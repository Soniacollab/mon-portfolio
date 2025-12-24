// src/middleware/authMiddleware.ts
// Middleware pour protéger les routes admin.
// Attente : header Authorization: Bearer <token>
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import dotenv from "dotenv";
dotenv.config();

interface JwtPayload {
  email?: string;
  iat?: number;
  exp?: number;
}

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Authorization header manquant" });

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Format du token invalide" });
    }

    const token = parts[1];
    const decoded = verifyToken(token) as JwtPayload | null;
    if (!decoded || !decoded.email) return res.status(401).json({ message: "Token invalide ou expiré" });

    // Vérifie que l'email du token correspond bien à l'admin configuré
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ message: "Accès refusé : non-admin" });
    }

    // on peut attacher user minimal au req si utile
    (req as any).user = { email: decoded.email };

    next();
  } catch (err) {
    console.error("Erreur authMiddleware:", err);
    return res.status(500).json({ message: "Erreur serveur d'authentification" });
  }
};
