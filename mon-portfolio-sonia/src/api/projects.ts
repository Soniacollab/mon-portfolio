import axios from "axios";

// src/api/projects.ts
export interface TSkill {
  _id: string;
  name: string;
}

export interface TProject {
  _id: string;
  title: string;
  description: string;
  link?: string;
  image?: string;
  skills?: TSkill[];
  featured: boolean; // <-- Ajoute
  createdAt: string; // <-- Ajoute
  updatedAt?: string;
}

// GET tous les projets
export const getProjects = async (): Promise<TProject[]> => {
  const res = await axios.get("http://localhost:5000/api/projects");
  return res.data;
};