// src/routes/skillRoutes.ts
import express from "express";
import { getSkills, createSkill, updateSkill, deleteSkill } from "../controllers/skillController";
import { authenticateAdmin } from "../middleware/authMiddleware";
import { uploadFile } from "../middleware/upload";
const router = express.Router();

// public
router.get("/", getSkills);

// admin
router.post("/", authenticateAdmin, uploadFile.single("icon"), createSkill);
router.put("/:id", authenticateAdmin, uploadFile.single("icon"), updateSkill);
router.delete("/:id", authenticateAdmin, deleteSkill);

export default router;
