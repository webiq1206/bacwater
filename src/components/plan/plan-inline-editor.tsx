"use client";

import { useMemo, useState } from "react";
import { Loader2, RotateCcw, Save, X } from "lucide-react";
import {
  PEPTIDES,
  SYRINGES,
  calculate,
  recommendBacWaterMl,
  type SyringeType,
} from "@/lib/calc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlanResults } from "@/components/plan/plan-results";
import { defaultPlanName, isGeneratedPlanName } from "@/lib/plan-name";
import { cn } from "@/lib/utils";

export interface PlanEditableFields {
  name: string;
  peptideSlug: string;
  peptideName: string;
  vialStrengthMg: number;
  doseMcg: number;
  injectionsPerWeek: number;
  bacWaterMl: number;
  syringeType: SyringeType;
  dateMixed: string;
}

const FREQUENCIES = [1, 2, 3, 5, 7] as const;

/**
 * The peptide name a plan is stored under: the chosen peptide's own name, or
 * whatever was typed for a custom one. Matches what `calculate()` resolves, so
 * a generated plan name here matches the one the server would produce.
 */
function displayPeptideName(f: {
  peptideSlug: string;
  peptideName: string;
}): string {
  if (f.peptideSlug === "custom") return f.peptideName || "Custom";
  return PEPTIDES.find((p) => p.slug === f.peptideSlug)?.name ?? f.peptideName;
}

/**
 * Compact edit form for a saved plan, shown inside the My Plans workspace so
 * correcting a number never leaves the screen.
 *
 * The results underneath recalculate live from the deterministic library, the
 * same `calculate()` the plan builder and the PDF use, so what you see before
 * saving is exactly what gets stored.
 */
