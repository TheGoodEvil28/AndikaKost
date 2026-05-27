import clsx from "clsx";

export default function Badge({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "ok" | "warn" | "bad" }) {
  const styles =
    tone === "ok"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : tone === "warn"
        ? "bg-amber-50 text-amber-900 border-amber-200"
        : tone === "bad"
          ? "bg-rose-50 text-rose-800 border-rose-200"
          : "bg-slate-50 text-slate-800 border-slate-200";
  return <span className={clsx("inline-flex rounded-full border px-2 py-1 text-sm font-medium", styles)}>{children}</span>;
}

