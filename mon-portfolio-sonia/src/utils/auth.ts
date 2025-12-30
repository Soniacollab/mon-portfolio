

import axios from "axios";
import { API_URL } from "../constants/api";

// Déduplication des appels de refresh : si un refresh est déjà en cours,
// on retourne la même Promise afin d'éviter plusieurs appels concurrents.
let refreshing: Promise<boolean> | null = null;

export const refreshToken = async (): Promise<boolean> => {
  if (refreshing) return refreshing;

  refreshing = (async () => {
    try {
      // Utilise axios sans l'instance `api` pour éviter d'entrer dans l'intercepteur
      await axios.post(`${API_URL}/admin/auth/refresh-token`, null, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return true;
    } catch (err) {
      return false;
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
};
