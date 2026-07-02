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

  /* ── Graduation marks ─────────────────────────────────── */
  const marks =
    scale === "u100"
      ? [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      : [0, 25, 50, 75, 100];

  const labelForMark = (m: number) =>
    scale === "u100" ? `${m}` : `${(m / 100).toFixed(2)}`;

  /* ── SVG geometry (viewBox coords) ────────────────────── */
  const viewW = 520;
  const viewH = 140;

  // Needle
  const needleTipX = 12;
  const needleBaseX = 80;
  const needleCenterY = 70;
  const needleHalfH = 3;

  // Barrel
  const barrelX = needleBaseX;
  const barrelEndX = 430;
  const barrelY = 38;
  const barrelH = 64;
  const barrelR = 6;
  const barrelInnerX = barrelX + 4;
  const barrelInnerEndX = barrelEndX - 4;
  const barrelInnerW = barrelInnerEndX - barrelInnerX;

  // Plunger
  const plungerRodStartX = barrelEndX;
  const plungerRodEndX = viewW - 10;
  const plungerRodY = needleCenterY;
  const plungerRodH = 6;
  const plungerTipW = 8;

  // Fill calculation — liquid fills from left (needle end) toward right
  const fillW = (clamped / 100) * barrelInnerW;
  const fillEndX = barrelInnerX + fillW;

  // Plunger head position — moves with fill level (sits at fill boundary)
  const plungerHeadX = fillEndX;
  const plungerHeadW = 10;

  return (
    <div
      className="callout-panel"
      style={{ borderLeftWidth: 3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div
            className="text-xs uppercase tracking-wide font-semibold"
            style={{ color: "var(--color-accent-guide)" }}
          >
            Draw to here
          </div>
          <div className="text-lg font-bold mt-0.5" style={{ color: "var(--color-foreground)" }}>
            {readoutLabel}
          </div>
        </div>
        <div
          className="text-right text-xs font-medium"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Syringe: {maxLabel}
        </div>
      </div>

      {/* Syringe SVG */}
      <div className="w-full overflow-visible">
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          role="img"
          aria-label={`Syringe showing ${readoutLabel}`}
          style={{ maxHeight: 120 }}
        >
          <defs>
            {/* Barrel gradient for glass/plastic look */}
            <linearGradient id="barrelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity="0.03" />
              <stop offset="30%" stopColor="var(--color-foreground)" stopOpacity="0.06" />
              <stop offset="70%" stopColor="var(--color-foreground)" stopOpacity="0.04" />
              <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity="0.08" />
            </linearGradient>
            {/* Liquid fill gradient */}
            <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent-guide)" stopOpacity="0.12" />
              <stop offset="50%" stopColor="var(--color-accent-guide)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-accent-guide)" stopOpacity="0.15" />
            </linearGradient>
            {/* Barrel highlight for cylindrical look */}
            <linearGradient id="barrelHighlight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="15%" stopColor="white" stopOpacity="0" />
              </linearGradient>
          </defs>

          {/* ── Needle ── */}
          {/* Needle hub (wider connector piece) */}
          <rect
            x={needleBaseX - 12}
            y={needleCenterY - 10}
            width={16}
            height={20}
            rx={2}
            fill="var(--color-foreground)"
            opacity={0.2}
          />
          {/* Needle shaft — tapers to point */}
          <polygon
            points={`
              ${needleTipX},${needleCenterY}
              ${needleBaseX - 12},${needleCenterY - needleHalfH}
              ${needleBaseX - 12},${needleCenterY + needleHalfH}
            `}
            fill="var(--color-foreground)"
            opacity={0.35}
          />
          {/* Needle highlight */}
          <line
            x1={needleTipX + 4}
            y1={needleCenterY - 1}
            x2={needleBaseX - 14}
            y2={needleCenterY - 2}
            stroke="white"
            strokeWidth={0.8}
            opacity={0.4}
          />

          {/* ── Barrel (cylinder body) ── */}
          {/* Barrel outline */}
          <rect
            x={barrelX}
            y={barrelY}
            width={barrelEndX - barrelX}
            height={barrelH}
            rx={barrelR}
            fill="url(#barrelGrad)"
            stroke="var(--color-foreground)"
            strokeWidth={1.5}
            strokeOpacity={0.2}
          />
          {/* Barrel highlight for 3D effect */}
          <rect
            x={barrelX + 1}
            y={barrelY + 1}
            width={barrelEndX - barrelX - 2}
            height={barrelH - 2}
            rx={barrelR - 1}
            fill="url(#barrelHighlight)"
          />
          {/* Flange (finger grip) at barrel end */}
          <rect
            x={barrelEndX - 3}
            y={barrelY - 8}
            width={6}
            height={barrelH + 16}
            rx={2}
            fill="var(--color-foreground)"
            opacity={0.12}
            stroke="var(--color-foreground)"
            strokeWidth={1}
            strokeOpacity={0.15}
          />

          {/* ── Liquid fill ── */}
          {clamped > 0 && (
            <rect
              x={barrelInnerX}
              y={barrelY + 4}
              width={Math.max(0, fillW)}
              height={barrelH - 8}
              rx={3}
              fill="url(#liquidGrad)"
              style={{ transition: "width 500ms ease" }}
            />
          )}

          {/* ── Plunger head (inside barrel) ── */}
          <rect
            x={plungerHeadX - 2}
            y={barrelY + 2}
            width={plungerHeadW}
            height={barrelH - 4}
            rx={2}
            fill="var(--color-foreground)"
            opacity={0.15}
            stroke="var(--color-foreground)"
            strokeWidth={1}
            strokeOpacity={0.2}
          />
          {/* Plunger gasket line */}
          <line
            x1={plungerHeadX + 1}
            y1={barrelY + 6}
            x2={plungerHeadX + 1}
            y2={barrelY + barrelH - 6}
            stroke="var(--color-foreground)"
            strokeWidth={1.5}
            strokeOpacity={0.25}
          />

          {/* ── Plunger rod ── */}
          <rect
            x={plungerRodStartX}
            y={plungerRodY - plungerRodH / 2}
            width={plungerRodEndX - plungerRodStartX}
            height={plungerRodH}
            rx={2}
            fill="var(--color-foreground)"
            opacity={0.12}
            stroke="var(--color-foreground)"
            strokeWidth={1}
            strokeOpacity={0.15}
          />
          {/* Plunger thumb rest (T-shape at end) */}
          <rect
            x={plungerRodEndX - 4}
            y={plungerRodY - 14}
            width={8}
            height={28}
            rx={3}
            fill="var(--color-foreground)"
            opacity={0.12}
            stroke="var(--color-foreground)"
            strokeWidth={1}
            strokeOpacity={0.15}
          />

          {/* ── Graduation marks (below barrel) ── */}
          {marks.map((m) => {
            const pct = m / (scale === "u100" ? 100 : 100);
            const x = barrelInnerX + pct * barrelInnerW;
            const isMajor = scale === "u100" ? m % 20 === 0 : true;
            const tickTop = barrelY + barrelH + 3;
            const tickLen = isMajor ? 10 : 6;

            return (
              <g key={m}>
                {/* Tick line */}
                <line
                  x1={x}
                  y1={tickTop}
                  x2={x}
                  y2={tickTop + tickLen}
                  stroke="var(--color-foreground)"
                  strokeWidth={isMajor ? 1.2 : 0.8}
                  strokeOpacity={isMajor ? 0.5 : 0.3}
                />
                {/* Label (show all for ml, every 20 for u100) */}
                {isMajor && (
                  <text
                    x={x}
                    y={tickTop + tickLen + 11}
                    textAnchor="middle"
                    fontSize={10}
                    fontFamily="system-ui, -apple-system, sans-serif"
                    fill="var(--color-muted-foreground)"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {labelForMark(m)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Minor ticks for u100 (every 5 units) */}
          {scale === "u100" &&
            Array.from({ length: 21 }, (_, i) => i * 5).map((m) => {
              if (m % 10 === 0) return null; // skip, already drawn above
              const pct = m / 100;
              const x = barrelInnerX + pct * barrelInnerW;
              const tickTop = barrelY + barrelH + 3;
              return (
                <line
                  key={`minor-${m}`}
                  x1={x}
                  y1={tickTop}
                  x2={x}
                  y2={tickTop + 4}
                  stroke="var(--color-foreground)"
                  strokeWidth={0.6}
                  strokeOpacity={0.2}
                />
              );
            })}

          {/* ── Draw-to indicator ── */}
          {clamped > 0 && clamped < 100 && (
            <g>
              {/* Arrow pointing down to fill line */}
              <polygon
                points={`
                  ${fillEndX},${barrelY - 2}
                  ${fillEndX - 5},${barrelY - 10}
                  ${fillEndX + 5},${barrelY - 10}
                `}
                fill="var(--color-accent-guide)"
              />
              {/* Vertical dashed line through barrel at fill point */}
              <line
                x1={fillEndX}
                y1={barrelY - 10}
                x2={fillEndX}
                y2={barrelY - 18}
                stroke="var(--color-accent-guide)"
                strokeWidth={1.5}
              />
            </g>
          )}
        </svg>
      </div>

      {/* Scale label */}
      <div
        className="mt-1 text-center text-[10px] tracking-wider uppercase"
        style={{ color: "var(--color-muted-foreground)" }}
      >
        {scale === "u100" ? "units" : "mL"}
      </div>
    </div>
  );
}
