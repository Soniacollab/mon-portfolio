// src/routes/projectSkillRoutes.ts
import express from "express";
import { addProjectSkill, removeProjectSkill } from "../controllers/projectSkillController";
import { adminAuth } from "../middleware/authMiddleware";
const router = express.Router();

// admin only: manage pivot links
router.post("/", adminAuth, addProjectSkill);
router.delete("/", adminAuth, removeProjectSkill);

export default router;
