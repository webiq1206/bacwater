"use client";

import { AlertCircle, Check, Info } from "lucide-react";
import type { CalcResult } from "@/lib/calc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SyringeVisual } from "@/components/plan/syringe-visual";
import { formatDate } from "@/lib/utils";
import { SupplyRecommender } from "@/components/plan/supply-recommender";

interface Props {
  result: CalcResult;
}

export function PlanResults({ result }: Props) {
  const { syringeReadout } = result;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <Badge variant="brand">Plan summary</Badge>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                {result.input.peptideName || "Reconstitution plan"}
              </h3>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold text-brand tabular-nums">
                {syringeReadout.kind === "u100"
                  ? `${syringeReadout.valueRounded} u`
                  : `${syringeReadout.valueRounded} mL`}
              </div>
              <div className="text-xs text-muted-foreground">per dose on your syringe</div>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {result.summary}
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Vial strength" value={`${result.input.vialStrengthMg} mg`} />
            <Stat label="BAC water" value={`${result.usedBacMl} mL`} />
            <Stat label="Concentration" value={`${result.finalConcentrationMgPerMl} mg/mL`} />
            <Stat label="Doses per vial" value={`${result.dosesPerVial}`} />
          </div>

          <div className="mt-6">
            <SyringeVisual
              fillPercent={syringeReadout.fillPercent}
              readoutLabel={syringeReadout.displayLabel}
              scale={syringeReadout.kind}
              maxLabel={
                syringeReadout.kind === "u100"
                  ? "100 units"
                  : "1 mL"
              }
            />
          </div>

          {result.warnings.length > 0 ? (
            <div className="mt-6 space-y-2">
              {result.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> {w}
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h4 className="font-semibold text-lg">In plain English</h4>
          <p className="mt-2 text-sm text-muted-foreground">
            You&apos;re dissolving {result.input.vialStrengthMg} mg of {result.input.peptideName || "peptide"} in {result.usedBacMl} mL of BAC water. That makes each mL contain <b>{result.finalConcentrationMgPerMl} mg</b> (or {result.finalConcentrationMcgPerMl} mcg) of peptide. To dose {result.input.doseMcg} mcg, you draw <b>{result.doseVolumeMl.toFixed(3)} mL</b> of the mixed solution — which is <b>{result.syringeReadout.displayLabel}</b>.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h4 className="font-semibold text-lg">Step-by-step</h4>
          <ol className="mt-4 space-y-3">
            {result.instructions.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground text-[11px] font-semibold">
                  {i + 1}
                </span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h4 className="font-semibold text-lg">Storage & expiration</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.expiration.note}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Shelf life</div>
              <div className="text-lg font-semibold">{result.expiration.days} days refrigerated</div>
              {result.expiration.date ? (
                <div className="mt-1 text-sm text-brand">
                  Expires {formatDate(result.expiration.date)}
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <SupplyRecommender supplies={result.supplies} />

      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold">Assumptions used</h4>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {result.assumptions.map((a, i) => (
              <li key={i} className="flex gap-2">
                <Check className="h-4 w-4 mt-0.5 text-brand shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-muted/70 p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
