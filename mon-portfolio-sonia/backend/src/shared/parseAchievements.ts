// ----------------- Normalisation des réalisations (backend copy) -----------------

// Utilitaire pour normaliser/extraire les réalisations (copie côté serveur)
export const parseAchievements = (raw: unknown): string[] => {
  if (raw === undefined || raw === null) return [];

  const tryParseJson = (s: string): string[] | null => {
    try {
      const p = JSON.parse(s);
      if (Array.isArray(p)) return p.map((a) => String(a));
    } catch {
      return null;
    }
    return null;
  };

  const cleanItem = (s: string) => s.replace(/^[\x5B\x5D"]+|[\x5B\x5D"]+$/g, "").trim();

  const splitAndClean = (s: string) =>
    s
      .split(/[,;\r\n]+/)
      .map((p) => p.replace(/[\x5B\x5D"]+/g, "").trim())
      .filter(Boolean);

  if (Array.isArray(raw)) {
    const joined = (raw as unknown[]).join(",");
    const parsed = tryParseJson(joined);
    if (parsed) return parsed.map((a) => a.trim()).filter(Boolean);
    return (raw as unknown[]).map((a) => cleanItem(String(a))).filter(Boolean);
  }

  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return [];
    const parsed = tryParseJson(s);
    if (parsed) return parsed.map((a) => a.trim()).filter(Boolean);
    return splitAndClean(s);
  }

  return splitAndClean(String(raw));
};

export default parseAchievements;
