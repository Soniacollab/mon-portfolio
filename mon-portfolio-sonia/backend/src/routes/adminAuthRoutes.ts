// src/routes/adminAuthRoutes.ts
import express from "express";
import { login } from "../controllers/adminAuthController";
const router = express.Router();

// POST /api/admin/login
router.post("/login", login);

export default router;
