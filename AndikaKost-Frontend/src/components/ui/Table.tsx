import type { ReactNode, TableHTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import clsx from "clsx";

export function Table({
  children,
  className,
  containerClassName,
  ...props
}: TableHTMLAttributes<HTMLTableElement> & { children: ReactNode; containerClassName?: string }) {
  return (
    <div className={clsx("responsive-table theme-surface overflow-x-auto rounded-2xl border", containerClassName)}>
      <table className={clsx("min-w-full text-left text-ui-base", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={clsx(
        "whitespace-nowrap border-b border-[var(--surface-divider)] bg-[var(--surface-subtle)] px-4 py-3.5 text-xs font-extrabold uppercase tracking-[0.055em] text-[var(--muted-strong)]",
        className
      )}
      scope="col"
      {...props}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
  label,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { label?: string }) {
  return (
    <td
      className={clsx("border-b border-[var(--surface-divider)] px-4 py-4 align-middle text-[var(--surface-fg)]", className)}
      data-label={label}
      {...props}
    >
      {children}
    </td>
  );
}
