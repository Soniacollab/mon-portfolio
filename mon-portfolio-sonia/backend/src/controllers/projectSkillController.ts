//---------------- Controller pour la liaison project-skill -------------//
import { Request, Response } from "express";
import ProjectSkill from "../models/ProjectSkill";
import Project from "../models/Project";
import mongoose from "mongoose";

export const addProjectSkill = async (req: Request, res: Response) => {
  try {
    const { project_id, skill_id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(project_id) || !mongoose.Types.ObjectId.isValid(skill_id)) {
      return res.status(400).json({ message: "IDs invalides" });
    }

    // upsert
    await ProjectSkill.updateOne(
      { project_id, skill_id },
      { project_id, skill_id },
      { upsert: true }
    );

    // ensure project.skills contains skill_id
    await Project.updateOne({ _id: project_id }, { $addToSet: { skills: skill_id } });

    res.json({ message: "Lien projet/skill ajouté" });
  } catch (err) {
    console.error("addProjectSkill error:", err);
    res.status(500).json({ message: "Erreur ajout lien projet/skill" });
  }
};

export const removeProjectSkill = async (req: Request, res: Response) => {
  try {
    const { project_id, skill_id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(project_id) || !mongoose.Types.ObjectId.isValid(skill_id)) {
      return res.status(400).json({ message: "IDs invalides" });
    }

    await ProjectSkill.deleteOne({ project_id, skill_id });
    // remove from project.skills
    await Project.updateOne({ _id: project_id }, { $pull: { skills: skill_id } });

    res.json({ message: "Lien projet/skill supprimé" });
  } catch (err) {
    console.error("removeProjectSkill error:", err);
    res.status(500).json({ message: "Erreur suppression lien projet/skill" });
  }
};
