import express from "express";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience
} from "../controllers/experienceController";
import { authenticateAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// Public
router.get("/", getExperiences);

// Admin
router.post("/", authenticateAdmin, createExperience);
router.put("/:id", authenticateAdmin, updateExperience);
router.delete("/:id", authenticateAdmin, deleteExperience);

export default router;