import express from "express";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience
} from "../controllers/experienceController";
import { adminAuth } from "../middleware/authMiddleware";
import { uploadFile } from "../middleware/upload";

const router = express.Router();

// Public
router.get("/", getExperiences);

// Admin
router.post("/", adminAuth, uploadFile.single("icon"), createExperience);
router.put("/:id", adminAuth, uploadFile.single("icon"), updateExperience);
router.delete("/:id", adminAuth , deleteExperience);

export default router;