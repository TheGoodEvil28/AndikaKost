import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-ui-base font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 focus-visible:ring-offset-2";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
      : variant === "danger"
        ? "bg-rose-600 text-white shadow-sm hover:bg-rose-700"
        : "bg-white text-slate-900 border border-slate-300 hover:bg-slate-50";
  return <button className={clsx(base, styles, className)} {...props} />;
}
