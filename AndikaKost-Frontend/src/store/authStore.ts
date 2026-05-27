import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, UserMe } from "../types";

type AuthState = {
  token: string | null;
  me: UserMe | null;
  setToken: (token: string | null) => void;
  setMe: (me: UserMe | null) => void;
  logout: () => void;
  hasRole: (role: Role) => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      me: null,
      setToken: (token) => set({ token }),
      setMe: (me) => set({ me }),
      logout: () => set({ token: null, me: null }),
      hasRole: (role) => get().me?.role === role
    }),
    { name: "andika_kost_auth_v1" }
  )
);

