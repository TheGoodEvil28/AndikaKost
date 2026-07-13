import { useQuery } from "@tanstack/react-query";
import { me } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

export function useAuthMe(token: string | null) {
  const setMe = useAuthStore((s) => s.setMe);
  return useQuery({
    queryKey: ["auth", "me", token],
    queryFn: async () => {
      const data = await me();
      setMe(data);
      return data;
    },
    enabled: !!token,
    retry: false,
    staleTime: 60_000
  });
}
