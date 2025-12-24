// src/routes/messageRoutes.ts
import express from "express";
import { body } from "express-validator";
import { createMessage, getMessages, deleteMessage } from "../controllers/messageController";
import { authenticateAdmin } from "../middleware/authMiddleware";
const router = express.Router();

// POST public - validation simple
router.post(
  "/",
  [
    body("name").isLength({ min: 2 }).withMessage("Nom requis (2 caractères min)"),
    body("email").isEmail().withMessage("Email invalide"),
    body("content").isLength({ min: 5 }).withMessage("Message trop court")
  ],
  createMessage
);

// admin
router.get("/", authenticateAdmin, getMessages);
router.delete("/:id", authenticateAdmin, deleteMessage);

export default router;
