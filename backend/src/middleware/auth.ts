import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || "secret";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { user } = jwt.verify(auth.slice(7), JWT_SECRET) as any;
    (req as any).user = user;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}
