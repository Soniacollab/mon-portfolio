// src/types/index.ts

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
  icon?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TSkill {
  _id: string;
  name: string;
  technique: boolean;
  icon?: string;
  profile_id?: string;
}

export interface TProfile {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  bio?: string;
  cv_url?: string;
  avatar?: string;
}

export interface TProject {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  link?: string;
  profile_id?: string;
  skills: TSkill[] | string[]; // si tu veux les objets skills ou juste leurs IDs
  createdAt: string;
  updatedAt?: string;
}

