//------------------------- Project Controller ----------------------//

import e, { Request, Response } from "express";
import mongoose from "mongoose";
import Project from "../models/Project";
import ProjectSkill from "../models/ProjectSkill";
import Skill from "../models/Skill";


/************************************************************** 
 *                GET /api/projects/:id
 *            Récupération de tous les projets 
 **************************************************************/
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find()
      .populate("skills")
      .sort({ createdAt: -1 })
      .lean();

    res.json(projects);
  } catch (err) {
    console.error("getProjects erreur:", err);
    res.status(500).json({ message: "Erreur récupération projets" });
  }
};



/************************************************************** 
 *                 GET /api/projects/:id
 *               Création d'un nouveau projet
 **************************************************************/
export const createProject = async (req: Request, res: Response) => {
  try {
    // On récupère les données du corps de la requête
    const { title, description, link, profile_id, skills } = req.body;

    // Si un projet avec le même titre existe déjà, on renvoie une erreur
    const existing = await Project.findOne({ title });
    if (existing) return res.status(400).json({ message: "Projet déjà existant !" });

    // On vérifie que les skills existent et on prépare leurs IDs
    const skillIds: mongoose.Types.ObjectId[] = [];
    if (skills) {
      for (const s of skills) {
        const exists = await Skill.findById(s);
        if (exists) skillIds.push(exists._id);
      }
    }

    // On gère l'upload de l'image dans le dossier approprié
    const imagePath = req.file
      ? `/uploads/projects/${req.file.filename}`
      : "/assets/default-project.png";

    // On crée le projet ici
    const project = new Project({
      title,
      description,
      link,
      profile_id,
      skills: skillIds,
      image: imagePath,
    });

    // On save le projet dans la bdd
    await project.save();

    // On crée les associations dans ProjectSkill
    for (const sid of skillIds) {
      await ProjectSkill.updateOne(
        { project_id: project._id, skill_id: sid },
        { project_id: project._id, skill_id: sid },
        { upsert: true }
      );
    }

    // Après création, on renvoie le projet créé avec les skills associées
    await project.populate("skills");
    res.status(201).json({ message: "Projet créé avec succès", project });
  } catch (err) {
    console.error("createProject error:", err);
    res.status(500).json({ message: "Erreur création projet" });
  }
};



/************************************************************** 
 *                PUT /api/admin/projects/:id
 *              Mise à jour d'un projet existant
 **************************************************************/
export const updateProject = async (req: Request, res: Response) => {
  try {

    // D'abord, on vérifie que le projet existe
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet non trouvé" });

    //On récupère les données à mettre à jour
    const { title, description, link, profile_id, skills } = req.body;

    // Vérifier si projet avec même titre existe déjà
    if (title && title !== project.title) {
      const existing = await Project.findOne({ title });
      if (existing) return res.status(400).json({ message: "Un projet avec ce titre existe déjà" });
      project.title = title;
    }

    // On met à jour les autres champs si fournis
    if (description !== undefined) project.description = description;
    if (link !== undefined) project.link = link;
    if (profile_id !== undefined) project.profile_id = profile_id;
    if (req.file) project.image = `/uploads/projects/${req.file.filename}`;

    // On gère les skills associés au projet
    if (skills) {
      const skillIds: mongoose.Types.ObjectId[] = [];
      for (const s of skills) {
        const foundSkills = await Skill.findById(s);
        if (foundSkills) skillIds.push(foundSkills._id);
      }

      // On met à jour la liste des skills du projet
      project.skills = skillIds;

      // On met à jour les associations dans ProjectSkill
      await ProjectSkill.deleteMany({
        project_id: project._id,
        skill_id: { $nin: skillIds },
      });

      // On ajoute les nouvelles associations
      for (const sid of skillIds) {
        await ProjectSkill.updateOne(
          { project_id: project._id, skill_id: sid },
          { project_id: project._id, skill_id: sid },
          { upsert: true }
        );
      }
    }

    // Et enfin on save les modifications
    await project.save();
    await project.populate("skills");
    res.json({ message: "Projet mis à jour avec succès", project });
  } catch (err) {
    console.error("updateProject error:", err);
    res.status(500).json({ message: "Erreur mise à jour projet" });
  }
};



/************************************************************** 
 *                DELETE /api/admin/projects/:id
 *               Suppression d'un projet 
 **************************************************************/
export const deleteProject = async (req: Request, res: Response) => {
  try {

    // D'abord, on vérifie que le projet existe
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet non trouvé" });

    // On supprime les associations dans ProjectSkill cad projet et skills liés
    await ProjectSkill.deleteMany({ project_id: project._id });
    res.json({ message: "Projet supprimé" });
  } catch (err) {
    console.error("deleteProject error:", err);
    res.status(500).json({ message: "Erreur suppression projet" });
  }
};
