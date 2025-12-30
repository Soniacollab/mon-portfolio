import { fetchWithRefreshOrRedirect } from "./fetchWithRefresh";

export async function downloadFile(url: string, filename?: string) {
  // Utilise la variante qui redirige si le refresh échoue
  const res = await fetchWithRefreshOrRedirect(url, { method: "GET" });
  if (!res) throw new Error("Session expirée, redirection vers la page de connexion");
  if (!res.ok) throw new Error(`Téléchargement échoué (${res.status})`);
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename || url.split("/").pop() || "file";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

export default downloadFile;
