import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-ui-base font-semibold tracking-tight transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2";

  const styles =
    variant === "primary"
      ? "border border-[#062e63] bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-2)] active:bg-[#062e63]"
      : variant === "danger"
        ? "border border-rose-700 bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800"
        : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 active:bg-slate-200";

  return <button className={clsx(base, styles, className)} {...props} />;
}
