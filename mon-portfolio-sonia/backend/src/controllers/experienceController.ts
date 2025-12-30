//----------------- Controller pour les expériences ----------------//
import { Request, Response } from "express";
import Experience from "../models/Experience";
import Skill from "../models/Skill";
import mongoose from "mongoose";
// Récupère l'utilitaire partagé pour normaliser les réalisations
import parseAchievements from "../shared/parseAchievements";

// NOTE: use the shared `parseAchievements` util from frontend `src/utils`.
// La fonction exportée par défaut renvoie un tableau de chaînes nettoyées.


/************************************************************** 
 *                  GET /api/experiences
 *   Récupère toutes les expériences de la base de données 
 **************************************************************/
export const getExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find()
      .populate("technologies")
      
      // Ici on trie par endDate asc , puis startDate desc, puis createdAt desc
      .sort({ endDate: 1, startDate: -1, createdAt: -1 })
      .lean(); // Retourne un objet simple

    // Nettoyage du champ achievements pour chaque expérience
    const cleaned = (experiences as unknown[]).map((exp) => ({
      ...(exp as Record<string, unknown>),
      achievements: parseAchievements((exp as Record<string, unknown>)["achievements"]),
    }));

    res.json(cleaned); // Envoie la réponse JSON au client
  } catch (err) {
    console.error("getExperiences error:", err);
    res.status(500).json({ message: "Erreur récupération expériences" });
  }
};


/********************************************************************
 *                POST /api/admin/experiences
 *                Crée une nouvelle expérience
 ********************************************************************/
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

    // Gestion de l'icône uploadée et fallback si aucune image uploadée
    const iconPath = req.file ? `/uploads/experiences/${req.file.filename}` : "/assets/default-experience.svg";

    // Transformation du tableau de technologies en ObjectId valides
    const techIds: mongoose.Types.ObjectId[] = [];
    let techRaw: unknown[] = [];
    if (Array.isArray(technologies)) techRaw = technologies;
    else if (typeof technologies === "string") {
      try {
        const parsed = JSON.parse(technologies);
        if (Array.isArray(parsed)) techRaw = parsed;
        else techRaw = String(technologies).split(",").map(s => s.trim()).filter(Boolean);
      } catch {
        techRaw = String(technologies).split(",").map(s => s.trim()).filter(Boolean);
      }
    }

    for (const t of techRaw) {

      // Accepter soit un ID Mongo valide, soit un nom de compétence
      const tStr = String(t);

      // Si c'est un ID Mongo valide, l'utiliser directement
      if (mongoose.Types.ObjectId.isValid(tStr)) {
        techIds.push(new mongoose.Types.ObjectId(tStr));
      }
      
      // Sinn nom de compétence 
      else {
        const name = tStr.trim();
        if (!name) continue;
        
        // Chercher une compétence existante (insensible à la casse)
        const existing = await Skill.findOne({ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")}$`, "i") });

        // Si trouvée on utilise son ID, sinon créer une new compétence
        if (existing) techIds.push(existing._id);
        else {
          const created = new Skill({ name, technique: false, icon: "/assets/default-skill.svg" });
          await created.save();
          techIds.push(created._id);
        }
      }
    }

    // Normaliser le champ achievements quelle que soit la forme envoyée
    console.log("createExperience - raw achievements:", achievements);
    const achievementsArr: string[] = parseAchievements(achievements);
    console.log("createExperience - normalized achievements:", achievementsArr);

    // Création du document Experience
    const experience = new Experience({
      title,
      company,
      description,
      type,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      location,
      achievements: achievementsArr,
      profile_id,
      technologies: techIds,
      icon: iconPath,
    });

    await experience.save(); // Sauvegarde dans MongoDB
    await experience.populate("technologies"); // Popule les technologies pour la réponse

    res.status(201).json(experience); // Renvoie la nouvelle expérience
  } catch (err) {
    console.error("createExperience error:", err);
    res.status(500).json({ message: "Erreur création expérience" });
  }
};


/*********************************************************************
 *                 PUT /api/admin/experiences/:id
 *                 Met à jour une expérience existante
 *********************************************************************/
export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Recherche de l'expérience par ID
    const experience = await Experience.findById(id);
    if (!experience) return res.status(404).json({ message: "Expérience non trouvée" });

    // Récupération des données à mettre à jour
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

    // Mise à jour des champs si fournis
    if (title) experience.title = title;
    if (company) experience.company = company;
    if (description) experience.description = description;
    if (type) experience.type = type;
    if (startDate) experience.startDate = new Date(startDate);
    if (endDate !== undefined) experience.endDate = new Date(endDate);
    if (location !== undefined) experience.location = location;
    // Permettre la mise à jour depuis différentes formes (JSON, CSV, newlines, quoted)
    if (typeof achievements !== "undefined") {
      console.log("updateExperience - raw achievements:", achievements);
      const norm = parseAchievements(achievements);
      console.log("updateExperience - normalized achievements:", norm);
      experience.achievements = norm;
    }

    // Mise à jour de l'icône si un nouveau fichier a été uploadé
    if (req.file) experience.icon = `/uploads/experiences/${req.file.filename}`;
    else if (icon !== undefined) experience.icon = icon; // sinon utilisation du champ icon passé

    // Mise à jour du tableau technologies (IDs ou noms acceptés)
    if (typeof technologies !== "undefined") {
      const newTechIds: mongoose.Types.ObjectId[] = [];
      if (Array.isArray(technologies)) {
        for (const t of technologies) {
          const tStr = String(t);
          if (mongoose.Types.ObjectId.isValid(tStr)) newTechIds.push(new mongoose.Types.ObjectId(tStr));
          else {
            const name = tStr.trim();
            if (!name) continue;
            const existing = await Skill.findOne({ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")}$`, "i") });
            if (existing) newTechIds.push(existing._id);
            else {
              const created = new Skill({ name, technique: false, icon: "/assets/default-skill.svg" });
              await created.save();
              newTechIds.push(created._id);
            }
          }
        }
      }
      experience.technologies = newTechIds;
    }

    await experience.save(); // Sauvegarde des modifications
    await experience.populate("technologies"); // Popule les technologies pour la réponse

    res.json(experience); // Renvoie l'expérience mise à jour
  } catch (err) {
    console.error("updateExperience error:", err);
    res.status(500).json({ message: "Erreur mise à jour expérience" });
  }
};


/********************************************************************** 
 *                 DELETE /api/admin/experiences/:id
 *                 Supprime une expérience existante
 **********************************************************************/
export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Suppression par ID
    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) return res.status(404).json({ message: "Expérience non trouvée" });

    res.json({ message: "Expérience supprimée" }); // Confirmation de suppression
  } catch (err) {
    console.error("deleteExperience error:", err);
    res.status(500).json({ message: "Erreur suppression expérience" });
  }
};
