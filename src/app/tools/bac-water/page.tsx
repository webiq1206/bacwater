"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Beaker, Check, Droplets, HelpCircle, Lightbulb } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PEPTIDES, recommendBacWaterMl } from "@/lib/calc";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

type Unit = "mg" | "mcg";

export default function BacWaterCalculatorPage() {
  const [peptideSlug, setPeptideSlug] = useState("bpc-157");
  const peptide = PEPTIDES.find((p) => p.slug === peptideSlug) ?? PEPTIDES[0];

  const [vialInput, setVialInput] = useState<number>(peptide.commonVialStrengthsMg[0]);
  const [vialUnit, setVialUnit] = useState<Unit>("mg");
  const vialMg = vialUnit === "mg" ? vialInput : vialInput / 1000;

  const [doseInput, setDoseInput] = useState<number>(peptide.suggestedDoseMcg / 1000);
  const [doseUnit, setDoseUnit] = useState<Unit>("mg");
  const doseMcg = doseUnit === "mcg" ? doseInput : doseInput * 1000;

  function handlePeptideChange(slug: string) {
    const p = PEPTIDES.find((x) => x.slug === slug) ?? PEPTIDES[0];
    setPeptideSlug(slug);
    setVialInput(p.commonVialStrengthsMg[0]);
    setVialUnit("mg");
    setDoseInput(p.suggestedDoseMcg / 1000);
    setDoseUnit("mg");
  }

  const rec = useMemo(() => recommendBacWaterMl(vialMg, doseMcg), [vialMg, doseMcg]);
  const concentration = vialMg > 0 && rec > 0 ? vialMg / rec : 0;
  const doseMl = concentration > 0 ? (doseMcg / 1000) / concentration : 0;
  const syringeUnits = doseMl * 100;
  const dosesPerVial = doseMcg > 0 ? Math.floor(vialMg / (doseMcg / 1000)) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "BAC Water Calculator", href: "/tools/bac-water" },
      ]} />
      <div className="max-w-3xl">
        <div className="eyebrow">Calculator</div>
        <h1 className="mt-3 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          How much BAC water do I add?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Tell us your peptide, vial size, and dose. We&apos;ll tell you exactly
          how much bacteriostatic water to add so your syringe math comes out clean
          and easy to measure.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-start">
        {/* Inputs: sticky on desktop */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <StepCard n={1} total={3} title="Which peptide?">
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
            <div className="mt-3 bg-surface px-3 py-2 text-xs text-muted-foreground">
              We&apos;ll pre-fill your vial size and dose with common starting values for {peptide.name}.
            </div>
          </StepCard>

          <StepCard
            n={2}
            total={3}
            title="What size is your vial?"
            hint="Look at the number printed on your vial label — it tells you how much peptide powder is inside."
          >
            <div className="flex flex-wrap gap-2">
              {peptide.commonVialStrengthsMg.map((mg) => (
                <button
                  key={mg}
                  type="button"
                  onClick={() => { setVialInput(mg); setVialUnit("mg"); }}
                  className={cn(
                    "chip",
                    vialUnit === "mg" && vialInput === mg && "chip--active"
                  )}
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
            {vialUnit === "mcg" && vialInput > 0 ? (
              <div className="mt-2 bg-surface px-3 py-2 text-xs text-muted-foreground">
                <Check className="h-3 w-3 inline mr-1" />
                {vialInput.toLocaleString()} mcg = {(vialInput / 1000).toFixed(vialInput % 1000 === 0 ? 0 : 2)} mg
              </div>
            ) : null}
          </StepCard>

          <StepCard
            n={3}
            total={3}
            title="How much per dose?"
            hint={`Typical range for ${peptide.name}: ${peptide.typicalDoseMcgRange[0] / 1000}–${peptide.typicalDoseMcgRange[1] / 1000} mg (${peptide.typicalDoseMcgRange[0].toLocaleString()}–${peptide.typicalDoseMcgRange[1].toLocaleString()} mcg).`}
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={doseInput}
                onChange={(e) => setDoseInput(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <UnitToggle value={doseUnit} onChange={setDoseUnit} options={["mg", "mcg"]} />
            </div>
            {doseUnit === "mcg" && doseInput > 0 ? (
              <div className="mt-2 bg-surface px-3 py-2 text-xs text-muted-foreground">
                <Check className="h-3 w-3 inline mr-1" />
                {doseInput.toLocaleString()} mcg = {(doseInput / 1000)} mg
              </div>
            ) : null}
          </StepCard>
        </div>

        {/* Result + Teaching (right column) */}
        <div className="space-y-4">
          {/* Main result */}
          <div className="border border-border bg-card p-6 sm:p-8">
            <div className="eyebrow">Your answer</div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="result-hero">{rec}</span>
              <span className="text-2xl text-muted-foreground font-serif">mL</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Add <strong className="text-foreground">{rec} mL</strong> of
              bacteriostatic water to your {vialMg} mg vial. This gives you
              clean, easy-to-measure doses on a standard insulin syringe.
            </p>

            <div className="rule my-6" />

            <div className="space-y-3 text-sm">
              <ResultRow
                label="Concentration after mixing"
                value={`${concentration.toFixed(2)} mg/mL`}
                sub={`${(concentration * 1000).toFixed(0)} mcg/mL`}
              />
              <ResultRow
                label="Each dose draws"
                value={`${syringeUnits.toFixed(1)} units`}
                sub={`${doseMl.toFixed(3)} mL = ${doseMcg.toLocaleString()} mcg`}
              />
              <ResultRow
                label="Doses per vial"
                value={`${dosesPerVial}`}
              />
            </div>

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

          {/* Why this number */}
          <div className="callout-panel">
            <div className="flex items-start gap-2.5">
              <Lightbulb className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-sm mb-1">Why this number?</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We aim for about <strong className="text-foreground">10 units per dose</strong> on
                  a U-100 insulin syringe. That makes it easy to draw accurately
                  without squinting at tiny markings. The math:
                  (10 &times; {vialMg}) &divide; (100 &times; {(doseMcg / 1000).toFixed(3)}) = {rec} mL.
                </p>
              </div>
            </div>
          </div>

          {/* Teaching sections */}
          <div className="mt-6 space-y-8">
            <TeachingSection
              icon={<Droplets className="h-5 w-5" />}
              title="What is bacteriostatic water?"
            >
              <p>
                Bacteriostatic water (BAC water) is sterile water with a tiny amount
                of benzyl alcohol (0.9%) added. The benzyl alcohol prevents bacteria
                from growing, which means your reconstituted peptide stays safe to
                use for weeks instead of hours.
              </p>
              <p>
                You can&apos;t use tap water, bottled water, or regular sterile water.
                Only BAC water is designed for this purpose.
              </p>
            </TeachingSection>

            <TeachingSection
              icon={<Beaker className="h-5 w-5" />}
              title="What does &ldquo;reconstitute&rdquo; mean?"
            >
              <p>
                Peptides arrive as a dry powder inside a sealed vial. Before you can
                measure and inject a dose, you need to dissolve the powder in liquid.
                That process is called <strong>reconstitution</strong>. You add BAC water to
                the vial, swirl gently, and the powder dissolves into a clear solution.
              </p>
            </TeachingSection>

            <TeachingSection
              icon={<HelpCircle className="h-5 w-5" />}
              title="Why does the amount of water matter?"
            >
              <p>
                The amount of water you add determines the <strong>concentration</strong> of
                the solution — how much peptide is in each drop of liquid. More water
                means a weaker solution (you draw more per dose). Less water means a
                stronger solution (you draw less per dose).
              </p>
              <p>
                We pick an amount that makes each dose land on a round, easy-to-read
                number on your syringe. No squinting at tiny lines, no guessing
                between markings.
              </p>
            </TeachingSection>
          </div>

          {/* Related tools */}
          <div className="mt-6">
            <h2 className="text-xl font-serif font-medium tracking-tight">Related tools</h2>
            <div className="mt-3 grid gap-3">
              <RelatedTool href="/tools/dose" title="Dose Calculator" body="Know your concentration and volume? Find out exactly what dose you're getting." />
              <RelatedTool href="/tools/syringe-units" title="Syringe Unit Converter" body="Convert between mL and insulin syringe units (100 units = 1 mL)." />
              <RelatedTool href="/tools/supplies" title="Supply Calculator" body="Figure out how many vials, syringes, and prep pads you need for your cycle." />
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
        {sub && (
          <div className="text-xs text-muted-foreground">{sub}</div>
        )}
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
    <Link href={href} className="group block border border-border hover:bg-surface transition-colors p-5">
      <h3 className="font-semibold group-hover:underline">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
        Open <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
