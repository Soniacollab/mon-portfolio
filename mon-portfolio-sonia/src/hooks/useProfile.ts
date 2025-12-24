import { useEffect, useState } from "react";
import { getProfile, TProfile } from "../api/profile";

export const useProfile = () => {
  const [profile, setProfile] = useState<TProfile | null>(null); // objet unique
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProfile();
        console.log("data reçue de l'API profile:", data);
        setProfile(data); // data est bien un objet
      } catch (err: any) {
        console.error("Erreur fetch profile:", err);
        setError("Impossible de récupérer le profil");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { profile, loading, error };
};
