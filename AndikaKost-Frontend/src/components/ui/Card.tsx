import type { ReactNode } from "react";
import clsx from "clsx";

export default function Card({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={clsx("rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur", className)}>
      {title ? <h2 className="mb-3 text-ui-lg font-semibold">{title}</h2> : null}
      {children}
    </section>
  );
}
