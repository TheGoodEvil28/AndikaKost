import { NavLink } from "react-router-dom";
import clsx from "clsx";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "block rounded-lg px-3 py-2 text-ui-base font-medium",
    isActive ? "bg-blue-50 text-blue-700" : "text-slate-800 hover:bg-slate-100"
  );

export default function Sidebar({ items }: { items: { to: string; label: string }[] }) {
  return (
    <nav className="w-full md:w-64 md:shrink-0 md:border-r md:border-slate-200 md:bg-white md:p-4">
      <div className="hidden md:block pb-2 text-ui-lg font-semibold">Menu</div>
      <div className="grid grid-cols-2 gap-2 p-3 md:block md:p-0">
        {items.map((i) => (
          <NavLink key={i.to} to={i.to} className={linkClass}>
            {i.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

