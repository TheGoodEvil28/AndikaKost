import clsx from "clsx";
import Icon from "../ui/Icon";

export default function BrandMark({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      <span
        className={clsx(
          "relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl shadow-sm",
          inverse ? "bg-white text-[#063b78]" : "bg-[var(--action-primary-bg)] text-[var(--action-primary-fg)]"
        )}
      >
        <Icon name="home" className="h-5 w-5" />
        <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-bl-lg bg-[var(--brand-accent)]" />
      </span>
      {!compact ? (
        <span className="min-w-0 leading-none">
          <span className={clsx("block truncate font-[Sora] text-lg font-bold tracking-tight", inverse ? "text-white" : "brand-heading")}>
            Andika<span className={inverse ? "text-white" : "text-[var(--brand-accent)]"}>Kost</span>
          </span>
          <span className={clsx("mt-1 block truncate text-[10px] font-bold uppercase tracking-[0.13em]", inverse ? "text-white/70" : "text-muted")}>
            Kost management
          </span>
        </span>
      ) : null}
    </span>
  );
}
