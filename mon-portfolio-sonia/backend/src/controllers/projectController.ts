import { Request, Response } from "express";
import Project from "../models/Project";
import ProjectSkill from "../models/ProjectSkill";
import Skill from "../models/Skill";
import mongoose from "mongoose";
import path from "path";

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().populate("skills").sort({ createdAt: -1 }).lean();
    res.json(projects);
  } catch (err) {
    console.error("getProjects error:", err);
    res.status(500).json({ message: "Erreur récupération projets" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, link, profile_id, skills } = req.body;
    if (!title) return res.status(400).json({ message: "Le titre est requis" });

    // Vérifier si projet existe déjà
    const existing = await Project.findOne({ title });
    if (existing) return res.status(400).json({ message: "Projet déjà existant" });

    // Skills
    const skillIds: mongoose.Types.ObjectId[] = [];
    if (Array.isArray(skills)) {
      const parsedSkills = typeof skills === "string" ? JSON.parse(skills) : skills;
      for (const s of parsedSkills) {
        if (!mongoose.Types.ObjectId.isValid(s)) continue;
        const found = await Skill.findById(s);
        if (found) skillIds.push(found._id);
      }
    }

    // Image
    let imagePath = "/assets/default-project.png";
    if (req.file) {
      imagePath = `/uploads/projects/${req.file.filename}`;
    }

    const project = new Project({
      title,
      description,
      link,
      profile_id,
      skills: skillIds,
      image: imagePath
    });

    await project.save();

    // Pivot table
    for (const sid of skillIds) {
      await ProjectSkill.updateOne(
        { project_id: project._id, skill_id: sid },
        { project_id: project._id, skill_id: sid },
        { upsert: true }
      );
    }

    await project.populate("skills");
    res.status(201).json({ message: "Projet créé avec succès", project });
  } catch (err) {
    console.error("createProject error:", err);
    res.status(500).json({ message: "Erreur création projet" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID projet invalide" });

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Projet non trouvé" });

    const { title, description, link, profile_id, skills } = req.body;

    if (title && title !== project.title) {
      const existing = await Project.findOne({ title });
      if (existing) return res.status(400).json({ message: "Un projet avec ce titre existe déjà" });
      project.title = title;
    }
    if (typeof description !== "undefined") project.description = description;
    if (typeof link !== "undefined") project.link = link;
    if (typeof profile_id !== "undefined") project.profile_id = profile_id;

    // Image
    if (req.file) project.image = `/uploads/projects/${req.file.filename}`;

    // Skills
    if (Array.isArray(skills)) {
      const skillIds: mongoose.Types.ObjectId[] = [];
      const parsedSkills = typeof skills === "string" ? JSON.parse(skills) : skills;
      for (const s of parsedSkills) {
        if (!mongoose.Types.ObjectId.isValid(s)) continue;
        const found = await Skill.findById(s);
        if (found) skillIds.push(found._id);
      }
      project.skills = skillIds;

      // sync pivot
      await ProjectSkill.deleteMany({ project_id: project._id, skill_id: { $nin: skillIds } });
      for (const sid of skillIds) {
        await ProjectSkill.updateOne(
          { project_id: project._id, skill_id: sid },
          { project_id: project._id, skill_id: sid },
          { upsert: true }
        );
      }
    }

    await project.save();
    await project.populate("skills");
    res.json({ message: "Projet mis à jour avec succès", project });
  } catch (err) {
    console.error("updateProject error:", err);
    res.status(500).json({ message: "Erreur mise à jour projet" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID projet invalide" });

    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ message: "Projet non trouvé" });

    await ProjectSkill.deleteMany({ project_id: project._id });
    res.json({ message: "Projet supprimé" });
  } catch (err) {
    console.error("deleteProject error:", err);
    res.status(500).json({ message: "Erreur suppression projet" });
  }
};
