// src/types/form.ts
import { TSkill, TExperience, TProject, TProfile } from "./index";

export type TSkillForm =
  Omit<TSkill, "_id" | "icon"> & {
    icon?: File | string;
  };


export type TProjectForm =
  Omit<TProject, "_id" | "createdAt" | "updatedAt" | "skills" | "image"> & {
    skills: string[];
    image?: File | string;
  };


// Form pour le hook
export type TProfileForm = Omit<TProfile, "_id"> & {
  avatarFile?: File;
  cvFile?: File;
};


  export type TExperienceForm =
  Omit<TExperience, "_id" | "createdAt" | "updatedAt" | "technologies"> & {
    technologies: string[];
  };
