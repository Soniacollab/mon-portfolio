// src/models/ProjectSkill.ts
// Table pivot explicit pour respecter ton MLD: projects_skills(#project_id, #skill_id)
// Avec Mongo ce fichier est optionnel (on peut utiliser project.skills) mais on le conserve pour conformité.
import mongoose, { Document, Schema } from "mongoose";

export interface IProjectSkill extends Document {
  project_id: mongoose.Types.ObjectId;
  skill_id: mongoose.Types.ObjectId;
  createdAt?: Date;
}

const ProjectSkillSchema = new Schema<IProjectSkill>({
  project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  skill_id: { type: Schema.Types.ObjectId, ref: "Skill", required: true }
});

ProjectSkillSchema.index({ project_id: 1, skill_id: 1 }, { unique: true });

export default mongoose.model<IProjectSkill>("ProjectSkill", ProjectSkillSchema);
