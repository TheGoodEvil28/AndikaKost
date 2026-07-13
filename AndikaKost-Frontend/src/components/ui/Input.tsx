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
      {label ? <span className="mb-1.5 block text-ui-base font-bold text-[var(--surface-fg)]">{label}</span> : null}
      <input
        id={inputId}
        ref={ref}
        className={clsx(
          "control-surface min-h-11 w-full rounded-xl border px-3.5 py-2.5 text-ui-base placeholder:text-[var(--muted-fg)]",
          "file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--brand-soft)] file:px-3 file:py-1.5 file:font-bold file:text-[var(--brand-primary)]",
          "transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
          "disabled:cursor-not-allowed disabled:opacity-60",
          error ? "border-[var(--danger-border)]" : "hover:border-[var(--info-border)]",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={helpId}
        {...props}
      />
      {helpId ? (
        <span id={helpId} className={clsx("mt-1.5 block text-sm", error ? "text-[var(--danger-fg)]" : "text-muted")}>
          {error ?? hint}
        </span>
      ) : null}
    </label>
  );
});

export default Input;
