import { NavLink } from "react-router-dom";
import clsx from "clsx";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "block min-h-11 rounded-xl px-4 py-3 text-ui-base font-semibold",
    isActive
      ? "bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200"
      : "text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
  );

export default function Sidebar({ items }: { items: { to: string; label: string }[] }) {
  return (
    <nav className="w-full border-b border-slate-200 bg-white p-3 md:w-72 md:shrink-0 md:border-b-0 md:border-r md:p-4" aria-label="Sidebar">
      <div className="hidden pb-2 text-ui-lg font-semibold md:block">Menu</div>
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
