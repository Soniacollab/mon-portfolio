// src/routes/projectRoutes.ts
import express from "express";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/projectController";
import { adminAuth } from "../middleware/authMiddleware";
import { uploadFile } from "../middleware/upload";
const router = express.Router();

// public
router.get("/", getProjects);

// admin
router.post("/", adminAuth, uploadFile.single("image"), createProject);
router.put("/:id", adminAuth, uploadFile.single("image"), updateProject);
router.delete("/:id", adminAuth, deleteProject);

export default router;
