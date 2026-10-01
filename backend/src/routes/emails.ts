import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../lib/prisma";
import { emailQueue } from "../lib/queue";
import { requireAuth } from "../middleware/auth";
import { indexEmail, searchEmails } from "../lib/elasticsearch";

const router = Router();

// POST /emails/schedule
router.post("/schedule", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const { recipients, subject, body, senderEmail, startTime, delayBetweenMs } = req.body;

    if (!Array.isArray(recipients) || !subject || !body || !senderEmail || !startTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created = [];
    let scheduleTime = new Date(startTime).getTime();

    for (const recipient of recipients) {
      const id = uuidv4();
      const scheduledAt = new Date(scheduleTime);
      const delay = Math.max(0, scheduleTime - Date.now());

      // Add to BullMQ — if Redis fails, log but continue
      try {
        await emailQueue.add(
          "send-email",
          { emailId: id, userId: user.id, recipient, subject, body, senderEmail },
          { jobId: id, delay }
        );
      } catch (queueErr: any) {
        console.warn("BullMQ queue error (continuing):", queueErr.message);
      }

      // Always save to DB
      const email = await prisma.email.create({
        data: {
          id,
          userId: user.id,
          recipient,
          subject,
          body,
          senderEmail,
          scheduledAt,
          status: "SCHEDULED",
          bullJobId: id,
        },
      });

      // Index to ES — if unavailable, skip
      await indexEmail({
        id: email.id,
        userId: email.userId,
        recipient: email.recipient,
        subject: email.subject,
        body: email.body,
        senderEmail: email.senderEmail,
        status: email.status,
        scheduledAt: email.scheduledAt,
        sentAt: email.sentAt,
      }).catch(() => {});

      created.push(email);
      scheduleTime += delayBetweenMs || 0;
    }

    res.json({ scheduled: created.length, emails: created });
  } catch (err: any) {
    console.error("Schedule error:", err.message);
    res.status(500).json({ error: err.message || "Failed to schedule emails" });
  }
});

// GET /emails/scheduled
router.get("/scheduled", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const emails = await prisma.email.findMany({
      where: { userId: user.id, status: "SCHEDULED" },
      orderBy: { scheduledAt: "asc" },
    });
    res.json(emails);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /emails/sent
router.get("/sent", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const emails = await prisma.email.findMany({
      where: { userId: user.id, status: { in: ["SENT", "FAILED"] } },
      orderBy: { sentAt: "desc" },
    });
    res.json(emails);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /emails/search?q=...
router.get("/search", requireAuth, async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    const q = req.query.q as string;
    if (!q) return res.status(400).json({ error: "Missing query" });
    const results = await searchEmails(user.id, q);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
