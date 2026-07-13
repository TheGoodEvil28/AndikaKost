import { NavLink } from "react-router-dom";
import clsx from "clsx";
import Icon, { type IconName } from "../ui/Icon";

export type SidebarItem = { to: string; label: string; icon: IconName; end?: boolean };

const linkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "group inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-ui-base font-bold",
    "transition-[background-color,border-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
    isActive
      ? "border-[var(--action-primary-bg)] bg-[var(--action-primary-bg)] text-[var(--action-primary-fg)] shadow-sm"
      : "border-transparent text-[var(--muted-strong)] hover:border-[var(--surface-border)] hover:bg-[var(--surface-subtle)] hover:text-[var(--surface-fg)]"
  );

export default function Sidebar({ items, label = "Main navigation" }: { items: SidebarItem[]; label?: string }) {
  return (
    <nav
      className="theme-surface z-30 w-full border-x-0 border-t-0 p-2.5 lg:sticky lg:top-[65px] lg:h-[calc(100vh-65px)] lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-4"
      aria-label={label}
    >
      <div className="mb-3 hidden px-2 text-xs font-extrabold uppercase tracking-[0.12em] text-muted lg:block">Workspace</div>
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 lg:grid lg:gap-1.5 lg:overflow-visible lg:pb-0">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
            <Icon name={item.icon} className="h-4.5 w-4.5 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
