//--------- Middleware de validation des ObjectId mongoose ---------//

import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

// Vérifie si un paramètre est un ObjectId valide
// Usage: validateObjectId("id") pour valider req.params.id
// Et on utilise nextFunction pour passer au middleware suivant si valide
export const validateObjectId = (param: string) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const value = req.params[param];
  if (!mongoose.Types.ObjectId.isValid(value as string)) {
    return res.status(400).json({ message: `ID '${param}' invalide` });
  }
  next();
};

// Fonction utilitaire pour valider un tableau d'ObjectId
export const validateObjectIdArray = (arr: unknown[]): boolean => {
  if (!Array.isArray(arr)) return false;
  return arr.every((id) => mongoose.Types.ObjectId.isValid(id as string));
};
