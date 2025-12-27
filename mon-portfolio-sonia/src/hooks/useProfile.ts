import { useState, useEffect, useCallback } from "react";
import { profileAPI } from "../api/admin";
import { TProfile } from "../types";
import useFileDownload from "./useFileDownload";

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

  const cvDownloadUrl = profile?.cv_url
    ? profile.cv_url.startsWith("http")
      ? profile.cv_url
      : `http://localhost:5000/api/profile/cv/${profile.cv_url.split("/").pop()}`
    : undefined;

  const downloadCV = useCallback(async (filename?: string) => {
    if (!cvDownloadUrl) throw new Error("Aucun CV disponible");
    await download(cvDownloadUrl, filename);
  }, [cvDownloadUrl, download]);

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
