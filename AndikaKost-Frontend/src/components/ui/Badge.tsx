import clsx from "clsx";
import { formatStatus, statusTone, type BadgeTone } from "./status";

const toneStyles: Record<BadgeTone, string> = {
  ok: "border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--success-fg)]",
  warn: "border-[var(--warning-border)] bg-[var(--warning-bg)] text-[var(--warning-fg)]",
  bad: "border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger-fg)]",
  info: "border-[var(--info-border)] bg-[var(--info-bg)] text-[var(--info-fg)]",
  neutral: "border-[var(--neutral-border)] bg-[var(--neutral-bg)] text-[var(--neutral-fg)]"
};

export default function Badge({ children, tone }: { children: string; tone?: BadgeTone }) {
  const resolvedTone = tone ?? statusTone(children);

  return (
    <span
      className={clsx(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-extrabold tracking-wide",
        toneStyles[resolvedTone]
      )}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" aria-hidden="true" />
      <span className="truncate">{formatStatus(children)}</span>
    </span>
  );
}
