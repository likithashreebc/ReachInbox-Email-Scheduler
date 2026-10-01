import { WebClient } from "@slack/web-api";
import prisma from "./prisma";

export async function notifySlackRateLimit(userId: string, sender: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.slackToken || !user?.slackChannel) return;

  const client = new WebClient(user.slackToken);
  await client.chat.postMessage({
    channel: user.slackChannel,
    text: `⚠️ Rate limit reached for sender *${sender}*. Emails will resume in the next hour window.`,
  });
}
