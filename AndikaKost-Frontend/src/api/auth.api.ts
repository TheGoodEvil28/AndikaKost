import { api } from "./client";
import type { ApiSuccess, UserMe } from "../types";

export async function login(email: string, password: string) {
  const res = await api.post<ApiSuccess<{ access_token: string; token_type: string }>>("/auth/login", {
    email,
    password
  });
  return res.data.data.access_token;
}

export async function me() {
  const res = await api.get<ApiSuccess<UserMe>>("/auth/me");
  return res.data.data;
}

