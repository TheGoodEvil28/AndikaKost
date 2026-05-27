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
  return (
    <label className="block">
      {label ? <div className="mb-1 text-ui-base font-medium">{label}</div> : null}
      <input
        id={inputId}
        ref={ref}
        className={clsx(
          "w-full rounded-lg border bg-white px-3 py-2 text-ui-base",
          error ? "border-rose-400" : "border-slate-300",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={hint || error ? `${inputId}-help` : undefined}
        {...props}
      />
      {hint || error ? (
        <div id={`${inputId}-help`} className={clsx("mt-1 text-sm", error ? "text-rose-700" : "text-slate-600")}>
          {error ?? hint}
        </div>
      ) : null}
    </label>
  );
});

export default Input;
