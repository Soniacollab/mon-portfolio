//----------------- Controller pour les expériences ----------------//
import { Request, Response } from "express";
import Experience from "../models/Experience";
import Skill from "../models/Skill";
import mongoose from "mongoose";

// Robust normalizer for achievements input (JSON array, CSV, newlines, or quoted items)
const normalizeAchievements = (raw: any): string[] => {
  if (raw === undefined || raw === null) return [];
  if (Array.isArray(raw)) {
    // Some clients may produce an array of JSON-fragments like ['["a"', '"b"]']
    // Try to rejoin and parse as JSON first
    try {
      const joined = raw.join(",");
      const parsed = JSON.parse(joined);
      if (Array.isArray(parsed)) return parsed.map((a: any) => String(a).trim()).filter(Boolean);
    } catch {
      // fallback: strip surrounding brackets/quotes from each item
      return raw
        .map((a: any) => String(a).replace(/^[\[\]"]+|[\[\]"]+$/g, "").trim())
        .filter(Boolean);
    }
  }
  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return [];
    // try JSON parse first
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map((a: any) => String(a).trim()).filter(Boolean);
    } catch {
      // ignore
    }

    // If looks like ["a" "b"] where commas missing but quotes present, extract quoted parts
    const quotedMatches = Array.from(s.matchAll(/"([^"]+)"|'([^']+)'/g)).map(m => (m[1] || m[2] || "").trim()).filter(Boolean);
    if (quotedMatches.length) return quotedMatches;

    // Split on common delimiters: comma, semicolon, or newlines
    return s.split(/[,;\r\n]+/).map(part => part.replace(/[\[\]\"]+/g, "").trim()).filter(Boolean);
  }
  // Fallback: coerce to string and split
  return String(raw).split(/[,;\r\n]+/).map(p => p.replace(/[\[\]\"]+/g, "").trim()).filter(Boolean);
};


/************************************************************** 
 *                  GET /api/experiences
 *   Récupère toutes les expériences de la base de données 
 **************************************************************/
export const getExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find()
      .populate("technologies") // Remplace les IDs par les doc des technologies
      .sort({ startDate: -1 }) // Tri décroissant par date de début
      .lean(); // Retourne un objet simple
    const cleaned = experiences.map((exp: any) => ({
      ...exp,
      achievements: normalizeAchievements(exp.achievements),
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
    let techRaw: any[] = [];
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
      if (mongoose.Types.ObjectId.isValid(t)) {
        techIds.push(new mongoose.Types.ObjectId(t));
      } else {
        const name = String(t).trim();
        if (!name) continue;
        // find existing skill by case-insensitive name
        const existing = await Skill.findOne({ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") });
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
    const achievementsArr: string[] = normalizeAchievements(achievements);
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
      const norm = normalizeAchievements(achievements);
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
          if (mongoose.Types.ObjectId.isValid(t)) newTechIds.push(new mongoose.Types.ObjectId(t));
          else {
            const name = String(t).trim();
            if (!name) continue;
            const existing = await Skill.findOne({ name: new RegExp(`^${name.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "i") });
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
