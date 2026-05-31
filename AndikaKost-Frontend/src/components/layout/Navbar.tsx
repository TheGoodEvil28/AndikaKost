import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../theme/useTheme";
import Logo from "../../assets/Logo.png";

export default function Navbar({ title }: { title: string }) {
  const me = useAuthStore((s) => s.me);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useTheme();
  const homePath = title === "Admin" ? "/admin/dashboard" : "/tenant/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 px-4 py-3 md:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3">
        <Link to={homePath} className="inline-flex items-center gap-3">
          <img src={Logo} alt="AndikaKost" className="h-10 w-10 rounded-lg border border-slate-200" />
          <div>
            <div className="text-ui-lg font-semibold brand-heading">{title} Panel</div>
            {me ? <div className="text-sm text-muted">Signed in as {me.full_name}</div> : null}
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? "Dark" : "Light"}
          </Button>
          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
