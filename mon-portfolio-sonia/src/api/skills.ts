// src/api/skills.ts
import axios from "axios";

export interface TSkill {
  _id: string;
  name: string;
  icon: string;
  technique: boolean;
  createdAt: string;
  updatedAt?: string;
}

export const getSkills = async (): Promise<TSkill[]> => {
  const res = await axios.get("http://localhost:5000/api/skills");
  return res.data;
};