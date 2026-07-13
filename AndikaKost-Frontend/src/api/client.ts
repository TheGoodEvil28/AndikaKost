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

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? "";
      const isLoginRequest = requestUrl.endsWith("/auth/login");

      if (!isLoginRequest) {
        const auth = useAuthStore.getState();
        if (auth.token || auth.me) auth.logout();
      }
    }

    return Promise.reject(error);
  }
);
