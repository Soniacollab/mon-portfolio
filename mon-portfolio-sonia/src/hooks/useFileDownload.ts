//------------- Hook pour gérer le téléchargement de fichiers ----------//

import { useCallback, useState } from "react";
import downloadFile from "../utils/download";

export default function useFileDownload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour télécharger un fichier
  // j'utilise useCallback pour éviter de recréer la fonction à chaque rendu
  const download = useCallback(async (url?: string, filename?: string) => {
    if (!url) {
      setError("URL manquante");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await downloadFile(url, filename);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError(String(err) || "Erreur lors du téléchargement");
    } finally {
      setLoading(false);
    }
  }, []);

  return { download, loading, error } as const;
}
