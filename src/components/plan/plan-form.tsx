"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Info, Loader2, Save, X } from "lucide-react";
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
import {
  PEPTIDES,
  SYRINGES,
  calculate,
  recommendBacWaterMl,
  type CalcInput,
  type CalcResult,
  type SyringeType,
} from "@/lib/calc";
import { savePlanAction } from "@/lib/plan-actions";
import { PlanResults } from "@/components/plan/plan-results";
import { toast } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

type Mode = "beginner" | "advanced";
type Unit = "mg" | "mcg";

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

// ---------- small building blocks ----------

function StepEyebrow({ n, total }: { n: number; total: number }) {
  return (
    <div className="eyebrow">
      Step {n} <span className="opacity-40">·</span> of {total}
    </div>
  );
}

function ChipButton({
  active,
  onClick,
  children,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left rounded-lg border px-4 py-3 transition-colors",
        active
          ? "border-foreground bg-muted ring-1 ring-foreground/20"
          : "border-border hover:border-foreground/25 hover:bg-muted/40"
      )}
    >
      <div className="font-medium leading-tight">{children}</div>
      {hint ? (
        <div className="text-xs text-muted-foreground mt-1">{hint}</div>
      ) : null}
    </button>
  );
}

function StepBlock({
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
      <StepEyebrow n={n} total={total} />
      <h3 className="mt-2 text-xl font-serif font-medium leading-tight">
        {title}
      </h3>
      {hint ? (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {hint}
        </p>
      ) : null}
      <div className="mt-5">{children}</div>
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

function ConversionHint({
  value,
  unit,
  kind,
}: {
  value: number;
  unit: Unit;
  kind: "vial" | "dose";
}) {
  if (!value || !Number.isFinite(value)) return null;
  const inMcg = unit === "mcg" ? value : value * 1000;
  const inMg = unit === "mg" ? value : value / 1000;
  const otherLabel =
    unit === "mg"
      ? `${inMcg.toLocaleString()} mcg`
      : `${inMg.toLocaleString(undefined, { maximumFractionDigits: 4 })} mg`;
  return (
    <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
      <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-foreground" />
      <span>
        Same as <b className="text-foreground">{otherLabel}</b> — pick whichever
        your label uses. We&apos;ll do the conversion.
      </span>
    </div>
  );
}

// ---------- main ----------

export function PlanForm({ mode }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);

  const [peptideSlug, setPeptideSlug] = useState<string>("bpc-157");
  const [customPeptideName, setCustomPeptideName] = useState("");

  const [vialInput, setVialInput] = useState<number>(5);
  const [vialUnit, setVialUnit] = useState<Unit>("mg");
  const [showCustomVial, setShowCustomVial] = useState(false);

  const [doseInput, setDoseInput] = useState<number>(250);
  const [doseUnit, setDoseUnit] = useState<Unit>("mcg");
  const [showCustomDose, setShowCustomDose] = useState(false);

  const [syringeType, setSyringeType] = useState<SyringeType>("insulin-1ml");

  const [useRecommendedBac, setUseRecommendedBac] = useState<boolean>(true);
  const [customBacMl, setCustomBacMl] = useState<number>(2);

  const [dateMixed, setDateMixed] = useState<string>("");
  const [showDate, setShowDate] = useState<boolean>(false);

  // Blend
  const [showBlend, setShowBlend] = useState<boolean>(false);
  const [secondarySlug, setSecondarySlug] = useState<string>("cjc-1295-no-dac");
  const [customSecondaryName, setCustomSecondaryName] = useState("");
  const [secondaryVialInput, setSecondaryVialInput] = useState<number>(5);
  const [secondaryVialUnit, setSecondaryVialUnit] = useState<Unit>("mg");

  const [saving, setSaving] = useState(false);

  const peptide = PEPTIDES.find((p) => p.slug === peptideSlug) ?? PEPTIDES[0];
  const secondaryPeptide =
    PEPTIDES.find((p) => p.slug === secondarySlug) ?? PEPTIDES[0];

  const vialStrengthMg = vialUnit === "mg" ? vialInput : vialInput / 1000;
  const doseMcg = doseUnit === "mcg" ? doseInput : doseInput * 1000;
  const secondaryVialMg =
    secondaryVialUnit === "mg" ? secondaryVialInput : secondaryVialInput / 1000;

  const recommendedBac = useMemo(
    () => recommendBacWaterMl(vialStrengthMg, doseMcg),
    [vialStrengthMg, doseMcg]
  );

  const dosePresets = useMemo(() => {
    const [lo, hi] = peptide.typicalDoseMcgRange;
    const common = peptide.suggestedDoseMcg;
    const list: { mcg: number; label: string; hint: string }[] = [];
    if (lo && lo !== common)
      list.push({ mcg: lo, label: `${lo} mcg`, hint: "Light — good starting point" });
    list.push({
      mcg: common,
      label: `${common} mcg`,
      hint: "Common — most people start here",
    });
    if (hi && hi !== common)
      list.push({ mcg: hi, label: `${hi} mcg`, hint: "High end of typical range" });
    return list;
  }, [peptide]);

  const primaryName =
    peptideSlug === "custom"
      ? customPeptideName || "Custom peptide"
      : peptide.name;
  const secondaryName = showBlend
    ? secondarySlug === "custom"
      ? customSecondaryName || "Custom peptide"
      : secondaryPeptide.name
    : null;

  const input: CalcInput = {
    peptideSlug,
    peptideName: primaryName,
    vialStrengthMg,
    doseMcg,
    bacWaterMl: useRecommendedBac ? undefined : customBacMl,
    syringeType,
    dateMixed: dateMixed || null,
    secondary: showBlend
      ? {
          peptideSlug: secondarySlug,
          peptideName: secondaryName!,
          vialStrengthMg: secondaryVialMg,
        }
      : null,
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
    showBlend,
    secondarySlug,
    customSecondaryName,
    secondaryVialMg,
  ]);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        peptideSlug,
        peptideName: showBlend
          ? `${primaryName} + ${secondaryName}`
          : primaryName,
        vialStrengthMg,
        doseMcg,
        bacWaterMl: useRecommendedBac ? recommendedBac : customBacMl,
        syringeType,
        dateMixed: dateMixed || null,
        notes: null,
      };
      const res = await savePlanAction(payload, undefined);
      if (res.ok) {
        toast({
          title: "Plan saved",
          description: "You can share the link or print the PDF.",
          variant: "success",
        });
        router.push(`/plan/${res.publicId}`);
      } else {
        toast({
          title: "Could not save plan",
          description: (res as { error?: string }).error,
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  }

  // ---------- ADVANCED — beginner-friendly single-page guided flow ----------
  if (mode === "advanced") {
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-start">
        {/* Guided form — sticky on desktop */}
        <div className="lg:sticky lg:top-24 space-y-4">
          {/* 1. Peptide */}
          <StepBlock
            n={1}
            total={6}
            title="Which peptide are you mixing?"
            hint="Pick from the list. If yours isn't there, choose Other."
          >
            <Select value={peptideSlug} onValueChange={setPeptideSlug}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PEPTIDES.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {peptideSlug === "custom" ? (
              <div className="mt-3">
                <Label className="text-xs text-muted-foreground">
                  Type the name on your label
                </Label>
                <Input
                  className="mt-1"
                  placeholder="e.g., MyPeptide-500"
                  value={customPeptideName}
                  onChange={(e) => setCustomPeptideName(e.target.value)}
                />
              </div>
            ) : null}

            {!showBlend ? (
              <button
                type="button"
                onClick={() => setShowBlend(true)}
                className="mt-4 text-sm text-foreground font-medium hover:underline inline-flex items-center gap-1"
              >
                + Is this a blend? (e.g., Ipamorelin + CJC-1295)
              </button>
            ) : (
              <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    Second peptide in the same vial
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBlend(false)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Remove second peptide"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  A blend has two peptides mixed in one vial. Every draw
                  delivers both at once — we&apos;ll show you how much of each.
                </p>
                <div className="mt-3">
                  <Select value={secondarySlug} onValueChange={setSecondarySlug}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PEPTIDES.filter((p) => p.slug !== peptideSlug).map((p) => (
                        <SelectItem key={p.slug} value={p.slug}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {secondarySlug === "custom" ? (
                    <Input
                      className="mt-2"
                      placeholder="Name of the second peptide"
                      value={customSecondaryName}
                      onChange={(e) => setCustomSecondaryName(e.target.value)}
                    />
                  ) : null}
                </div>
                <div className="mt-3">
                  <Label className="text-xs">
                    How much of it is in the vial?
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={secondaryVialInput}
                      onChange={(e) =>
                        setSecondaryVialInput(parseFloat(e.target.value) || 0)
                      }
                      className="flex-1"
                    />
                    <UnitToggle
                      value={secondaryVialUnit}
                      onChange={setSecondaryVialUnit}
                      options={["mg", "mcg"]}
                    />
                  </div>
                  <ConversionHint
                    value={secondaryVialInput}
                    unit={secondaryVialUnit}
                    kind="vial"
                  />
                </div>
              </div>
            )}
          </StepBlock>

          {/* 2. Vial strength */}
          <StepBlock
            n={2}
            total={6}
            title="What size is your vial?"
            hint={`Common sizes for ${peptide.name}. Look at the number printed on the label.`}
          >
            <div className="flex flex-wrap gap-2">
              {peptide.commonVialStrengthsMg.map((mg) => (
                <ChipButton
                  key={mg}
                  active={!showCustomVial && vialStrengthMg === mg}
                  onClick={() => {
                    setShowCustomVial(false);
                    setVialInput(mg);
                    setVialUnit("mg");
                  }}
                >
                  {mg} mg
                </ChipButton>
              ))}
              <ChipButton
                active={showCustomVial}
                onClick={() => setShowCustomVial(true)}
              >
                Other size...
              </ChipButton>
            </div>
            {showCustomVial ? (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={vialInput}
                    onChange={(e) =>
                      setVialInput(parseFloat(e.target.value) || 0)
                    }
                    className="flex-1"
                    autoFocus
                    aria-label="Vial strength"
                  />
                  <UnitToggle
                    value={vialUnit}
                    onChange={setVialUnit}
                    options={["mg", "mcg"]}
                  />
                </div>
                <ConversionHint value={vialInput} unit={vialUnit} kind="vial" />
              </div>
            ) : null}
          </StepBlock>

          {/* 3. Dose */}
          <StepBlock
            n={3}
            total={6}
            title="How much do you want per injection?"
            hint={`Typical range: ${peptide.typicalDoseMcgRange[0]}–${peptide.typicalDoseMcgRange[1]} mcg.`}
          >
            <div className="grid gap-2">
              {dosePresets.map((d) => (
                <ChipButton
                  key={d.mcg}
                  active={!showCustomDose && doseMcg === d.mcg}
                  onClick={() => {
                    setShowCustomDose(false);
                    setDoseInput(d.mcg);
                    setDoseUnit("mcg");
                  }}
                  hint={d.hint}
                >
                  {d.label}
                </ChipButton>
              ))}
              <ChipButton
                active={showCustomDose}
                onClick={() => setShowCustomDose(true)}
              >
                Custom dose...
              </ChipButton>
            </div>
            {showCustomDose ? (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    inputMode="numeric"
                    step="10"
                    value={doseInput}
                    onChange={(e) =>
                      setDoseInput(parseFloat(e.target.value) || 0)
                    }
                    className="flex-1"
                    autoFocus
                    aria-label="Dose amount"
                  />
                  <UnitToggle
                    value={doseUnit}
                    onChange={setDoseUnit}
                    options={["mcg", "mg"]}
                  />
                </div>
                <ConversionHint value={doseInput} unit={doseUnit} kind="dose" />
              </div>
            ) : null}
          </StepBlock>

          {/* 4. Syringe */}
          <StepBlock
            n={4}
            total={6}
            title="Which syringe are you using?"
            hint="A 1 mL insulin syringe works for almost everyone. Not sure? Stick with the default."
          >
            <Select
              value={syringeType}
              onValueChange={(v) => setSyringeType(v as SyringeType)}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SYRINGES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Insulin syringes are marked in <b>units</b>. 100 units = 1 mL,
              so 10 units = 0.1 mL. We&apos;ll tell you exactly how many units
              to draw.
            </p>
          </StepBlock>

          {/* 5. BAC water */}
          <StepBlock
            n={5}
            total={6}
            title="How much BAC water to add?"
            hint="BAC water is the sterile liquid that dissolves the powder. More water = larger, easier draws."
          >
            <div className="grid gap-2">
              <ChipButton
                active={useRecommendedBac}
                onClick={() => setUseRecommendedBac(true)}
                hint="Chosen to give clean, round numbers on your syringe."
              >
                {recommendedBac} mL — recommended
              </ChipButton>
              <ChipButton
                active={!useRecommendedBac}
                onClick={() => setUseRecommendedBac(false)}
                hint="Pick your own amount."
              >
                Custom amount
              </ChipButton>
            </div>
            {!useRecommendedBac ? (
              <div className="mt-4 flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  value={customBacMl}
                  onChange={(e) =>
                    setCustomBacMl(parseFloat(e.target.value) || 0)
                  }
                  className="flex-1"
                  autoFocus
                />
                <div className="text-sm text-muted-foreground">mL</div>
              </div>
            ) : null}
          </StepBlock>

          {/* 6. Date (optional) */}
          <StepBlock
            n={6}
            total={6}
            title="When did you (or will you) mix it?"
            hint="Optional — lets us calculate when the vial expires."
          >
            {!showDate ? (
              <button
                type="button"
                onClick={() => {
                  setShowDate(true);
                  setDateMixed(new Date().toISOString().slice(0, 10));
                }}
                className="text-sm text-foreground font-medium hover:underline"
              >
                + Add today&apos;s date
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={dateMixed}
                  onChange={(e) => setDateMixed(e.target.value)}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowDate(false);
                    setDateMixed("");
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground px-2"
                >
                  Skip
                </button>
              </div>
            )}
          </StepBlock>

          <div className="pt-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="brand"
              size="lg"
              className="w-full"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save my plan
            </Button>
            <p className="mt-3 text-xs text-muted-foreground text-center">
              You&apos;ll get a shareable link, a PDF, printable vial labels,
              and a one-click supply cart.
            </p>
          </div>
        </div>

        {/* Live results */}
        <div>
          <PlanResults result={result} />
        </div>
      </div>
    );
  }

  // ---------- BEGINNER — one question at a time ----------
  return (
    <div className="mx-auto max-w-2xl">
      <StepBar step={step} total={STEPS.length} />

      {step === 0 && (
        <StepPanel
          title="Which peptide are you mixing?"
          hint="Pick from the list, or choose Other if it's not there."
          onNext={() => setStep(1)}
          onBack={null}
        >
          <Select value={peptideSlug} onValueChange={setPeptideSlug}>
            <SelectTrigger className="h-14 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PEPTIDES.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>
                  {p.name}
                </SelectItem>
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
        </StepPanel>
      )}

      {step === 1 && (
        <StepPanel
          title="What size is your vial?"
          hint={`Look at your label. Common sizes for ${peptide.name}:`}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        >
          <div className="flex flex-wrap gap-2">
            {peptide.commonVialStrengthsMg.map((mg) => (
              <button
                key={mg}
                type="button"
                onClick={() => {
                  setVialInput(mg);
                  setVialUnit("mg");
                  setShowCustomVial(false);
                }}
                className={cn(
                  "rounded-full border px-4 h-10 text-sm font-medium transition-colors",
                  !showCustomVial && vialStrengthMg === mg
                    ? "bg-foreground text-white border-foreground"
                    : "border-border hover:bg-muted"
                )}
              >
                {mg} mg
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowCustomVial(true)}
              className={cn(
                "rounded-full border px-4 h-10 text-sm font-medium transition-colors",
                showCustomVial
                  ? "bg-foreground text-white border-foreground"
                  : "border-border hover:bg-muted"
              )}
            >
              Other size
            </button>
          </div>
          {showCustomVial ? (
            <div className="mt-4">
              <Label>Enter what&apos;s on your label</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  value={vialInput}
                  onChange={(e) => setVialInput(parseFloat(e.target.value) || 0)}
                  className="flex-1"
                />
                <UnitToggle
                  value={vialUnit}
                  onChange={setVialUnit}
                  options={["mg", "mcg"]}
                />
              </div>
              <ConversionHint value={vialInput} unit={vialUnit} kind="vial" />
            </div>
          ) : null}
        </StepPanel>
      )}

      {step === 2 && (
        <StepPanel
          title="How much do you want per injection?"
          hint={`Typical range for ${peptide.name}: ${peptide.typicalDoseMcgRange[0]}–${peptide.typicalDoseMcgRange[1]} mcg. Not sure? Pick "Common".`}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        >
          <div className="grid gap-2">
            {dosePresets.map((d) => (
              <button
                key={d.mcg}
                type="button"
                onClick={() => {
                  setDoseInput(d.mcg);
                  setDoseUnit("mcg");
                  setShowCustomDose(false);
                }}
                className={cn(
                  "text-left rounded-lg border px-4 py-3 transition-colors",
                  !showCustomDose && doseMcg === d.mcg
                    ? "border-foreground bg-muted ring-1 ring-foreground/20"
                    : "border-border hover:bg-muted"
                )}
              >
                <div className="font-medium">{d.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {d.hint}
                </div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowCustomDose(true)}
              className={cn(
                "text-left rounded-lg border px-4 py-3 transition-colors",
                showCustomDose
                  ? "border-foreground bg-muted ring-1 ring-foreground/20"
                  : "border-border hover:bg-muted"
              )}
            >
              <div className="font-medium">Custom dose</div>
            </button>
          </div>
          {showCustomDose ? (
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="10"
                  value={doseInput}
                  onChange={(e) => setDoseInput(parseFloat(e.target.value) || 0)}
                  className="flex-1"
                />
                <UnitToggle
                  value={doseUnit}
                  onChange={setDoseUnit}
                  options={["mcg", "mg"]}
                />
              </div>
              <ConversionHint value={doseInput} unit={doseUnit} kind="dose" />
            </div>
          ) : null}
        </StepPanel>
      )}

      {step === 3 && (
        <StepPanel
          title="Which syringe are you using?"
          hint="A 1 mL insulin syringe fits almost every dose."
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        >
          <div className="grid gap-2">
            {SYRINGES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSyringeType(s.id)}
                className={cn(
                  "text-left rounded-lg border p-4 transition-colors",
                  syringeType === s.id
                    ? "border-foreground bg-muted ring-1 ring-foreground/20"
                    : "border-border hover:bg-muted"
                )}
              >
                <div className="font-medium">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {s.description}
                </div>
              </button>
            ))}
          </div>
        </StepPanel>
      )}

      {step === 4 && (
        <StepPanel
          title="How much BAC water to add?"
          hint={`We recommend ${recommendedBac} mL — it gives you clean numbers when drawing.`}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        >
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => setUseRecommendedBac(true)}
              className={cn(
                "text-left rounded-lg border p-4 transition-colors",
                useRecommendedBac
                  ? "border-foreground bg-muted ring-1 ring-foreground/20"
                  : "border-border hover:bg-muted"
              )}
            >
              <div className="font-medium">
                Recommended: {recommendedBac} mL
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Gives you clean, round syringe numbers.
              </div>
            </button>
            <button
              type="button"
              onClick={() => setUseRecommendedBac(false)}
              className={cn(
                "text-left rounded-lg border p-4 transition-colors",
                !useRecommendedBac
                  ? "border-foreground bg-muted ring-1 ring-foreground/20"
                  : "border-border hover:bg-muted"
              )}
            >
              <div className="font-medium">I want to pick my own amount</div>
              {!useRecommendedBac ? (
                <div className="mt-3 flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    value={customBacMl}
                    onChange={(e) =>
                      setCustomBacMl(parseFloat(e.target.value) || 0)
                    }
                  />
                  <span className="text-sm text-muted-foreground">mL</span>
                </div>
              ) : null}
            </button>
          </div>
        </StepPanel>
      )}

      {step === 5 && (
        <StepPanel
          title="When did you mix it? (optional)"
          hint="Today's date lets us calculate when the vial expires."
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
            onClick={() =>
              setDateMixed(new Date().toISOString().slice(0, 10))
            }
            className="mt-3 text-sm text-foreground hover:underline"
          >
            Use today&apos;s date
          </button>
        </StepPanel>
      )}

      {step === 6 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-serif font-medium tracking-tight">
              Your plan is ready.
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Review it below. Save it to get a permanent link, a PDF, and
              printable vial labels.
            </p>
          </div>
          <PlanResults result={result} />
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button
              variant="brand"
              size="lg"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save my plan
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

function StepPanel({
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
      <CardContent className="p-7 sm:p-9">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          {title}
        </h2>
        {hint ? (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {hint}
          </p>
        ) : null}
        <div className="mt-6">{children}</div>
        <div className="mt-8 flex items-center justify-between">
          {onBack ? (
            <Button variant="ghost" onClick={onBack}>
              Back
            </Button>
          ) : (
            <span />
          )}
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
          className="h-full bg-foreground transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        Step {Math.min(step + 1, total)} of {total}
      </div>
    </div>
  );
}
