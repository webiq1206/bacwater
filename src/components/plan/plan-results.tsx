"use client";

import { AlertTriangle, Check, CheckCircle2, Info, MessageCircle } from "lucide-react";
import type { CalcResult } from "@/lib/calc";
import { SyringeVisual } from "@/components/plan/syringe-visual";
import { ShelfLifeTimeline } from "@/components/plan/shelf-life-timeline";
import { formatDate } from "@/lib/utils";
import { SupplyRecommender } from "@/components/plan/supply-recommender";

interface Props {
  result: CalcResult;
}

export function PlanResults({ result }: Props) {
  const { syringeReadout } = result;

  return (
    <div className="space-y-6">
      {/* Hero result */}
      <div className="border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="eyebrow">Your result</div>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-medium tracking-tight">
          {result.input.peptideName || "Reconstitution Plan"}
        </h3>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-10">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Draw this much per dose
            </div>
            <div className="mt-1 result-hero">
              {syringeReadout.kind === "u100"
                ? `${syringeReadout.valueRounded} units`
                : `${syringeReadout.valueRounded} mL`}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              on your {result.input.syringeType.replace("insulin-", "").replace("ml", " mL")} syringe
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            = {result.doseVolumeMl.toFixed(3)} mL
            = {result.input.doseMcg.toLocaleString()} mcg
            {result.input.doseMcg >= 1000 && (
              <> = {(result.input.doseMcg / 1000).toFixed(result.input.doseMcg % 1000 === 0 ? 0 : 2)} mg</>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border">
          <Stat label="Vial" value={`${result.input.vialStrengthMg} mg`} />
          <Stat label="BAC water added" value={`${result.usedBacMl} mL`} />
          <Stat
            label="Concentration"
            value={`${result.finalConcentrationMgPerMl} mg/mL`}
            sub={`${result.finalConcentrationMcgPerMl.toLocaleString()} mcg/mL`}
          />
          <Stat label="Doses per vial" value={`${result.dosesPerVial}`} />
        </div>

        <div className="mt-6">
          <SyringeVisual
            fillPercent={syringeReadout.fillPercent}
            readoutLabel={syringeReadout.displayLabel}
            scale={syringeReadout.kind}
            maxLabel={
              syringeReadout.kind === "u100" ? "100 units" : "1 mL"
            }
          />
        </div>

        {result.warnings.length > 0 && (
          <div className="mt-6 space-y-2">
            {result.warnings.map((w, i) => (
              <div key={i} className="warning-strip flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> {w}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* In Plain English — most prominent section */}
      <div className="callout-panel">
        <div className="flex items-center gap-2.5 mb-4">
          <MessageCircle className="h-5 w-5 accent-check" />
          <h4 className="text-lg font-serif font-medium tracking-tight">
            In plain English
          </h4>
        </div>
        <div className="text-[15px] leading-relaxed space-y-3">
          <p>
            You have a vial of{" "}
            <strong>{result.input.peptideName || "peptide"}</strong> that
            contains{" "}
            <strong>
              {result.input.vialStrengthMg} mg
            </strong>{" "}
            of powder.
          </p>
          <p>
            Add{" "}
            <strong>
              {result.usedBacMl} mL of BAC water
            </strong>{" "}
            to the vial. This creates a solution where every milliliter
            contains{" "}
            <strong>
              {result.finalConcentrationMgPerMl} mg
            </strong>{" "}
            ({result.finalConcentrationMcgPerMl.toLocaleString()} mcg) of
            peptide.
          </p>
          <p>
            To get your{" "}
            <strong>
              {result.input.doseMcg.toLocaleString()} mcg
            </strong>{" "}
            dose, draw{" "}
            <strong>{result.syringeReadout.displayLabel}</strong>.
            That&apos;s{" "}
            <strong>{result.doseVolumeMl.toFixed(3)} mL</strong> of
            the mixed solution.
          </p>
          <p>
            You&apos;ll get about{" "}
            <strong>{result.dosesPerVial} doses</strong> from this vial
            before it runs out.
          </p>
          {result.secondary && (
            <p>
              Because this is a blend, each draw also delivers{" "}
              <strong>
                {result.secondary.companionDoseMcg.toLocaleString()} mcg
              </strong>{" "}
              of {result.secondary.peptideName}.
            </p>
          )}
        </div>
      </div>

      {/* Step-by-step instructions */}
      <div className="border border-border bg-card p-6 sm:p-8">
        <div className="section-prominent mb-0 border-t-0">
          <h4 className="text-lg font-serif font-medium tracking-tight">
            Step-by-step instructions
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">
            Follow these steps in order. Take your time — there&apos;s no rush.
          </p>
        </div>
        <ol className="mt-6 space-y-4">
          {result.instructions.map((s, i) => (
            <li key={i} className="flex gap-4 text-sm">
              <span className="step-number--filled step-number text-[11px]">
                {i + 1}
              </span>
              <span className="pt-1 leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Storage & shelf life timeline */}
      <div className="border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h4 className="text-lg font-serif font-medium tracking-tight">
              Storage &amp; shelf life
            </h4>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-lg">
              {result.expiration.note}
            </p>
          </div>
          <div className="text-right border-l border-border pl-6">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Shelf life
            </div>
            <div className="text-2xl font-semibold mt-1 tabular-nums">
              {result.expiration.days} days
            </div>
            <div className="text-xs text-muted-foreground">refrigerated</div>
            {result.expiration.date && (
              <div className="mt-2 text-sm font-medium">
                Expires {formatDate(result.expiration.date)}
              </div>
            )}
          </div>
        </div>
        <div className="rule mb-6" />
        <ShelfLifeTimeline
          peptideName={result.input.peptideName}
          shelfDays={result.expiration.days}
          dateMixed={result.input.dateMixed}
        />
      </div>

      {/* Supply recommender — prominent */}
      <SupplyRecommender supplies={result.supplies} />

      {/* Assumptions */}
      <div className="border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-4 w-4 text-muted-foreground" />
          <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
            Assumptions used
          </h4>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {result.assumptions.map((a, i) => (
            <li key={i} className="flex gap-2.5">
              <Check className="h-4 w-4 mt-0.5 accent-check shrink-0" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-card px-4 py-4">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 text-lg font-semibold tabular-nums">{value}</div>
      {sub && (
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      )}
    </div>
  );
}
