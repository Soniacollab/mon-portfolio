// ------------------ Hook pour gérer les projets ------------------ //
import { useState, useEffect, useCallback } from "react";
import { projectAPI } from "../api/admin";
import { TProject } from "../types";

export const useProjects = () => {
  const [projects, setProjects] = useState<TProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Fonction pour fetch les projets
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {

      // Pour le debug je log le temps de fetch et le nombre de projets
      const start = Date.now();
      const data = await projectAPI.getAll();
      const duration = Date.now() - start;
      console.log(
        `useProjects: fetched ${Array.isArray(data) ? data.length : 0} projects in ${duration}ms`
      );
      setProjects(data);
      setError(null);
      return data;
    } catch (err) {
      console.error("Erreur fetch projects:", err);
      setError("Impossible de récupérer les projets");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
};
