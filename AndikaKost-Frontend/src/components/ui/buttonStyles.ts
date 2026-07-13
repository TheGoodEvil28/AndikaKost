import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export function buttonClassName({
  variant = "primary",
  size = "md",
  className
}: {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  className?: string;
} = {}) {
  const base = clsx(
    "inline-flex items-center justify-center gap-2 rounded-xl border font-bold tracking-tight",
    "transition-[background-color,border-color,color,transform,box-shadow] duration-150",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
    "disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
    size === "sm" ? "min-h-10 px-3 py-2 text-sm" : "min-h-11 px-4 py-2.5 text-ui-base"
  );

  const styles =
    variant === "primary"
      ? "border-[var(--action-primary-bg)] bg-[var(--action-primary-bg)] text-[var(--action-primary-fg)] shadow-sm hover:border-[var(--action-primary-hover)] hover:bg-[var(--action-primary-hover)] active:bg-[var(--action-primary-active)]"
      : variant === "danger"
        ? "border-[var(--action-danger-bg)] bg-[var(--action-danger-bg)] text-[var(--action-danger-fg)] hover:border-[var(--action-danger-hover)] hover:bg-[var(--action-danger-hover)]"
        : variant === "ghost"
          ? "border-transparent bg-transparent text-[var(--muted-strong)] hover:bg-[var(--surface-subtle)] hover:text-[var(--surface-fg)]"
          : "border-[var(--surface-border)] bg-[var(--control-bg)] text-[var(--surface-fg)] shadow-sm hover:border-[var(--info-border)] hover:bg-[var(--surface-subtle)]";

  return clsx(base, styles, className);
}
