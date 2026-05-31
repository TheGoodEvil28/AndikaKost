import type { ReactNode } from "react";

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="theme-surface overflow-auto rounded-2xl border">
      <table className="min-w-full text-left text-ui-base">{children}</table>
    </div>
  );
}

export function Th({ children }: { children?: ReactNode }) {
  return <th className="whitespace-nowrap border-b border-slate-200 bg-white/65 px-4 py-4 font-semibold text-slate-700">{children}</th>;
}

export function Td({ children }: { children?: ReactNode }) {
  return <td className="border-b border-slate-100/90 px-4 py-4 align-top">{children}</td>;
}
