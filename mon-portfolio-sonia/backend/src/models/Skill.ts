// src/models/Skill.ts
// skills (id, name, technique, #profile_id)
// On conserve profile_id pour permettre d'associer une compétence à un profil si nécessaire.
import mongoose, { Document, Schema } from "mongoose";

export interface ISkill extends Document {
  name: string;
  icon: string;
  technique: boolean;
  profile_id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    technique: { type: Boolean, default: true },
    profile_id: { type: Schema.Types.ObjectId, ref: "Profile" }
  },
  { timestamps: true }
);

export default mongoose.model<ISkill>("Skill", SkillSchema);
