import "dotenv/config";
import { Worker, Job } from "bullmq";
import redis from "../lib/redis";
import prisma from "../lib/prisma";
import { sendEmail } from "../lib/mailer";
import { checkAndIncrement, msUntilNextHour } from "../lib/rateLimiter";
import { notifySlackRateLimit } from "../lib/slack";
import { updateEmailIndex } from "../lib/elasticsearch";
import { emailQueue } from "../lib/queue";

const CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || "5");
const SEND_DELAY_MS = parseInt(process.env.EMAIL_SEND_DELAY_MS || "2000");

export interface EmailJobData {
  emailId: string;
  userId: string;
  recipient: string;
  subject: string;
  body: string;
  senderEmail: string;
}

async function processEmailById(emailId: string, userId: string, recipient: string, subject: string, body: string, senderEmail: string) {
  // Idempotency: skip if already sent
  const existing = await prisma.email.findUnique({ where: { id: emailId } });
  if (!existing || existing.status === "SENT") return;

  // Rate limit check
  const allowed = await checkAndIncrement(senderEmail);
  if (!allowed) {
    const delay = msUntilNextHour();
    await notifySlackRateLimit(userId, senderEmail).catch(() => {});
    await emailQueue.add(
      "send-email",
      { emailId, userId, recipient, subject, body, senderEmail },
      { delay, jobId: `retry-${emailId}-${Date.now()}` }
    ).catch(() => {});
    return;
  }

  // Minimum delay between sends
  await new Promise((r) => setTimeout(r, SEND_DELAY_MS));

  try {
    const info = await sendEmail({ from: senderEmail, to: recipient, subject, html: body });
    console.log(`Email sent to ${recipient} — Preview: ${info.messageId}`);

    const now = new Date();
    await prisma.email.update({
      where: { id: emailId },
      data: { status: "SENT", sentAt: now },
    });
    await updateEmailIndex(emailId, { status: "SENT", sentAt: now }).catch(() => {});
  } catch (err: any) {
    console.error(`Failed to send to ${recipient}:`, err.message);
    await prisma.email.update({
      where: { id: emailId },
      data: { status: "FAILED" },
    });
    await updateEmailIndex(emailId, { status: "FAILED" }).catch(() => {});
    throw err;
  }
}

async function processEmail(job: Job<EmailJobData>) {
  const { emailId, userId, recipient, subject, body, senderEmail } = job.data;
  await processEmailById(emailId, userId, recipient, subject, body, senderEmail);
}

// BullMQ worker
const worker = new Worker<EmailJobData>("email-queue", processEmail, {
  connection: redis,
  concurrency: CONCURRENCY,
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

// DB POLLING FALLBACK — picks up scheduled emails that are due
// This runs every 5 seconds and processes any emails whose scheduledAt has passed
async function pollAndProcess() {
  try {
    const due = await prisma.email.findMany({
      where: {
        status: "SCHEDULED",
        scheduledAt: { lte: new Date() },
      },
      take: CONCURRENCY,
    });

    if (due.length > 0) {
      console.log(`Polling: found ${due.length} due email(s)`);
    }

    for (const email of due) {
      // Mark as processing to prevent duplicate processing
      await prisma.email.update({
        where: { id: email.id },
        data: { status: "PROCESSING" as any },
      }).catch(() => {});

      processEmailById(
        email.id,
        email.userId,
        email.recipient,
        email.subject,
        email.body,
        email.senderEmail
      ).catch((err) => console.error("Poll process error:", err.message));
    }
  } catch (err: any) {
    console.error("Poll error:", err.message);
  }
}

// Start polling every 5 seconds
setInterval(pollAndProcess, 5000);
pollAndProcess(); // run immediately on start

console.log(`Worker started (concurrency=${CONCURRENCY}, delay=${SEND_DELAY_MS}ms)`);

export default worker;
