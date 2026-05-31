import type { ReactNode } from "react";
import { useEffect } from "react";
import Button from "./Button";

export default function Modal({
  title,
  open,
  onClose,
  children
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05122e]/55 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="theme-surface w-full max-w-2xl rounded-3xl border shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 md:px-5">
          <h2 className="text-ui-lg font-semibold brand-heading">{title}</h2>
          <Button variant="secondary" onClick={onClose} aria-label="Close dialog">
            Close
          </Button>
        </div>
        <div className="p-4 md:p-5">{children}</div>
      </div>
    </div>
  );
}
