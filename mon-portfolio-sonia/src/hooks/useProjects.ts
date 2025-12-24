import { useEffect, useState } from "react";
import { getProjects, TProject } from "../api/projects";

export const useProjects = () => {
  const [projects, setProjects] = useState<TProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProjects();
        console.log("data reçue de l'API projects:", data); // 🔥 pour debug
        setProjects(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Erreur fetch projects:", err);
        setError("Impossible de récupérer les projets");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { projects, loading, error };
};
