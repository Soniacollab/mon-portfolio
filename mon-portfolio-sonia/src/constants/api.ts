// Centralise l'URL de l'API pour éviter les URLs codées en dur
const viteEnv = import.meta.env;
export const API_URL = viteEnv.VITE_API_URL ?? (viteEnv.DEV ? "http://localhost:5000/api" : "https://localhost:5000/api");

// Base sans le suffixe /api 
export const API_BASE = API_URL.replace(/\/api\/?$/, "");

export default API_URL;
