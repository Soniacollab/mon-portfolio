// src/controllers/adminAuthController.ts
// Login admin uniquement (pas de register). Compare avec ADMIN_EMAIL / ADMIN_PASSWORD dans .env
import { Request, Response } from "express";
import dotenv from "dotenv";
import { signToken } from "../utils/jwt";
dotenv.config();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email et password requis" });

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Token minimal : email et role
    const token = signToken({ email, role: "admin" }, "24h");
    return res.json({ token });
  } catch (err) {
    console.error("admin login error:", err);
    return res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
};
