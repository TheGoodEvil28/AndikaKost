import clsx from "clsx";

export default function Badge({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "ok" | "warn" | "bad" }) {
  const styles =
    tone === "ok"
      ? "bg-emerald-100/80 text-emerald-900 border-emerald-200"
      : tone === "warn"
        ? "bg-amber-100/80 text-amber-900 border-amber-200"
        : tone === "bad"
          ? "bg-rose-100/80 text-rose-900 border-rose-200"
          : "bg-blue-100/80 text-blue-900 border-blue-200";
  return (
    <span className={clsx("inline-flex rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide", styles)}>
      {children}
    </span>
  );
}
