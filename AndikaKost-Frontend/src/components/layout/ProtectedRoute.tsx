import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { Role } from "../../types";
import { useAuthStore } from "../../store/authStore";
import { useAuthMe } from "../../hooks/useAuth";

export function ProtectedRoute({ role, children }: { role: Role; children: ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const me = useAuthStore((state) => state.me);
  const session = useAuthMe(token);

  if (!token) return <Navigate to="/login" replace />;
  if (session.isLoading) return <div className="p-6 text-ui-base">Checking your session…</div>;
  if (session.isError || !me) return <Navigate to="/login" replace />;
  if (me.role !== role) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
