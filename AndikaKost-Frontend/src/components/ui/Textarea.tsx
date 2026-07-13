import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { className, label, hint, error, id, ...props },
  ref
) {
  const textareaId = id ?? props.name ?? undefined;
  const helpId = textareaId && (hint || error) ? `${textareaId}-help` : undefined;

  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-ui-base font-bold text-[var(--surface-fg)]">{label}</span> : null}
      <textarea
        id={textareaId}
        ref={ref}
        className={clsx(
          "control-surface min-h-28 w-full rounded-xl border px-3.5 py-3 text-ui-base placeholder:text-[var(--muted-fg)]",
          "transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
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

export default Textarea;
