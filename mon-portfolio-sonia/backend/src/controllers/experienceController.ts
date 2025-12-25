import { Request, Response } from "express";
import Experience from "../models/Experience";
import mongoose from "mongoose";

/** GET /api/experiences */
export const getExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find()
      .populate("technologies")
      .sort({ startDate: -1 })
      .lean();
    res.json(experiences);
  } catch (err) {
    console.error("getExperiences error:", err);
    res.status(500).json({ message: "Erreur récupération expériences" });
  }
};

/** POST /api/admin/experiences */
export const createExperience = async (req: Request, res: Response) => {
  try {
    const {
      title,
      company,
      description,
      type,
      startDate,
      endDate,
      location,
      technologies,
      achievements,
      profile_id
    } = req.body;

    if (!title || !company || !type || !startDate) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    // Gère le fichier uploadé pour l’icône
    const iconPath = req.file ? `/uploads/${req.file.filename}` : req.body.icon;

    // Transforme les technologies en ObjectId
    const techIds: mongoose.Types.ObjectId[] = [];
    if (Array.isArray(technologies)) {
      technologies.forEach((tech: string) => {
        if (mongoose.Types.ObjectId.isValid(tech)) {
          techIds.push(new mongoose.Types.ObjectId(tech));
        }
      });
    }

    const experience = new Experience({
      title,
      company,
      description,
      type,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      technologies: techIds,
      achievements: Array.isArray(achievements) ? achievements : [],
      profile_id,
      icon: iconPath
    });

    await experience.save();
    await experience.populate("technologies");

    res.status(201).json(experience);
  } catch (err) {
    console.error("createExperience error:", err);
    res.status(500).json({ message: "Erreur création expérience" });
  }
};

/** PUT /api/admin/experiences/:id */
export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: "Expérience non trouvée" });
    }

    const {
      title,
      company,
      description,
      type,
      startDate,
      endDate,
      location,
      technologies,
      achievements,
      icon
    } = req.body;

    if (title) experience.title = title;
    if (company) experience.company = company;
    if (description) experience.description = description;
    if (type) experience.type = type;
    if (startDate) experience.startDate = new Date(startDate);
    if (endDate !== undefined) experience.endDate = new Date(endDate);
    if (location !== undefined) experience.location = location;
    if (Array.isArray(achievements)) experience.achievements = achievements;

    // Update icon si nouveau fichier uploadé
    if (req.file) {
      experience.icon = `/uploads/${req.file.filename}`;
    } else if (icon !== undefined) {
      experience.icon = icon;
    }

    // Update technologies
    if (Array.isArray(technologies)) {
      const techIds: mongoose.Types.ObjectId[] = [];
      technologies.forEach((tech: string) => {
        if (mongoose.Types.ObjectId.isValid(tech)) {
          techIds.push(new mongoose.Types.ObjectId(tech));
        }
      });
      experience.technologies = techIds;
    }

    await experience.save();
    await experience.populate("technologies");

    res.json(experience);
  } catch (err) {
    console.error("updateExperience error:", err);
    res.status(500).json({ message: "Erreur mise à jour expérience" });
  }
};

/** DELETE /api/admin/experiences/:id */
export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) {
      return res.status(404).json({ message: "Expérience non trouvée" });
    }

    res.json({ message: "Expérience supprimée" });
  } catch (err) {
    console.error("deleteExperience error:", err);
    res.status(500).json({ message: "Erreur suppression expérience" });
  }
};
