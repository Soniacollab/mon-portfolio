export const parseAchievements = (raw: string[] | string | undefined): string[] => {
  if (raw === undefined || raw === null) return [];

  // If it's already an array, try to join/parse fragments or clean each item
  if (Array.isArray(raw)) {
    try {
      const joined = raw.join(",");
      const parsed = JSON.parse(joined);
      if (Array.isArray(parsed)) return parsed.map((a) => String(a).trim()).filter(Boolean);
    } catch {
      return raw
        .map((a) => String(a).replace(/^[\[\]"]+|[\[\]"]+$/g, "").trim())
        .filter(Boolean);
    }
  }

  // If it's a string, try JSON parse first
  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map((a) => String(a).trim()).filter(Boolean);
    } catch {
      // attempt to extract quoted items like "a" "b"
      const quotedMatches = Array.from(s.matchAll(/"([^\"]+)"|'([^']+)'/g)).map(m => (m[1] || m[2] || "").trim()).filter(Boolean);
      if (quotedMatches.length) return quotedMatches;
      // fallback split on comma/semicolon/newline
      return s.split(/[,;\r\n]+/).map((p) => p.replace(/[\[\]"]+/g, "").trim()).filter(Boolean);
    }
  }

  return [];
};

export default parseAchievements;
