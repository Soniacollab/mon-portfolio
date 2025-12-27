import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

// ------------------ Schéma Yup pour skill ------------------ //
const skillSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Le nom de compétence est obligatoire")

    .matches(/^[a-zA-Z0-9\s-]+$/, {
      message:
        "Le nom ne peut contenir que des lettres, chiffres, espaces et tirets",
      excludeEmptyString: true,
    })
    .strict(true),
  technique: yup.boolean().optional(),
  profile_id: yup.string().optional(),
});

// ------------------ Middleware générateur DRY ------------------ //
const validateSkill =
  (isUpdate = false) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const schema = isUpdate ? skillSchema.partial() : skillSchema;

        // Validation complète et collecte de toutes les erreurs
        await schema.validate(req.body, { abortEarly: false });

        next(); // tout est OK
      } catch (err: any) {
        // Construction d'un objet erreurs lisible pour le frontend
        const errors = err.inner?.reduce((acc: any, e: any) => {
          if (e.path) {
            // map pour correspondre exactement aux noms de champs frontend
            const key = e.path === "name" ? "name" : e.path;
            acc[key] = e.message;
          }
          return acc;
        }, {});
        return res.status(400).json({ errors });
      }
    };

// ------------------ Export ------------------ //
export const validateCreateSkill = validateSkill(false);
export const validateUpdateSkill = validateSkill(true);
