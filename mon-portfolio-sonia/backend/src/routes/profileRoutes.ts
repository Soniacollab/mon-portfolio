// src/routes/profileRoutes.ts
import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController";
import { adminAuth } from "../middleware/authMiddleware";
import { uploadFile } from "../middleware/upload";
const router = express.Router();

// public
router.get("/", getProfile);

// admin
router.put("/", adminAuth, uploadFile.single("avatar"), updateProfile);

export default router;
