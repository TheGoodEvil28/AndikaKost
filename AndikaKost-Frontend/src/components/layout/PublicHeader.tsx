import { Link, NavLink } from "react-router-dom";
import Button from "../ui/Button";
import { useTheme } from "../theme/useTheme";

export default function PublicHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-ui-lg font-semibold tracking-tight">
          AndikaKost
        </Link>

        <nav className="flex items-center gap-2" aria-label="Public navigation">
          <NavLink to="/rooms" className="rounded-xl px-4 py-2 text-ui-base font-semibold hover:bg-slate-100">
            Rooms
          </NavLink>
          <Link to="/login">
            <Button variant="secondary">Login</Button>
          </Link>
          <Button variant="secondary" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? "Light" : "Dark"}
          </Button>
        </nav>
      </div>
    </header>
  );
}
