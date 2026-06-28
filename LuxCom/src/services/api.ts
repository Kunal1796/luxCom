import axios from "axios";
import {
  clearAuthStorage,
  getStoredToken,
  isTokenExpired,
} from "../utils/token";
import { isLocalToken } from "../utils/localUsers";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.escuelajs.co/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token && !isTokenExpired(token) && !isLocalToken(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = getStoredToken();
    if (error.response?.status === 401 && token && !isLocalToken(token)) {
      clearAuthStorage();
      const isAuthPage = window.location.pathname.startsWith("/auth");
      if (!isAuthPage) {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
