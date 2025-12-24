// src/controllers/messageController.ts
// POST public pour créer message, GET/DELETE admin pour gérer
import { Request, Response } from "express";
import Message from "../models/Message";
import { validationResult } from "express-validator";

/** POST /api/messages */
export const createMessage = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, content } = req.body;
    const message = new Message({ name, email, content });
    await message.save();

    // Option : envoi mail avec nodemailer ici si tu veux.

    return res.status(201).json({ message: "Message envoyé" });
  } catch (err) {
    console.error("createMessage error:", err);
    return res.status(500).json({ message: "Erreur création message" });
  }
};

/** GET /api/admin/messages */
export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ created_at: -1 }).lean();
    res.json(messages);
  } catch (err) {
    console.error("getMessages error:", err);
    res.status(500).json({ message: "Erreur récupération messages" });
  }
};

/** DELETE /api/admin/messages/:id */
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const msg = await Message.findByIdAndDelete(id);
    if (!msg) return res.status(404).json({ message: "Message non trouvé" });
    res.json({ message: "Message supprimé" });
  } catch (err) {
    console.error("deleteMessage error:", err);
    res.status(500).json({ message: "Erreur suppression message" });
  }
};
