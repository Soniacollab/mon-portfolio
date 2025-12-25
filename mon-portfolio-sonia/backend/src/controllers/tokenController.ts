// src/controllers/tokenController.ts
import { Request, Response } from "express";
import { signToken, verifyToken } from "../utils/jwt";

export const refreshToken = (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).json({ message: "Token manquant" });

    const payload = verifyToken(refreshToken);
    if (!payload) return res.status(403).json({ message: "Token invalide" });

    const newAccessToken = signToken({ email: payload.email, role: payload.role }, "15m");

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
      })
      .json({ message: "Token renouvelé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
