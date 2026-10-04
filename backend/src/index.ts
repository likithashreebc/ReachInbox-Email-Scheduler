import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

import passport from "./lib/passport";
import { emailQueue } from "./lib/queue";
import { ensureIndex } from "./lib/elasticsearch";

import authRoutes from "./routes/auth";
import emailRoutes from "./routes/emails";
import slackRoutes from "./routes/slack";

const app = express();

app.use(
  cors({
    origin: (origin, cb) => {
      const allowed = (process.env.FRONTEND_URL || "http://localhost:3000").split(",").map(s => s.trim());
      if (!origin || allowed.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
createBullBoard({ queues: [new BullMQAdapter(emailQueue)], serverAdapter });
app.use("/admin/queues", serverAdapter.getRouter());

// Routes
app.use("/auth", authRoutes);
app.use("/emails", emailRoutes);
app.use("/slack", slackRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

async function start() {
  await ensureIndex().catch((e) => console.warn("Elasticsearch not available:", e.message));
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

start();
