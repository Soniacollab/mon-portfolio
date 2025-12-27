import express from "express";
import { getProfile, updateProfile, downloadCV } from "../controllers/profileController";
import { adminAuth } from "../middleware/authMiddleware";
import { uploadFile } from "../middleware/upload";
import { validateProfile } from "../middleware/validateProfile";

const router = express.Router();

// GET profil public
router.get("/", getProfile);

// PUT profil admin avec avatar + CV
router.put(
  "/admin",
  adminAuth,
 uploadFile.fields([
  { name: "avatar", maxCount: 1 },
  { name: "cv", maxCount: 1 },
]),
  validateProfile,
  updateProfile
);



export default router;

// Route publique pour télécharger le CV
router.get("/cv/:filename", downloadCV);
