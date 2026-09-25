"use client";
import { productDisplayName } from "@/lib/partners/supplier-catalog";

import Link from "next/link";
import { useCalculationSession, useSessionDraft, readCalculation, chooseCalculationProduct, resumeMassCalculation, type SharedCalculation } from "@/lib/session/calculation-session";
import { amountSchedule } from "@/lib/calc/amount-schedule";
import { AmountScheduleFields, SessionValuesNotice } from "@/components/calculator/amount-schedule";
function usePlanField<K extends keyof SharedCalculation>(key:K, initial:SharedCalculation[K], isolated:boolean) {
  const session=useCalculationSession();const [local,setLocal]=useState(initial);
  const value=isolated?local:session[key];
  function set(next:SharedCalculation[K]|((v:SharedCalculation[K])=>SharedCalculation[K])) {
    if(isolated)setLocal(next as React.SetStateAction<SharedCalculation[K]>);
    else session.patch({[key]:typeof next==="function"?(next as (v:SharedCalculation[K])=>SharedCalculation[K])(readCalculation()[key]):next});
  }
  return [value,set] as const;
}
import { useCalculatorProductSelection } from "@/components/partners/calculator-products";
import { productForReference, productCalculatorPath, SUPPLIER_PRODUCTS } from "@/lib/partners/supplier-catalog";
import { ProductPicker } from "./product-picker";
import { BeginnerHelp } from "./beginner-help";
import { WorkspaceActions } from "@/components/calculator/calculator-workspace";

import { trackUsage } from "@/lib/analytics";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setInterestPeptide } from "@/lib/learn/interest";
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
  type CalcInput,
  type CalcResult,
  type SyringeType,
} from "@/lib/calc";
import { savePlanAction, updatePlanAction } from "@/lib/plan-actions";
import { defaultPlanName, isGeneratedPlanName } from "@/lib/plan-name";
import { rememberDevicePlan } from "@/lib/saved-plans";
import { PostSaveDialog } from "@/components/plan/post-save-dialog";
import { PlanResults } from "@/components/plan/plan-results";
import { WizardPreview } from "@/components/plan/wizard-preview";
import { LivePlanPreview } from "./live-plan-preview";
import { planPreviewState, type PreviewField } from "@/lib/calc/plan-preview";
import previewStyles from "./live-plan-preview.module.css";
import { AiAssistantDrawer } from "@/components/plan/ai-assistant-drawer";
import { toast } from "@/components/ui/toaster";
import { positiveDecimal } from "@/lib/calc/number-text";
import { convertMassText } from "@/lib/calc/mass-text";
import { cn } from "@/lib/utils";

function usePlanDraft<T>(key:string, initial:T, isolated:boolean) {
  const [shared,setShared]=useSessionDraft(key,initial),[local,setLocal]=useState(initial);
  return isolated?[local,setLocal] as const:[shared,setShared] as const;
}
type Mode = "beginner" | "advanced";
type Unit = "mg" | "mcg";

export interface PlanFormInitial {
  peptideSlug?: string | null;
  peptideName?: string | null;
  vialStrengthMg?: number;
  doseMcg?: number;
  /** Plans saved before weekly splitting existed default to 1 (no split). */
  injectionsPerWeek?: number | null;
  bacWaterMl?: number;
  syringeType?: SyringeType;
  dateMixed?: string | null;
  secondary?: CalcInput["secondary"];
}

interface Props {
  mode: Mode;
  /** Prefill the form (used when editing an existing plan). */
  initial?: PlanFormInitial;
  /**
   * Present when this form is editing a plan that already exists. Saving then
   * updates that plan in place: same publicId, so a shared link or a printed
   * QR code keeps resolving to it: rather than creating a second one.
   */
  editing?: { publicId: string; name?: string | null };
}

