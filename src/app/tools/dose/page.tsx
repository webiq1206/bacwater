"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Check, FlaskConical, HelpCircle, Lightbulb, Ruler } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

type Unit = "mg" | "mcg";

export default function DoseCalculatorPage() {
  const [concInput, setConcInput] = useState(2.5);
  const [concUnit, setConcUnit] = useState<Unit>("mg");
  const concMgPerMl = concUnit === "mg" ? concInput : concInput / 1000;

  const [volMl, setVolMl] = useState(0.1);
  const [volMode, setVolMode] = useState<"ml" | "units">("units");
  const [volUnits, setVolUnits] = useState(10);

  const actualMl = volMode === "ml" ? volMl : volUnits / 100;

  const result = useMemo(() => {
    const doseMg = concMgPerMl * actualMl;
    const doseMcg = doseMg * 1000;
    return { doseMg, doseMcg, ml: actualMl, units: actualMl * 100 };
  }, [concMgPerMl, actualMl]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "Dose Calculator", href: "/tools/dose" },
      ]} />
      <div className="max-w-3xl">
        <div className="eyebrow">Calculator</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          What dose am I drawing?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Already mixed your vial? Enter your concentration and how much liquid
          you&apos;re drawing. We&apos;ll tell you the exact dose in both mg and mcg.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-start">
        {/* Inputs */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <StepCard
            n={1}
            total={2}
            title="What's the concentration?"
            hint="After mixing, your vial has a certain concentration. For example, 2.5 mg/mL means each milliliter of liquid contains 2.5 mg of peptide. Your plan or label should show this."
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={concInput}
                onChange={(e) => setConcInput(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <UnitToggle
                value={concUnit}
                onChange={setConcUnit}
                labels={["mg/mL", "mcg/mL"]}
                values={["mg", "mcg"]}
              />
            </div>
            {concUnit === "mcg" && concInput > 0 ? (
              <ConversionHint>{concInput} mcg/mL = {concInput / 1000} mg/mL</ConversionHint>
            ) : null}

            <div className="mt-4 bg-surface border border-border p-3">
              <p className="text-xs text-foreground leading-relaxed">
                <b>Not sure?</b> Concentration = vial strength &divide; BAC water added.
                Example: a 5 mg vial mixed with 2 mL of BAC water = 2.5 mg/mL.
                Use our <Link href="/tools/bac-water" className="underline font-medium">BAC Water Calculator</Link> to find yours.
              </p>
            </div>
          </StepCard>

          <StepCard
            n={2}
            total={2}
            title="How much are you drawing?"
            hint="Enter the amount of liquid you're pulling into your syringe, in either mL or syringe units."
          >
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => setVolMode("units")}
                className={cn("chip", volMode === "units" && "chip--active")}
              >
                <div className="flex items-center gap-2 font-medium">
                  {volMode === "units" && <Check className="h-4 w-4" />}
                  Syringe units
                </div>
              </button>
              <button
                type="button"
                onClick={() => setVolMode("ml")}
                className={cn("chip", volMode === "ml" && "chip--active")}
              >
                <div className="flex items-center gap-2 font-medium">
                  {volMode === "ml" && <Check className="h-4 w-4" />}
                  mL
                </div>
              </button>
            </div>
            {volMode === "units" ? (
              <>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="1"
                  value={volUnits}
                  onChange={(e) => setVolUnits(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 10"
                />
                <ConversionHint>{volUnits} units = {(volUnits / 100).toFixed(3)} mL</ConversionHint>
              </>
            ) : (
              <>
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={volMl}
                  onChange={(e) => setVolMl(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 0.1"
                />
                <ConversionHint>{volMl} mL = {(volMl * 100).toFixed(1)} units</ConversionHint>
              </>
            )}
          </StepCard>
        </div>

        {/* Result + Teaching (right column) */}
        <div className="space-y-4">
          <div className="border border-border bg-card p-6 sm:p-8">
              <div className="eyebrow">Your dose</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="result-hero tabular-nums">
                  {result.doseMg.toFixed(result.doseMg >= 1 ? 1 : 3)}
                </span>
                <span className="text-2xl text-muted-foreground font-serif">mg</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                = {result.doseMcg.toFixed(1)} mcg
              </div>

              <div className="rule my-6" />

              <div className="space-y-3 text-sm">
                <ResultRow label="Concentration" value={`${concMgPerMl.toFixed(2)} mg/mL`} />
                <ResultRow label="Volume drawn" value={`${result.ml.toFixed(3)} mL (${result.units.toFixed(1)} units)`} />
                <ResultRow label="Dose" value={`${result.doseMcg.toFixed(1)} mcg (${result.doseMg.toFixed(3)} mg)`} />
              </div>

              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                Drawing <b>{result.units.toFixed(1)} units</b> from a solution
                at <b>{concMgPerMl.toFixed(2)} mg/mL</b> gives
                you <b>{result.doseMcg.toFixed(1)} mcg</b> of peptide per injection.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="brand" size="lg">
                  <Link href="/plan">
                    Build a full plan <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/shop">Shop supplies</Link>
                </Button>
              </div>
          </div>

          <div className="callout-panel">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <b>The math:</b> dose = concentration &times; volume.
                  {" "}{concMgPerMl.toFixed(2)} mg/mL &times; {result.ml.toFixed(3)} mL
                  = {result.doseMg.toFixed(3)} mg = {result.doseMcg.toFixed(1)} mcg.
                </p>
              </div>
          </div>

          {/* Teaching sections */}
          <div className="mt-6 space-y-8">
            <TeachingSection
              icon={<FlaskConical className="h-5 w-5 text-foreground" />}
              title="What is concentration?"
            >
              <p>
                Concentration tells you how much peptide is dissolved in each
                milliliter of liquid. It&apos;s written as <b>mg/mL</b> (milligrams
                per milliliter). Think of it like the &ldquo;strength&rdquo; of your solution.
              </p>
              <p>
                <b>Example:</b> If you dissolved a 5 mg vial in 2 mL of BAC water,
                the concentration is 5 &divide; 2 = 2.5 mg/mL. Every milliliter of
                that liquid contains 2.5 mg of peptide.
              </p>
            </TeachingSection>

            <TeachingSection
              icon={<Ruler className="h-5 w-5 text-foreground" />}
              title="Units vs. mL: what's the difference?"
            >
              <p>
                Insulin syringes are marked in &ldquo;units&rdquo; instead of mL. The
                conversion is simple: <b>100 units = 1 mL</b>. So 10 units = 0.1 mL,
                and 5 units = 0.05 mL.
              </p>
              <p>
                If your syringe shows units, just divide by 100 to get mL. Or use our{" "}
                <Link href="/tools/syringe-units" className="text-foreground underline font-medium">
                  Syringe Unit Converter
                </Link>.
              </p>
            </TeachingSection>

            <TeachingSection
              icon={<HelpCircle className="h-5 w-5 text-foreground" />}
              title="When would I use this calculator?"
            >
              <p>
                Use this when you&apos;ve already mixed your vial and want to
                double-check what dose you&apos;re getting. Common situations:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>You forgot how much BAC water you added and want to recalculate</li>
                <li>You want to verify the dose from a plan someone else gave you</li>
                <li>You&apos;re adjusting your dose and want to see the new numbers</li>
              </ul>
            </TeachingSection>
          </div>

          {/* Related tools */}
          <div className="mt-6">
            <h2 className="text-xl font-serif font-medium tracking-tight">Related tools</h2>
            <div className="mt-3 grid gap-3">
              <RelatedTool href="/tools/bac-water" title="BAC Water Calculator" body="Find out how much BAC water to add to your vial before mixing." />
              <RelatedTool href="/tools/syringe-units" title="Syringe Unit Converter" body="Convert between mL and insulin syringe units (100 units = 1 mL)." />
              <RelatedTool href="/tools/mg-to-mcg" title="mg ↔ mcg Converter" body="Convert between milligrams and micrograms. 1 mg = 1,000 mcg." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({
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
    <div className="border border-border bg-card p-6 sm:p-7">
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

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums text-right">{value}</span>
    </div>
  );
}

function UnitToggle({ value, onChange, labels, values }: { value: Unit; onChange: (u: Unit) => void; labels: [string, string]; values: [Unit, Unit] }) {
  return (
    <div className="inline-flex border border-border bg-muted p-0.5 shrink-0">
      {values.map((v, i) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "px-3 h-8 text-xs font-semibold transition-colors whitespace-nowrap",
            value === v
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {labels[i]}
        </button>
      ))}
    </div>
  );
}

function ConversionHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 bg-surface px-3 py-2 text-xs text-muted-foreground">
      <Check className="h-3 w-3 inline mr-1" />
      {children}
    </div>
  );
}

function TeachingSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 border-2 border-foreground/20 grid place-items-center shrink-0">{icon}</div>
        <h3 className="text-lg font-serif font-medium">{title}</h3>
      </div>
      <div className="mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed pl-[52px]">
        {children}
      </div>
    </div>
  );
}

function RelatedTool({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="group">
      <div className="h-full border border-border hover:bg-surface transition-colors p-6">
          <h3 className="font-semibold group-hover:underline">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground underline group-hover:gap-2 transition-all">
            Open <ArrowRight className="h-4 w-4" />
          </div>
      </div>
    </Link>
  );
}
