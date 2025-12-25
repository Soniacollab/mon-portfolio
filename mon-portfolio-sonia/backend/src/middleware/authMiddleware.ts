import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies?.accessToken; // ← sécurise l’accès
  if (!accessToken) return res.status(401).json({ message: "Non autorisé" });

  const payload = verifyToken(accessToken);
  if (!payload || payload.role !== "admin") {
    return res.status(403).json({ message: "Non autorisé" });
  }

  next();
};
