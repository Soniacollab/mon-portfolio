// ----------------- Normalisation des réalisations (partagée) -----------------

// Utilitaire pour normaliser/extraire les réalisations
export const parseAchievements = (raw: unknown): string[] => {
  // si non défini ou null, retourner tableau vide
  if (raw === undefined || raw === null) return [];

  // On tente de parser une chaîne JSON et retourner un tableau
  const tryParseJson = (s: string): string[] | null => {
    try {
      const p = JSON.parse(s);
      if (Array.isArray(p)) return p.map((a) => String(a));
    } catch {
      return null; // non JSON
    }
    return null;
  };

  // helper: nettoyage d'un item (supprime crochets/guillemets autour)
  const cleanItem = (s: string) => s.replace(/^[\x5B\x5D"]+|[\x5B\x5D"]+$/g, "").trim();

  // helper: split + nettoyage sur délimiteurs communs
  const splitAndClean = (s: string) =>
    s
      .split(/[,;\r\n]+/)
      .map((p) => p.replace(/[\x5B\x5D"]+/g, "").trim())
      .filter(Boolean);

  // Si on reçoit un tableau, essayer d'abord de le reconstituer en JSON
  if (Array.isArray(raw)) {
    const joined = (raw as unknown[]).join(",");
    const parsed = tryParseJson(joined);
    if (parsed) return parsed.map((a) => a.trim()).filter(Boolean);
    // fallback: nettoyer chaque élément individuellement
    return (raw as unknown[]).map((a) => cleanItem(String(a))).filter(Boolean);
  }

  // Si c'est une chaîne, tenter JSON puis fallback split
  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return [];
    const parsed = tryParseJson(s);
    if (parsed) return parsed.map((a) => a.trim()).filter(Boolean);
    return splitAndClean(s);
  }

  // Sinon, forcer en chaîne et split + clean
  return splitAndClean(String(raw));
};

export default parseAchievements;
