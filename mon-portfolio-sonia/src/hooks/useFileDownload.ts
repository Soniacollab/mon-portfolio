import { useCallback, useState } from "react";
import downloadFile from "../utils/download";

export default function useFileDownload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = useCallback(async (url?: string, filename?: string) => {
    if (!url) {
      setError("URL manquante");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await downloadFile(url, filename);
    } catch (err: any) {
      setError(err?.message || "Erreur lors du téléchargement");
    } finally {
      setLoading(false);
    }
  }, []);

  return { download, loading, error } as const;
}
