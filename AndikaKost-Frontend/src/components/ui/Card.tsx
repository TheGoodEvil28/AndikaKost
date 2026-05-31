import type { ReactNode } from "react";
import clsx from "clsx";

export default function Card({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={clsx("theme-surface rounded-2xl border p-5 md:p-6", className)}>
      {title ? <h2 className="mb-3 text-ui-lg font-semibold brand-heading">{title}</h2> : null}
      {children}
    </section>
  );
}
