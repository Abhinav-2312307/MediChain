import axios from "axios";

import { getStoredToken } from "../features/auth/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_Backend_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
