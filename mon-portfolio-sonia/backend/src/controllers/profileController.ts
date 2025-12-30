import { Request, Response } from "express";
import Profile from "../models/Profile";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

/*****************************************************************
 *                  GET /api/profile
 *             Récupère le profil unique (public)
 *****************************************************************/
export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findOne().lean(); // fetch profil unique
    if (!profile)
      return res.status(404).json({ message: "Aucun profil trouvé" });

    // On retire le mot de passe avant d'envoyer la réponse
    const rest = { ...(profile as unknown as Record<string, unknown>) };
    delete (rest as unknown as Record<string, unknown>)['password'];
    res.json(rest);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


/********************************************************************
 *                     PUT /api/admin/profile
 *              Crée ou met à jour le profil (admin)
 *******************************************************************/
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { email, first_name, last_name, bio, password } = req.body;

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    let profile = await Profile.findOne();

    /* =======================
       CRÉATION
    ======================= */
    if (!profile) {
      profile = new Profile({
        email,
        first_name,
        last_name,
        bio,
        password: hashedPassword,
        avatar: files?.avatar
          ? `/uploads/profiles/${files.avatar[0].filename}`
          : "/assets/default-avatar.svg",
        cv_url: files?.cv
          ? `/uploads/cv/${files.cv[0].filename}`
          : undefined,
      });

      await profile.save();
      const rest = profile.toObject() as unknown as Record<string, unknown>;
      delete (rest as unknown as Record<string, unknown>)['password'];
      return res.status(201).json(rest);
    }

    /* =======================
       MISE À JOUR
    ======================= */
    if (email) profile.email = email;
    if (first_name) profile.first_name = first_name;
    if (last_name) profile.last_name = last_name;
    if (typeof bio !== "undefined") profile.bio = bio;
    if (hashedPassword) profile.password = hashedPassword;

    if (files?.avatar) {
      profile.avatar = `/uploads/profiles/${files.avatar[0].filename}`;
    }

    if (files?.cv) {
      profile.cv_url = `/uploads/cv/${files.cv[0].filename}`;
    }

    await profile.save();

    const rest = profile.toObject() as unknown as Record<string, unknown>;
    delete (rest as unknown as Record<string, unknown>)['password'];
    res.json(rest);
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Erreur mise à jour profil" });
  }
};


/* ======================================================
   GET /api/profile/cv/:filename
   Télécharge le fichier CV 
   ====================================================== */
export const downloadCV = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    if (!filename) return res.status(400).json({ message: "Nom de fichier manquant" });

    const filePath = path.join(__dirname, "../../uploads/cv", filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "CV introuvable" });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("downloadCV error:", err);
        if (!res.headersSent) res.status(500).end();
      }
    });
  } catch (err) {
    console.error("downloadCV error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
