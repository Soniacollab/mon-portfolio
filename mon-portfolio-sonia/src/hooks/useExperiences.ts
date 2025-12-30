//-------------- Hook pour gérer les expériences ---------------//

import { useState, useEffect } from "react";
import { experienceAPI } from "../api/admin";
import { TExperience } from "../types";
import parseAchievements from "../shared/parseAchievements";



export const useExperiences = () => {
  const [experiences, setExperiences] = useState<TExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour fetch les expériences
  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const data = await experienceAPI.getAll();
      // ON normalise les achievements en tableau
      const normalized = data.map((d) => ({
        ...d,
        achievements: parseAchievements(d.achievements as unknown as string[] | string),
      } as TExperience));

      // On met à jour l'état avec les expériences normalisées
      setExperiences(normalized);
      // On réinitialise l'erreur
      setError(null);
    } catch (err) {
      console.error("Erreur fetch experiences:", err);
      setError("Impossible de récupérer les expériences");
    } 
    // Ici j'utilise finally car je veux être sûr que loading sera mis à false
    // que la requête réussisse ou échoue
    finally {
      setLoading(false);
    }
  };


  // useEffect pour fetch les expériences au montage du composant
  useEffect(() => {
    fetchExperiences();
  }, []);


  // Enfin on retourne les états et la fonction de refetch
  return { experiences, loading, error, fetchExperiences };
};
