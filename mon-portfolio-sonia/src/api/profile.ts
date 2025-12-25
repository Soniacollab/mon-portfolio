import axios from "axios";

// src/api/profile.ts

export interface TProfile {
  _id: string;
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

// Récupèrer profil
export const getProfile = async (): Promise<TProfile> => {
  const res = await axios.get("http://localhost:5000/api/admin/profile");
  return res.data; 
};
