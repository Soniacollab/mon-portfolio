import express from "express";
import { sendContact, listContacts } from "../controllers/contactController";
import { adminAuth } from "../middleware/authMiddleware";

const router = express.Router();

// Public contact form submit
router.post("/", sendContact);

// Admin: list messages
router.get("/admin", adminAuth, listContacts);

export default router;
