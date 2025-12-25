// src/routes/skillRoutes.ts
import express from "express";
import { getSkills, createSkill, updateSkill, deleteSkill } from "../controllers/skillController";
import { adminAuth  } from "../middleware/authMiddleware";
import { uploadFile } from "../middleware/upload";
const router = express.Router();

// public
router.get("/", getSkills);

// admin
router.post("/", adminAuth, uploadFile.single("icon"), createSkill);
router.put("/:id", adminAuth, uploadFile.single("icon"), updateSkill);
router.delete("/:id", adminAuth, deleteSkill);

export default router;
