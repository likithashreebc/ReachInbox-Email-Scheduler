import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "../lib/passport";

const router = Router();
const JWT_SECRET = process.env.SESSION_SECRET || "secret";

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login` }),
  (req, res) => {
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    const token = jwt.sign({ user: req.user }, JWT_SECRET, { expiresIn: "7d" });
    res.redirect(`${frontend}/dashboard?token=${token}`);
  }
);

router.post("/logout", (_req, res) => res.json({ ok: true }));

router.get("/me", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { user } = jwt.verify(auth.slice(7), JWT_SECRET) as any;
    res.json(user);
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
});

export default router;
