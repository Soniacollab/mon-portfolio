import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

// -------- Taille max fichier (5 Mo par défaut)
const MAX_SIZE = 5 * 1024 * 1024;

// -------- Storage UNIQUE (images + avatar + CV)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others";

    // ---- Images existantes
    if (file.fieldname === "experienceIcon") folder = "experiences";
    else if (file.fieldname === "icon") folder = "skills";
    else if (file.fieldname === "image") folder = "projects";
    else if (file.fieldname === "avatar") folder = "profiles";

    // ---- CV
    else if (file.fieldname === "cv") folder = "cv";

    const uploadPath = path.join(__dirname, `../../uploads/${folder}`);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// -------- Multer principal
export const uploadFile = multer({
  storage,
  limits: { fileSize: MAX_SIZE },

  fileFilter: (req, file, cb) => {
    // ---- CV (PDF uniquement)
    if (file.fieldname === "cv") {
      if (file.mimetype === "application/pdf") {
        return cb(null, true);
      }
      return cb(new Error("Le CV doit être un fichier PDF"));
    }

    // ---- Images
    const allowedImages = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];

    if (allowedImages.includes(file.mimetype)) {
      return cb(null, true);
    }

    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        "Type de fichier non autorisé"
      )
    );
  },
});

// -------- Gestion des erreurs Multer
export const handleUploadErrors = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "Fichier trop volumineux (max 5 Mo)" });
    }

    return res.status(400).json({ message: err.message });
  }

  if (err) {
    const msg = (err as { message?: string })?.message || String(err);
    return res.status(400).json({ message: msg });
  }

  next();
};
