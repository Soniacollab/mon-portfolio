import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db";

import adminAuthRoutes from "./routes/adminAuthRoutes";
import profileRoutes from "./routes/profileRoutes";
import projectRoutes from "./routes/projectRoutes";
import skillRoutes from "./routes/skillRoutes";
import projectSkillRoutes from "./routes/projectSkillRoutes";
import experienceRoutes from "./routes/experienceRoutes";
import contactRoutes from "./routes/contactRoutes";

import path from "path";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // ← indispensable pour cookie HttpOnly
  })
);

app.use(express.json());
app.use(cookieParser());
// Servir les uploads sans cache en développement pour éviter des réponses 304 obsolètes
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    maxAge: 0,
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "no-store, must-revalidate");
    },
  })
);

connectDB();

// During development, ensure API responses are not cached by browsers
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/project-skills", projectSkillRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
