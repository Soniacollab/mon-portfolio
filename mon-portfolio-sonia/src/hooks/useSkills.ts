// ------------------ Hook pour gérer les compétences ------------------ //
import { useState, useEffect } from "react";
import { skillAPI } from "../api/admin";
import { TSkill } from "../types";

export const useSkills = () => {
  const [skills, setSkills] = useState<TSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await skillAPI.getAll();
      setSkills(data);
    } catch (err) {
      console.error("Erreur fetch skills:", err);
      setError("Impossible de récupérer les compétences");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return { skills, loading, error, fetchSkills };
};
