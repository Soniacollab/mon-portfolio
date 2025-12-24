// src/middleware/upload.ts
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "others";
    if (file.fieldname === "icon") folder = "skills";
    else if (file.fieldname === "image") folder = "projects";
    else if (file.fieldname === "avatar") folder = "profiles";

    const uploadPath = path.join(__dirname, `../../uploads/${folder}`);
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  },
});


export const uploadFile = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Seules les images sont autorisées"));
    cb(null, true);
  },
});
