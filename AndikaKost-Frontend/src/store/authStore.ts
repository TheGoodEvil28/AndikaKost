import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role, UserMe } from "../types";
import { queryClient } from "../api/queryClient";

const AUTH_STORAGE_KEY = "andika_kost_auth_v2";
const LEGACY_AUTH_STORAGE_KEY = "andika_kost_auth_v1";

if (typeof window !== "undefined") {
  window.localStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
}

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
      logout: () => {
        queryClient.clear();
        set({ token: null, me: null });
      },
      hasRole: (role) => get().me?.role === role
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({ token: state.token })
    }
  )
);
