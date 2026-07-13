import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import Icon from "./Icon";

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  backTo,
  backLabel = "Back",
  className
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  backTo?: string;
  backLabel?: string;
  className?: string;
}) {
  return (
    <header className={clsx("theme-surface rounded-2xl border p-5 md:p-6", className)}>
      {backTo ? (
        <Link to={backTo} className="text-link mb-3 inline-flex min-h-10 items-center gap-1.5 rounded-lg pr-2 text-sm">
          <Icon name="arrow-left" className="h-4 w-4" />
          {backLabel}
        </Link>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? <div className="page-kicker mb-2">{eyebrow}</div> : null}
          <h1 className="page-title">{title}</h1>
          {description ? <div className="page-description mt-2">{description}</div> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