const STEPS = [
  "peptide",
  "vial",
  "dose",
  "water",
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
      aria-pressed={active}
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
  label,
  title,
  hint,
  children,
}: {
  n: number;
  total: number;
  /** Short section name, e.g. "Compound". Falls back to "Step n of total". */
  label?: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-plan-section={n} className="rounded-xl border border-border bg-card rounded-2xl p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <StepNumber n={n} filled />
        <SectionLabel>{label ?? `Step ${n} of ${total}`}</SectionLabel>
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
          aria-pressed={value === opt}
          className={cn(
            "px-3 min-h-11 text-xs font-semibold transition-colors",
            value === opt
              ? "bg-card text-foreground shadow-lift"
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
        aria-pressed={mode === "beginner"}
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors",
          mode === "beginner"
            ? "bg-card text-foreground shadow-lift"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Step by step
      </button>
      <button
        type="button"
        onClick={() => onChange("advanced")}
        aria-pressed={mode === "advanced"}
        className={cn(
          "px-4 py-2 text-sm font-medium transition-colors",
          mode === "advanced"
            ? "bg-card text-foreground shadow-lift"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        All at once
      </button>
    </div>
  );
}

// ---------- main ----------

export function PlanForm({ mode: initialMode, initial, editing }: Props) {
  const router = useRouter();
  const advancedRef = useRef<HTMLDivElement>(null);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const setSelectedProduct=useCalculatorProductSelection();

  // Derive first-render values from an optional prefill (edit flow). Computed
  // once; the useState initializers below read from it.
  const init = useMemo(() => {
    if (!initial) return null;
    const known = initial.peptideSlug
      ? PEPTIDES.find((p) => p.slug === initial.peptideSlug)
      : undefined;
    const slug = known ? known.slug : initial.peptideName ? "custom" : "";
    const ref = known ?? PEPTIDES.find((p) => p.slug === slug);
    const vialMg = initial.vialStrengthMg ?? 0;
    const doseMcg = initial.doseMcg ?? 0;
    // Old saved records with no split retain one amount. No frequency is inferred.
    const injectionsPerWeek = initial.injectionsPerWeek ?? 1;
    const bac = initial.bacWaterMl;
    const dosePresetValues = ref
      ? [ref.typicalDoseMcgRange[0], ref.suggestedDoseMcg, ref.typicalDoseMcgRange[1]]
      : [];
    return {
      slug,
      customName: slug === "custom" ? initial.peptideName ?? "" : "",
      vialMg,
      showCustomVial: !(ref?.commonVialStrengthsMg ?? []).includes(vialMg),
      doseMcg,
      injectionsPerWeek,
      showCustomDose: true,
      syringeType: initial.syringeType ?? "insulin-1ml",
      customBacMl: bac ?? 0,
      dateMixed: initial.dateMixed ? initial.dateMixed.slice(0, 10) : "",
      showDate: !!initial.dateMixed,
    };
  }, [initial]);

  useEffect(()=>{if(!init)resumeMassCalculation();},[init]);

  const [mode, setMode] = usePlanDraft<Mode>("plan-mode", initialMode, !!init);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [storedStep, setStep] = usePlanDraft<number>("plan-step", 0, !!init);
  const step=Number.isInteger(storedStep)&&storedStep>=0&&storedStep<STEPS.length?storedStep:0;
  const stepContainerRef = useRef<HTMLDivElement>(null);
  // Set when the user navigates steps, so we only auto-scroll on real step
  // changes (not on the first render or when editing an already-visible field).
  const pendingScrollRef = useRef(false);

  // Auto-scroll so the current step sits just below the sticky header.
  // This runs AFTER the new step has been committed to the DOM, so the
  // measurement reflects the step that is now on screen (the previous
  // requestAnimationFrame version measured the outgoing step's layout).
  useEffect(() => {
    if (!pendingScrollRef.current) return;
    pendingScrollRef.current = false;
    const el = stepContainerRef.current;
    if (!el) return;
    const scroller = el.closest<HTMLElement>("[data-calculator-scroll]");
    if (scroller) {
      scroller.scrollTo({ top: 0, behavior: "instant" });
      const heading = el.querySelector<HTMLElement>(".bac-step-panel h2, h2");
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
      return;
    }
    const HEADER_OFFSET = 88; // sticky header (64px) + breathing room
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    // Only scroll when the step isn't already comfortably in view, so we never
    // yank the page when the user is already looking at the right place.
    const alreadyInView =
      Math.abs(window.scrollY - Math.max(0, top)) < 24;
    if (!alreadyInView) {
      window.scrollTo({ top: Math.max(0, top), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  }, [step]);

  function goToStep(n: number) {
    pendingScrollRef.current = true;
    setStep(n);
  }

  // New sessions start empty. The current tab supplies compatible entries.
  // Editing a saved record stays isolated from the active calculation.
  const [peptideSlug, setPeptideSlug] = usePlanField("peptideSlug", init?.slug ?? "", !!init);
  const [customPeptideName, setCustomPeptideName] = usePlanField("customName", init?.customName ?? "", !!init);
  // Picking a peptide is an interest signal used to personalize panels
  // elsewhere on the site. It does NOT pre-fill vial/dose: the user enters
  // those (or picks a suggestion chip) so nothing is silently pre-populated.
  const selectPeptide = useCallback((slug: string) => {
    if(slug.startsWith("product:")){
      const id=slug.slice(8);
      const p=SUPPLIER_PRODUCTS.find(p=>p.id===id);if(p){if(init)return;chooseCalculationProduct(p.id,p.kind,p.reference||"");router.push(productCalculatorPath(id));}
      return;
    }
    const listing=productForReference(slug);
    if(listing&&listing.kind!=="single"){if(init)return;chooseCalculationProduct(listing.id,listing.kind,listing.reference||"");router.push(productCalculatorPath(listing.id));return;}
    if(!init)chooseCalculationProduct(slug==="hcg"?"hcg":listing?.id||"",slug==="hcg"?"iu":"single",slug);
    setPeptideSlug(slug);
    if (slug !== "custom") setInterestPeptide(slug);
    // Changing a mass-based product preserves values and shows a label-check notice.
  }, [router,peptideSlug,init]);
  useEffect(()=>{setSelectedProduct(productForReference(peptideSlug)?.id||null);},[peptideSlug,setSelectedProduct]);

  const [vialRaw,setVialRaw]=usePlanField("vialInput",init?String(init.vialMg):"",!!init);
  const vialInput=positiveDecimal(vialRaw) ?? 0;
  const setVialInput=(next:number|((v:number)=>number))=>setVialRaw(v=>{const n=typeof next==="function"?next(Number(v)||0):next;return n===0?"":String(n);});
  const [vialUnit, setVialUnit] = usePlanField("vialUnit", "mg", !!init);
  const [showCustomVial, setShowCustomVial] = useState(init?.showCustomVial ?? false);

  const [amountRaw,setAmountRaw]=usePlanField("amount",init?String(init.doseMcg):"",!!init);
  const doseInput=amountRaw?Number(amountRaw):0;
  const setDoseInput=(next:number|((v:number)=>number))=>setAmountRaw(v=>{const n=typeof next==="function"?next(Number(v)||0):next;return n===0?"":String(n);});
  const [doseUnit, setDoseUnit] = usePlanField("amountUnit",init ? "mcg" : "mg",!!init);
  const [showCustomDose, setShowCustomDose] = useState(init?.showCustomDose ?? true);
  const [amountBasis,setAmountBasis]=usePlanField("basis",init&&init.injectionsPerWeek>1?"week":"each",!!init);
  const [scheduleCount,setScheduleCount]=usePlanField("timesPerWeek",init&&init.injectionsPerWeek>1?String(init.injectionsPerWeek):"",!!init);
  const scheduleInput={amount:amountRaw,amountUnit:doseUnit,basis:amountBasis,timesPerWeek:scheduleCount};
  const scheduleResult=amountSchedule(scheduleInput);
  const injectionsPerWeek=scheduleResult.ready?scheduleResult.count:1;
  const dosePerInjectionMcg=scheduleResult.ready?scheduleResult.eachMcg:0;
  const scheduleFields=<AmountScheduleFields value={scheduleInput} onChange={n=>{setAmountRaw(n.amount);setDoseUnit(n.amountUnit);setAmountBasis(n.basis);setScheduleCount(n.timesPerWeek);}}/>;

  const [syringeType, setSyringeType] = usePlanDraft<SyringeType>("plan-syringe",init?.syringeType ?? "insulin-1ml",!!init);

  const [volumeRaw,setVolumeRaw]=usePlanField("finalVolume",init?String(init.customBacMl):"",!!init);
  const customBacMl=positiveDecimal(volumeRaw) ?? 0;
  const setCustomBacMl=(next:number)=>setVolumeRaw(next===0?"":String(next));

  const [dateMixed, setDateMixed] = usePlanDraft<string>(`plan-date:${peptideSlug}`,init?.dateMixed ?? "",!!init);
  const [showDate, setShowDate] = usePlanDraft<boolean>(`plan-show-date:${peptideSlug}`,init?.showDate ?? false,!!init);

  // Blend
  const [showBlend, setShowBlend] = usePlanDraft<boolean>(`plan-blend:${peptideSlug}`,!!initial?.secondary,!!init);
  const [secondarySlug, setSecondarySlug] = usePlanDraft<string>(`plan-secondary-slug:${peptideSlug}`,initial?.secondary?.peptideSlug || "custom",!!init);
  const [customSecondaryName, setCustomSecondaryName] = usePlanDraft<string>(`plan-secondary-name:${peptideSlug}`,initial?.secondary?.peptideName || "",!!init);
  const [secondaryVialInput, setSecondaryVialInput] = usePlanDraft<number>(`plan-secondary-mass:${peptideSlug}`,initial?.secondary?.vialStrengthMg || 0,!!init);
  const [secondaryVialUnit, setSecondaryVialUnit] = usePlanDraft<Unit>(`plan-secondary-unit:${peptideSlug}`,"mg",!!init);

  const [saving, setSaving] = useState(false);
  // Set after a successful save; opens the post-save dialog (PDF download +
  // auth-aware next step) instead of a blind redirect.
  const [savedPlan, setSavedPlan] = useState<{ publicId: string; ownedByUser: boolean } | null>(null);
  // null = untouched, so the editable field tracks the generated default name
  // as the numbers change. When editing, a name the user typed is pinned here
  // so it survives; a name we generated stays null so it follows the numbers,
  // and the field shows the new one before it is saved rather than after.
  const [planName, setPlanName] = useState<string | null>(() => {
    const stored = editing?.name?.trim();
    if (!stored) return null;
    return isGeneratedPlanName(stored, {
      peptideName: initial?.peptideName,
      vialStrengthMg: initial?.vialStrengthMg,
      dateMixed: initial?.dateMixed ?? null,
    })
      ? null
      : stored;
  });
  const [editingSyringe, setEditingSyringe] = useState(false);

  const peptide = PEPTIDES.find((p) => p.slug === peptideSlug) ?? PEPTIDES[0];
  const secondaryPeptide =
    PEPTIDES.find((p) => p.slug === secondarySlug) ?? PEPTIDES[0];

  const vialStrengthMg = vialUnit === "mg" ? vialInput : vialInput / 1000;
  // Round the mg→mcg conversion so 0.3 mg doesn't become 300.00000000000006.
  const doseMcg = scheduleResult.ready ? scheduleResult.weeklyMcg : 0;
  const secondaryVialMg =
    secondaryVialUnit === "mg" ? secondaryVialInput : secondaryVialInput / 1000;

  const hasPeptide =
    peptideSlug === "custom" ? customPeptideName.trim().length > 0 : PEPTIDES.some(p=>p.slug===peptideSlug);
  const hasValidBlend = !showBlend || ((secondarySlug === "custom" || secondarySlug !== peptideSlug) && (secondarySlug === "custom" ? customSecondaryName.trim().length > 0 : PEPTIDES.some(p => p.slug === secondarySlug && p.slug !== "hcg")) && Number.isFinite(secondaryVialMg) && secondaryVialMg > 0);
  const hasValidInputs = hasValidBlend && hasPeptide && peptideSlug !== "hcg" && Number.isFinite(vialStrengthMg) && vialStrengthMg > 0 && scheduleResult.ready && Number.isFinite(customBacMl) && customBacMl > 0;

  // Numeric fields are one synchronous session record shared with the hero and
  // product calculators. Saved-plan edits keep their supplied values isolated.
  const session=useCalculationSession();
  const hydrated=init?true:session.ready;

  const dosePresets: { mcg: number; label: string; hint: string }[] = [];
  const weeklyRangeHint = "Tell us whether your number is for one time, one day, or one week. Then copy the schedule from your instructions.";

  const primaryName =
    peptideSlug === "custom"
      ? customPeptideName || "Custom peptide"
      : productDisplayName(peptide.slug, peptide.name);
  const secondaryName = showBlend
    ? secondarySlug === "custom"
      ? customSecondaryName || "Custom peptide"
      : productDisplayName(secondaryPeptide.slug, secondaryPeptide.name)
    : null;

  const input: CalcInput = {
    peptideSlug,
    peptideName: primaryName,
    vialStrengthMg,
    doseMcg,
    injectionsPerWeek,
    bacWaterMl: customBacMl,
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
      injectionsPerWeek,
      syringeType,
      customBacMl,
      dateMixed,
      showBlend,
      secondarySlug,
      customSecondaryName,
      secondaryVialMg,
    ]
  );

  const syringe = SYRINGES.find((s) => s.id === syringeType) ?? SYRINGES[2];

  const peptideNameForPlan = showBlend
    ? `${primaryName} + ${secondaryName}`
    : primaryName;
  const nameValue =
    planName ??
    defaultPlanName({ peptideName: peptideNameForPlan, vialStrengthMg, dateMixed });

  // Editing and creating share this form, so the primary action has to say
  // which one is about to happen: the old copy promised a new saved plan in
  // both cases.
  const saveLabel = editing ? "Save changes" : "Save my plan";
  const saveHint = editing
    ? "Updates this plan in place. Its link, PDF and vial labels keep working and will show the new numbers."
    : !hasValidInputs || result.errors.length > 0
      ? "Enter the product, total in the vial, amount for each time, and final liquid volume before saving."
      : "Saves your calculation with a shareable link, downloadable PDF and printable labels.";

  async function handleSave() {
    if (saving || !hasValidInputs || result.errors.length) return;
    setSaving(true);
    try {
      const payload = {
        name: nameValue,
        peptideSlug,
        peptideName: peptideNameForPlan,
        vialStrengthMg,
        doseMcg,
        injectionsPerWeek,
        bacWaterMl: customBacMl,
        syringeType,
        dateMixed: dateMixed || null,
        notes: null,
        secondary: result?.secondary ? { peptideName: result.secondary.peptideName, vialStrengthMg: result.secondary.vialStrengthMg } : null,
      };
      if (editing) {
        // Editing an existing plan updates it in place. `notes` is deliberately
        // not sent: this form never shows them, so passing a value here would
        // wipe notes the user wrote on the plan page.
        const res = await updatePlanAction(editing.publicId, payload, {
          name: nameValue,
        });
        if (res.ok) {
          trackUsage("plan_updated");
          toast({ title: "Plan updated", variant: "success" });
          // Back to the plan itself, which now shows the corrected numbers.
          router.push(`/plan/${editing.publicId}`);
          router.refresh();
        } else {
          toast({
            title: "Could not update plan",
            description: res.error,
            variant: "destructive",
          });
        }
        return;
      }

      const res = await savePlanAction(payload, undefined);
      if (res.ok) {
        // Keep the current session values after saving. Saved records are separate.
        try {
          // Keep the current session values after saving so other tools can use them.
        } catch {
          /* ignore */
        }
        // Remember on this device right away so the plan shows under My Plans
        // even if the visitor never opens the plan page or signs in. If they
        // sign in later, the claim step attaches it to their account.
        rememberDevicePlan({
          publicId: res.publicId,
          name: nameValue,
          savedAt: new Date().toISOString(),
          claimToken: res.claimToken ?? undefined,
        });
        trackUsage("plan_saved");
        setSavedPlan({ publicId: res.publicId, ownedByUser: res.ownedByUser });
      } else {
        toast({
          title: "Could not save plan",
          description: (res as { error?: string }).error,
          variant: "destructive",
        });
      }
    } catch { toast({ title: "Could not save plan", description: "Your values are still here. Check your connection and retry.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  // Build a quick summary line for the wizard review step
  const quickSummaryLines = [
    { label: "Product", value: primaryName },
    { label: "Vial", value: `${vialStrengthMg} mg` },
    {
      label: scheduleResult.scheduled ? "Total for one week" : "Amount for one time",
      value: `${(doseMcg / 1000).toFixed(doseMcg % 1000 === 0 ? 0 : 2)} mg (${doseMcg.toLocaleString()} mcg)`,
    },
    {
      label: "Each time",
      value:
        injectionsPerWeek > 1
          ? `${(dosePerInjectionMcg / 1000).toLocaleString(undefined, { maximumSignificantDigits: 8 })} mg, ${injectionsPerWeek} times per week`
          : "One measurement (no schedule chosen)",
    },
    { label: "Syringe", value: syringe.label },
    {
      label: "Final liquid volume",
      value: `${customBacMl} mL (entered)`,
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
  const preview = planPreviewState({ input, result, hasProduct: hasPeptide, vialText: vialRaw, vialUnit, volumeText: volumeRaw, amount: scheduleInput, secondaryReady: hasValidBlend, hydrated });
  function editPreviewField(field: PreviewField) {
    const section = { product: 1, vial: 2, amount: 3, volume: 5, blend: 1 }[field];
    const panel = advancedRef.current?.querySelector<HTMLElement>(`[data-plan-section="${section}"]`);
    panel?.scrollIntoView({ block: "start", behavior: "auto" });
    const selector = field === "product" ? '[role="combobox"]' : field === "blend" ? 'input[aria-label="Second compound amount"]' : 'input';
    panel?.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
  }
  function showLivePreview() {
    setPreviewExpanded(true);
    requestAnimationFrame(() => {
      const panel = advancedRef.current?.querySelector<HTMLElement>("[data-live-plan-preview]");
      panel?.scrollIntoView({ block: "start", behavior: "auto" });
      panel?.focus({ preventScroll: true });
    });
  }

  if (mode === "advanced") {
    return (
      <div ref={advancedRef} data-plan-builder="advanced">
        {savedPlan && <PostSaveDialog publicId={savedPlan.publicId} ownedByUser={savedPlan.ownedByUser} open onOpenChange={(open) => { if (!open) setSavedPlan(null); }} />}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          {hasMounted && (
            <ModeToggle mode={mode} onChange={setMode} />
          )}
        </div>
        {!init&&<SessionValuesNotice/>}<div className={`bac-focus-advanced ${previewStyles.advancedLayout}`}>
          {/* The form scrolls normally; the preview stays visible on desktop. */}
          <div className={`${previewStyles.fields} space-y-4`}>
            {/* 1. Peptide */}
            <StepBlock
              n={1}
              total={6}
              label="Product"
              title="What is the name on your vial?"
              hint="Search for the exact name on the label. Choose Other / Custom if it is not listed."
            >
              <ProductPicker value={peptideSlug} onChange={selectPeptide} label="Product"/>
              {peptideSlug === "custom" ? (
                <div className="mt-3">
                  <Label className="text-xs text-muted-foreground">
                    Type the name on your label
                  </Label>
                  <Input aria-label="Custom peptide name"
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
                    <ProductPicker value={secondarySlug} onChange={value=>{setSecondarySlug(value);setSecondaryVialInput(0);}} label="Second product" referencesOnly excludeValue={peptideSlug}/>
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
                      <Input aria-label="Second compound amount"
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
                        onChange={unit=>{if(unit!==secondaryVialUnit)setSecondaryVialInput(v=>unit==="mg"?v/1000:v*1000);setSecondaryVialUnit(unit);}}
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
              label="Vial size"
              title="What amount is on the vial?"
              hint={'Look at your label for a number like "5 mg."'}
            >
              <div className="flex flex-wrap gap-2">
                {hasPeptide && peptide.commonVialStrengthsMg.map((mg) => (
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
                <div className="mt-4">
                  <Label className="text-xs text-muted-foreground">
                    Enter what&apos;s on your label
                  </Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      type="text" inputMode="decimal" maxLength={64}
                      value={vialRaw}
                      onChange={(e) =>
                        setVialRaw(e.target.value)
                      }
                      className="flex-1"
                      aria-label="Vial strength"
                    />
                    <UnitToggle
                      value={vialUnit}
                      onChange={unit=>{const c=convertMassText(vialRaw,vialUnit);if(vialRaw.trim()&&c.kind!=="value")return;setVialRaw(c.kind==="value"?c[unit]:"");setVialUnit(unit);}}
                      options={["mg", "mcg"]}
                    />
                  </div>
                  <ConversionHint value={vialInput} unit={vialUnit} />
                </div>
            </StepBlock>

            <StepBlock n={3} total={6} label="Amount and schedule" title="How much, and how often?" hint={weeklyRangeHint}>
              {scheduleFields}
              <BeginnerHelp kind="amount"/><BeginnerHelp kind="units"/>
            </StepBlock>

            {/* 4. Syringe */}
            <StepBlock
              n={4}
              total={6}
              label="Syringe"
              title="Which syringe are you using?"
              hint="Choose the scale printed on your actual syringe. These markings are not interchangeable."
            >
              <Select
                value={syringeType}
                onValueChange={(v) => setSyringeType(v as SyringeType)}
              >
                <SelectTrigger aria-label="Syringe size and scale" className="h-12">
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
                so 10 units = 0.1 mL. The result shows
                units on that scale. Check the markings on the actual device.
              </div>
            </StepBlock>

            {/* 5. BAC water */}
            <StepBlock
              n={5}
              total={6}
              label="BAC water"
              title="What final volume do your instructions give?"
              hint="Use the liquid and final volume from the exact product instructions. The calculator does not choose them."
            >
              <Label htmlFor="advanced-final-volume">Final liquid volume</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input id="advanced-final-volume" aria-label="Final liquid volume in mL" type="text" inputMode="decimal" maxLength={64} value={volumeRaw} onChange={e => setVolumeRaw(e.target.value)} className="flex-1" />
                <span className="text-sm text-muted-foreground">mL</span>
              </div>
              <BeginnerHelp kind="volume" />
            </StepBlock>

            {/* 6. Date (optional) */}
            <StepBlock
              n={6}
              total={6}
              label="Mixing date"
              title="What is the mix date?"
              hint="Optional. This saves the date only. It does not tell you when the product goes bad."
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
                  <Input aria-label="Mixing date"
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
              <div className="mb-3">
                <Label htmlFor="plan-name-advanced" className="text-xs text-muted-foreground">
                  Plan name
                </Label>
                <Input
                  id="plan-name-advanced"
                  value={nameValue}
                  onChange={(e) => setPlanName(e.target.value)}
                  maxLength={120}
                  placeholder="Name this plan"
                  className="mt-1 h-11"
                />
              </div>
              <WorkspaceActions>
              <button type="button" className={previewStyles.viewButton} onClick={showLivePreview}>View calculation</button>
              <Button
                onClick={handleSave}
                disabled={saving || !hasValidInputs || result.errors.length > 0}
                variant="brand"
                size="lg"
                className="w-full"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saveLabel}
              </Button>
              </WorkspaceActions>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                {saveHint}
              </p>
            </div>
          </div>

          <LivePlanPreview preview={preview} result={result} expanded={previewExpanded} onExpand={setPreviewExpanded} onEdit={editPreviewField}>
            {preview.ready && <PlanResults result={result} />}
          </LivePlanPreview>
        </div>
      </div>
    );
  }

  // ---------- BEGINNER: one question at a time ----------
  const isReview = step === STEPS.length - 1;
  return (
    // One question at a time stays exactly that: the column on the left is
    // unchanged. The preview beside it only fills desktop space that was
    // previously empty, so the plan being built is visible while it is built.
    // Below xl there is no room for it, and the WizardContext breadcrumb
    // already carries the answers so far.
    <div
      className={cn(
        "bac-focus-step mx-auto pb-24 sm:pb-0",
        isReview
          ? // The review step lays out its own panes, so it takes the full width
            // instead of being squeezed into the question column.
            "max-w-2xl xl:max-w-7xl"
          : "grid max-w-2xl gap-10 xl:max-w-6xl xl:grid-cols-[minmax(0,38rem)_minmax(0,24rem)] xl:justify-center"
      )}
    >
      <div ref={stepContainerRef} className="min-w-0">
      <div className="mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-3">
        {hasMounted && (
          <ModeToggle mode={mode} onChange={setMode} />
        )}
      </div>

      {!init&&<SessionValuesNotice/>}<StepBar step={step} total={STEPS.length} />
      <WizardContext
        step={step}
        peptideName={primaryName}
        vialMg={vialStrengthMg}
        doseMcg={dosePerInjectionMcg}
      />

      {step === 0 && (
        <StepPanel
          title="What is the name on your vial?"
          hint="Search by name, then pick the item that matches your label."
          onNext={() => goToStep(1)}
          onBack={null}
          stepNum={1}
          nextDisabled={!hasPeptide || peptideSlug === "hcg"}
        >
          <ProductPicker value={peptideSlug} onChange={selectPeptide} label="Product"/>
          {peptideSlug === "hcg" ? <div className="mt-4 rounded-xl border p-4"><p className="text-sm">hCG uses IU, not mg. Use the IU calculator for this label.</p><Button asChild variant="brand" className="mt-3"><Link href="/calculate/hcg">Open hCG IU calculator</Link></Button></div> : peptideSlug === "custom" ? (
            <Input
              className="mt-3"
              aria-label="Custom peptide name"
              placeholder="Type your peptide's name"
              value={customPeptideName}
              onChange={(e) => setCustomPeptideName(e.target.value)}
            />
          ) : peptideSlug ? (
            <div className="mt-4 bg-surface px-4 py-3 text-sm text-muted-foreground">
              <strong className="text-foreground">{productDisplayName(peptide.slug, peptide.name)}</strong>
              {". "}Confirm the amount and units on your own label.
              Next, copy the amount printed on this product's label.
            </div>
          ) : null}
        </StepPanel>
      )}

      {step === 1 && (
        <StepPanel
          title="What amount is on the vial?"
          hint="Copy the total amount from the label on the small bottle. mg and mcg are different units."
          onNext={() => goToStep(2)}
          onBack={() => goToStep(0)}
          stepNum={2}
          nextDisabled={!(vialStrengthMg > 0)}
        >
          <details className="mb-3"><summary className="cursor-pointer min-h-11 text-sm">Label shortcuts (optional)</summary><div className="flex flex-wrap gap-2">
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
          </details>
          {(
            <div className="mt-4">
              <Label className="text-xs text-muted-foreground">
                Enter what&apos;s on your label
              </Label>
              <div className="mt-1 flex items-center gap-2">
                <Input aria-label="Vial strength"
                  type="text" inputMode="decimal" maxLength={64}
                  value={vialRaw}
                  onChange={(e) =>
                    setVialRaw(e.target.value)
                  }
                  className="flex-1"
                />
                <UnitToggle
                  value={vialUnit}
                  onChange={unit=>{const c=convertMassText(vialRaw,vialUnit);if(vialRaw.trim()&&c.kind!=="value")return;setVialRaw(c.kind==="value"?c[unit]:"");setVialUnit(unit);}}
                  options={["mg", "mcg"]}
                />
              </div>
              <ConversionHint value={vialInput} unit={vialUnit} />
            </div>
          )}
          <BeginnerHelp kind="vial"/>
          <BeginnerHelp kind="units"/>
        </StepPanel>
      )}

      {step === 2 && (
        <StepPanel title="How much, and how often?" hint={weeklyRangeHint}
          onNext={()=>goToStep(3)} onBack={()=>goToStep(1)} stepNum={3} nextDisabled={!scheduleResult.ready}>
          {scheduleFields}
          <BeginnerHelp kind="amount"/><BeginnerHelp kind="units"/>
        </StepPanel>
      )}

      {step === 3 && (
        <StepPanel
          title="What is the final liquid volume?"
          hint="Use the final amount of liquid from your instructions. This may differ from the water you add."
          onNext={() => goToStep(4)}
          onBack={() => goToStep(2)}
          stepNum={4}
          nextDisabled={!Number.isFinite(customBacMl) || customBacMl <= 0}
        >
          <Label htmlFor="guided-final-volume">Total liquid after preparation</Label>
          <div className="mt-2 flex items-center gap-2"><Input id="guided-final-volume" aria-label="Final liquid volume in mL" type="text" inputMode="decimal" maxLength={64} value={volumeRaw} onChange={e=>setVolumeRaw(e.target.value)} className="flex-1 h-14 text-base"/><span>mL</span></div>
          <BeginnerHelp kind="volume"/>
          {/* Live reasoning: show the consequence of this choice */}
          {customBacMl > 0 && result.errors.length === 0 && <div className="mt-3 sm:mt-4 rounded-xl border border-border bg-surface p-3 sm:p-4 text-sm leading-relaxed">
            <span className="text-muted-foreground">With </span>
            <strong>{customBacMl || 0} mL</strong>
            <span className="text-muted-foreground"> final liquid volume, your entered amount equals </span>
            <strong style={{ color: "var(--color-accent-guide)" }}>
              {result.syringeReadout.displayLabel}
            </strong>
            <span className="text-muted-foreground">.</span>
          </div>}
        </StepPanel>
      )}

      {step === 4 && (
        <StepPanel
          title="Add a date? (optional)"
          hint="Add the mix date, or leave it blank. Follow the storage rules on the product label."
          onNext={() => goToStep(5)}
          onBack={() => goToStep(3)}
          stepNum={5}
          nextDisabled={false}
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <Input aria-label="Mixing date"
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
              className="inline-flex items-center justify-center border border-border px-5 h-14 text-sm font-medium hover:bg-muted whitespace-nowrap"
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
              . This is a record, not a calculated expiry date.
            </p>
          ) : (
            <p
              className="mt-4 text-sm font-medium"
              style={{ color: "var(--color-accent-guide)" }}
            >
              No date? You can skip this step.
            </p>
          )}
        </StepPanel>
      )}

      {step === 5 && (
        <div className="space-y-8">
          {/* Review header */}
          <div className="text-center">
            <div className="eyebrow">Your calculation is ready</div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
              Here are your numbers.
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto leading-relaxed">
              These results use only the numbers you entered. Check them against your label and instructions. Save them for a PDF or printable label.
            </p>
          </div>

          {/*
            Two panes at xl: the plan itself on the left, and everything you can
            still change or do about it on the right. Below xl they stack, and
            the plan comes first in the DOM so the answer is what you land on
            after the last question rather than a recap of your own inputs.
          */}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_23rem] xl:items-start xl:gap-8">
          <div className="min-w-0 space-y-5">
            <PlanResults result={result} />
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24">
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
              <h4 className="text-sm font-semibold">Check your device settings</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              These are calculator settings, not a device recommendation. Tap{" "}
              <span className="font-medium" style={{ color: "var(--color-accent-guide)" }}>
                Change
              </span>{" "}
              to match the scale and marks on your actual device.
            </p>
            <div className="space-y-3">
              <SmartDefault
                label="Syringe"
                value={syringe.label}
                reason="Confirm the scale, capacity and markings on your device."
                editing={editingSyringe}
                onToggle={() => setEditingSyringe(!editingSyringe)}
              >
                <div className="grid gap-1.5 sm:gap-2">
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
            </div>
          </div>

          <AiAssistantDrawer plan={result} />

          <div className="flex flex-col gap-3 pt-2">
            {/* Name your plan (a relevant default is pre-filled; editable). */}
            <div>
              <Label htmlFor="plan-name" className="text-xs text-muted-foreground">
                Plan name
              </Label>
              <Input
                id="plan-name"
                value={nameValue}
                onChange={(e) => setPlanName(e.target.value)}
                maxLength={120}
                placeholder="Name this plan"
                className="mt-1 h-12"
              />
            </div>
            {/* The workspace action dock keeps Save reachable. */}

            <p className="text-xs text-muted-foreground text-center">
              {saveHint}
            </p>
            <Button
              variant="ghost"
              onClick={() => goToStep(0)}
              className="mx-auto"
            >
              Start over
            </Button>
          </div>

          </aside>
          </div>

          {/* One primary Save action in the viewport-aware workspace dock. */}
          <WorkspaceActions>
            <Button
              variant="brand"
              size="lg"
              onClick={handleSave}
              disabled={saving || !hasValidInputs || result.errors.length > 0}
              className="w-full"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saveLabel}
            </Button>
          </WorkspaceActions>
        </div>
      )}

      {savedPlan ? (
        <PostSaveDialog
          publicId={savedPlan.publicId}
          ownedByUser={savedPlan.ownedByUser}
          open
          onOpenChange={(open) => {
            if (!open) setSavedPlan(null);
          }}
        />
      ) : null}
      </div>

      {/* The review step already renders the whole plan in the main column,
          so the preview would be saying the same thing twice there. */}
      {!isReview ? (
        <WizardPreview
          className="hidden xl:block xl:sticky xl:top-24 xl:h-fit"
          result={result}
          hasPeptide={hasPeptide}
          vialStrengthMg={vialStrengthMg}
          doseMcg={doseMcg}
          syringeType={syringeType}
          dateMixed={dateMixed}
        />
      ) : null}
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
    <div className="bac-step-panel rounded-xl border border-border bg-card rounded-2xl">
      <div className="p-5 sm:p-8">
        <div className="flex items-center gap-3 mb-2 sm:mb-3">
          <StepNumber n={stepNum} filled />
          <SectionLabel>Question {stepNum}</SectionLabel>
        </div>
        <h2 className="text-xl sm:text-3xl font-serif font-medium tracking-tight">
          {title}
        </h2>
        {hint ? (
          <p className="mt-2 sm:mt-3 text-sm text-muted-foreground leading-relaxed">
            {hint}
          </p>
        ) : null}
        <div className="mt-4 sm:mt-6">{children}</div>
      </div>

      <WorkspaceActions>
        {onBack ? <Button variant="outline" size="lg" onClick={onBack} aria-label="Go back"><ArrowLeft className="h-4 w-4"/> Back</Button> : <span/>}
        <Button variant="brand" size="lg" onClick={onNext} disabled={nextDisabled}>Continue <ArrowRight className="h-4 w-4"/></Button>
      </WorkspaceActions>
    </div>
  );
}

function StepBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-5 sm:mb-8">
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
    <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
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
  if (step >= 1) items.push({ label: "Product", value: peptideName });
  if (step >= 2) items.push({ label: "Vial", value: `${vialMg} mg` });
  if (step >= 3)
    items.push({
      label: "Amount",
      value: `${(doseMcg / 1000).toFixed(doseMcg % 1000 === 0 ? 0 : 2)} mg`,
    });
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm mb-4 sm:mb-6 px-1">
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
