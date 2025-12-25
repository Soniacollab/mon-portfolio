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
import messageRoutes from "./routes/messageRoutes";
import experienceRoutes from "./routes/experienceRoutes";

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
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

connectDB();

// Routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/profile", profileRoutes);
app.use("/api/admin/projects", projectRoutes);
app.use("/api/admin/skills", skillRoutes);
app.use("/api/admin/project-skills", projectSkillRoutes);
app.use("/api/admin/experiences", experienceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
