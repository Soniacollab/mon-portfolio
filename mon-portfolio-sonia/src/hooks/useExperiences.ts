import { useState, useEffect } from "react";
import { experienceAPI } from "../api/admin";
import { TExperience } from "../types";
import parseAchievements from "../utils/parseAchievements";

export const useExperiences = () => {
  const [experiences, setExperiences] = useState<TExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await experienceAPI.getAll();
        // normalize achievements field
        const normalized = data.map((d) => ({
          ...d,
          achievements: parseAchievements(d.achievements as any),
        } as TExperience));
        setExperiences(normalized);
      } catch (err) {
        console.error("Erreur fetch experiences:", err);
        setError("Impossible de récupérer les expériences");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { experiences, loading, error };
};
