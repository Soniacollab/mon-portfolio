import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

// ------------------ Schéma Yup pour profil ------------------ //
const profileSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Format d'email incorrect")
    .optional(),
  first_name: yup
    .string()
    .trim()
    .min(2, "Prénom trop court")
    .max(50, "Prénom trop long")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Prénom invalide") // lettres, accents, espaces, tirets/apostrophes
    .optional(),
  last_name: yup
    .string()
    .trim()
    .min(2, "Nom trop court")
    .max(50, "Nom trop long")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Nom invalide")
    .optional(),
  bio: yup
    .string()
    .trim()
    .max(500, "Bio trop longue")
    .optional(),
  cv_url: yup
    .string()
    .trim()
    .url("CV URL invalide")
    .optional(),
  password: yup
    .string()
    .trim()
    .min(6, "Mot de passe trop court")
    .optional(),
});

// ------------------ Middleware ------------------ //
export const validateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await profileSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err: any) {
    // Construction d'un objet lisible pour le front
    const errors = err.inner?.reduce((acc: any, e: any) => {
      if (e.path) acc[e.path] = e.message;
      return acc;
    }, {});
    return res.status(400).json({ errors });
  }
};
