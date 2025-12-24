import { useEffect, useState } from "react";
import { getExperiences, TExperience } from "../api/experiences";

export const useExperiences = () => {
  const [experiences, setExperiences] = useState<TExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getExperiences();
        setExperiences(Array.isArray(data) ? data : []);
      } catch (err: any) {
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