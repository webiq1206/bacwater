import { cn } from "@/lib/utils";

export interface GlanceItem {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}

/**
 * AtAGlance: a compact key/value grid for the handful of facts a reader most
 * wants up front (a compound's vial strengths, storage window, evidence stage,
 * and so on). Renders as a hairline-separated grid that collapses to two
 * columns on narrow screens.
 */
export function AtAGlance({
  items,
  columns = 4,
  className,
}: {
  items: GlanceItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const colClass =
    columns === 2
      ? "grid-cols-2"
      : columns === 3
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-4";
  return (
    <div
      className={cn(
        "grid gap-px bg-border rounded-xl overflow-hidden border border-border",
        colClass,
        className,
      )}
    >
      {items.map((item, i) => (
        <div key={i} className="bg-card px-4 py-3.5">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            {item.label}
          </div>
          <div className="mt-1 text-base tabular-nums text-foreground leading-snug">
            {item.value}
          </div>
          {item.sub ? (
            <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
