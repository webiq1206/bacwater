"use client";

import { PlanQr } from "@/components/plan/plan-qr";
import { formatDate } from "@/lib/utils";

/**
 * One 2.5 × 1.5 inch vial label, and the print CSS that lays a sheet of them
 * out. Shared by the single-plan sheet at /plan/[id]/label and the multi-plan
 * sheet at /plans/labels — two sheets, one label design, so a batch print and
 * a single print never disagree about what a label looks like.
 */

export const LABEL_SHEET_STYLES = `
  .label-sheet {
    display: grid;
    grid-template-columns: repeat(auto-fill, 2.5in);
    gap: 0.2in;
    justify-content: center;
  }
  .vial-label {
    width: 2.5in;
    min-height: 1.5in;
    box-sizing: border-box;
    padding: 0.12in 0.14in;
    border: 1px dashed var(--color-border);
    border-radius: 0.08in;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 4px;
    overflow: hidden;
    background: #ffffff;
  }
  .vl-date-input {
    font-size: 9px;
    line-height: 1.1;
    border: none;
    border-bottom: 1px solid #9aa09b;
    padding: 0 2px;
    width: 1in;
    background: transparent;
    color: #2c302f;
    font-family: inherit;
  }
  .vl-date-input::-webkit-calendar-picker-indicator {
    transform: scale(0.7);
    opacity: 0.5;
    padding: 0;
    margin-left: 1px;
  }
  .vl-write {
    border-bottom: 1px solid #9ca3af;
    min-width: 0.9in;
    display: inline-block;
    height: 0.9em;
  }
  .print-only-inline { display: none; }
  @media print {
    /*
      The on-screen layout puts the controls in a column beside the sheet. On
      paper the controls are hidden, so the wrapper has to stop being a grid or
      the labels would print into the narrow second column. This lives here
      rather than in a Tailwind print: utility because an inline <style> block
      reliably wins over the responsive lg: grid rule regardless of how the
      generated stylesheet happens to order those two variants.
    */
    .label-layout { display: block !important; }
    .label-sheet { gap: 0.1in; justify-content: flex-start; }
    .vial-label {
      height: 1.5in;
      min-height: 0;
      border: 1px solid #9ca3af;
      border-radius: 0;
      break-inside: avoid;
    }
    .print-only-inline { display: inline; }
  }
`;

export function fmtLabelDate(iso: string): string {
  return formatDate(new Date(iso + "T12:00:00"));
}

export function addDaysIso(iso: string, days: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export interface VialLabelData {
  publicId: string;
  peptideName: string;
  vialStrengthMg: number;
  /** Pre-formatted BAC water volume, e.g. "2" or "1.33". */
  bacWaterMl: string;
  /** Pre-formatted syringe reading, e.g. "10 units" or "0.25 mL". */
  doseReading: string;
  /** Injections per week; null for older plans saved without a schedule. */
  injectionsPerWeek?: number | null;
  shelfDays: number;
}

export function VialLabel({
  data,
  mixDate,
  onMixDateChange,
  ariaLabel,
}: {
  data: VialLabelData;
  mixDate: string;
  onMixDateChange: (v: string) => void;
  ariaLabel: string;
}) {
  const exp = mixDate ? addDaysIso(mixDate, data.shelfDays) : "";
  return (
    <div className="vial-label">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[7px] uppercase tracking-widest leading-none text-muted-foreground">
            BACwater.ai
          </div>
          <div className="mt-0.5 truncate text-[13px] font-semibold leading-tight">
            {data.peptideName || "Peptide"}
          </div>
          <div className="mt-0.5 text-[8px] leading-tight text-muted-foreground">
            {`${data.vialStrengthMg} mg vial · ${data.bacWaterMl} mL BAC · ${data.doseReading}/dose${
              data.injectionsPerWeek ? ` · ${data.injectionsPerWeek}x/week` : ""
            }`}
          </div>
        </div>
        <div className="shrink-0">
          <PlanQr publicId={data.publicId} size={54} />
        </div>
      </div>

      <div className="text-[8px] leading-relaxed">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Mixed</span>
          <input
            type="date"
            value={mixDate}
            onChange={(e) => onMixDateChange(e.target.value)}
            className="vl-date-input no-print"
            aria-label={ariaLabel}
          />
          <span className="print-only-inline">
            {mixDate ? fmtLabelDate(mixDate) : <span className="vl-write" />}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1">
          <span className="text-muted-foreground">Exp</span>
          <span className="tabular-nums">
            {exp ? fmtLabelDate(exp) : <span className="vl-write" />}
          </span>
          <span className="whitespace-nowrap text-muted-foreground">
            within {data.shelfDays} d
          </span>
        </div>
      </div>

      <div className="text-[8px] leading-tight text-muted-foreground">
        Refrigerate &middot; protect from light &middot; do not freeze
      </div>
    </div>
  );
}
