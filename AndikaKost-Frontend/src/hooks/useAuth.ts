import { useQuery } from "@tanstack/react-query";
import { me } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

export function useAuthMe(enabled: boolean) {
  const setMe = useAuthStore((s) => s.setMe);
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const data = await me();
      setMe(data);
      return data;
    },
    enabled
  });
}

