import { Request, Response } from "express";
import Contact from "../models/Contact";
import nodemailer from "nodemailer";

// POST /api/contact
export const sendContact = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: "Missing fields" });

    // Save to DB (optional)
    const contact = new Contact({ name, email, message });
    await contact.save();

    // Préparer le payload du mail. On définira `from` et `replyTo` selon la disponibilité SMTP.
    const to = process.env.CONTACT_TO || process.env.ADMIN_EMAIL;
    const baseMail: nodemailer.SendMailOptions = {
      to,
      // include submitter email in subject so it's visible in inbox list
      subject: `Contact form: ${name} <${email}>`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>Applicant:</strong> ${name} &lt;${email}&gt;</p><hr/><p>${message.replace(/\n/g, "<br />")}</p>`,
    };

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // Helper : envoie avec un transporter donné et retourne l'URL de preview si disponible
    const trySend = async (transporter: nodemailer.Transporter) => {
      const info = await transporter.sendMail(baseMail as nodemailer.SendMailOptions);
      const preview = (nodemailer as unknown as { getTestMessageUrl?: (info: unknown) => string | undefined }).getTestMessageUrl?.(info);
      return { info, preview };
    };

    // Si la configuration SMTP est disponible, l'utiliser en priorité. Lorsqu'on utilise un SMTP authentifié
    // il est préférable de définir `from` sur l'utilisateur authentifié et `replyTo` sur le soumetteur
    // afin que les recruteurs puissent répondre directement.
    if (host && user && pass && to) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });

        // utiliser l'expéditeur authentifié comme From mais inclure le nom du soumetteur pour que le destinataire voie l'auteur
        baseMail.from = `${name} via Portfolio <${user}>`;
        baseMail.replyTo = `${name} <${email}>`;

        await trySend(transporter);
        return res.json({ message: "Message saved and email sent via SMTP" });
      } catch (err) {
        console.warn("Failed to send via configured SMTP:", (err as Error)?.message || err);
        // fall through to Ethereal test account below
      }
    } else {
      console.warn("SMTP not fully configured — will use Ethereal test account for preview.");
    }

    // Créer un compte Ethereal de test et envoyer (utile en développement/tests)
    try {
      const testAccount = await nodemailer.createTestAccount();
      const ethTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });

      // Pour Ethereal, il est acceptable de définir From sur le soumetteur pour que la preview affiche son nom
      baseMail.from = `${name} <${email}>`;

      const { preview } = await trySend(ethTransporter);
      console.info("Sent via Ethereal preview:", preview);
      return res.json({ message: "Message saved and sent via Ethereal (dev)", previewUrl: preview });
    } catch (err) {
      console.error("Ethereal send failed:", err);
      return res.json({ message: "Saved (mail not sent - sending failed)" });
    }
  } catch (err) {
    console.error("sendContact error:", err);
    res.status(500).json({ message: "Unable to send message" });
  }
};

// GET /api/contact/admin - list messages (admin)
export const listContacts = async (req: Request, res: Response) => {
  try {
    const items = await Contact.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    console.error("listContacts error:", err);
    res.status(500).json({ message: "Unable to fetch messages" });
  }
};
