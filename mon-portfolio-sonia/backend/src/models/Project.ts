// src/models/Project.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  title: string;
  description?: string;
  image?: string;
  link?: string;
  profile_id?: mongoose.Types.ObjectId;
  skills: mongoose.Types.ObjectId[];
  featured: boolean; 
  createdAt?: Date;
  updatedAt?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    link: { type: String },
    profile_id: { type: Schema.Types.ObjectId, ref: "Profile" },
    skills: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    featured: { type: Boolean, default: false } // ← NOUVEAU
  },
  { timestamps: true } // ← createdAt et updatedAt sont déjà ici
);

export default mongoose.model<IProject>("Project", ProjectSchema);