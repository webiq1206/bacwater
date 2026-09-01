"use client";

import { useState } from "react";
import { Printer, RotateCcw } from "lucide-react";
import {
  LABEL_SHEET_STYLES,
  VialLabel,
  type VialLabelData,
} from "@/components/plan/vial-label";

type Props = VialLabelData;

/**
 * Printable labels for a single plan: N copies of the same vial, each with its
 * own mix date, for someone reconstituting the same peptide repeatedly.
 *
 * For labels spanning several different plans, see /plans/labels.
 */
export function LabelSheet(props: Props) {
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
      <style>{LABEL_SHEET_STYLES}</style>

      {/*
        Controls beside the sheet rather than stacked above it, so the labels
        stay in view while the count and dates are set. On print the controls
        are hidden and the sheet reverts to the full page width.
      */}
      <div className="label-layout lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="no-print lg:sticky lg:top-24">
          <h1 className="text-2xl font-semibold tracking-tight">Printable vial labels</h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Each label is 2.5 by 1.5 inches. Set a mix date to print it on the
            labels (expiry fills in automatically), or leave it blank to write
            the date on each vial by hand. Adjust any individual label on the
            sheet. Print at 100% scale and cut along the outlines.
          </p>

          <div className="mt-5 space-y-4 border border-border bg-surface p-4">
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
            <label className="block text-sm">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Mix date (fills all labels)
              </span>
              <input
                type="date"
                value={allDate}
                onChange={(e) => applyAll(e.target.value)}
                className="h-10 w-full border border-input bg-card px-3 text-sm"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex h-10 items-center gap-1.5 border border-border bg-card px-3 text-sm font-medium hover:bg-muted"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear dates
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 px-4 text-sm font-medium text-white"
                style={{ background: "var(--color-accent-guide)" }}
              >
                <Printer className="h-4 w-4" /> Print labels
              </button>
            </div>
          </div>
        </div>

        <div className="label-sheet mt-8 lg:mt-0">
          {dates.map((mix, i) => (
            <VialLabel
              key={i}
              data={props}
              mixDate={mix}
              onMixDateChange={(v) => setOne(i, v)}
              ariaLabel={`Mix date for label ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
