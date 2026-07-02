"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Info,
  Lightbulb,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  "date",
  "review",
] as const;

// ---------- building blocks ----------

function StepNumber({ n, filled }: { n: number; filled?: boolean }) {
  return (
    <span className={cn("step-number", filled && "step-number--filled")}>
      {n}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow mb-1">{children}</div>
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
      className={cn("chip", active && "chip--active")}
    >
      <div className="flex items-center gap-2">
        {active && <Check className="h-4 w-4 shrink-0" />}
        <span className="font-medium leading-tight">{children}</span>
      </div>
      {hint ? (
        <div className={cn("text-xs text-muted-foreground mt-1", active && "ml-6")}>
          {hint}
        </div>
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
    <div className="border border-border bg-card p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <StepNumber n={n} filled />
        <SectionLabel>Step {n} of {total}</SectionLabel>
      </div>
      <h3 className="mt-3 text-xl font-serif font-medium leading-tight">
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

function ConversionHint({
  value,
  unit,
}: {
  value: number;
  unit: Unit;
}) {
  if (!value || !Number.isFinite(value)) return null;
  const inMcg = unit === "mcg" ? value : value * 1000;
  const inMg = unit === "mg" ? value : value / 1000;
  const otherLabel =
    unit === "mg"
      ? `${inMcg.toLocaleString()} mcg`
      : `${inMg.toLocaleString(undefined, { maximumFractionDigits: 4 })} mg`;
  return (
    <div className="mt-2 flex items-start gap-2 text-xs bg-surface px-3 py-2">
      <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
      <span className="text-muted-foreground">
        Same as <b className="text-foreground">{otherLabel}</b>
      </span>
    </div>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div className="flex items-center gap-1 border border-border bg-muted p-1">
      <button
        type="button"
        onClick={() => onChange("beginner")}
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors",
          mode === "beginner"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Guided wizard
      </button>
      <button
        type="button"
        onClick={() => onChange("advanced")}
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors",
          mode === "advanced"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        All at once
      </button>
    </div>
  );
}

// ---------- main ----------

export function PlanForm({ mode: initialMode }: Props) {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>(initialMode);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [step, setStep] = useState<number>(0);
  const stepContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top of wizard step on step change
  const scrollToStep = useCallback(() => {
    requestAnimationFrame(() => {
      if (stepContainerRef.current) {
        const y =
          stepContainerRef.current.getBoundingClientRect().top +
          window.scrollY -
          80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  }, []);

  function goToStep(n: number) {
    setStep(n);
    scrollToStep();
  }

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
  const [editingSyringe, setEditingSyringe] = useState(false);
  const [editingBac, setEditingBac] = useState(false);

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
    const fmtLabel = (mcg: number) => {
      const mg = mcg / 1000;
      const mgStr = mg >= 1 ? `${mg} mg` : `${mg.toFixed(mg % 0.1 === 0 ? 1 : 2)} mg`;
      return `${mgStr} (${mcg.toLocaleString()} mcg)`;
    };
    const list: { mcg: number; label: string; hint: string }[] = [];
    if (lo && lo !== common)
      list.push({
        mcg: lo,
        label: fmtLabel(lo),
        hint: "Lower end, good starting point",
      });
    list.push({
      mcg: common,
      label: fmtLabel(common),
      hint: "Most common, recommended starting dose",
    });
    if (hi && hi !== common)
      list.push({
        mcg: hi,
        label: fmtLabel(hi),
        hint: "Upper end of typical range",
      });
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

  const result: CalcResult = useMemo(
    () => calculate(input),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
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
    ]
  );

  const syringe = SYRINGES.find((s) => s.id === syringeType) ?? SYRINGES[2];

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

  // Build a quick summary line for the wizard review step
  const quickSummaryLines = [
    { label: "Peptide", value: primaryName },
    { label: "Vial", value: `${vialStrengthMg} mg` },
    {
      label: "Dose",
      value: `${(doseMcg / 1000).toFixed(doseMcg % 1000 === 0 ? 0 : 2)} mg (${doseMcg.toLocaleString()} mcg)`,
    },
    { label: "Syringe", value: syringe.label },
    {
      label: "BAC water",
      value: useRecommendedBac
        ? `${recommendedBac} mL (recommended)`
        : `${customBacMl} mL (custom)`,
    },
    {
      label: "Mixed",
      value: dateMixed
        ? new Date(dateMixed + "T12:00:00").toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Not set",
    },
  ];

  // ---------- ADVANCED: all-at-once side-by-side ----------
  if (mode === "advanced") {
    return (
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          {hasMounted && (
            <ModeToggle mode={mode} onChange={setMode} />
          )}
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-start">
          {/* Form: sticky on desktop */}
          <div className="lg:sticky lg:top-24 space-y-4">
            {/* 1. Peptide */}
            <StepBlock
              n={1}
              total={6}
              title="Which peptide are you mixing?"
              hint="Pick from the list, or choose &ldquo;Other&rdquo; if yours isn't shown."
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
                <div className="mt-4 border-2 border-border bg-surface p-4">
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
                    A blend has two peptides in one vial. Every draw delivers both.
                  </p>
                  <div className="mt-3">
                    <Select
                      value={secondarySlug}
                      onValueChange={setSecondarySlug}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PEPTIDES.filter((p) => p.slug !== peptideSlug).map(
                          (p) => (
                            <SelectItem key={p.slug} value={p.slug}>
                              {p.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    {secondarySlug === "custom" ? (
                      <Input
                        className="mt-2"
                        aria-label="Name of the second peptide"
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
                          setSecondaryVialInput(
                            parseFloat(e.target.value) || 0
                          )
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
              hint={`Look at your label for a number like "5 mg." Common sizes for ${peptide.name}:`}
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
                  onClick={() => { setShowCustomVial(true); setVialInput(0); }}
                >
                  Other size...
                </ChipButton>
              </div>
              {showCustomVial ? (
                <div className="mt-4">
                  <Label className="text-xs text-muted-foreground">
                    Enter what&apos;s on your label
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={vialInput || ""}
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
                  <ConversionHint value={vialInput} unit={vialUnit} />
                </div>
              ) : null}
            </StepBlock>

            {/* 3. Dose */}
            <StepBlock
              n={3}
              total={6}
              title="How much per injection?"
              hint={`Typical range for ${peptide.name}: ${peptide.typicalDoseMcgRange[0] / 1000} to ${peptide.typicalDoseMcgRange[1] / 1000} mg (${peptide.typicalDoseMcgRange[0].toLocaleString()} to ${peptide.typicalDoseMcgRange[1].toLocaleString()} mcg).`}
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
                  <Label className="text-xs text-muted-foreground">
                    Enter your dose
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      type="number"
                      inputMode="numeric"
                      step="10"
                      value={doseInput || ""}
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
                      options={["mg", "mcg"]}
                    />
                  </div>
                  <ConversionHint value={doseInput} unit={doseUnit} />
                </div>
              ) : null}
            </StepBlock>

            {/* 4. Syringe */}
            <StepBlock
              n={4}
              total={6}
              title="Which syringe are you using?"
              hint="Not sure? A 1 mL insulin syringe works for almost everyone."
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
              <div className="mt-3 bg-surface px-3 py-2 text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Quick tip:</strong> Insulin
                syringes are marked in <b>units</b>. 100 units = 1 mL,
                so 10 units = 0.1 mL. We&apos;ll tell you exactly how many
                units to draw.
              </div>
            </StepBlock>

            {/* 5. BAC water */}
            <StepBlock
              n={5}
              total={6}
              title="How much BAC water to add?"
              hint="BAC water is the sterile liquid that dissolves the powder. More water = larger, easier-to-measure draws."
            >
              <div className="grid gap-2">
                <ChipButton
                  active={useRecommendedBac}
                  onClick={() => setUseRecommendedBac(true)}
                  hint="Chosen to give clean, round numbers on your syringe."
                >
                  {recommendedBac} mL (recommended)
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
                <div className="mt-4">
                  <Label className="text-xs text-muted-foreground">
                    BAC water amount
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
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
                    <div className="text-sm text-muted-foreground font-medium">
                      mL
                    </div>
                  </div>
                </div>
              ) : null}
            </StepBlock>

            {/* 6. Date (optional) */}
            <StepBlock
              n={6}
              total={6}
              title="When did you (or will you) mix it?"
              hint="Optional. Lets us calculate when the vial expires so you know when to discard it."
            >
              {!showDate ? (
                <button
                  type="button"
                  onClick={() => setShowDate(true)}
                  className="text-sm text-foreground font-medium hover:underline"
                >
                  + Set the mix date
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
                    onClick={() =>
                      setDateMixed(new Date().toISOString().slice(0, 10))
                    }
                    className="text-xs font-medium hover:underline whitespace-nowrap px-1"
                    style={{ color: "var(--color-accent-guide)" }}
                  >
                    Today
                  </button>
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
                Saves your plan with a shareable link, downloadable PDF,
                and printable vial labels.
              </p>
            </div>
          </div>

          {/* Live results */}
          <div>
            <PlanResults result={result} />
          </div>
        </div>
      </div>
    );
  }

  // ---------- BEGINNER: one question at a time ----------
  return (
    <div className="mx-auto max-w-2xl" ref={stepContainerRef}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {hasMounted && (
          <ModeToggle mode={mode} onChange={setMode} />
        )}
      </div>

      <StepBar step={step} total={STEPS.length} />
      <WizardContext
        step={step}
        peptideName={primaryName}
        vialMg={vialStrengthMg}
        doseMcg={doseMcg}
      />

      {step === 0 && (
        <StepPanel
          title="Which peptide are you mixing?"
          hint="Pick the peptide from the list. If it's not there, choose &ldquo;Other.&rdquo;"
          onNext={() => goToStep(1)}
          onBack={null}
          stepNum={1}
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
              aria-label="Custom peptide name"
              placeholder="Type your peptide's name"
              value={customPeptideName}
              onChange={(e) => setCustomPeptideName(e.target.value)}
            />
          ) : (
            <div className="mt-4 bg-surface px-4 py-3 text-sm text-muted-foreground">
              <strong className="text-foreground">{peptide.name}</strong>
              {". "}Typical dose: {peptide.typicalDoseMcgRange[0] / 1000} to {peptide.typicalDoseMcgRange[1] / 1000} mg ({peptide.typicalDoseMcgRange[0].toLocaleString()} to {peptide.typicalDoseMcgRange[1].toLocaleString()} mcg).
              Common vial sizes: {peptide.commonVialStrengthsMg.join(", ")} mg.
            </div>
          )}
        </StepPanel>
      )}

      {step === 1 && (
        <StepPanel
          title="What size is your vial?"
          hint={`This is the number on your vial label. Common sizes for ${peptide.name}:`}
          onNext={() => goToStep(2)}
          onBack={() => goToStep(0)}
          stepNum={2}
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
                  "chip",
                  !showCustomVial && vialStrengthMg === mg && "chip--active"
                )}
              >
                <div className="flex items-center gap-2 font-medium">
                  {!showCustomVial && vialStrengthMg === mg && (
                    <Check className="h-4 w-4" />
                  )}
                  {mg} mg
                </div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setShowCustomVial(true); setVialInput(0); }}
              className={cn("chip", showCustomVial && "chip--active")}
            >
              <span className="font-medium">Other size</span>
            </button>
          </div>
          {showCustomVial ? (
            <div className="mt-4">
              <Label className="text-xs text-muted-foreground">
                Enter what&apos;s on your label
              </Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  type="number"
                  step="0.1"
                  value={vialInput || ""}
                  onChange={(e) =>
                    setVialInput(parseFloat(e.target.value) || 0)
                  }
                  className="flex-1"
                />
                <UnitToggle
                  value={vialUnit}
                  onChange={setVialUnit}
                  options={["mg", "mcg"]}
                />
              </div>
              <ConversionHint value={vialInput} unit={vialUnit} />
            </div>
          ) : null}
        </StepPanel>
      )}

      {step === 2 && (
        <StepPanel
          title="How much per injection?"
          hint={`Typical range for ${peptide.name}: ${peptide.typicalDoseMcgRange[0] / 1000} to ${peptide.typicalDoseMcgRange[1] / 1000} mg (${peptide.typicalDoseMcgRange[0].toLocaleString()} to ${peptide.typicalDoseMcgRange[1].toLocaleString()} mcg). Not sure? Pick the most common dose.`}
          onNext={() => goToStep(3)}
          onBack={() => goToStep(1)}
          stepNum={3}
        >
          <div className="grid gap-2">
            {dosePresets.map((d) => (
              <ChipButton
                key={d.mcg}
                active={!showCustomDose && doseMcg === d.mcg}
                onClick={() => {
                  setDoseInput(d.mcg);
                  setDoseUnit("mcg");
                  setShowCustomDose(false);
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
              Custom dose
            </ChipButton>
          </div>
          {showCustomDose ? (
            <div className="mt-4">
              <Label className="text-xs text-muted-foreground">
                Enter your dose
              </Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  type="number"
                  step="10"
                  value={doseInput}
                  onChange={(e) =>
                    setDoseInput(parseFloat(e.target.value) || 0)
                  }
                  className="flex-1"
                />
                <UnitToggle
                  value={doseUnit}
                  onChange={setDoseUnit}
                  options={["mg", "mcg"]}
                />
              </div>
              <ConversionHint value={doseInput} unit={doseUnit} />
            </div>
          ) : null}
        </StepPanel>
      )}

      {step === 3 && (
        <StepPanel
          title="When did you mix it?"
          hint="Pick the day you added BAC water, or the day you plan to. This sets your discard date. We won't guess this one for you."
          onNext={() => goToStep(4)}
          onBack={() => goToStep(2)}
          stepNum={4}
          nextDisabled={!dateMixed}
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <Input
              type="date"
              value={dateMixed}
              onChange={(e) => setDateMixed(e.target.value)}
              className="flex-1 h-14 text-base"
            />
            <button
              type="button"
              onClick={() =>
                setDateMixed(new Date().toISOString().slice(0, 10))
              }
              className="inline-flex items-center justify-center border border-border px-5 h-14 text-sm font-medium hover:bg-surface whitespace-nowrap"
              style={{ color: "var(--color-accent-guide)" }}
            >
              I mixed it today
            </button>
          </div>
          {dateMixed ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Mixed{" "}
              {new Date(dateMixed + "T12:00:00").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
              . We&apos;ll count your shelf life from this date.
            </p>
          ) : (
            <p
              className="mt-4 text-sm font-medium"
              style={{ color: "var(--color-accent-guide)" }}
            >
              Choose a date to continue.
            </p>
          )}
        </StepPanel>
      )}

      {step === 4 && (
        <div className="space-y-8">
          {/* Review header */}
          <div className="text-center">
            <div className="eyebrow">Your plan is ready</div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
              Here&apos;s your reconstitution plan.
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
              Everything below is calculated from your inputs. Review it, then
              save to get a permanent link, a downloadable PDF, and printable
              vial labels.
            </p>
          </div>

          {/* Quick config summary */}
          <div className="border-2 border-foreground bg-surface p-5 sm:p-6">
            <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-4">
              Your selections
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {quickSummaryLines.map((line) => (
                <div key={line.label} className="flex flex-col">
                  <dt className="text-xs text-muted-foreground">{line.label}</dt>
                  <dd className="font-medium mt-0.5">{line.value}</dd>
                </div>
              ))}
            </dl>
            <button
              type="button"
              onClick={() => goToStep(0)}
              className="mt-4 text-sm text-foreground font-medium hover:underline inline-flex items-center gap-1"
            >
              Change something <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Smart defaults - auto-inferred settings */}
          <div className="callout-panel">
            <div className="flex items-center gap-2.5 mb-3">
              <Lightbulb className="h-5 w-5" style={{ color: "var(--color-accent-guide)" }} />
              <h4 className="text-sm font-semibold">We handled these for you</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Based on your inputs, we automatically set these values. Already
              have syringes or BAC water on hand? Tap{" "}
              <span className="font-medium" style={{ color: "var(--color-accent-guide)" }}>
                Change
              </span>{" "}
              to match what you&apos;ve got.
            </p>
            <div className="space-y-3">
              <SmartDefault
                label="Syringe"
                value={syringe.label}
                reason="Works for virtually every peptide dose. Most common choice."
                editing={editingSyringe}
                onToggle={() => setEditingSyringe(!editingSyringe)}
              >
                <div className="grid gap-2">
                  {SYRINGES.map((s) => (
                    <ChipButton
                      key={s.id}
                      active={syringeType === s.id}
                      onClick={() => { setSyringeType(s.id); setEditingSyringe(false); }}
                      hint={s.description}
                    >
                      {s.label}
                    </ChipButton>
                  ))}
                </div>
              </SmartDefault>
              <SmartDefault
                label="BAC water"
                value={useRecommendedBac ? `${recommendedBac} mL (recommended)` : `${customBacMl} mL (custom)`}
                reason="Chosen to give clean, easy-to-read syringe numbers."
                editing={editingBac}
                onToggle={() => setEditingBac(!editingBac)}
              >
                <div className="grid gap-2">
                  <ChipButton
                    active={useRecommendedBac}
                    onClick={() => { setUseRecommendedBac(true); setEditingBac(false); }}
                    hint="Gives you clean, round syringe numbers."
                  >
                    {recommendedBac} mL (recommended)
                  </ChipButton>
                  <ChipButton
                    active={!useRecommendedBac}
                    onClick={() => setUseRecommendedBac(false)}
                    hint="Pick your own amount."
                  >
                    Custom amount
                  </ChipButton>
                  {!useRecommendedBac && (
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={customBacMl}
                        onChange={(e) => setCustomBacMl(parseFloat(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground font-medium">mL</span>
                    </div>
                  )}
                </div>
              </SmartDefault>
            </div>
          </div>

          <PlanResults result={result} />

          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="brand"
              size="xl"
              onClick={handleSave}
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save my plan
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Saves your plan with a shareable link, downloadable PDF,
              and printable vial labels.
            </p>
            <Button
              variant="ghost"
              onClick={() => goToStep(0)}
              className="mx-auto"
            >
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
  stepNum,
  nextDisabled = false,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack: (() => void) | null;
  stepNum: number;
  nextDisabled?: boolean;
}) {
  return (
    <div className="border border-border bg-card">
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-3">
          <StepNumber n={stepNum} filled />
          <SectionLabel>Question {stepNum}</SectionLabel>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          {title}
        </h2>
        {hint ? (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {hint}
          </p>
        ) : null}
        <div className="mt-6">{children}</div>
      </div>
      <div className="flex items-center justify-between border-t border-border px-6 py-4 sm:px-8 bg-surface/50">
        {onBack ? (
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        ) : (
          <span />
        )}
        <Button
          variant="brand"
          size="lg"
          onClick={onNext}
          disabled={nextDisabled}
        >
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function StepBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 transition-all",
              i <= step ? "bg-foreground" : "bg-muted"
            )}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Step {Math.min(step + 1, total)} of {total}
        </span>
        {step === total - 1 && (
          <span className="font-medium text-foreground">Review</span>
        )}
      </div>
    </div>
  );
}

function SmartDefault({
  label,
  value,
  reason,
  editing,
  onToggle,
  children,
}: {
  label: string;
  value: string;
  reason: string;
  editing: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border bg-card p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-sm font-medium mt-0.5">{value}</div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="text-xs font-medium hover:underline shrink-0"
          style={{ color: "var(--color-accent-guide)" }}
        >
          {editing ? "Done" : "Change"}
        </button>
      </div>
      {!editing && (
        <div className="text-xs text-muted-foreground mt-1">{reason}</div>
      )}
      {editing && <div className="mt-3">{children}</div>}
    </div>
  );
}

function WizardContext({
  step,
  peptideName,
  vialMg,
  doseMcg,
}: {
  step: number;
  peptideName: string;
  vialMg: number;
  doseMcg: number;
}) {
  const items: { label: string; value: string }[] = [];
  if (step >= 1) items.push({ label: "Peptide", value: peptideName });
  if (step >= 2) items.push({ label: "Vial", value: `${vialMg} mg` });
  if (step >= 3)
    items.push({
      label: "Dose",
      value: `${(doseMcg / 1000).toFixed(doseMcg % 1000 === 0 ? 0 : 2)} mg`,
    });
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm mb-6 px-1">
      {items.map((item, i) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          {i > 0 && (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
          <span className="text-muted-foreground">{item.label}:</span>
          <span className="font-medium">{item.value}</span>
        </span>
      ))}
    </div>
  );
}
