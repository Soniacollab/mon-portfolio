// src/routes/profileRoutes.ts
import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController";
import { authenticateAdmin } from "../middleware/authMiddleware";
import { uploadFile } from "../middleware/upload";
const router = express.Router();

// public
router.get("/", getProfile);

// admin
router.put("/", authenticateAdmin, uploadFile.single("avatar"), updateProfile);

export default router;
