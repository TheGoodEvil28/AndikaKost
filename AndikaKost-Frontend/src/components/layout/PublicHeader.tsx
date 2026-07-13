import { Link, NavLink } from "react-router-dom";
import Button from "../ui/Button";
import { buttonClassName } from "../ui/buttonStyles";
import Icon from "../ui/Icon";
import { useTheme } from "../theme/useTheme";
import BrandMark from "./BrandMark";

export default function PublicHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="theme-surface sticky top-0 z-40 border-x-0 border-t-0 px-3 py-2.5 shadow-sm md:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
        <Link to="/" aria-label="AndikaKost home" className="min-w-0 rounded-xl">
          <BrandMark />
        </Link>

        <nav className="flex shrink-0 items-center gap-1 sm:gap-2" aria-label="Public navigation">
          <NavLink
            to="/rooms"
            className={({ isActive }) => buttonClassName({ variant: isActive ? "secondary" : "ghost", size: "sm" })}
          >
            <Icon name="rooms" className="h-4 w-4" />
            <span className="hidden sm:inline">Rooms</span>
          </NavLink>
          <Link to="/login" className={buttonClassName({ size: "sm" })}>
            <Icon name="user" className="h-4 w-4" />
            <span className="hidden sm:inline">Sign in</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            title={theme === "light" ? "Dark theme" : "Light theme"}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
