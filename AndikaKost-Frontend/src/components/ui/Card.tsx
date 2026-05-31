import type { ReactNode } from "react";
import clsx from "clsx";

export default function Card({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section
      className={clsx(
        "theme-surface rounded-3xl border p-5 backdrop-blur md:p-6",
        "relative overflow-hidden",
        "before:pointer-events-none before:absolute before:-right-16 before:-top-16 before:h-40 before:w-40 before:rounded-full before:bg-[radial-gradient(circle,rgba(228,24,36,0.16),transparent_70%)]",
        className
      )}
    >
      {title ? <h2 className="mb-3 text-ui-lg font-semibold brand-heading">{title}</h2> : null}
      {children}
    </section>
  );
}
