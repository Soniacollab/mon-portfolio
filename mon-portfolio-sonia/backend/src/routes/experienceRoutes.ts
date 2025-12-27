import express from "express";
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from "../controllers/experienceController";
import { adminAuth } from "../middleware/authMiddleware";
import { uploadFile } from "../middleware/upload";
import { validateObjectId } from "../middleware/validateObjectId";
import {
  validateCreateExperience,
  validateUpdateExperience,
} from "../middleware/validateExperience";

const router = express.Router();

// -- GET /api/experiences -- // (public)
router.get("/", getExperiences);

// -- POST /api/experiences/admin -- // (pour admin only)
router.post(
  "/admin",
  adminAuth,
  uploadFile.single("experienceIcon"),
  validateCreateExperience,
  createExperience
);

// -- PUT /api/experiences/admin/:id -- // (pour admin only)
router.put(
  "/admin/:id",
  adminAuth,
  validateObjectId("id"),
  uploadFile.single("experienceIcon"),
  validateUpdateExperience,
  updateExperience
);

// -- DELETE /api/experiences/admin/:id -- // (pour admin only)
router.delete(
  "/admin/:id", 
  adminAuth, 
  validateObjectId("id"), 
  deleteExperience
);

export default router;
