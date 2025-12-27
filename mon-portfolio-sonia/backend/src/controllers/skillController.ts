// ---------------------- Controller des compétences --------------------//
import { Request, Response } from "express";
import Skill from "../models/Skill";
import Project from "../models/Project";
import ProjectSkill from "../models/ProjectSkill";


/************************************************************** 
 *                GET /api/skills/
 *              Recupèration de toutes les compétences 
 **************************************************************/
export const getSkills = async (req: Request, res: Response) => {
  try {

    // Récupère toutes les compétences, triées par nom
    const skills = await Skill.find().sort({ name: 1 }).lean();
    res.json(skills);
  } catch (err) {
    console.error("getSkills error:", err);
    res.status(500).json({ message: "Erreur récupération compétences" });
  }
};

/************************************************************** 
 *                  POST /api/admin/skills
 *             Création d'une ou plusieurs compétences
 **************************************************************/
export const createSkill = async (req: Request, res: Response) => {
  try {

    // D'abord on gère le cas de création multiple
    const skillsData = Array.isArray(req.body) ? req.body : [req.body];
    
    // On initialise un tableau pour stocker les compétences créées
    const createdSkills = [];

    // On boucle sur les données pour créer chaque compétence
    for (const data of skillsData) {
      const { name, technique, profile_id } = data;

      // Crée une nouvelle instance de Skill
      const skill = new Skill({
        name,
        technique: !!technique,
        profile_id,
        icon: req.file ? `/uploads/skills/${req.file.filename}` : "/assets/default-skill.svg",
      });

      // Sauvegarder dans la base de données
      await skill.save();
      // Ajouter au tableau des compétences créées
      createdSkills.push(skill);
    }

    res.status(201).json(skillsData.length === 1 ? createdSkills[0] : createdSkills);
  } catch (err) {
    console.error("createSkill error:", err);
    res.status(500).json({ message: "Erreur création compétence" });
  }
};


/************************************************************** 
 *                  PUT /api/admin/skills/:id
 *                  Mise à jour d'une compétence 
 **************************************************************/
export const updateSkill = async (req: Request, res: Response) => {
  try {
    // Trouve la compétence par ID cad la compétence à mettre à jour
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Compétence non trouvée" });

    // Récupèrer la compétence
    const { name, technique, profile_id } = req.body;

    if (name) skill.name = name;
    if (typeof technique !== "undefined") skill.technique = technique;
    if (profile_id) skill.profile_id = profile_id;
    if (req.file) skill.icon = `/uploads/skills/${req.file.filename}`;

    // Mettre à jour
    await skill.save();
    res.json(skill);
  } catch (err) {
    console.error("updateSkill error:", err);
    res.status(500).json({ message: "Erreur mise à jour compétence" });
  }
};


/************************************************************** 
 *                DELETE /api/admin/skills/:id
 *                   Suppression d'un skill 
 **************************************************************/
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Supprime les références dans les projets
    await Project.updateMany({}, { $pull: { skills: id } });

    // Supprime les entrées 
    await ProjectSkill.deleteMany({ skill_id: id });

    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) return res.status(404).json({ message: "Compétence non trouvée" });

    res.json({ message: "Compétence supprimée" });
  } catch (err) {
    console.error("deleteSkill error:", err);
    res.status(500).json({ message: "Erreur suppression compétence" });
  }
};
