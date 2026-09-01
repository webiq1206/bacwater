"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, RotateCcw } from "lucide-react";
import {
  LABEL_SHEET_STYLES,
  VialLabel,
  type VialLabelData,
} from "@/components/plan/vial-label";

export interface BatchLabelPlan extends VialLabelData {
  planName: string;
  /** The plan's own recorded mix date, used as this plan's starting value. */
  defaultMixDate: string;
}

interface PerPlan {
  count: number;
  dates: string[];
}

const MAX_PER_PLAN = 20;

/**
 * One label sheet spanning several plans, for the case the single-plan sheet
 * can't cover: reconstituting three different peptides in one sitting and
 * wanting one page to print and cut rather than three.
 *
 * Counts and mix dates are per plan, since different vials get mixed on
 * different days.
 */
export function BatchLabelSheet({ plans }: { plans: BatchLabelPlan[] }) {
  const [state, setState] = useState<Record<string, PerPlan>>(() =>
    Object.fromEntries(
      plans.map((p) => [
        p.publicId,
        { count: 2, dates: [p.defaultMixDate, p.defaultMixDate] },
      ])
    )
  );

  function setCount(publicId: string, n: number, fallbackDate: string) {
    const c = Math.max(0, Math.min(MAX_PER_PLAN, Math.floor(n) || 0));
    setState((s) => {
      const prev = s[publicId];
      const dates = prev.dates.slice(0, c);
      while (dates.length < c) dates.push(prev.dates[prev.dates.length - 1] ?? fallbackDate);
      return { ...s, [publicId]: { count: c, dates } };
    });
  }

  function setDate(publicId: string, index: number, value: string) {
    setState((s) => ({
      ...s,
      [publicId]: {
        ...s[publicId],
        dates: s[publicId].dates.map((d, i) => (i === index ? value : d)),
      },
    }));
  }

  function setAllDatesFor(publicId: string, value: string) {
    setState((s) => ({
      ...s,
      [publicId]: { ...s[publicId], dates: s[publicId].dates.map(() => value) },
    }));
  }

  function clearAll() {
    setState((s) =>
      Object.fromEntries(
        Object.entries(s).map(([id, v]) => [id, { ...v, dates: v.dates.map(() => "") }])
      )
    );
  }

  const total = Object.values(state).reduce((n, p) => n + p.count, 0);

  return (
    <div>
      <style>{LABEL_SHEET_STYLES}</style>

      {/* Controls beside the sheet, so the labels stay in view while the
          per-plan counts and dates are set. */}
      <div className="label-layout lg:grid lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start lg:gap-8">
      <div className="no-print lg:sticky lg:top-24 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
        <Link
          href="/plans"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> My Plans
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Labels for {plans.length} plan{plans.length === 1 ? "" : "s"}
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          One sheet covering every plan you selected. Set how many labels each
          vial needs and when it was mixed — expiry fills in from that plan&apos;s
          own shelf life. Print at 100% scale and cut along the outlines.
        </p>

        <div className="mt-5 border border-border bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="text-sm">
              <span className="font-medium tabular-nums">{total}</span>{" "}
              <span className="text-muted-foreground">
                label{total === 1 ? "" : "s"} on this sheet
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex h-9 items-center gap-1.5 border border-border bg-card px-3 text-sm font-medium hover:bg-muted"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear dates
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                disabled={total === 0}
                className="inline-flex h-9 items-center gap-1.5 px-4 text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "var(--color-accent-guide)" }}
              >
                <Printer className="h-4 w-4" /> Print sheet
              </button>
            </div>
          </div>

          <ul className="divide-y divide-border">
            {plans.map((p) => (
              <li key={p.publicId} className="flex flex-wrap items-end gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.planName}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.peptideName} · {p.vialStrengthMg} mg · {p.doseReading}/dose ·{" "}
                    {p.shelfDays} d shelf life
                  </div>
                </div>
                <label className="text-sm">
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Labels
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={MAX_PER_PLAN}
                    value={state[p.publicId].count}
                    onChange={(e) =>
                      setCount(p.publicId, parseInt(e.target.value, 10), p.defaultMixDate)
                    }
                    className="h-9 w-20 border border-input bg-card px-3 text-sm"
                  />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Mix date
                  </span>
                  <input
                    type="date"
                    value={state[p.publicId].dates[0] ?? ""}
                    onChange={(e) => setAllDatesFor(p.publicId, e.target.value)}
                    className="h-9 border border-input bg-card px-3 text-sm"
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="label-sheet mt-8 lg:mt-0">
        {plans.flatMap((p) =>
          state[p.publicId].dates.map((mix, i) => (
            <VialLabel
              key={`${p.publicId}-${i}`}
              data={p}
              mixDate={mix}
              onMixDateChange={(v) => setDate(p.publicId, i, v)}
              ariaLabel={`Mix date for ${p.planName} label ${i + 1}`}
            />
          ))
        )}
      </div>
      </div>
    </div>
  );
}
