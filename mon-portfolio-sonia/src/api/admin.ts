import axios, { AxiosRequestConfig, AxiosError } from "axios";

const API_URL = "http://localhost:5000/api";

// Création de l'instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ indispensable pour cookie HttpOnly
});

// Intercepteur pour gérer le refresh token
api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Si 401 et pas encore retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/admin/auth/refresh-token"); // rafraîchit le token
        return api(originalRequest); // retry request initiale
      } catch {
        window.location.href = "/admin/login"; // redirect si refresh invalide
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// ===== API ADMIN =====

// Expériences
export const experienceAPI = {
  getAll: () => api.get("/admin/experiences"),
  create: (data: any) => api.post("/admin/experiences", data),
  update: (id: string, data: any) => api.put(`/admin/experiences/${id}`, data),
  delete: (id: string) => api.delete(`/admin/experiences/${id}`),
};

// Projets
export const projectAPI = {
  getAll: () => api.get("/admin/projects"),
  create: (data: any) => api.post("/admin/projects", data),
  update: (id: string, data: any) => api.put(`/admin/projects/${id}`, data),
  delete: (id: string) => api.delete(`/admin/projects/${id}`),
};

// Compétences
export const skillAPI = {
  getAll: () => api.get("/admin/skills"),
  create: (data: any) => api.post("/admin/skills", data),
  update: (id: string, data: any) => api.put(`/admin/skills/${id}`, data),
  delete: (id: string) => api.delete(`/admin/skills/${id}`),
};

// Profil
export const profileAPI = {
  get: () => api.get("/admin/profile"),
  update: (data: any) => api.put("/admin/profile", data),
};

// Messages
export const messageAPI = {
  getAll: () => api.get("/admin/messages"),
  delete: (id: string) => api.delete(`/admin/messages/${id}`),
};

// Auth
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/admin/auth/login', credentials),
  logout: () => api.post('/admin/auth/logout'),
  verify: () => api.get('/admin/auth/verify'),
  refreshToken: () => api.post('/admin/auth/refresh-token'), // ← ajouté
};


// Upload
export const uploadAPI = {
  uploadImage: (file: File, type: "project" | "skill" | "profile") => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/admin/upload/${type}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
