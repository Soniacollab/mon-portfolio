import { useState, useEffect } from "react";
import { projectAPI } from "../api/admin";
import { TProject } from "../types";

export const useProjects = () => {
  const [projects, setProjects] = useState<TProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await projectAPI.getAll();
        setProjects(data);
      } catch (err) {
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
