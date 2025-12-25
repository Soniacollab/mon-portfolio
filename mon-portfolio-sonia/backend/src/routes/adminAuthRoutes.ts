import express from "express";
import { login, logout, refreshToken } from "../controllers/adminAuthController";
import { adminAuth } from "../middleware/authMiddleware";

const router = express.Router();

// POST /api/admin/auth/login
router.post("/login", login);

// POST /api/admin/auth/logout
router.post("/logout", logout);

// POST /api/admin/auth/refresh-token
router.post("/refresh-token", refreshToken);

// GET /api/admin/auth/verify
router.get("/verify", adminAuth, (req, res) => {
  res.json({ ok: true });
});

export default router;
