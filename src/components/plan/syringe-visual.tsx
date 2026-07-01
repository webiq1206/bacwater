interface Props {
  fillPercent: number;
  readoutLabel: string;
  scale: "u100" | "ml";
  maxLabel: string;
}

export function SyringeVisual({ fillPercent, readoutLabel, scale, maxLabel }: Props) {
  const clamped = Math.max(0, Math.min(100, fillPercent));
  const marks = scale === "u100"
    ? [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    : [0, 25, 50, 75, 100];

  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-5">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        Draw to this level
      </div>
      <div className="mt-1 text-sm font-medium">{readoutLabel}</div>

      <div className="mt-4 relative">
        <div className="h-10 rounded-full border border-border bg-background overflow-hidden">
          <div
            className="h-full bg-brand/80 transition-[width] duration-500"
            style={{ width: `${clamped}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground tabular-nums">
          {marks.map((m) => (
            <span key={m} className={m === marks[0] || m === marks[marks.length - 1] ? "" : ""}>
              {scale === "u100" ? `${m}u` : `${(m / 100).toFixed(2)} mL`}
            </span>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">
          Syringe capacity: {maxLabel}
        </div>
      </div>
    </div>
  );
}
