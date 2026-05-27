import type { ReactNode } from "react";
import clsx from "clsx";

export default function Card({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={clsx("rounded-xl border border-slate-200 bg-white p-4", className)}>
      {title ? <h2 className="mb-3 text-ui-lg font-semibold">{title}</h2> : null}
      {children}
    </section>
  );
}

