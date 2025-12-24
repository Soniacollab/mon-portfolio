import { Request, Response } from "express";
import Profile from "../models/Profile";
import bcrypt from "bcryptjs";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findOne().lean();
    if (!profile) return res.status(404).json({ message: "Aucun profil trouvé" });

    const { password, ...rest } = profile as any;
    res.json(rest);
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { email, first_name, last_name, bio, cv_url, password } = req.body;
    let profile = await Profile.findOne();

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    if (!profile) {
      profile = new Profile({
        email,
        first_name,
        last_name,
        bio,
        cv_url,
        password: hashedPassword,
        avatar: req.file ? `/uploads/profiles/${req.file.filename}` : "/assets/default-avatar.svg"
      });
      await profile.save();
      const { password: _p, ...rest } = profile.toObject();
      return res.status(201).json(rest);
    }

    if (email) profile.email = email;
    if (first_name) profile.first_name = first_name;
    if (last_name) profile.last_name = last_name;
    if (typeof bio !== "undefined") profile.bio = bio;
    if (typeof cv_url !== "undefined") profile.cv_url = cv_url;
    if (hashedPassword) profile.password = hashedPassword;
    if (req.file) profile.avatar = `/uploads/profiles/${req.file.filename}`;

    await profile.save();
    const { password: _p, ...rest } = profile.toObject();
    res.json(rest);
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Erreur mise à jour profil" });
  }
};
