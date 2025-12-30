import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { ValidationError } from "yup";

// ------------------ Schéma Yup pour skill ------------------ //
const skillSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Le nom de compétence est obligatoire")

    .matches(/^[a-zA-Z0-9\s.-]+$/, {
      message:
        "Le nom ne peut contenir que des lettres, chiffres, espaces, points et tirets",
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
      } catch (err: unknown) {
        if (err instanceof ValidationError) {
          const errors = err.inner?.reduce((acc: Record<string, string>, e: ValidationError) => {
            if (e.path) {
              const key = e.path === "name" ? "name" : e.path;
              acc[key] = e.message;
            }
            return acc;
          }, {} as Record<string, string>);
          return res.status(400).json({ errors });
        }
        return res.status(400).json({ errors: {} });
      }
    };

// ------------------ Export ------------------ //
export const validateCreateSkill = validateSkill(false);
export const validateUpdateSkill = validateSkill(true);
