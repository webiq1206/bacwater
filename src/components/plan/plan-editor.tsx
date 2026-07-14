"use client";

import { PlanForm, type PlanFormInitial } from "@/components/plan/plan-form";
import type { SyringeType } from "@/lib/calc";

interface Initial {
  peptideSlug: string;
  peptideName: string;
  vialStrengthMg: number;
  doseMcg: number;
  bacWaterMl: number;
  syringeType: string;
  dateMixed: string;
  notes: string;
}

// Edit reuses the advanced form, prefilled with the saved plan's values.
export function PlanEditor({ initial }: { initial: Initial }) {
  const prefill: PlanFormInitial = {
    peptideSlug: initial.peptideSlug,
    peptideName: initial.peptideName,
    vialStrengthMg: initial.vialStrengthMg,
    doseMcg: initial.doseMcg,
    bacWaterMl: initial.bacWaterMl,
    syringeType: initial.syringeType as SyringeType,
    dateMixed: initial.dateMixed || null,
  };
  return <PlanForm mode="advanced" initial={prefill} />;
}
