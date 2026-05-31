import { Link, NavLink } from "react-router-dom";
import Button from "../ui/Button";
import { useTheme } from "../theme/useTheme";
import Logo from "../../assets/Logo.png";

export default function PublicHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link to="/" className="inline-flex items-center gap-3 rounded-xl px-1 py-1">
          <img src={Logo} alt="AndikaKost" className="h-10 w-10 rounded-lg border border-white/50 shadow" />
          <span className="text-ui-lg font-semibold brand-heading">AndikaKost</span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Public navigation">
          <NavLink
            to="/rooms"
            className={({ isActive }) =>
              `rounded-xl px-4 py-2 text-ui-base font-semibold transition ${
                isActive ? "bg-blue-100/80 text-blue-900" : "text-slate-700 hover:bg-white/80"
              }`
            }
          >
            Rooms
          </NavLink>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Button variant="secondary" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? "Dark" : "Light"}
          </Button>
        </nav>
      </div>
    </header>
  );
}
