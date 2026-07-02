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
            = {(result.input.doseMcg / 1000).toFixed(result.input.doseMcg % 1000 === 0 ? 0 : 2)} mg
            ({result.input.doseMcg.toLocaleString()} mcg)
            = {result.doseVolumeMl.toFixed(3)} mL
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
              {(result.input.doseMcg / 1000).toFixed(result.input.doseMcg % 1000 === 0 ? 0 : 2)} mg
            </strong>{" "}
            ({result.input.doseMcg.toLocaleString()} mcg) dose, draw{" "}
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
                {(result.secondary.companionDoseMcg / 1000).toFixed(result.secondary.companionDoseMcg % 1000 === 0 ? 0 : 2)} mg
              </strong>{" "}
              ({result.secondary.companionDoseMcg.toLocaleString()} mcg) of {result.secondary.peptideName}.
            </p>
          )}
        </div>
      </div>

      {/* Step-by-step instructions */}
      <div className="border border-border bg-card p-6 sm:p-8">
        <div className="section-prominent mb-0 border-t-0">
          <h4 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
            Step-by-step instructions
          </h4>
          <p className="mt-2 text-sm text-muted-foreground">
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
            <h4 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
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

      {/* What to do next */}
      <div className="callout-panel">
        <h4 className="text-lg font-serif font-medium tracking-tight mb-4">
          What to do next
        </h4>
        <ol className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="step-number step-number--filled text-[10px] mt-0.5 h-5 w-5 text-[9px]">1</span>
            <span className="leading-relaxed">
              <strong className="text-foreground">Save your plan</strong>
              <span className="text-muted-foreground"> — get a permanent link, downloadable PDF, and printable vial labels.</span>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="step-number step-number--filled text-[10px] mt-0.5 h-5 w-5 text-[9px]">2</span>
            <span className="leading-relaxed">
              <strong className="text-foreground">Gather your supplies</strong>
              <span className="text-muted-foreground"> — the supply list above tells you exactly what to order.</span>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="step-number step-number--filled text-[10px] mt-0.5 h-5 w-5 text-[9px]">3</span>
            <span className="leading-relaxed">
              <strong className="text-foreground">Follow the instructions</strong>
              <span className="text-muted-foreground"> — the step-by-step guide above walks you through mixing.</span>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="step-number step-number--filled text-[10px] mt-0.5 h-5 w-5 text-[9px]">4</span>
            <span className="leading-relaxed">
              <strong className="text-foreground">Draw to the mark</strong>
              <span className="text-muted-foreground"> — the syringe diagram shows exactly where to draw.</span>
            </span>
          </li>
        </ol>
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
