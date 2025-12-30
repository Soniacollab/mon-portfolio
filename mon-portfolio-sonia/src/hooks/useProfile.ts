// ------------------ Hook pour gérer le profil utilisateur ------------------ //

import { useState, useEffect, useCallback } from "react";
import { profileAPI } from "../api/admin";
import { TProfile } from "../types";
import useFileDownload from "./useFileDownload";
import { API_URL } from "../constants/api";

export const useProfile = () => {
  const [profile, setProfile] = useState<TProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { download, loading: downloadLoading, error: downloadError } = useFileDownload();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileAPI.get();
        setProfile(data);
      } catch (err) {
        console.error("Erreur fetch profile:", err);
        setError("Impossible de récupérer le profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);


  // URL de téléchargement du CV
  const cvDownloadUrl = profile?.cv_url
    ? profile.cv_url.startsWith("http")
      ? profile.cv_url
      : `${API_URL}/profile/cv/${profile.cv_url.split("/").pop()}`
    : undefined;


  // Fonction pour télécharger le CV avec useFileDownload
  const downloadCV = useCallback(async (filename?: string) => {
    if (!cvDownloadUrl) throw new Error("Aucun CV disponible");
    await download(cvDownloadUrl, filename);
  }, [cvDownloadUrl, download]);


  // Fonction pour refetch le profil
  const refetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await profileAPI.get();
      setProfile(data);
    } catch (err) {
      console.error("Erreur refetch profile:", err);
      setError("Impossible de récupérer le profil");
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, error, cvDownloadUrl, downloadCV, downloadLoading, downloadError, refetchProfile } as const;
};
