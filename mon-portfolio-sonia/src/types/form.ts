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
export type TProfileForm = Omit<TProfile, "_id" | "avatar" | "cv_url"> & {
  avatar?: File | string | null;
  cv?: File | string | null;
};


export type TExperienceForm =
  Omit<
    TExperience,
    "_id" | "createdAt" | "updatedAt" | "technologies" | "achievements"
  > & {
    // In forms we prefer a comma-separated string for achievements
    achievements: string;
    technologies: string[];
    // preview/upload field used in admin forms
    experienceIcon?: File | string | null;
  };
