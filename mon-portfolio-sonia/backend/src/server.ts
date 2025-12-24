// src/server.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db";

// Import des routes
import adminAuthRoutes from "./routes/adminAuthRoutes";
import profileRoutes from "./routes/profileRoutes";
import projectRoutes from "./routes/projectRoutes";
import skillRoutes from "./routes/skillRoutes";
import projectSkillRoutes from "./routes/projectSkillRoutes";
import messageRoutes from "./routes/messageRoutes";
import experienceRoutes from "./routes/experienceRoutes";

// Load env variables
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// Routes
app.use("/api/admin", adminAuthRoutes); // login (public)
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/project-skills", projectSkillRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/experiences", experienceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
