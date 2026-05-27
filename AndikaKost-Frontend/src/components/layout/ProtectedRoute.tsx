import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { Role } from "../../types";
import { useAuthStore } from "../../store/authStore";
import { useAuthMe } from "../../hooks/useAuth";

export function ProtectedRoute({ role, children }: { role: Role; children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const me = useAuthStore((s) => s.me);
  const { isLoading } = useAuthMe(!!token && !me);

  if (!token) return <Navigate to="/login" replace />;
  if (isLoading) return <div className="p-6 text-ui-base">Loading…</div>;
  if (!me) return <Navigate to="/login" replace />;
  if (me.role !== role) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

