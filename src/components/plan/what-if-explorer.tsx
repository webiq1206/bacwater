"use client";

import { useState } from "react";
import { formatConcentration, formatUnits } from "@/lib/calc/format";

/**
 * An interactive "what if" for the results page. The saved plan is fixed; this
 * lets a reader drag the BAC water amount and watch the concentration, the
 * volume to measure, and the syringe units change for the SAME target amount,
 * so the water -> strength -> units relationship becomes something you can feel.
 * It computes nothing new about the plan (measurements per vial depend only on
 * the vial and the amount, not the water); it only re-expresses the same dose at
 * a different dilution.
 */
export function WhatIfExplorer({
  vialStrengthMg,
  doseMcg,
  actualBacMl,
}: {
  vialStrengthMg: number;
  doseMcg: number;
  actualBacMl: number;
}) {
  const [bacMl, setBacMl] = useState(actualBacMl);

  const concentration = bacMl > 0 ? vialStrengthMg / bacMl : 0; // mg/mL
  const doseMl = concentration > 0 ? doseMcg / 1000 / concentration : 0;
  const units = doseMl * 100; // U-100 insulin units
  const isActual = Math.abs(bacMl - actualBacMl) < 0.02;
  const overFull = units > 100;

  return (
    <div>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Your plan uses{" "}
        <strong className="text-foreground">{actualBacMl} mL</strong> of BAC
        water. Drag the slider to see how a different amount would change the same{" "}
        <strong className="text-foreground">
          {doseMcg >= 1000 ? `${doseMcg / 1000} mg` : `${doseMcg} mcg`}
        </strong>{" "}
        measurement. This does not change your saved plan.
      </p>

      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="whatif-water" className="text-sm font-medium text-foreground">
            BAC water added
          </label>
          <span className="tabular-nums text-lg font-medium">
            {bacMl.toFixed(2)} mL
            {isActual && (
              <span className="ml-2 text-[10px] uppercase tracking-wide accent-check align-middle">
                your plan
              </span>
            )}
          </span>
        </div>
        <input
          id="whatif-water"
          type="range"
          min={0.5}
          max={5}
          step={0.25}
          value={bacMl}
          onChange={(e) => setBacMl(parseFloat(e.target.value))}
          className="mt-3 w-full accent-[var(--color-accent-guide)]"
          aria-label="BAC water in milliliters"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground tabular-nums">
          <span>0.5 mL</span>
          <span>5 mL</span>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden">
          <Cell label="Concentration" value={`${formatConcentration(concentration)}`} unit="mg/mL" />
          <Cell label="Volume to measure" value={doseMl.toFixed(3)} unit="mL" />
          <Cell
            label="Syringe units"
            value={overFull ? ">100" : formatUnits(units)}
            unit="U-100"
            emphasis
          />
        </div>

        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          {overFull ? (
            <>
              At <strong className="text-foreground">{bacMl.toFixed(2)} mL</strong>{" "}
              the solution is weak enough that one measurement is more than a full
              1 mL syringe. Add less water for a stronger solution and a smaller
              draw.
            </>
          ) : (
            <>
              More water makes the solution weaker, so you measure{" "}
              <strong className="text-foreground">more</strong> for the same
              amount. Less water makes it stronger, so you measure{" "}
              <strong className="text-foreground">less</strong>. Pick an amount
              that lands on a mark you can read.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

function Cell({
  label,
  value,
  unit,
  emphasis,
}: {
  label: string;
  value: string;
  unit: string;
  emphasis?: boolean;
}) {
  return (
    <div className="bg-card px-3 py-3">
      <div className="text-[10px] uppercase text-muted-foreground leading-tight">
        {label}
      </div>
      <div
        className={
          emphasis
            ? "mt-1 text-lg font-medium tabular-nums text-foreground"
            : "mt-1 text-lg tabular-nums text-foreground"
        }
      >
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground">{unit}</div>
    </div>
  );
}
