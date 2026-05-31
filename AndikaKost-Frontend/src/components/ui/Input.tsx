import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, label, hint, error, id, ...props },
  ref
) {
  const inputId = id ?? props.name ?? undefined;
  const helpId = inputId && (hint || error) ? `${inputId}-help` : undefined;
  return (
    <label className="block">
      {label ? <div className="mb-1.5 text-ui-base font-semibold text-[var(--surface-fg)]">{label}</div> : null}
      <input
        id={inputId}
        ref={ref}
        className={clsx(
          "min-h-11 w-full rounded-xl border bg-white/85 px-3.5 py-2.5 text-ui-base text-slate-900 placeholder:text-slate-400",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
          "transition",
          error ? "border-rose-400" : "border-slate-300/80",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={helpId}
        {...props}
      />
      {helpId ? (
        <div id={helpId} className={clsx("mt-1.5 text-sm", error ? "text-rose-700" : "text-muted")}>
          {error ?? hint}
        </div>
      ) : null}
    </label>
  );
});

export default Input;
