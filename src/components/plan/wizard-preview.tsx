"use client";

import { CheckCircle2, Circle } from "lucide-react";
import type { CalcResult, SyringeType } from "@/lib/calc";
import { findSyringe } from "@/lib/calc";
import {
  formatConcentration,
  formatDose,
  formatMl,
  formatSyringeReading,
} from "@/lib/calc/format";
import { SyringeVisual } from "@/components/plan/syringe-visual";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * The plan taking shape, shown beside the guided wizard on desktop.
 *
 * The wizard asks one question at a time, which is right for someone who
 * would be overwhelmed by the full form — but it meant the thing being built
 * stayed invisible until the final step, on a screen that was two-thirds
 * empty. This fills that space with the answer as it becomes knowable: the
 * numbers appear the moment the inputs that determine them are in, and the
 * rows that aren't answerable yet say so rather than showing a zero.
 *
 * It is a read-only mirror of `calculate()`, the same deterministic result the
 * review step, the PDF, and the vial label all render. No separate math.
 */
export function WizardPreview({
  result,
  hasPeptide,
  vialStrengthMg,
  doseMcg,
  syringeType,
  dateMixed,
  className,
}: {
  result: CalcResult;
  hasPeptide: boolean;
  vialStrengthMg: number;
  doseMcg: number;
  syringeType: SyringeType;
  dateMixed: string;
  className?: string;
}) {
  const knowsVial = vialStrengthMg > 0;
  const knowsDose = doseMcg > 0;
  // Every downstream number needs both the vial contents and the amount being
  // measured; until then there is nothing honest to show.
  const solved = knowsVial && knowsDose;
  const syringe = findSyringe(syringeType);

  const steps = [
    { label: "Peptide", done: hasPeptide },
    { label: "Vial strength", done: knowsVial },
    { label: "Amount", done: knowsDose },
  ];

  return (
    <aside className={cn("space-y-4", className)}>
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="eyebrow">Your plan so far</div>

        {!solved ? (
          <>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              As soon as we know what&apos;s in your vial and how much you want
              to measure, the full plan appears here and updates with every
              answer.
            </p>
            <ul className="mt-4 space-y-2">
              {steps.map((s) => (
                <li
                  key={s.label}
                  className={cn(
                    "flex items-center gap-2 text-sm",
                    s.done ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {s.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0" />
                  )}
                  {s.label}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className="mt-1 font-serif text-xl font-medium tracking-tight">
              {result.input.peptideName || "Reconstitution plan"}
            </div>

            <div className="mt-4">
              <SyringeVisual
                fillPercent={result.syringeReadout.fillPercent}
                readoutLabel={formatSyringeReading(result.syringeReadout)}
                scale={result.syringeReadout.kind}
                maxLabel={syringe.label}
              />
            </div>

            <dl className="mt-4 space-y-0 text-sm">
              <Row
                label="Add BAC water"
                value={`${formatMl(result.usedBacMl)} mL`}
                emphasis
              />
              <Row
                label="Draw to"
                value={formatSyringeReading(result.syringeReadout)}
                emphasis
              />
              <Row
                label="Concentration"
                value={formatConcentration(result.finalConcentrationMgPerMl)}
              />
              <Row
                label="Per injection"
                value={formatDose(
                  result.schedule?.dosePerInjectionMcg ?? result.input.doseMcg
                )}
              />
              <Row label="Measures per vial" value={String(result.dosesPerVial)} />
              <Row
                label="Discard by"
                value={
                  dateMixed && result.expiration.date
                    ? formatDate(result.expiration.date)
                    : `${result.expiration.days} days after mixing`
                }
              />
            </dl>

            {result.syringeReadout.exceedsSyringe ? (
              <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                This draw is larger than the {syringe.label} holds. Pick a bigger
                syringe, or add less BAC water, on the coming steps.
              </p>
            ) : null}

            {result.warnings.length > 0 ? (
              <ul className="mt-3 space-y-1.5">
                {result.warnings.slice(0, 2).map((w, i) => (
                  <li key={i} className="text-xs leading-relaxed text-muted-foreground">
                    {w}
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Updates as you answer. Nothing is saved until you choose to save.
            </p>
          </>
        )}
      </div>
    </aside>
  );
}

function Row({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border py-2 last:border-b-0">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "min-w-0 text-right",
          emphasis ? "text-base font-semibold" : "font-medium"
        )}
      >
        {value}
      </dd>
    </div>
  );
}
