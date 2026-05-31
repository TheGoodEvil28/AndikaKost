import Button from "../ui/Button";
import { useAuthStore } from "../../store/authStore";
import { useTheme } from "../theme/useTheme";

export default function Navbar({ title }: { title: string }) {
  const me = useAuthStore((s) => s.me);
  const logout = useAuthStore((s) => s.logout);
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
      <div>
        <div className="text-ui-xl font-semibold">{title}</div>
        {me ? <div className="text-ui-base text-slate-600">{me.full_name}</div> : null}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? "Light" : "Dark"}
        </Button>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
