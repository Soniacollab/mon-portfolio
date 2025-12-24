import axios from "axios";

export interface TExperience {
  _id: string;
  title: string;
  company: string;
  description: string;
  type: 'stage' | 'job' | 'internship' | 'freelance';
  startDate: string;
  endDate?: string;
  location?: string;
  technologies: Array<{
    _id: string;
    name: string;
  }>;
  achievements: string[];
  createdAt: string;
  updatedAt?: string;
}

export const getExperiences = async (): Promise<TExperience[]> => {
  const res = await axios.get("http://localhost:5000/api/experiences");
  return res.data;
};