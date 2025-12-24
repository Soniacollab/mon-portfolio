// src/routes/projectSkillRoutes.ts
import express from "express";
import { addProjectSkill, removeProjectSkill } from "../controllers/projectSkillController";
import { authenticateAdmin } from "../middleware/authMiddleware";
const router = express.Router();

// admin only: manage pivot links
router.post("/", authenticateAdmin, addProjectSkill);
router.delete("/", authenticateAdmin, removeProjectSkill);

export default router;
