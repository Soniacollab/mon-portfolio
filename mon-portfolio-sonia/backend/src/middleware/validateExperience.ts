import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

// ------------------ Schéma Yup pour expérience ------------------ //
const experienceSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required("Le titre ne peut pas être vide")
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .matches(/^[a-zA-Z0-9\s-]+$/, {
      message: "Le titre ne peut contenir que des lettres, chiffres, espaces et tirets",
      excludeEmptyString: true,
    }),
  company: yup
    .string()
    .trim()
    .required("Nom de l'entreprise obligatoire")
    .min(2, "Le nom de l'entreprise doit contenir au moins 2 caractères")
    .matches(/^[a-zA-Z0-9\s-&]+$/, {
      message: "Nom entreprise : lettres, chiffres, espaces, tirets et & seulement",
      excludeEmptyString: true,
    }),
  description: yup.string().trim().optional(),
  type: yup
    .string()
    .trim()
    .required("Type d'expérience obligatoire")
    .oneOf(["job", "stage", "internship", "freelance"], "Type d'expérience invalide"),
  startDate: yup
    .date()
    .typeError("Date de début invalide")
    .required("La date de début est obligatoire"),
  endDate: yup
    .date()
    .typeError("Date de fin invalide")
    .optional()
    .min(yup.ref("startDate"), "La date de fin doit être postérieure à la date de début"),
  technologies: yup.array().of(yup.string()).optional(),
  achievements: yup
    .array()
    .of(yup.string().trim())
    .optional(),
});

// ------------------ Middleware ------------------ //
const validateExperience = (isUpdate = false) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = isUpdate ? experienceSchema.partial() : experienceSchema;

    // ---------- Transformer achievements en tableau ----------
    if (req.body.achievements) {
      if (!Array.isArray(req.body.achievements) && typeof req.body.achievements === "string") {
        req.body.achievements = req.body.achievements
          .split(",")
          .map((a: string) => a.trim())
          .filter(Boolean);
      }
    }

    if (req.body["achievements[]"]) {
      req.body.achievements = Array.isArray(req.body["achievements[]"])
        ? req.body["achievements[]"].map((a: string) => a.trim()).filter(Boolean)
        : [req.body["achievements[]"].trim()].filter(Boolean);
      delete req.body["achievements[]"];
    }

    // ---------- Parse technologies si JSON ----------
    if (typeof req.body.technologies === "string") {
      try {
        req.body.technologies = JSON.parse(req.body.technologies);
      } catch {
        return res.status(400).json({ errors: { technologies: "Format technologies invalide" } });
      }
    }

    await schema.validate(req.body, { abortEarly: false });

    next();
  } catch (err: any) {
    const errors = err.inner?.reduce((acc: any, e: any) => {
      if (e.path) acc[e.path] = e.message;
      return acc;
    }, {});
    return res.status(400).json({ errors });
  }
};

// ------------------ Export ------------------ //
export const validateCreateExperience = validateExperience(false);
export const validateUpdateExperience = validateExperience(true);
