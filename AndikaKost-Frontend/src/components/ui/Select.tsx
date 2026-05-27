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
      {label ? <div className="mb-1 text-ui-base font-medium">{label}</div> : null}
      <select
        id={selectId}
        ref={ref}
        className={clsx(
          "w-full rounded-lg border bg-white px-3 py-2 text-ui-base",
          error ? "border-rose-400" : "border-slate-300",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={hint || error ? `${selectId}-help` : undefined}
        {...props}
      >
        {children}
      </select>
      {hint || error ? (
        <div id={`${selectId}-help`} className={clsx("mt-1 text-sm", error ? "text-rose-700" : "text-slate-600")}>
          {error ?? hint}
        </div>
      ) : null}
    </label>
  );
});

export default Select;
