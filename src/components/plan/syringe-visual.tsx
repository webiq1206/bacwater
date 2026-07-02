interface Props {
  fillPercent: number;
  readoutLabel: string;
  scale: "u100" | "ml";
  maxLabel: string;
}

export function SyringeVisual({
  fillPercent,
  readoutLabel,
  scale,
  maxLabel,
}: Props) {
  const clamped = Math.max(0, Math.min(100, fillPercent));
  const marks =
    scale === "u100"
      ? [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      : [0, 25, 50, 75, 100];

  return (
    <div className="bg-surface border border-border p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Draw to here
          </div>
          <div className="text-base font-semibold mt-0.5">{readoutLabel}</div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          Syringe: {maxLabel}
        </div>
      </div>

      <div className="relative">
        <div className="h-10 border-2 border-foreground/20 bg-background overflow-hidden">
          <div
            className="h-full bg-foreground/15 transition-[width] duration-500 relative"
            style={{ width: `${clamped}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-foreground" />
          </div>
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground tabular-nums">
          {marks.map((m) => (
            <span key={m}>
              {scale === "u100" ? `${m}u` : `${(m / 100).toFixed(2)}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
