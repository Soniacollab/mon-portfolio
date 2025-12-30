// src/middleware/validateProject.ts
import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { validateObjectIdArray } from "./validateObjectId";

// ------------------ Schéma Yup ------------------//
// Ici, on définit les règles de validation pour un projet
// On utilise test() pour min-length afin d'éviter le conflit avec required()
const projectSchema = yup.object().shape({
  title: yup
    .string()
    .trim() // enlève les espaces début/fin
    .required("Le titre ne peut pas être vide")
    .test(
      "min-length",
      "Titre invalide",
      (val) => !val || val.length >= 3 // vérifie la longueur seulement si val existe
    ),
  description: yup
    .string()
    .trim()
    .required("La description ne peut pas être vide")
    .test(
      "min-length",
      "La description doit contenir au minimum 10 caractères",
      (val) => !val || val.length >= 10
    )
    .matches(/^[a-zA-Z0-9\s-]+$/, {
      message:
        "Le nom ne peut contenir que des lettres, chiffres, espaces et tirets",
      excludeEmptyString: true,
    }),
  link: yup
    .string()
    .trim()
    .required("Le lien ne peut pas être vide")
    .url("Lien invalide"),
  skills: yup.mixed().test(
    "is-valid-array",
    "Au moins un Skill ID est invalide",
    (val) => {
      if (!val) return true; // skills optionnel pour création
      return Array.isArray(val) && validateObjectIdArray(val);
    }
  ),
});

// ------------------ Helper parse skills ------------------//
// Transforme les skills reçus en tableau, supporte JSON string
const parseSkills = (skills: unknown) => {
  if (!skills) return [];
  if (typeof skills === "string") {
    try {
      return JSON.parse(skills);
    } catch {
      return null; // format invalide
    }
  }
  return skills;
};

// ------------------ Middleware DRY ------------------//
// Fonction génératrice de middleware pour create/update
const validateProject = (isUpdate = false) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Parse les skills pour transformer string JSON en tableau
  req.body.skills = parseSkills(req.body.skills);
  if (req.body.skills === null) {
    return res.status(400).json({ errors: { skills: "Format des skills invalide" } });
  }

  try {
    // partial() rend toutes les propriétés optionnelles pour update
    const schema = isUpdate ? projectSchema.partial() : projectSchema;

    // Validation complète avec collecte de toutes les erreurs
    await schema.validate(req.body, { abortEarly: false });

    next(); // tout est OK
  } catch (err: unknown) {
    if (err instanceof yup.ValidationError) {
      const errors = err.inner?.reduce((acc: Record<string, string>, e: yup.ValidationError) => {
        if (e.path) {
          // Map des noms pour correspondre au front
          const key = e.path === "title" ? "title" : e.path === "link" ? "link" : e.path === "description" ? "description" : e.path;
          acc[key] = e.message;
        }
        return acc;
      }, {} as Record<string, string>);
      return res.status(400).json({ errors });
    }
    return res.status(400).json({ errors: {} });
  }
};

// ------------------ Export ------------------//
export const validateCreateProject = validateProject(false);
export const validateUpdateProject = validateProject(true);
