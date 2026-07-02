"use client";

import { useMemo } from "react";
import { PEPTIDES } from "@/lib/calc/peptides";

interface Props {
  peptideName: string | null;
  shelfDays: number;
  dateMixed: string | null;
}

const REFERENCE_PEPTIDES = [
  { name: "CJC-1295", days: 21 },
  { name: "Most peptides", days: 28, isBand: true },
  { name: "Tirzepatide", days: 42 },
  { name: "Semaglutide", days: 56 },
];

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDay(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function ShelfLifeTimeline({ peptideName, shelfDays, dateMixed }: Props) {
  const maxDay = Math.max(shelfDays + 14, 60);

  const optimalEnd = Math.round(shelfDays * 0.5);
  const cautionEnd = shelfDays;

  const userPct = (shelfDays / maxDay) * 100;
  const optimalPct = (optimalEnd / maxDay) * 100;
  const cautionPct = ((cautionEnd - optimalEnd) / maxDay) * 100;

  const references = useMemo(() => {
    const refs = REFERENCE_PEPTIDES.filter(
      (r) =>
        r.name.toLowerCase() !== (peptideName ?? "").toLowerCase() &&
        r.days <= maxDay
    );
    return refs;
  }, [peptideName, maxDay]);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Your peptide
          </div>
          <div className="text-lg font-serif font-medium mt-0.5">
            {peptideName ?? "Custom"} — {shelfDays} days
          </div>
        </div>
        {dateMixed && (
          <div className="text-right text-sm text-muted-foreground">
            Mixed {formatDay(dateMixed)}
          </div>
        )}
      </div>

      {/* Timeline bar */}
      <div className="relative">
        {/* Background track */}
        <div className="h-8 bg-muted border border-border relative overflow-hidden">
          {/* Optimal zone */}
          <div
            className="absolute inset-y-0 left-0 bg-emerald-500/15 border-r border-emerald-500/30"
            style={{ width: `${optimalPct}%` }}
          />
          {/* Acceptable zone */}
          <div
            className="absolute inset-y-0 bg-amber-500/15 border-r-2 border-foreground"
            style={{ left: `${optimalPct}%`, width: `${cautionPct}%` }}
          />
          {/* Past shelf life */}
          <div
            className="absolute inset-y-0 right-0 bg-red-500/10"
            style={{ left: `${optimalPct + cautionPct}%` }}
          />
        </div>

        {/* User's peptide marker */}
        <div
          className="absolute top-0 bottom-0 flex flex-col items-center"
          style={{ left: `${userPct}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-0.5 h-8 bg-foreground" />
        </div>

        {/* Day labels below the bar */}
        <div className="relative h-6 mt-1">
          {/* Day 0 */}
          <div className="absolute left-0 text-[10px] text-muted-foreground tabular-nums">
            {dateMixed ? formatDay(dateMixed) : "Day 0"}
          </div>

          {/* Shelf life end */}
          <div
            className="absolute text-[10px] font-medium tabular-nums"
            style={{
              left: `${userPct}%`,
              transform: "translateX(-50%)",
            }}
          >
            {dateMixed ? addDays(dateMixed, shelfDays) : `Day ${shelfDays}`}
          </div>

          {/* Max */}
          <div className="absolute right-0 text-[10px] text-muted-foreground tabular-nums">
            {dateMixed ? addDays(dateMixed, maxDay) : `Day ${maxDay}`}
          </div>
        </div>

        {/* Zone labels above */}
        <div className="flex mt-3 text-[10px] uppercase tracking-wider font-medium">
          <div
            className="text-emerald-700 dark:text-emerald-400"
            style={{ width: `${optimalPct}%` }}
          >
            Optimal
          </div>
          <div
            className="text-amber-700 dark:text-amber-400"
            style={{ width: `${cautionPct}%` }}
          >
            Acceptable
          </div>
          <div className="text-red-600/70 dark:text-red-400/70 flex-1 text-right">
            Discard
          </div>
        </div>
      </div>

      {/* Reference markers */}
      <div className="mt-5 border-t border-border pt-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">
          How other peptides compare
        </div>
        <div className="space-y-2">
          {references.map((ref) => {
            const pct = (ref.days / maxDay) * 100;
            const isUser =
              ref.name.toLowerCase() ===
              (peptideName ?? "").toLowerCase();
            return (
              <div key={ref.name} className="flex items-center gap-3 text-sm">
                <div className="w-28 sm:w-36 text-xs text-muted-foreground truncate">
                  {ref.name}
                </div>
                <div className="flex-1 relative h-3 bg-muted">
                  <div
                    className="absolute inset-y-0 left-0 bg-foreground/10"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-14 text-right text-xs tabular-nums text-muted-foreground">
                  {ref.days} days
                </div>
              </div>
            );
          })}
          {/* User's peptide highlighted */}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-28 sm:w-36 text-xs font-medium truncate">
              {peptideName ?? "Your peptide"}
            </div>
            <div className="flex-1 relative h-3 bg-muted">
              <div
                className="absolute inset-y-0 left-0 bg-foreground/25"
                style={{ width: `${userPct}%` }}
              />
            </div>
            <div className="w-14 text-right text-xs tabular-nums font-medium">
              {shelfDays} days
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Temperature
          </div>
          <div className="text-sm mt-1">36–46°F (2–8°C)</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Refrigerate immediately
          </div>
        </div>
        <div className="bg-surface p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Light
          </div>
          <div className="text-sm mt-1">Protect from light</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Keep in box or wrap in foil
          </div>
        </div>
        <div className="bg-surface p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Never freeze
          </div>
          <div className="text-sm mt-1">No freeze-thaw cycles</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Destroys peptide structure
          </div>
        </div>
      </div>
    </div>
  );
}
