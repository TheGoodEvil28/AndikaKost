import type { ReactNode } from "react";
import clsx from "clsx";
import Icon, { type IconName } from "./Icon";

export default function StatePanel({
  title,
  description,
  action,
  icon = "building",
  tone = "neutral",
  compact = false
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  icon?: IconName;
  tone?: "neutral" | "danger";
  compact?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border text-center",
        compact ? "p-5" : "p-8 md:p-10",
        tone === "danger"
          ? "border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger-fg)]"
          : "theme-subtle"
      )}
    >
      <span className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[var(--brand-soft)] text-[var(--brand-primary)]">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h2 className="mt-3 text-lg font-bold">{title}</h2>
      {description ? <div className="mx-auto mt-1 max-w-lg text-sm opacity-80">{description}</div> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
