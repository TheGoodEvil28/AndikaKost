import { NavLink } from "react-router-dom";
import clsx from "clsx";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "block min-h-11 rounded-xl px-4 py-3 text-ui-base font-semibold transition",
    isActive
      ? "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-2)] text-white shadow-[0_12px_22px_-14px_rgba(0,48,120,0.8)]"
      : "text-slate-800 hover:bg-white/80 focus-visible:outline-none"
  );

export default function Sidebar({ items }: { items: { to: string; label: string }[] }) {
  return (
    <nav
      className="w-full border-b border-white/40 bg-white/65 p-3 backdrop-blur md:w-72 md:shrink-0 md:border-b-0 md:border-r md:p-4"
      aria-label="Sidebar"
    >
      <div className="hidden pb-2 text-ui-lg font-semibold brand-heading md:block">Navigation</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:block">
        {items.map((i) => (
          <NavLink key={i.to} to={i.to} className={linkClass}>
            {i.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
