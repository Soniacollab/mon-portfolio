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

    // Prepare mail payload. We'll set `from` and `replyTo` depending on SMTP availability.
    const to = process.env.CONTACT_TO || process.env.ADMIN_EMAIL;
    const baseMail: any = {
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

    // Helper to send with a given transporter and return preview URL when available
    const trySend = async (transporter: nodemailer.Transporter) => {
      const info = await transporter.sendMail(baseMail as any);
      const preview = (nodemailer as any).getTestMessageUrl
        ? (nodemailer as any).getTestMessageUrl(info)
        : undefined;
      return { info, preview };
    };

    // If SMTP config available, try to use it first. When using authenticated SMTP
    // it's best to set the `from` to the authenticated user and set `replyTo`
    // to the submitter so recruiters can reply directly to them.
    if (host && user && pass && to) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });

        // use authenticated sender as From but include submitter name so recipient sees applicant
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

    // Create Ethereal test account and send (useful for development/testing)
    try {
      const testAccount = await nodemailer.createTestAccount();
      const ethTransporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });

      // For Ethereal, it's fine to set the From to the submitter so preview shows their name
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
