// src/controllers/skillController.ts
// CRUD compétences. Public GET, admin POST/PUT/DELETE.
import { Request, Response } from "express";
import Skill from "../models/Skill";
import Project from "../models/Project";
import ProjectSkill from "../models/ProjectSkill";
import mongoose from "mongoose";

/** GET /api/skills */
export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find().sort({ name: 1 }).lean();
    res.json(skills);
  } catch (err) {
    console.error("getSkills error:", err);
    res.status(500).json({ message: "Erreur récupération compétences" });
  }
};

/** POST /api/admin/skills */
export const createSkill = async (req: Request, res: Response) => {
  try {
    const skillsData = Array.isArray(req.body) ? req.body : [req.body];
    const createdSkills = [];

    for (const data of skillsData) {
      const { name, technique, profile_id } = data;
      if (!name) return res.status(400).json({ message: "Le nom de la compétence est requis" });

      const skill = new Skill({ 
        name, 
        technique: !!technique, 
        profile_id,
        icon: req.file ? `/uploads/skills/${req.file.filename}` : "/assets/default-skill.svg" // fallback si pas d'upload
      });

      await skill.save();
      createdSkills.push(skill);
    }

    res.status(201).json(skillsData.length === 1 ? createdSkills[0] : createdSkills);
  } catch (err) {
    console.error("createSkill error:", err);
    res.status(500).json({ message: "Erreur création compétence" });
  }
};

/** PUT /api/admin/skills/:id */
export const updateSkill = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID invalide" });

    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: "Compétence non trouvée" });

    const { name, technique } = req.body;
    if (typeof name !== "undefined") skill.name = name;
    if (typeof technique !== "undefined") skill.technique = technique;
    if (req.file) skill.icon = `/uploads/skills/${req.file.filename}`; // update si upload

    await skill.save();
    res.json(skill);
  } catch (err) {
    console.error("updateSkill error:", err);
    res.status(500).json({ message: "Erreur mise à jour compétence" });
  }
};


/** DELETE /api/admin/skills/:id */
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "ID invalide" });
    // remove references from projects
    await Project.updateMany({}, { $pull: { skills: id } });
    // remove pivot entries
    await ProjectSkill.deleteMany({ skill_id: id });
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) return res.status(404).json({ message: "Compétence non trouvée" });
    res.json({ message: "Compétence supprimée" });
  } catch (err) {
    console.error("deleteSkill error:", err);
    res.status(500).json({ message: "Erreur suppression compétence" });
  }
  
};
