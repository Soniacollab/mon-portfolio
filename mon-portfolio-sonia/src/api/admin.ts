/**********************************************************************************
 *                  API client pour l'admin avec gestion du refresh token
 **********************************************************************************/

import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { refreshToken } from "../utils/auth";
import { TExperience, TProject, TSkill, TProfile } from "../types";

// URL de base de l'API : utilise `VITE_API_URL` si défini (Vite expose `import.meta.env` au client)
// En dev j'utilise HTTP local par défaut pour éviter les soucis de certificat avec HTTPS localhost
const viteEnv = import.meta.env;
const API_URL = viteEnv.VITE_API_URL ?? (viteEnv.DEV ? "http://localhost:5000/api" : "https://localhost:5000/api");


// Création d'une instance axios qui est configurée pour l'API admin
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});


// Intercepteur pour gérer le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Récupère la requête originale
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const url = originalRequest?.url || "";

    // Si on reçoit une 401 Unauthorized, on tente de refresh le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Ne pas tenter de refresh si on est déjà sur la route de refresh
      if (url.includes("/admin/auth/refresh-token")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const ok = await refreshToken();
        if (ok) {
          // Réessaie la requête originale
          return api(originalRequest);
        }
        return Promise.reject(error);
      } catch (refreshErr) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

/*********************************************************************
                          ===== API ADMIN =====
 *********************************************************************/

//------------------------- Pour les expériences --------------------//
export const experienceAPI = {
  getAll: async (): Promise<TExperience[]> => {
    const res = await api.get("/experiences");
    return res.data;
  },
  create: (data: FormData) =>
    api.post("/experiences/admin/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id: string, data: FormData) =>
    api.put(`/experiences/admin/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id: string) => api.delete(`/experiences/admin/${id}`),
};

//------------------------- Pour les projets --------------------//
export const projectAPI = {
  getAll: async (): Promise<TProject[]> => {
    // Ajout d'un timestamp pour éviter le cache
    const res = await api.get(`/projects?_=${Date.now()}`);
    return res.data;
  },

  // Création et MAJ acceptant FormData pour les uploads d'img
  create: (data: Partial<TProject> | FormData) =>
    api.post(
      "/projects/admin",
      data,
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined
    ),

  update: (id: string, data: Partial<TProject> | FormData) =>
    api.put(
      `/projects/admin/${id}`,
      data,
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined
    ),

  delete: (id: string) => api.delete(`/projects/admin/${id}`),
};

//------------------------- Pour les compétences --------------------//
export const skillAPI = {
  getAll: async (): Promise<TSkill[]> => {
    const res = await api.get("/skills");
    return res.data;
  },
  create: (data: FormData | Partial<TSkill>) =>
    api.post(
      "/skills/admin",
      data,
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined
    ),
  update: (id: string, data: FormData | Partial<TSkill>) =>
    api.put(
      `/skills/admin/${id}`,
      data,
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined
    ),
  delete: (id: string) => api.delete(`/skills/admin/${id}`),
};

//------------------------- Pour mon profil --------------------//
export const profileAPI = {
  get: async (): Promise<TProfile> => {
    const res = await api.get("/profile");
    return res.data;
  },

  // Update accepte FormData pour les uploads d'avatar/cv
  update: (data: Partial<TProfile> | FormData) =>
    api.put(
      "/profile/admin",
      data,
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined
    ),
};

//------------------------- Pour Authentification --------------------//
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/admin/auth/login", credentials),
  logout: () => api.post("/admin/auth/logout"),
  verify: () => api.get("/admin/auth/verify"),

  // et on utilise le refreshToken de src/utils/auth.ts
  refreshToken: () => refreshToken(),
};

//------------------------- Pour upload --------------------//
export const uploadAPI = {
  uploadImage: (file: File, type: "project" | "skill" | "profile") => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/admin/upload/${type}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

//------------------------- Pour le formulaire de contact public --------------------//
export const contactAPI = {
  // Envoie un message depuis le site public vers /api/contact
  send: (payload: { name: string; email: string; message: string }) =>
    api.post("/contact", payload),
};

export default api;
