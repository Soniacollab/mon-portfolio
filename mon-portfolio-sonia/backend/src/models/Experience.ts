import mongoose, { Document, Schema } from "mongoose";

export interface IExperience extends Document {
  title: string;
  company: string;
  description: string;
  type: 'stage' | 'job' | 'internship' | 'freelance';
  startDate: Date;
  icon: string;
  endDate: Date;
  location?: string;
  technologies: mongoose.Types.ObjectId[]; // Référence vers Skill
  achievements: string[]; // Points/bullet points
  profile_id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    title: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    description: { type: String },
    type: { 
      type: String, 
      enum: ['stage', 'job', 'internship', 'freelance'], 
      required: true 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String },
    technologies: [{ type: Schema.Types.ObjectId, ref: "Skill" }],
    achievements: [{ type: String }],
    profile_id: { type: Schema.Types.ObjectId, ref: "Profile" },
    icon: { type: String }, // ← chemin ou URL de l’icône
  },
  { timestamps: true }
);

export default mongoose.model<IExperience>("Experience", ExperienceSchema);