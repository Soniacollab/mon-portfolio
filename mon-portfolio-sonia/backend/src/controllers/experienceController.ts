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

    // Valide les technologies
    const techIds: mongoose.Types.ObjectId[] = [];
    if (Array.isArray(technologies) && technologies.length > 0) {
      for (const tech of technologies) {
        if (mongoose.Types.ObjectId.isValid(tech)) {
          techIds.push(new mongoose.Types.ObjectId(tech));
        }
      }
    }

    const experience = new Experience({
      title,
      company,
      description,
      type,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      location,
      technologies: techIds,
      achievements: Array.isArray(achievements) ? achievements : [],
      profile_id
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
    const id = req.params.id;
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
      achievements
    } = req.body;

    if (title) experience.title = title;
    if (company) experience.company = company;
    if (description) experience.description = description;
    if (type) experience.type = type;
    if (startDate) experience.startDate = new Date(startDate);
    if (endDate) experience.endDate = new Date(endDate);
    if (location !== undefined) experience.location = location;
    if (Array.isArray(achievements)) experience.achievements = achievements;

    // Update technologies
    if (Array.isArray(technologies)) {
      const techIds: mongoose.Types.ObjectId[] = [];
      for (const tech of technologies) {
        if (mongoose.Types.ObjectId.isValid(tech)) {
          techIds.push(new mongoose.Types.ObjectId(tech));
        }
      }
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
    const id = req.params.id;
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