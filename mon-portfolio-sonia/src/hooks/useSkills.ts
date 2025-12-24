// src/hooks/useSkills.ts
import { useEffect, useState } from "react";
import { getSkills, TSkill } from "../api/skills";

export const useSkills = () => {
  const [skills, setSkills] = useState<TSkill[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError("Impossible de récupérer les compétences");
      } 
    };
    fetchSkills();
  }, []);

  return { skills, error };
};