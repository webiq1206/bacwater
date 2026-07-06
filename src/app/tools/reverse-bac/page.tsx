"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Check, Lightbulb, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PEPTIDES } from "@/lib/calc";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ResearchDisclaimer } from "@/components/common/research-disclaimer";
import { SyringeVisual } from "@/components/plan/syringe-visual";
import { CopyButton } from "@/components/common/copy-button";
import { StickyResultBar } from "@/components/tools/sticky-result-bar";
import { RelatedReadingDynamic } from "@/components/learn/related-reading-dynamic";
import { setInterestPeptide } from "@/lib/learn/interest";

type Unit = "mg" | "mcg";

const TARGET_PRESETS = [10, 15, 20, 25, 50];

export default function ReverseBacCalculatorPage() {
  const [peptideSlug, setPeptideSlug] = useState("bpc-157");
  const peptide = PEPTIDES.find((p) => p.slug === peptideSlug) ?? PEPTIDES[0];

  const [vialInput, setVialInput] = useState<number>(peptide.commonVialStrengthsMg[0]);
  const [vialUnit, setVialUnit] = useState<Unit>("mg");
  const vialMg = vialUnit === "mg" ? vialInput : vialInput / 1000;

  const [doseInput, setDoseInput] = useState<number>(peptide.suggestedDoseMcg);
  const [doseUnit, setDoseUnit] = useState<Unit>("mcg");
  const doseMcg = doseUnit === "mcg" ? doseInput : doseInput * 1000;

  const [targetUnits, setTargetUnits] = useState<number>(20);

  function handlePeptideChange(slug: string) {
    const p = PEPTIDES.find((x) => x.slug === slug) ?? PEPTIDES[0];
    setPeptideSlug(slug);
    if (slug !== "custom") setInterestPeptide(slug);
    setVialInput(p.commonVialStrengthsMg[0]);
    setVialUnit("mg");
    setDoseInput(p.suggestedDoseMcg);
    setDoseUnit("mcg");
  }

  const result = useMemo(() => {
    if (vialMg <= 0 || doseMcg <= 0 || targetUnits <= 0) return null;
    // Target draw volume from the units you want (U-100: 100 units = 1 mL).
    const doseMl = targetUnits / 100;
    const concentration = doseMcg / 1000 / doseMl; // mg/mL
    const bacWaterMl = vialMg / concentration;
    const dosesPerVial = Math.floor(vialMg / (doseMcg / 1000));
    return { doseMl, concentration, bacWaterMl, dosesPerVial };
  }, [vialMg, doseMcg, targetUnits]);

  const warnings: string[] = [];
  if (result) {
    if (targetUnits > 100)
      warnings.push("More than 100 units will not fit on a 1 mL (U-100) insulin syringe. Choose fewer units or a larger syringe.");
    if (result.bacWaterMl > 5)
      warnings.push("That is a large volume of bac water, so the solution will be very dilute. Fewer target units keeps it more concentrated.");
    if (result.bacWaterMl > 0 && result.bacWaterMl < 0.5)
      warnings.push("That is very little bac water, which can be hard to mix evenly. More target units adds a little more water.");
  }

  const bac = result ? Math.round(result.bacWaterMl * 100) / 100 : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Reverse BAC Water Calculator", href: "/tools/reverse-bac" },
      ]} />
      <StickyResultBar
        label="Bac water to add"
        value={result ? `${bac} mL` : "--"}
        sub={result ? `${targetUnits} units` : undefined}
        visible={!!result}
      />
      <div className="max-w-3xl">
        <div className="eyebrow">Calculator</div>
        <h1 className="mt-3 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          Reverse BAC Water Calculator: Units to Water
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Choose the dose you want and the exact units you want to draw on the
          syringe. We&apos;ll tell you precisely how much bacteriostatic water to
          add so it lands there.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-start">
        {/* Inputs */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <StepCard n={1} total={4} title="Which peptide?">
            <Select value={peptideSlug} onValueChange={handlePeptideChange}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PEPTIDES.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </StepCard>

          <StepCard n={2} total={4} title="What size is your vial?">
            <div className="flex flex-wrap gap-2">
              {peptide.commonVialStrengthsMg.map((mg) => (
                <button
                  key={mg}
                  type="button"
                  onClick={() => { setVialInput(mg); setVialUnit("mg"); }}
                  className={cn("chip", vialUnit === "mg" && vialInput === mg && "chip--active")}
                >
                  <div className="flex items-center gap-2 font-medium">
                    {vialUnit === "mg" && vialInput === mg && <Check className="h-4 w-4" />}
                    {mg} mg
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Input
                type="number"
                inputMode="decimal"
                step="0.5"
                value={vialInput}
                onChange={(e) => setVialInput(parseFloat(e.target.value) || 0)}
                className="flex-1"
                placeholder="Or type a custom value"
              />
              <UnitToggle value={vialUnit} onChange={setVialUnit} options={["mg", "mcg"]} />
            </div>
          </StepCard>

          <StepCard n={3} total={4} title="How much per dose?">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="decimal"
                step="1"
                value={doseInput}
                onChange={(e) => setDoseInput(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <UnitToggle value={doseUnit} onChange={setDoseUnit} options={["mg", "mcg"]} />
            </div>
            {doseUnit === "mcg" && doseInput > 0 ? (
              <div className="mt-2 bg-surface px-3 py-2 text-xs text-muted-foreground">
                <Check className="h-3 w-3 inline mr-1" />
                {doseInput.toLocaleString()} mcg = {doseInput / 1000} mg
              </div>
            ) : null}
          </StepCard>

          <StepCard n={4} total={4} title="Units you want to draw" hint="The mark you want to fill to on a U-100 insulin syringe.">
            <div className="flex flex-wrap gap-2">
              {TARGET_PRESETS.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setTargetUnits(u)}
                  className={cn("chip", targetUnits === u && "chip--active")}
                >
                  <div className="flex items-center gap-2 font-medium">
                    {targetUnits === u && <Check className="h-4 w-4" />}
                    {u} units
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-3">
              <Input
                type="number"
                inputMode="numeric"
                step="1"
                value={targetUnits}
                onChange={(e) => setTargetUnits(parseFloat(e.target.value) || 0)}
                className="w-full"
                placeholder="Or type target units"
              />
            </div>
          </StepCard>
        </div>

        {/* Result */}
        <div className="space-y-4">
          <div className="border border-border bg-card p-6 sm:p-8">
            <div className="eyebrow">Bac water to add</div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="result-hero">{result ? bac : "--"}</span>
              <span className="text-2xl text-muted-foreground font-serif">mL</span>
            </div>
            {result && <div className="mt-2"><CopyButton value={`${bac} mL`} label="Copy amount" /></div>}
            {result ? (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Add <strong className="text-foreground">{bac} mL</strong> of
                bacteriostatic water to your {vialMg} mg vial. A{" "}
                {doseMcg.toLocaleString()} mcg dose then measures exactly{" "}
                <strong className="text-foreground">{targetUnits} units</strong>{" "}
                on a U-100 insulin syringe.
              </p>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Enter a vial strength, dose, and target units to see the exact
                amount of bac water to add.
              </p>
            )}

            {result && (
              <>
                <div className="rule my-6" />
                <div className="space-y-3 text-sm">
                  <ResultRow
                    label="Concentration after mixing"
                    value={`${result.concentration.toFixed(2)} mg/mL`}
                    sub={`${(result.concentration * 1000).toFixed(0)} mcg/mL`}
                  />
                  <ResultRow
                    label="Each dose draws"
                    value={`${targetUnits} units`}
                    sub={`${result.doseMl.toFixed(3)} mL = ${doseMcg.toLocaleString()} mcg`}
                  />
                  <ResultRow label="Doses per vial" value={`${result.dosesPerVial}`} />
                </div>
              </>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="lg">
                <Link href="/plan">
                  Build a full plan <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/tools/bac-water">Forward calculator</Link>
              </Button>
            </div>

            <ResearchDisclaimer className="mt-6" />
          </div>

          {/* Syringe visualization */}
          {result && (
            <SyringeVisual
              fillPercent={Math.min(100, targetUnits)}
              readoutLabel={`${targetUnits} units`}
              scale="u100"
              maxLabel="1 mL (100 units)"
            />
          )}

          {/* Capacity warnings */}
          {warnings.length > 0 && (
            <div className="callout-panel" style={{ borderLeftWidth: 3, borderLeftColor: "var(--color-warning, #b45309)" }}>
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  {warnings.map((w, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed">{w}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Why this works */}
          <div className="callout-panel">
            <div className="flex items-start gap-2.5">
              <Lightbulb className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">How it works</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The units you want set the draw volume ({targetUnits} units ={" "}
                  {(targetUnits / 100).toFixed(2)} mL on a U-100 syringe). We then
                  pick the bac water so the concentration puts your dose in exactly
                  that volume.
                </p>
              </div>
            </div>
          </div>

          <RelatedReadingDynamic
            peptide={peptideSlug === "custom" ? undefined : peptideSlug}
            topics={["dosage", "reconstitution-method", "safety"]}
            title={`Related reading for ${peptide.name}`}
            limit={4}
          />
        </div>
      </div>
    </div>
  );
}

function StepCard({ n, total, title, hint, children }: { n: number; total: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-card p-5 sm:p-7">
      <div className="flex items-center gap-3 mb-3">
        <span className="step-number step-number--filled text-[11px]">{n}</span>
        <div className="eyebrow">Step {n} of {total}</div>
      </div>
      <h3 className="text-xl font-serif font-medium leading-tight">{title}</h3>
      {hint && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{hint}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ResultRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className="font-medium tabular-nums">{value}</span>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </div>
    </div>
  );
}

function UnitToggle({ value, onChange, options }: { value: Unit; onChange: (u: Unit) => void; options: [Unit, Unit] }) {
  return (
    <div className="inline-flex border border-border-strong bg-muted p-0.5 shrink-0">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "px-3 h-10 text-xs font-semibold transition-colors",
            value === opt ? "bg-card text-foreground shadow-lift" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
