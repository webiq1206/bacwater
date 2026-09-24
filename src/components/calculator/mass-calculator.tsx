"use client";
import { useEffect, useId } from "react";
import { useMassSession, clearMassSession, massText } from "@/lib/calculator-session";
import { positiveDecimal } from "@/lib/calc/number-text";
import { resolveAmountSchedule, amountText } from "@/lib/calc/amount-schedule";
import { numberLabel } from "@/lib/partners/product-calculation";
import { productForReference, type SupplierProduct } from "@/lib/partners/supplier-catalog";
import { CalculatorWorkspace, WorkspaceActions } from "./calculator-workspace";
import { AmountScheduleFields } from "./amount-schedule-fields";
import { SessionNote } from "./session-note";
import { BeginnerHelp } from "@/components/plan/beginner-help";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/copy-button";

export function MassCalculator({ title, product, reference, backHref = "/recommendations" }: { title: string; product?: SupplierProduct; reference?: string; backHref?: string }) {
  const [draft, patch] = useMassSession(), id = useId();
  useEffect(() => {
    if (product || reference) patch({ productId: product?.id || productForReference(reference || "")?.id || "", peptideSlug: product?.reference || reference || "custom", customName: product?.reference || reference ? "" : product?.name || "" });
  }, [product?.id, reference, patch]);
  const total = positiveDecimal(massText(draft.total, draft.totalUnit, "mg")), volume = positiveDecimal(draft.volume);
  const schedule = resolveAmountSchedule(draft);
  const concentration = total && volume ? total / volume : null;
  const validConcentration = concentration !== null && Number.isFinite(concentration) && concentration > 0;
  const ml = validConcentration && schedule.ready ? schedule.eachMcg / 1000 / concentration! : null;
  const ready = ml !== null && Number.isFinite(ml) && ml > 0 && schedule.eachMcg / 1000 <= total!;
  const lines = [validConcentration ? `${numberLabel(concentration!)} mg/mL` : "", ready ? `Each time: ${amountText(schedule.eachMcg, draft.amountUnit)} ${draft.amountUnit} = ${numberLabel(ml!)} mL = ${numberLabel(ml! * 100)} U-100 scale units` : "", ready && schedule.weeklyMcg !== null ? `Whole week: ${schedule.count} equal amounts; ${amountText(schedule.weeklyMcg, draft.amountUnit)} ${draft.amountUnit} total` : ""].filter(Boolean);
  const inputError = draft.total && total === null ? "Check the total on the vial. Use a number greater than zero." : draft.volume && volume === null ? "Final liquid volume must be greater than zero." : validConcentration && schedule.ready && schedule.eachMcg / 1000 > total! ? "The amount each time is larger than the whole vial. Check the amount and unit." : "";
  return <CalculatorWorkspace title={title} description="Copy your label numbers. We keep the amount each time separate from the whole week." backHref={backHref} help={<><p>All linked products are for lab research only, not for people or animals. The calculator uses your numbers, not a recommended amount or schedule.</p><BeginnerHelp kind="units" /><BeginnerHelp kind="volume" /></>}>
    <section className="bac-calc-card p-5 sm:p-7" aria-label="Product calculation inputs" style={{ maxWidth: 760, marginInline: "auto" }}>
      {(draft.total || draft.volume || draft.amount) && <SessionNote />}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="min-w-0"><label htmlFor={`${id}-total`} className="block text-sm font-medium">Total amount in the vial</label>
          <div className="mt-2 flex gap-2"><Input id={`${id}-total`} type="text" inputMode="decimal" maxLength={64} value={draft.total} onChange={e => patch({ total: e.target.value })} aria-describedby={`${id}-total-help`} className="min-w-0 min-h-12" />
            <select aria-label="Vial amount unit" className="rounded-xl border bg-white px-2 text-base" value={draft.totalUnit} onChange={e => { const unit = e.target.value === "mcg" ? "mcg" : "mg"; patch({ total: massText(draft.total, draft.totalUnit, unit), totalUnit: unit }); }}><option value="mg">mg</option><option value="mcg">mcg</option></select></div>
          <p id={`${id}-total-help`} className="mt-2 text-xs leading-relaxed text-muted-foreground">The whole amount printed on the small bottle, not the amount each time.</p>
        </div>
        <div className="min-w-0"><label htmlFor={`${id}-volume`} className="block text-sm font-medium">Final liquid volume (mL)</label><Input id={`${id}-volume`} type="text" inputMode="decimal" maxLength={64} value={draft.volume} onChange={e => patch({ volume: e.target.value })} aria-describedby={`${id}-volume-help`} className="mt-2 min-h-12" /><p id={`${id}-volume-help`} className="mt-2 text-xs leading-relaxed text-muted-foreground">Total liquid after preparation, from your instructions. This is not always the amount of water added.</p></div>
      </div>
      <div className="mt-6 border-t pt-6"><h2 className="mb-4 text-xl font-medium">How much each time?</h2><AmountScheduleFields value={draft} onChange={value => patch(value)} /></div>
      <div className="bac-result-card mt-6 break-words [overflow-wrap:anywhere]" role="status" aria-live="polite" aria-atomic="true">
        {lines.length ? lines.map(line => <p className="mt-2 first:mt-0" key={line}>{line}</p>) : <p>Enter the total in the vial and final liquid volume to see the concentration.</p>}
        {validConcentration && !ready && !inputError && <p className="mt-3 text-sm">Add the amount each time, or a weekly total and its schedule, to see mL and U-100 units.</p>}
      </div>
      {inputError && <p className="mt-3 text-sm text-destructive" role="alert">{inputError}</p>}
      {ready && ml! > 1 && <p className="mt-3 text-sm" role="alert">This volume is over 1 mL. Check the actual device capacity. A calculated number is not a device recommendation.</p>}
      <div className="mt-4"><BeginnerHelp kind="units" /><BeginnerHelp kind="volume" /></div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">U-100 is a liquid-volume scale: 100 units = 1 mL. It is not a product activity unit. No dose, schedule, liquid, or storage period is chosen. Check your own instructions and device markings.</p>
    </section>
    <WorkspaceActions><Button type="button" variant="outline" onClick={clearMassSession}>Clear inputs</Button>{ready && <CopyButton value={lines.join("; ")} label="Copy result" />}</WorkspaceActions>
  </CalculatorWorkspace>;
}
