"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Loader2,
  Save,
  Wand2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PEPTIDES, SYRINGES, calculate, recommendBacWaterMl, type CalcInput, type CalcResult, type SyringeType } from "@/lib/calc";
import { savePlanAction } from "@/lib/plan-actions";
import { PlanResults } from "@/components/plan/plan-results";
import { toast } from "@/components/ui/toaster";

type Mode = "beginner" | "advanced";

interface Props {
  mode: Mode;
}

const STEPS = [
  "peptide",
  "vial",
  "dose",
  "syringe",
  "bac",
  "date",
  "review",
] as const;

export function PlanForm({ mode }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);
  const [peptideSlug, setPeptideSlug] = useState<string>("bpc-157");
  const [customPeptideName, setCustomPeptideName] = useState("");
  const [vialStrengthMg, setVialStrengthMg] = useState<number>(5);
  const [doseMcg, setDoseMcg] = useState<number>(250);
  const [syringeType, setSyringeType] = useState<SyringeType>("insulin-1ml");
  const [useRecommendedBac, setUseRecommendedBac] = useState<boolean>(true);
  const [customBacMl, setCustomBacMl] = useState<number>(2);
  const [dateMixed, setDateMixed] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const peptide = PEPTIDES.find((p) => p.slug === peptideSlug) ?? PEPTIDES[0];

  const recommendedBac = useMemo(
    () => recommendBacWaterMl(vialStrengthMg, doseMcg),
    [vialStrengthMg, doseMcg]
  );

  const input: CalcInput = {
    peptideSlug,
    peptideName: peptideSlug === "custom" ? customPeptideName || "Custom peptide" : peptide.name,
    vialStrengthMg,
    doseMcg,
    bacWaterMl: useRecommendedBac ? undefined : customBacMl,
    syringeType,
    dateMixed: dateMixed || null,
  };

  const result: CalcResult = useMemo(() => calculate(input), [
    peptideSlug,
    customPeptideName,
    vialStrengthMg,
    doseMcg,
    syringeType,
    useRecommendedBac,
    customBacMl,
    dateMixed,
  ]);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        peptideSlug,
        peptideName: input.peptideName,
        vialStrengthMg,
        doseMcg,
        bacWaterMl: useRecommendedBac ? recommendedBac : customBacMl,
        syringeType,
        dateMixed: dateMixed || null,
        notes: notes || null,
      };
      const res = await savePlanAction(payload, notes);
      if (res.ok) {
        toast({ title: "Plan saved", description: "You can share the link or print the PDF.", variant: "success" });
        router.push(`/plan/${res.publicId}`);
      } else {
        toast({ title: "Could not save plan", description: (res as { error?: string }).error, variant: "destructive" });
      }
    } finally {
      setSaving(false);
    }
  }

  if (mode === "advanced") {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <Card>
          <CardContent className="p-6 sm:p-8 space-y-5">
            <div>
              <Label>Peptide</Label>
              <Select value={peptideSlug} onValueChange={setPeptideSlug}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PEPTIDES.map((p) => (
                    <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {peptideSlug === "custom" ? (
                <Input
                  className="mt-2"
                  placeholder="Custom peptide name"
                  value={customPeptideName}
                  onChange={(e) => setCustomPeptideName(e.target.value)}
                />
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vial strength (mg)</Label>
                <Input
                  className="mt-2"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={vialStrengthMg}
                  onChange={(e) => setVialStrengthMg(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Dose (mcg)</Label>
                <Input
                  className="mt-2"
                  type="number"
                  inputMode="numeric"
                  step="10"
                  value={doseMcg}
                  onChange={(e) => setDoseMcg(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div>
              <Label>Syringe type</Label>
              <Select value={syringeType} onValueChange={(v) => setSyringeType(v as SyringeType)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SYRINGES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label>BAC water (mL)</Label>
                <button
                  type="button"
                  onClick={() => setUseRecommendedBac((s) => !s)}
                  className="text-xs text-brand font-medium hover:underline"
                >
                  {useRecommendedBac ? "Use custom amount" : "Use recommended"}
                </button>
              </div>
              {useRecommendedBac ? (
                <div className="mt-2 rounded-2xl border border-border bg-muted/50 px-4 h-12 flex items-center justify-between">
                  <span>{recommendedBac} mL <span className="text-muted-foreground text-sm">recommended</span></span>
                  <Wand2 className="h-4 w-4 text-brand" />
                </div>
              ) : (
                <Input
                  className="mt-2"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={customBacMl}
                  onChange={(e) => setCustomBacMl(parseFloat(e.target.value) || 0)}
                />
              )}
            </div>

            <div>
              <Label>Date mixed (optional)</Label>
              <Input
                className="mt-2"
                type="date"
                value={dateMixed}
                onChange={(e) => setDateMixed(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Adding a date lets us calculate the expiration for you.
              </p>
            </div>

            <div>
              <Label>Notes (optional)</Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm"
                placeholder="Anything you want to remember about this plan."
              />
            </div>

            <div className="pt-2 flex gap-3">
              <Button onClick={handleSave} disabled={saving} variant="brand">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save plan
              </Button>
              <Button asChild variant="ghost">
                <Link href="/plan/new">Switch to beginner</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <PlanResults result={result} />
      </div>
    );
  }

  // Beginner: one question at a time.
  return (
    <div className="mx-auto max-w-2xl">
      <StepBar step={step} total={STEPS.length} />

      {step === 0 && (
        <StepCard
          title="Which peptide are you mixing?"
          hint="Pick from the list, or choose Other if it's not here."
          onNext={() => setStep(1)}
          onBack={null}
        >
          <Select value={peptideSlug} onValueChange={setPeptideSlug}>
            <SelectTrigger className="h-14 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PEPTIDES.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {peptideSlug === "custom" ? (
            <Input
              className="mt-3"
              placeholder="Type your peptide's name"
              value={customPeptideName}
              onChange={(e) => setCustomPeptideName(e.target.value)}
            />
          ) : null}
        </StepCard>
      )}

      {step === 1 && (
        <StepCard
          title="What is the vial strength?"
          hint={`Common strengths for ${peptide.name}: ${peptide.commonVialStrengthsMg.map((n) => `${n} mg`).join(", ")}. Check the label to be sure.`}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        >
          <div className="flex gap-2 flex-wrap">
            {peptide.commonVialStrengthsMg.map((mg) => (
              <button
                key={mg}
                type="button"
                onClick={() => setVialStrengthMg(mg)}
                className={
                  "rounded-full border px-4 h-10 text-sm font-medium transition-colors " +
                  (vialStrengthMg === mg
                    ? "bg-brand text-brand-foreground border-brand"
                    : "border-border hover:bg-muted")
                }
              >
                {mg} mg
              </button>
            ))}
          </div>
          <div className="mt-4">
            <Label>Or enter a custom strength</Label>
            <Input
              className="mt-2"
              type="number"
              inputMode="decimal"
              step="0.1"
              value={vialStrengthMg}
              onChange={(e) => setVialStrengthMg(parseFloat(e.target.value) || 0)}
            />
          </div>
        </StepCard>
      )}

      {step === 2 && (
        <StepCard
          title="What dose do you want per injection?"
          hint={`Typical research range for ${peptide.name}: ${peptide.typicalDoseMcgRange[0]}–${peptide.typicalDoseMcgRange[1]} mcg. We suggest ${peptide.suggestedDoseMcg} mcg as a starting point.`}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        >
          <div className="flex gap-2 flex-wrap">
            {[
              peptide.typicalDoseMcgRange[0],
              peptide.suggestedDoseMcg,
              peptide.typicalDoseMcgRange[1],
            ]
              .filter((v, i, a) => a.indexOf(v) === i)
              .map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setDoseMcg(v)}
                  className={
                    "rounded-full border px-4 h-10 text-sm font-medium transition-colors " +
                    (doseMcg === v
                      ? "bg-brand text-brand-foreground border-brand"
                      : "border-border hover:bg-muted")
                  }
                >
                  {v} mcg
                </button>
              ))}
          </div>
          <div className="mt-4">
            <Label>Or enter a custom dose (mcg)</Label>
            <Input
              className="mt-2"
              type="number"
              inputMode="numeric"
              step="10"
              value={doseMcg}
              onChange={(e) => setDoseMcg(parseFloat(e.target.value) || 0)}
            />
          </div>
        </StepCard>
      )}

      {step === 3 && (
        <StepCard
          title="Which syringe will you use?"
          hint="Insulin syringes are marked in units. A 1 mL insulin syringe has 100 units."
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        >
          <div className="grid gap-2">
            {SYRINGES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSyringeType(s.id)}
                className={
                  "text-left rounded-2xl border p-4 transition-colors " +
                  (syringeType === s.id
                    ? "border-brand bg-brand-soft/70"
                    : "border-border hover:bg-muted")
                }
              >
                <div className="font-medium">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.description}</div>
              </button>
            ))}
          </div>
        </StepCard>
      )}

      {step === 4 && (
        <StepCard
          title="BAC water amount"
          hint={`We recommend ${recommendedBac} mL to give you clean, round numbers on your syringe. You can override if you have a preferred amount.`}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        >
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => setUseRecommendedBac(true)}
              className={
                "text-left rounded-2xl border p-4 transition-colors " +
                (useRecommendedBac
                  ? "border-brand bg-brand-soft/70"
                  : "border-border hover:bg-muted")
              }
            >
              <div className="font-medium">Recommended: {recommendedBac} mL</div>
              <div className="text-xs text-muted-foreground mt-1">
                Chosen so your dose lands at a clean number on the syringe.
              </div>
            </button>
            <button
              type="button"
              onClick={() => setUseRecommendedBac(false)}
              className={
                "text-left rounded-2xl border p-4 transition-colors " +
                (!useRecommendedBac
                  ? "border-brand bg-brand-soft/70"
                  : "border-border hover:bg-muted")
              }
            >
              <div className="font-medium">Custom amount</div>
              <div className="text-xs text-muted-foreground mt-1">
                Pick your own BAC water volume.
              </div>
              {!useRecommendedBac ? (
                <Input
                  className="mt-3"
                  type="number"
                  step="0.1"
                  value={customBacMl}
                  onChange={(e) => setCustomBacMl(parseFloat(e.target.value) || 0)}
                />
              ) : null}
            </button>
          </div>
        </StepCard>
      )}

      {step === 5 && (
        <StepCard
          title="Date mixed (optional)"
          hint="Adding today's date lets us calculate the expiration for you."
          onNext={() => setStep(6)}
          onBack={() => setStep(4)}
        >
          <Input
            type="date"
            value={dateMixed}
            onChange={(e) => setDateMixed(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setDateMixed(new Date().toISOString().slice(0, 10))}
            className="mt-3 text-sm text-brand hover:underline"
          >
            Use today
          </button>
        </StepCard>
      )}

      {step === 6 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Your plan is ready.</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Review it below. Save it to get a permanent link, a PDF, and a
              printable vial label.
            </p>
          </div>
          <PlanResults result={result} />
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button variant="brand" size="lg" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save plan
            </Button>
            <Button variant="ghost" onClick={() => setStep(0)}>
              Start over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepCard({
  title,
  hint,
  children,
  onNext,
  onBack,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: (() => void) | null;
}) {
  return (
    <Card>
      <CardContent className="p-8">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {hint ? <p className="mt-2 text-sm text-muted-foreground">{hint}</p> : null}
        <div className="mt-6">{children}</div>
        <div className="mt-8 flex items-center justify-between">
          {onBack ? (
            <Button variant="ghost" onClick={onBack}>Back</Button>
          ) : <span />}
          <Button variant="brand" size="lg" onClick={onNext}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StepBar({ step, total }: { step: number; total: number }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="mb-6">
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-brand transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Step {Math.min(step + 1, total)} of {total}
      </div>
    </div>
  );
}