export function PlanInlineEditor({
  initial,
  saving,
  onSave,
  onCancel,
}: {
  initial: PlanEditableFields;
  saving: boolean;
  onSave: (fields: PlanEditableFields) => void;
  onCancel: () => void;
}) {
  const [fields, setFields] = useState<PlanEditableFields>(initial);

  // A name that just restates the plan's numbers keeps restating them as they
  // are edited, so the field shows the name that will be saved. A name the
  // user typed is theirs and is never rewritten under them.
  const [nameIsGenerated, setNameIsGenerated] = useState(() =>
    isGeneratedPlanName(initial.name, {
      peptideName: displayPeptideName(initial),
      vialStrengthMg: initial.vialStrengthMg,
      dateMixed: initial.dateMixed || null,
    })
  );

  function patch(p: Partial<PlanEditableFields>) {
    setFields((f) => {
      const next = { ...f, ...p };
      // Only follow the numbers; typing in the name field is handled there.
      if (p.name === undefined && nameIsGenerated) {
        next.name = defaultPlanName({
          peptideName: displayPeptideName(next),
          vialStrengthMg: next.vialStrengthMg,
          dateMixed: next.dateMixed || null,
        });
      }
      return next;
    });
  }

  const dirty = useMemo(
    () => (Object.keys(initial) as Array<keyof PlanEditableFields>).some((k) => fields[k] !== initial[k]),
    [fields, initial]
  );

  const recommendedBac = useMemo(
    () => recommendBacWaterMl(fields.vialStrengthMg, fields.doseMcg),
    [fields.vialStrengthMg, fields.doseMcg]
  );

  const valid = fields.vialStrengthMg > 0 && fields.doseMcg > 0 && fields.bacWaterMl > 0;

  const preview = useMemo(() => {
    if (!valid) return null;
    return calculate({
      peptideSlug: fields.peptideSlug === "custom" ? undefined : fields.peptideSlug,
      peptideName:
        fields.peptideSlug === "custom" ? fields.peptideName || "Custom" : undefined,
      vialStrengthMg: fields.vialStrengthMg,
      doseMcg: fields.doseMcg,
      injectionsPerWeek: fields.injectionsPerWeek,
      bacWaterMl: fields.bacWaterMl,
      syringeType: fields.syringeType,
      dateMixed: fields.dateMixed || null,
    });
  }, [fields, valid]);

  return (
    <div className="p-4 sm:p-5">
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-serif text-xl font-medium tracking-tight">Edit this plan</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Cancel editing"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Saving updates this plan and keeps its link, so a shared URL or a
          printed QR label still resolves here. To branch off instead and keep
          the original untouched, close this and use Duplicate.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label className="text-xs text-muted-foreground">Plan name</Label>
            <Input
              value={fields.name}
              onChange={(e) => {
                // An emptied field is no longer a chosen name, so it goes back
                // to following the numbers.
                setNameIsGenerated(e.target.value.trim() === "");
                patch({ name: e.target.value });
              }}
              maxLength={120}
              className="mt-1 h-10"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Peptide</Label>
            <Select
              value={fields.peptideSlug}
              onValueChange={(slug) => patch({ peptideSlug: slug })}
            >
              <SelectTrigger className="mt-1 h-10">
                <SelectValue placeholder="Choose a peptide" />
              </SelectTrigger>
              <SelectContent>
                {PEPTIDES.map((p) => (
                  <SelectItem key={p.slug} value={p.slug}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {fields.peptideSlug === "custom" ? (
            <div>
              <Label className="text-xs text-muted-foreground">Name on the label</Label>
              <Input
                value={fields.peptideName}
                onChange={(e) => patch({ peptideName: e.target.value })}
                className="mt-1 h-10"
              />
            </div>
          ) : null}

          <div>
            <Label className="text-xs text-muted-foreground">Vial strength (mg)</Label>
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={fields.vialStrengthMg || ""}
              onChange={(e) => patch({ vialStrengthMg: Number(e.target.value) || 0 })}
              className="mt-1 h-10"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Weekly total (mcg)</Label>
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              value={fields.doseMcg || ""}
              onChange={(e) => patch({ doseMcg: Number(e.target.value) || 0 })}
              className="mt-1 h-10"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Injections per week</Label>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {FREQUENCIES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => patch({ injectionsPerWeek: n })}
                  className={cn(
                    "h-10 min-w-10 rounded-lg border px-3 text-sm font-medium transition-colors",
                    fields.injectionsPerWeek === n
                      ? "border-foreground bg-muted"
                      : "border-border text-muted-foreground hover:text-foreground"
                  )}
                >
                  {n}×
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">BAC water (mL)</Label>
            <div className="mt-1 flex gap-1.5">
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                value={fields.bacWaterMl || ""}
                onChange={(e) => patch({ bacWaterMl: Number(e.target.value) || 0 })}
                className="h-10"
              />
              {recommendedBac > 0 && fields.bacWaterMl !== recommendedBac ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => patch({ bacWaterMl: recommendedBac })}
                  title="Use the amount we'd recommend for these numbers"
                >
                  Use {recommendedBac} mL
                </Button>
              ) : null}
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Syringe</Label>
            <Select
              value={fields.syringeType}
              onValueChange={(v) => patch({ syringeType: v as SyringeType })}
            >
              <SelectTrigger className="mt-1 h-10">
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
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Date mixed</Label>
            <div className="mt-1 flex gap-1.5">
              <Input
                type="date"
                value={fields.dateMixed}
                onChange={(e) => patch({ dateMixed: e.target.value })}
                className="h-10"
              />
              {fields.dateMixed ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => patch({ dateMixed: "" })}
                >
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        {!valid ? (
          <p className="mt-3 text-xs text-amber-700">
            Vial strength, weekly total, and BAC water all need to be greater than
            zero before this can be saved.
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => onSave(fields)} disabled={saving || !valid || !dirty} variant="brand">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save changes
          </Button>
          <Button
            onClick={() => setFields(initial)}
            disabled={saving || !dirty}
            variant="outline"
          >
            <RotateCcw className="h-4 w-4" /> Revert
          </Button>
          <Button onClick={onCancel} disabled={saving} variant="ghost">
            Cancel
          </Button>
        </div>
      </div>

      {preview ? (
        <div className="mt-5">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {dirty ? "Preview of your changes" : "Current plan"}
          </div>
          <PlanResults result={preview} />
        </div>
      ) : null}
    </div>
  );
}
