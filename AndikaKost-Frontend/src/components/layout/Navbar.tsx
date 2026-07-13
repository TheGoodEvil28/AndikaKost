import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Icon from "../ui/Icon";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../theme/useTheme";
import BrandMark from "./BrandMark";

export default function Navbar({ title }: { title: "Admin" | "Tenant" }) {
  const me = useAuthStore((state) => state.me);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useTheme();
  const homePath = title === "Admin" ? "/admin/dashboard" : "/tenant/dashboard";

  return (
    <header className="theme-surface sticky top-0 z-40 border-x-0 border-t-0 px-3 py-2.5 shadow-sm md:px-5">
      <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between gap-3">
        <Link to={homePath} className="inline-flex min-w-0 items-center rounded-xl">
          <BrandMark />
        </Link>

        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          {me ? (
            <div className="mr-1 hidden min-w-0 text-right md:block">
              <div className="truncate text-sm font-extrabold text-[var(--surface-fg)]">{me.full_name}</div>
              <div className="text-xs font-semibold text-muted">{title} workspace</div>
            </div>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            title={theme === "light" ? "Dark theme" : "Light theme"}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} className="h-5 w-5" />
            <span className="hidden sm:inline">{theme === "light" ? "Dark" : "Light"}</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={logout}>
            <Icon name="logout" className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
