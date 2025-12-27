import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import { adminAuth } from "../middleware/authMiddleware";
import { uploadFile } from "../middleware/upload";
import {
  validateCreateProject,
  validateUpdateProject,
} from "../middleware/validateProject";
import { validateObjectId } from "../middleware/validateObjectId";

const router = express.Router();

// -- GET /api/projects -- // (public)
router.get("/", getProjects);

// -- POST /api/projects/admin -- // (pour admin only)
router.post(
  "/admin",
  adminAuth,
  uploadFile.single("image"),
  validateCreateProject,
  createProject
);

// -- PUT /api/projects/admin/:id -- // (pour admin only)
router.put(
  "/admin/:id",
  adminAuth,
  validateObjectId("id"),
  uploadFile.single("image"),
  validateUpdateProject,
  updateProject
);

// -- DELETE /api/projects/admin/:id -- // (pour admin only)
router.delete(
  "/admin/:id",
  adminAuth,
  validateObjectId("id"),
  deleteProject
);

export default router;
