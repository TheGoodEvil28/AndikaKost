import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useAuthStore } from "../store/authStore";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 20_000
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

