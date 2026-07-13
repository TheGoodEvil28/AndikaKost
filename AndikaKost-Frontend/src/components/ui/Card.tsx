import type { ReactNode } from "react";
import clsx from "clsx";

export default function Card({
  title,
  description,
  action,
  children,
  className,
  padding = "md"
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md";
}) {
  return (
    <section
      className={clsx(
        "theme-surface overflow-hidden rounded-2xl border",
        padding === "sm" && "p-4",
        padding === "md" && "p-5 md:p-6",
        className
      )}
    >
      {title || description || action ? (
        <div className={clsx("flex flex-wrap items-start justify-between gap-3", children && "mb-4")}>
          <div className="min-w-0">
            {title ? <h2 className="text-ui-lg font-bold brand-heading">{title}</h2> : null}
            {description ? <div className="mt-1 text-sm text-muted">{description}</div> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
