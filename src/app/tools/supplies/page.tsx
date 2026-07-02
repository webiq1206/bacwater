"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PEPTIDES, recommendBacWaterMl } from "@/lib/calc";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

type Frequency = "daily" | "twice-daily" | "every-other-day" | "weekly";
type Unit = "mg" | "mcg";

const FREQUENCIES: { id: Frequency; label: string; perWeek: number; hint: string }[] = [
  { id: "daily", label: "Once a day", perWeek: 7, hint: "Most common, e.g., every morning." },
  { id: "twice-daily", label: "Twice a day", perWeek: 14, hint: "Morning + evening." },
  { id: "every-other-day", label: "Every other day", perWeek: 3.5, hint: "3-4 times a week." },
  { id: "weekly", label: "Once a week", perWeek: 1, hint: "Some protocols use weekly dosing." },
];

const DURATIONS = [
  { weeks: 4, label: "4 weeks", hint: "Short trial cycle" },
  { weeks: 8, label: "8 weeks", hint: "Standard cycle length" },
  { weeks: 12, label: "12 weeks", hint: "Extended cycle" },
];

export default function SupplyCalculatorPage() {
  const [peptideSlug, setPeptideSlug] = useState("bpc-157");
  const peptide = PEPTIDES.find((p) => p.slug === peptideSlug) ?? PEPTIDES[0];

  // Dose (default to peptide's suggested)
  const [doseInput, setDoseInput] = useState<number>(peptide.suggestedDoseMcg);
  const [doseUnit, setDoseUnit] = useState<Unit>("mcg");
  const doseMcg = doseUnit === "mcg" ? doseInput : doseInput * 1000;

  // Vial size: user picks from common options
  const [vialMg, setVialMg] = useState<number>(peptide.commonVialStrengthsMg[0]);

  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [durationWeeks, setDurationWeeks] = useState<number>(8);
  const [showCustomDuration, setShowCustomDuration] = useState(false);

  // Whenever peptide changes, reset dose + vial to that peptide's defaults
  function handlePeptideChange(slug: string) {
    const p = PEPTIDES.find((x) => x.slug === slug) ?? PEPTIDES[0];
    setPeptideSlug(slug);
    setDoseInput(p.suggestedDoseMcg);
    setDoseUnit("mcg");
    setVialMg(p.commonVialStrengthsMg[0]);
  }

  const results = useMemo(() => {
    const freq = FREQUENCIES.find((f) => f.id === frequency) ?? FREQUENCIES[0];
    const totalDoses = Math.ceil(freq.perWeek * durationWeeks);

    const doseMg = doseMcg / 1000;
    const dosesPerVial = Math.max(1, Math.floor(vialMg / doseMg));
    const peptideVialsNeeded = Math.ceil(totalDoses / dosesPerVial);

    // BAC water per peptide vial: recommended amount
    const bacPerVial = recommendBacWaterMl(vialMg, doseMcg);
    const totalBacMl = bacPerVial * peptideVialsNeeded;
    // Round up to whole 30 mL BAC vials
    const bacVialsNeeded = Math.max(1, Math.ceil(totalBacMl / 30));

    // Syringes: one per injection, round to boxes of 100
    const syringesNeeded = totalDoses;
    const syringeBoxes = Math.ceil(syringesNeeded / 100);

    // Alcohol prep pads: 2 per injection (vial top + injection site)
    const padsNeeded = totalDoses * 2;
    const padBoxes = Math.ceil(padsNeeded / 200);

    return {
      totalDoses,
      dosesPerVial,
      peptideVialsNeeded,
      bacPerVial,
      totalBacMl,
      bacVialsNeeded,
      syringesNeeded,
      syringeBoxes,
      padsNeeded,
      padBoxes,
      freq,
    };
  }, [frequency, durationWeeks, doseMcg, vialMg]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Supply Calculator", href: "/tools/supplies" },
      ]} />
      <div className="max-w-3xl">
        <div className="eyebrow">Supply Calculator</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          How much do I need?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Tell us what you&apos;re running and we&apos;ll figure out exactly how
          many peptide vials, BAC water bottles, syringes, and alcohol pads
          you&apos;ll need, with a one-click cart.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-start">
        <div className="lg:sticky lg:top-24 space-y-4">
          {/* 1. Peptide */}
          <Section n={1} total={5} title="Which peptide?">
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
          </Section>

          {/* 2. Dose per injection */}
          <Section
            n={2}
            total={5}
            title="How much per injection?"
            hint={`Typical range: ${peptide.typicalDoseMcgRange[0]}-${peptide.typicalDoseMcgRange[1]} mcg (${peptide.typicalDoseMcgRange[0] / 1000}-${peptide.typicalDoseMcgRange[1] / 1000} mg). We pre-filled the common starting dose.`}
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="numeric"
                step="10"
                value={doseInput}
                onChange={(e) => setDoseInput(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <UnitToggle value={doseUnit} onChange={setDoseUnit} options={["mcg", "mg"]} />
            </div>
          </Section>

          {/* 3. Vial size to order */}
          <Section
            n={3}
            total={5}
            title="What size vial will you order?"
            hint="Bigger vials = more doses per vial, but slightly less flexibility."
          >
            <div className="flex flex-wrap gap-2">
              {peptide.commonVialStrengthsMg.map((mg) => (
                <button
                  key={mg}
                  type="button"
                  onClick={() => setVialMg(mg)}
                  className={cn("chip", vialMg === mg && "chip--active")}
                >
                  <div className="flex items-center gap-2 font-medium">
                    {vialMg === mg && <Check className="h-4 w-4" />}
                    {mg} mg
                  </div>
                </button>
              ))}
            </div>
          </Section>

          {/* 4. Frequency */}
          <Section n={4} total={5} title="How often will you inject?">
            <div className="grid gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrequency(f.id)}
                  className={cn("chip text-left", frequency === f.id && "chip--active")}
                >
                  <div className="flex items-center gap-2">
                    {frequency === f.id && <Check className="h-4 w-4 shrink-0" />}
                    <div>
                      <div className="font-medium">{f.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{f.hint}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          {/* 5. Cycle length */}
          <Section n={5} total={5} title="How long is your cycle?">
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => {
                const active = !showCustomDuration && durationWeeks === d.weeks;
                return (
                  <button
                    key={d.weeks}
                    type="button"
                    onClick={() => { setDurationWeeks(d.weeks); setShowCustomDuration(false); }}
                    className={cn("chip", active && "chip--active")}
                  >
                    <div className="flex items-center gap-2 font-medium">
                      {active && <Check className="h-4 w-4" />}
                      {d.label}
                    </div>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setShowCustomDuration(true)}
                className={cn("chip", showCustomDuration && "chip--active")}
              >
                <div className="flex items-center gap-2 font-medium">
                  {showCustomDuration && <Check className="h-4 w-4" />}
                  Custom
                </div>
              </button>
            </div>
            {showCustomDuration ? (
              <div className="mt-3 flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1"
                  autoFocus
                />
                <span className="text-sm text-muted-foreground">weeks</span>
              </div>
            ) : null}
          </Section>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="border border-border bg-card p-6 sm:p-8">
              <div className="eyebrow">Your shopping list</div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-medium tracking-tight">
                {results.totalDoses} injections over {durationWeeks} weeks
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {results.freq.label.toLowerCase()} &times; {durationWeeks} weeks ={" "}
                <b>{results.totalDoses}</b> total injections. Here&apos;s
                everything you&apos;ll need.
              </p>

              <div className="rule my-6" />

              <div className="space-y-4">
                <SupplyRow
                  qty={results.peptideVialsNeeded}
                  label={`${peptide.name}, ${vialMg} mg vial${results.peptideVialsNeeded === 1 ? "" : "s"}`}
                  why={`Each vial gives you about ${results.dosesPerVial} doses at ${doseMcg} mcg (${doseMcg / 1000} mg). Rounded up so you don't run out.`}
                />
                <SupplyRow
                  qty={results.bacVialsNeeded}
                  label={`Bacteriostatic Water, 30 mL bottle${results.bacVialsNeeded === 1 ? "" : "s"}`}
                  why={`You'll use ~${Math.round(results.totalBacMl * 10) / 10} mL total to reconstitute your ${results.peptideVialsNeeded} peptide vial${results.peptideVialsNeeded === 1 ? "" : "s"}.`}
                  buyable="BAC-30ML"
                />
                <SupplyRow
                  qty={results.syringeBoxes}
                  label={`Insulin Syringes, box of 100${results.syringeBoxes === 1 ? "" : ""} (${results.syringesNeeded} injections)`}
                  why="One fresh syringe per injection. Never reuse."
                  buyable="SYR-INS-10"
                />
                <SupplyRow
                  qty={results.padBoxes}
                  label={`Alcohol Prep Pads, box of 200${results.padBoxes === 1 ? "" : ""} (${results.padsNeeded} pads)`}
                  why="Two pads per injection: one to wipe the vial top, one for the injection site."
                  buyable="ALC-200"
                />
              </div>

              <div className="rule my-6" />

              <div className="flex flex-wrap gap-3">
                <Button asChild variant="brand" size="lg">
                  <Link href="/shop">
                    Shop these supplies <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/plan">Build a full mixing plan</Link>
                </Button>
              </div>
          </div>

          <div className="bg-surface border border-border p-5">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We rounded everything up to whole boxes so you won&apos;t run
                  out mid-cycle. Numbers assume {results.bacPerVial} mL of BAC
                  water per peptide vial, the amount that gives clean syringe
                  numbers at your chosen dose.
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  n,
  total,
  title,
  hint,
  children,
}: {
  n: number;
  total: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border bg-card p-5 sm:p-7">
      <div className="flex items-center gap-3 mb-3">
        <span className="step-number step-number--filled text-[11px]">{n}</span>
        <div className="eyebrow">Step {n} of {total}</div>
      </div>
      <h3 className="text-xl font-serif font-medium leading-tight">{title}</h3>
      {hint ? <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{hint}</p> : null}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function SupplyRow({
  qty,
  label,
  why,
  buyable,
}: {
  qty: number;
  label: string;
  why: string;
  buyable?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="shrink-0 w-12 h-12 bg-muted grid place-items-center">
        <div className="font-semibold text-foreground text-lg tabular-nums">
          {qty}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium leading-tight">{label}</div>
        <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{why}</div>
      </div>
      {buyable ? (
        <Check className="h-4 w-4 text-foreground shrink-0 mt-2" />
      ) : null}
    </div>
  );
}

function UnitToggle<U extends string>({
  value,
  onChange,
  options,
}: {
  value: U;
  onChange: (u: U) => void;
  options: [U, U];
}) {
  return (
    <div className="inline-flex border border-border-strong bg-muted p-0.5 shrink-0">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "px-3 h-8 text-xs font-semibold transition-colors",
            value === opt
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
