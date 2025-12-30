import { Request, Response } from "express";
import dotenv from "dotenv";
import { signToken, verifyToken } from "../utils/jwt";

// Charger les variables d'environnement
dotenv.config();

// Contrôleur pour l'authentification admin
export const login = async (req: Request, res: Response) => {
  try {

    // Récupère email et password du corps de la requête
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email et password requis" });


    // Vérifie les identifiants (ici on utilise des variables d'env pour simplifier)
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Token principal (courte durée)
    const accessToken = signToken({ email, role: "admin" }, "60m");

    // Refresh token (plus longue durée)
    const refreshToken = signToken({ email, role: "admin" }, "7d");

    // On envoie les tokens dans les cookies HttpOnly
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 1000, // 1 heure
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      })
      .json({ message: "Login réussi" });
  } catch (err) {
    console.error("admin login error:", err);
    return res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
};


// Contrôleur pour le logout admin
export const logout = (req: Request, res: Response) => {
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ message: "Déconnecté" });
};


// Contrôleur pour rafraîchir le token d'accès
export const refreshToken = (req: Request, res: Response) => {
  // Récupère le refresh token depuis les cookies
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token manquant" });

  try {
    const payload = verifyToken(refreshToken); // décode et vérifie
    const newAccessToken = signToken({ email: payload.email, role: "admin" }, "60m");

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    res.json({ message: "Access token rafraîchi" });
  } catch (err) {
    res.status(401).json({ message: "Refresh token invalide" });
  }
};
