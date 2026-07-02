"use client";

import { useMemo } from "react";
import { PEPTIDES } from "@/lib/calc/peptides";

interface Props {
  peptideName: string | null;
  shelfDays: number;
  dateMixed: string | null;
}

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

function pickRelevantPeptides(
  peptideName: string | null,
  shelfDays: number
) {
  const slug = (peptideName ?? "").toLowerCase();
  const userPeptide = PEPTIDES.find(
    (p) =>
      p.name.toLowerCase() === slug ||
      p.slug === slug
  );
  const category = userPeptide?.category ?? "other";

  const candidates = PEPTIDES.filter(
    (p) =>
      p.slug !== "custom" &&
      p.name.toLowerCase() !== slug &&
      p.slug !== (userPeptide?.slug ?? "")
  );

  const sameCategory = candidates.filter((p) => p.category === category);
  const otherCategory = candidates.filter((p) => p.category !== category);

  const byRelevance = [
    ...sameCategory.sort(
      (a, b) =>
        Math.abs(a.refrigeratedShelfDays - shelfDays) -
        Math.abs(b.refrigeratedShelfDays - shelfDays)
    ),
    ...otherCategory.sort(
      (a, b) =>
        Math.abs(a.refrigeratedShelfDays - shelfDays) -
        Math.abs(b.refrigeratedShelfDays - shelfDays)
    ),
  ];

  const seen = new Set<number>();
  const picks: { name: string; days: number }[] = [];
  for (const p of byRelevance) {
    if (picks.length >= 4) break;
    if (seen.has(p.refrigeratedShelfDays)) continue;
    seen.add(p.refrigeratedShelfDays);
    picks.push({ name: p.name, days: p.refrigeratedShelfDays });
  }

  return picks.sort((a, b) => a.days - b.days);
}

export function ShelfLifeTimeline({ peptideName, shelfDays, dateMixed }: Props) {
  const maxDay = Math.max(shelfDays + 14, 60);

  const optimalEnd = Math.round(shelfDays * 0.5);
  const cautionEnd = shelfDays;

  const userPct = (shelfDays / maxDay) * 100;
  const optimalPct = (optimalEnd / maxDay) * 100;
  const cautionPct = ((cautionEnd - optimalEnd) / maxDay) * 100;

  const references = useMemo(
    () => pickRelevantPeptides(peptideName, shelfDays),
    [peptideName, shelfDays]
  );

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
        <div className="h-8 bg-muted border border-border relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-emerald-500/15 border-r border-emerald-500/30"
            style={{ width: `${optimalPct}%` }}
          />
          <div
            className="absolute inset-y-0 bg-amber-500/15 border-r-2 border-foreground"
            style={{ left: `${optimalPct}%`, width: `${cautionPct}%` }}
          />
          <div
            className="absolute inset-y-0 right-0 bg-red-500/10"
            style={{ left: `${optimalPct + cautionPct}%` }}
          />
        </div>

        <div
          className="absolute top-0 bottom-0 flex flex-col items-center"
          style={{ left: `${userPct}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-0.5 h-8 bg-foreground" />
        </div>

        <div className="relative h-6 mt-1">
          <div className="absolute left-0 text-[10px] text-muted-foreground tabular-nums">
            {dateMixed ? formatDay(dateMixed) : "Day 0"}
          </div>
          <div
            className="absolute text-[10px] font-medium tabular-nums"
            style={{
              left: `${userPct}%`,
              transform: "translateX(-50%)",
            }}
          >
            {dateMixed ? addDays(dateMixed, shelfDays) : `Day ${shelfDays}`}
          </div>
          <div className="absolute right-0 text-[10px] text-muted-foreground tabular-nums">
            {dateMixed ? addDays(dateMixed, maxDay) : `Day ${maxDay}`}
          </div>
        </div>

        <div className="flex mt-3 text-[10px] uppercase tracking-wider font-medium">
          <div
            className="text-emerald-700"
            style={{ width: `${optimalPct}%` }}
          >
            Optimal
          </div>
          <div
            className="text-amber-700"
            style={{ width: `${cautionPct}%` }}
          >
            Acceptable
          </div>
          <div className="text-red-600/70 flex-1 text-right">
            Discard
          </div>
        </div>
      </div>

      {/* Reference markers */}
      <div className="mt-5 border-t border-border pt-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-3">
          How similar peptides compare
        </div>
        <div className="space-y-2">
          {references.map((ref) => {
            const pct = (ref.days / maxDay) * 100;
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
            <div className="w-28 sm:w-36 text-xs font-medium truncate" style={{ color: "var(--color-accent-guide)" }}>
              {peptideName ?? "Your peptide"}
            </div>
            <div className="flex-1 relative h-3 bg-muted">
              <div
                className="absolute inset-y-0 left-0"
                style={{ width: `${userPct}%`, background: "var(--color-accent-guide)", opacity: 0.3 }}
              />
            </div>
            <div className="w-14 text-right text-xs tabular-nums font-medium" style={{ color: "var(--color-accent-guide)" }}>
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
