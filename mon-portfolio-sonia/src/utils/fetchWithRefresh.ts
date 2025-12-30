import { refreshToken } from "./auth";

// Utilitaire fetch qui va un refresh si la requête retourne 401/403
export const fetchWithRefresh = async (url: string, options: RequestInit = {}) => {

  //Ici on a la première requête
  let res = await fetch(url, { ...options, credentials: "include" });

  // Si on reçoit 401 Unauthorized ou 403 Forbidden, on tente de refresh le token
  if (res.status === 401 || res.status === 403) {
    const ok = await refreshToken();
    if (ok) {
      res = await fetch(url, { ...options, credentials: "include" });
    } else {
      return null;
    }
  }

  return res;
};


// Fonction qui redirige vers la page de login si le refresh échoue
export const fetchWithRefreshOrRedirect = async (url: string, options: RequestInit = {}) => {
  const res = await fetchWithRefresh(url, options);
  if (!res) {
    // redirection côté client vers la page de login admin
    window.location.href = "/admin/secure-login";
    return null;
  }
  return res;
};
