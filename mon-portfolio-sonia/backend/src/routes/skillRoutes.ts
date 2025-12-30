//--------------------- Routes compétences ---------------------//
import express from "express";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController";
import { adminAuth } from "../middleware/authMiddleware";
import { uploadFile, handleUploadErrors } from "../middleware/upload";
import {
  validateCreateSkill,
  validateUpdateSkill,
} from "../middleware/validateSkill";
import { validateObjectId } from "../middleware/validateObjectId";

const router = express.Router();


// -- GET /api/skills -- // (public)
router.get(
    "/", 
    getSkills
);

// -- POST /api/skills/admin -- // (pour admin only)
router.post(
  "/admin/",
  adminAuth,
  uploadFile.single("icon"),
  handleUploadErrors,
  validateCreateSkill,
  createSkill
);

// -- PUT /api/skills/admin/:id -- // (pour admin only)
router.put(
  "/admin/:id",
  adminAuth,
  validateObjectId("id"),
  uploadFile.single("icon"),
  handleUploadErrors,
  validateUpdateSkill,
  updateSkill
);

// -- DELETE /api/skills/admin/:id -- // (pour admin only)
router.delete(
    "/admin/:id", 
    adminAuth, 
    validateObjectId("id"), 
    deleteSkill
);

export default router;
