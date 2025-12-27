// src/api/admin.ts
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { TExperience, TProject, TSkill, TProfile } from "../types";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Intercepteur pour gérer le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/admin/auth/refresh-token");
        return api(originalRequest);
      } catch {
        window.location.href = "/admin/secure-login";
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
    api.post("/experiences/admin/", data, { headers: { "Content-Type": "multipart/form-data" } }),
  update: (id: string, data: FormData) =>
    api.put(`/experiences/admin/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id: string) => api.delete(`/experiences/admin/${id}`),
};

//------------------------- Pour les projets --------------------//
export const projectAPI = {
  getAll: async (): Promise<TProject[]> => {
    const res = await api.get("/projects");
    return res.data;
  },

  // Création et MAJ acceptent Partial<TProject> ou FormData
  create: (data: Partial<TProject> | FormData) =>
    api.post(
      "/projects/admin",
      data,
      data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    ),

  update: (id: string, data: Partial<TProject> | FormData) =>
    api.put(
      `/projects/admin/${id}`,
      data,
      data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
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
      data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    ),
  update: (id: string, data: FormData | Partial<TSkill>) =>
    api.put(
      `/skills/admin/${id}`,
      data,
      data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    ),
  delete: (id: string) => api.delete(`/skills/admin/${id}`),
};


//------------------------- Pour mon profil --------------------//
export const profileAPI = {
  get: async (): Promise<TProfile> => {
    const res = await api.get("/profile");
    return res.data;
  },
  // Accept FormData for file uploads (avatar, cv)
  // If data is FormData, set multipart headers; otherwise send JSON
  update: (data: Partial<TProfile> | FormData) =>
    api.put(
      "/profile/admin",
      data,
      data instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
    ),
};

//------------------------- Pour Authentification --------------------//
export const authAPI = {
  login: (credentials: { email: string; password: string }) => api.post("/admin/auth/login", credentials),
  logout: () => api.post("/admin/auth/logout"),
  verify: () => api.get("/admin/auth/verify"),
  refreshToken: () => api.post("/admin/auth/refresh-token"),
};

//------------------------- Pour upload --------------------//
export const uploadAPI = {
  uploadImage: (file: File, type: "project" | "skill" | "profile") => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/admin/upload/${type}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  },
};

//------------------------- Pour le formulaire de contact public --------------------//
export const contactAPI = {
  // Envoie un message depuis le site public vers /api/contact
  send: (payload: { name: string; email: string; message: string }) => api.post("/contact", payload),
};

export default api;
