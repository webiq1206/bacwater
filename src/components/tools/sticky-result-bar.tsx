"use client";

/**
 * Compact result bar pinned to the bottom of the viewport on small screens, so
 * the calculator's answer stays visible while the user scrolls through inputs
 * and teaching content. Hidden on lg+ where the result sits beside the inputs.
 * Renders nothing until there is a valid result.
 */
export function StickyResultBar({
  label,
  value,
  sub,
  visible = true,
}: {
  label: string;
  value: string;
  sub?: string;
  visible?: boolean;
}) {
  if (!visible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm px-4 py-2.5 flex items-center justify-between gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
    >
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="text-lg font-semibold tabular-nums leading-tight truncate">
          {value}
          {sub ? (
            <span className="text-sm font-normal text-muted-foreground"> · {sub}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
