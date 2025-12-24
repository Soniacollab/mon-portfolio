// src/routes/projectRoutes.ts
import express from "express";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/projectController";
import { authenticateAdmin } from "../middleware/authMiddleware";
import { uploadFile } from "../middleware/upload";
const router = express.Router();

// public
router.get("/", getProjects);

// admin
router.post("/", authenticateAdmin, uploadFile.single("image"), createProject);
router.put("/:id", authenticateAdmin, uploadFile.single("image"), updateProject);
router.delete("/:id", authenticateAdmin, deleteProject);

export default router;
