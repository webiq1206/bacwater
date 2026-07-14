"use client";

import { useState } from "react";
import { Printer, RotateCcw } from "lucide-react";
import { PlanQr } from "@/components/plan/plan-qr";
import { formatDate } from "@/lib/utils";

interface Props {
  publicId: string;
  peptideName: string;
  vialStrengthMg: number;
  /** Pre-formatted BAC water volume, e.g. "2" or "1.33". */
  bacWaterMl: string;
  /** Pre-formatted syringe reading, e.g. "10 units" or "0.25 mL". */
  doseReading: string;
  shelfDays: number;
}

function fmt(iso: string): string {
  return formatDate(new Date(iso + "T12:00:00"));
}

function addDaysIso(iso: string, days: number): string {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function LabelSheet({
  publicId,
  peptideName,
  vialStrengthMg,
  bacWaterMl,
  doseReading,
  shelfDays,
}: Props) {
  const [count, setCount] = useState(6);
  const [allDate, setAllDate] = useState("");
  const [dates, setDates] = useState<string[]>(() => Array(6).fill(""));

  function setCountSafe(n: number) {
    const c = Math.max(1, Math.min(30, Math.floor(n) || 1));
    setCount(c);
    setDates((prev) => {
      const next = prev.slice(0, c);
      while (next.length < c) next.push(allDate);
      return next;
    });
  }
  function applyAll(v: string) {
    setAllDate(v);
    setDates(Array(count).fill(v));
  }
  function setOne(i: number, v: string) {
    setDates((prev) => prev.map((d, idx) => (idx === i ? v : d)));
  }
  function clearAll() {
    setAllDate("");
    setDates(Array(count).fill(""));
  }

  return (
    <div>
      <style>{`
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
      `}</style>

      <div className="no-print">
        <h1 className="text-2xl font-semibold tracking-tight">
          Printable vial labels
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
          Each label is 2.5 by 1.5 inches. Set a mix date to print it on the
          labels (expiry fills in automatically), or leave it blank to write the
          date on each vial by hand. Adjust any individual label below. Print at
          100% scale and cut along the outlines.
        </p>

        <div className="mt-5 flex flex-wrap items-end gap-4 border border-border bg-surface p-4">
          <label className="text-sm">
            <span className="block text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">
              Number of labels
            </span>
            <input
              type="number"
              min={1}
              max={30}
              value={count}
              onChange={(e) => setCountSafe(parseInt(e.target.value, 10))}
              className="h-10 w-24 border border-input bg-card px-3 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="block text-xs uppercase tracking-wide text-muted-foreground font-medium mb-1">
              Mix date (fills all labels)
            </span>
            <input
              type="date"
              value={allDate}
              onChange={(e) => applyAll(e.target.value)}
              className="h-10 border border-input bg-card px-3 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={clearAll}
            className="h-10 inline-flex items-center gap-1.5 border border-border bg-card px-3 text-sm font-medium hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Clear dates
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="h-10 inline-flex items-center gap-1.5 px-4 text-sm font-medium text-white"
            style={{ background: "var(--color-accent-guide)" }}
          >
            <Printer className="h-4 w-4" /> Print labels
          </button>
        </div>
      </div>

      <div className="mt-8 label-sheet">
        {dates.map((mix, i) => {
          const exp = mix ? addDaysIso(mix, shelfDays) : "";
          return (
            <div key={i} className="vial-label">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[7px] uppercase tracking-widest text-muted-foreground leading-none">
                    BACwater.ai
                  </div>
                  <div className="text-[13px] font-semibold leading-tight truncate mt-0.5">
                    {peptideName || "Peptide"}
                  </div>
                  <div className="text-[8px] text-muted-foreground leading-tight mt-0.5">
                    {`${vialStrengthMg} mg vial · ${bacWaterMl} mL BAC · ${doseReading}/dose`}
                  </div>
                </div>
                <div className="shrink-0">
                  <PlanQr publicId={publicId} size={54} />
                </div>
              </div>

              <div className="text-[8px] leading-relaxed">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Mixed</span>
                  <input
                    type="date"
                    value={mix}
                    onChange={(e) => setOne(i, e.target.value)}
                    className="vl-date-input no-print"
                    aria-label={`Mix date for label ${i + 1}`}
                  />
                  <span className="print-only-inline">
                    {mix ? fmt(mix) : <span className="vl-write" />}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-muted-foreground">Exp</span>
                  <span className="tabular-nums">
                    {exp ? (
                      fmt(exp)
                    ) : (
                      <span className="vl-write" />
                    )}
                  </span>
                  <span className="text-muted-foreground whitespace-nowrap">
                    within {shelfDays} d
                  </span>
                </div>
              </div>

              <div className="text-[8px] text-muted-foreground leading-tight">
                Refrigerate &middot; protect from light &middot; do not freeze
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
