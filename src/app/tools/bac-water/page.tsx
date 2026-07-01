"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Beaker, Check, Droplets, HelpCircle, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PEPTIDES, recommendBacWaterMl } from "@/lib/calc";
import { cn } from "@/lib/utils";

type Unit = "mg" | "mcg";

export default function BacWaterCalculatorPage() {
  const [peptideSlug, setPeptideSlug] = useState("bpc-157");
  const peptide = PEPTIDES.find((p) => p.slug === peptideSlug) ?? PEPTIDES[0];

  const [vialInput, setVialInput] = useState<number>(peptide.commonVialStrengthsMg[0]);
  const [vialUnit, setVialUnit] = useState<Unit>("mg");
  const vialMg = vialUnit === "mg" ? vialInput : vialInput / 1000;

  const [doseInput, setDoseInput] = useState<number>(peptide.suggestedDoseMcg);
  const [doseUnit, setDoseUnit] = useState<Unit>("mcg");
  const doseMcg = doseUnit === "mcg" ? doseInput : doseInput * 1000;

  function handlePeptideChange(slug: string) {
    const p = PEPTIDES.find((x) => x.slug === slug) ?? PEPTIDES[0];
    setPeptideSlug(slug);
    setVialInput(p.commonVialStrengthsMg[0]);
    setVialUnit("mg");
    setDoseInput(p.suggestedDoseMcg);
    setDoseUnit("mcg");
  }

  const rec = useMemo(() => recommendBacWaterMl(vialMg, doseMcg), [vialMg, doseMcg]);
  const concentration = vialMg > 0 && rec > 0 ? vialMg / rec : 0;
  const doseMl = concentration > 0 ? (doseMcg / 1000) / concentration : 0;
  const syringeUnits = doseMl * 100;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <div className="max-w-3xl">
        <div className="eyebrow">Calculator</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          How much BAC water do I add?
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Tell us your peptide, vial size, and dose. We&apos;ll tell you exactly
          how much bacteriostatic water to add so your syringe math comes out clean
          and easy to measure.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-start">
        {/* Inputs — sticky on desktop */}
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
            <p className="mt-2 text-xs text-muted-foreground">
              We&apos;ll pre-fill your vial size and dose with common starting values.
            </p>
          </StepCard>

          <StepCard
            n={2}
            total={3}
            title="What size is your vial?"
            hint="This is the number printed on the vial label — it tells you how much peptide powder is inside."
          >
            <div className="flex flex-wrap gap-2">
              {peptide.commonVialStrengthsMg.map((mg) => (
                <button
                  key={mg}
                  type="button"
                  onClick={() => { setVialInput(mg); setVialUnit("mg"); }}
                  className={cn(
                    "rounded-full border px-4 h-10 text-sm font-medium transition-colors",
                    vialUnit === "mg" && vialInput === mg
                      ? "bg-brand text-brand-foreground border-brand"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {mg} mg
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
              <ConversionHint>{vialInput} mcg = {vialInput / 1000} mg</ConversionHint>
            ) : null}
          </StepCard>

          <StepCard
            n={3}
            total={3}
            title="How much per dose?"
            hint={`Typical range for ${peptide.name}: ${peptide.typicalDoseMcgRange[0]}–${peptide.typicalDoseMcgRange[1]} mcg. We pre-filled a common starting dose.`}
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="decimal"
                step="10"
                value={doseInput}
                onChange={(e) => setDoseInput(parseFloat(e.target.value) || 0)}
                className="flex-1"
              />
              <UnitToggle value={doseUnit} onChange={setDoseUnit} options={["mcg", "mg"]} />
            </div>
            {doseUnit === "mg" && doseInput > 0 ? (
              <ConversionHint>{doseInput} mg = {doseInput * 1000} mcg</ConversionHint>
            ) : null}
          </StepCard>
        </div>

        {/* Result + Teaching (right column) */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-7 sm:p-9">
              <div className="eyebrow">Your answer</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-serif font-medium tracking-tight text-brand-ink tabular-nums">
                  {rec}
                </span>
                <span className="text-2xl text-muted-foreground font-serif">mL</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Add <b>{rec} mL</b> of bacteriostatic water to your {vialMg} mg
                vial. This gives you clean, easy-to-measure doses on a standard
                insulin syringe.
              </p>

              <div className="rule my-6" />

              <div className="space-y-3 text-sm">
                <ResultRow label="Concentration after mixing" value={`${concentration.toFixed(2)} mg/mL`} />
                <ResultRow label="Each dose draws" value={`${doseMl.toFixed(3)} mL (${syringeUnits.toFixed(1)} units)`} />
                <ResultRow label="Doses per vial" value={`${Math.floor(vialMg / (doseMcg / 1000))}`} />
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
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="h-4 w-4 text-brand mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <b>Why this number?</b> We aim for about 10 units per dose on
                  a U-100 insulin syringe. That makes it easy to draw accurately
                  without squinting at tiny markings. The math:
                  (10 &times; {vialMg}) &divide; (100 &times; {(doseMcg / 1000).toFixed(3)}) = {rec} mL.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Teaching sections */}
          <div className="mt-6 space-y-8">
            <TeachingSection
              icon={<Droplets className="h-5 w-5 text-brand" />}
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
              icon={<Beaker className="h-5 w-5 text-brand" />}
              title="What does &ldquo;reconstitute&rdquo; mean?"
            >
              <p>
                Peptides arrive as a dry powder inside a sealed vial. Before you can
                measure and inject a dose, you need to dissolve the powder in liquid.
                That process is called <b>reconstitution</b>. You add BAC water to
                the vial, swirl gently, and the powder dissolves into a clear solution.
              </p>
            </TeachingSection>

            <TeachingSection
              icon={<HelpCircle className="h-5 w-5 text-brand" />}
              title="Why does the amount of water matter?"
            >
              <p>
                The amount of water you add determines the <b>concentration</b> of
                the solution — how much peptide is in each drop of liquid. More water
                means a weaker solution (you draw more liquid per dose). Less water
                means a stronger solution (you draw less per dose).
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
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="eyebrow">Step {n} &middot; of {total}</div>
      <h3 className="mt-2 text-xl font-serif font-medium leading-tight">{title}</h3>
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

function UnitToggle({ value, onChange, options }: { value: Unit; onChange: (u: Unit) => void; options: [Unit, Unit] }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-muted p-0.5 shrink-0">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-full px-3 h-8 text-xs font-semibold transition-colors",
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

function ConversionHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-ink">
      <Check className="h-3 w-3" />
      {children}
    </div>
  );
}

function TeachingSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-brand-soft grid place-items-center shrink-0">{icon}</div>
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
      <Card className="h-full hover:shadow-[var(--shadow-lift)] transition-shadow">
        <CardContent className="p-6">
          <h3 className="font-semibold group-hover:underline">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand group-hover:gap-2 transition-all">
            Open <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
