import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import clsx from "clsx";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { className, label, hint, error, id, children, ...props },
  ref
) {
  const selectId = id ?? props.name ?? undefined;
  return (
    <label className="block">
      {label ? <div className="mb-1.5 text-ui-base font-semibold text-[var(--surface-fg)]">{label}</div> : null}
      <select
        id={selectId}
        ref={ref}
        className={clsx(
          "min-h-11 w-full rounded-xl border bg-white/85 px-3.5 py-2.5 text-ui-base text-slate-900",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
          "transition",
          error ? "border-rose-400" : "border-slate-300/80",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={hint || error ? `${selectId}-help` : undefined}
        {...props}
      >
        {children}
      </select>
      {hint || error ? (
        <div id={`${selectId}-help`} className={clsx("mt-1.5 text-sm", error ? "text-rose-700" : "text-muted")}>
          {error ?? hint}
        </div>
      ) : null}
    </label>
  );
});

export default Select;
