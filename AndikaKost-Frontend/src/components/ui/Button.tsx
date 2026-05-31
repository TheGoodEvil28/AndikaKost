import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-ui-base font-semibold tracking-tight transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2";
  const styles =
    variant === "primary"
      ? "border border-blue-900/15 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-2)] text-white shadow-[0_12px_22px_-14px_rgba(0,48,120,0.8)] hover:-translate-y-0.5 hover:brightness-110"
      : variant === "danger"
        ? "border border-rose-900/20 bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-[0_12px_22px_-14px_rgba(225,29,72,0.8)] hover:-translate-y-0.5 hover:brightness-110"
        : "theme-surface border text-[var(--surface-fg)] hover:-translate-y-0.5 hover:bg-white/90";

  return <button className={clsx(base, styles, className)} {...props} />;
}
