"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Beaker, Check } from "lucide-react";
import { CopyButton } from "@/components/common/copy-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { recommendBacWaterMl } from "@/lib/calc";
import { ResearchDisclaimer } from "@/components/common/research-disclaimer";
import { setInterestPeptide } from "@/lib/learn/interest";

interface Props {
  peptideName: string;
  peptideSlug?: string;
  commonVialStrengthsMg: number[];
  suggestedDoseMcg: number;
}

export function PeptideCalc({
  peptideName,
  peptideSlug,
  commonVialStrengthsMg,
  suggestedDoseMcg,
}: Props) {
  // Opening a peptide page is an interest signal that personalizes contextual
  // panels elsewhere on the site (e.g. the FAQ hub).
  useEffect(() => {
    if (peptideSlug && peptideSlug !== "custom") setInterestPeptide(peptideSlug);
  }, [peptideSlug]);

  const [vialMg, setVialMg] = useState<number>(commonVialStrengthsMg[0]);
  const [customVial, setCustomVial] = useState(false);
  const [doseMcg, setDoseMcg] = useState<number>(suggestedDoseMcg);

  const result = useMemo(() => {
    const safeVial = Math.max(0.0001, vialMg || 0);
    const safeDose = Math.max(0.0001, doseMcg || 0);
    const bacMl = recommendBacWaterMl(safeVial, safeDose);
    const concentrationMgPerMl = safeVial / bacMl;
    const doseVolumeMl = safeDose / 1000 / concentrationMgPerMl;
    const units = doseVolumeMl * 100;
    const dosesPerVial = Math.floor(safeVial / (safeDose / 1000));
    return {
      bacMl: Math.round(bacMl * 100) / 100,
      concentrationMgPerMl: Math.round(concentrationMgPerMl * 100) / 100,
      units: Math.round(units * 10) / 10,
      dosesPerVial,
    };
  }, [vialMg, doseMcg]);

  const valid = vialMg > 0 && doseMcg > 0;

  return (
    <div className="border-2 border-foreground bg-card">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2.5 mb-5">
          <Beaker className="h-5 w-5" style={{ color: "var(--color-accent-guide)" }} />
          <h3 className="text-lg font-serif font-medium tracking-tight">
            {peptideName} bac water calculator
          </h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Vial strength
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {commonVialStrengthsMg.map((mg) => (
                <button
                  key={mg}
                  type="button"
                  aria-pressed={!customVial && vialMg === mg}
                  onClick={() => {
                    setVialMg(mg);
                    setCustomVial(false);
                  }}
                  className={cn(
                    "chip",
                    !customVial && vialMg === mg && "chip--active"
                  )}
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    {!customVial && vialMg === mg && <Check className="h-3.5 w-3.5" />}
                    {mg} mg
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCustomVial(true)}
                className={cn("chip", customVial && "chip--active")}
              >
                <span className="font-medium">Other</span>
              </button>
            </div>
            {customVial && (
              <Input
                type="number"
                step="0.5"
                className="mt-2"
                value={vialMg || ""}
                onChange={(e) => setVialMg(parseFloat(e.target.value) || 0)}
                placeholder="Vial strength in mg"
                aria-label="Custom vial strength in mg"
              />
            )}
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Dose per injection (mcg)
            </label>
            <Input
              type="number"
              step="10"
              className="mt-2"
              value={doseMcg || ""}
              onChange={(e) => setDoseMcg(parseFloat(e.target.value) || 0)}
              aria-label="Amount you measure, in micrograms"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              = {(doseMcg / 1000).toFixed(doseMcg % 1000 === 0 ? 0 : 2)} mg
            </p>
          </div>
        </div>

        <div className="mt-6 rule" />

        <div className="mt-6 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-10">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              Add this much bac water
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="result-hero">{valid ? result.bacMl : "--"}</span>
              <span className="text-2xl text-muted-foreground font-serif">mL</span>
            </div>
            {valid && <div className="mt-2"><CopyButton value={`${result.bacMl} mL`} label="Copy amount" /></div>}
          </div>
          {valid ? (
            <div className="grid grid-cols-3 gap-px bg-border flex-1">
              <Stat label="Concentration" value={`${result.concentrationMgPerMl} mg/mL`} />
              <Stat label="Per dose" value={`${result.units} units`} />
              <Stat label="Doses / vial" value={`${result.dosesPerVial}`} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground flex-1">
              Enter a vial strength and a dose to see your numbers.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="brand" size="lg">
            <Link href="/plan">
              Build a full plan <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/learn">Learn the basics</Link>
          </Button>
        </div>

        <ResearchDisclaimer className="mt-6" />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card px-3 py-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}
