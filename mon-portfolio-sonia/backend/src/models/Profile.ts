// src/models/Profile.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProfile extends Document {
  email: string;
  password?: string; 
  avatar?: string;
  first_name: string;
  last_name: string;
  bio?: string;
  cv_url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    password: { type: String },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    bio: { type: String },
    cv_url: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>("Profile", ProfileSchema);
