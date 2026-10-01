import { Router, Request, Response } from "express";
import axios from "axios";
import { requireAuth } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

router.get("/connect", requireAuth, (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID!,
    scope: "chat:write",
    redirect_uri: process.env.SLACK_REDIRECT_URI!,
  });
  res.redirect(`https://slack.com/oauth/v2/authorize?${params}`);
});

router.get("/callback", requireAuth, async (req: Request, res: Response) => {
  const user = req.user as any;
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "Missing code" });

  const resp = await axios.post("https://slack.com/api/oauth.v2.access", null, {
    params: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code,
      redirect_uri: process.env.SLACK_REDIRECT_URI,
    },
  });

  const data = resp.data;
  if (!data.ok) return res.status(400).json({ error: data.error });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      slackToken: data.access_token,
      slackChannel: data.incoming_webhook?.channel_id || data.authed_user?.id,
    },
  });

  res.redirect(`${process.env.FRONTEND_URL}/dashboard?slack=connected`);
});

router.post("/disconnect", requireAuth, async (req: Request, res: Response) => {
  const user = req.user as any;
  await prisma.user.update({
    where: { id: user.id },
    data: { slackToken: null, slackChannel: null },
  });
  res.json({ ok: true });
});

router.get("/status", requireAuth, async (req: Request, res: Response) => {
  const user = req.user as any;
  const u = await prisma.user.findUnique({ where: { id: user.id } });
  res.json({ connected: !!u?.slackToken });
});

export default router;
