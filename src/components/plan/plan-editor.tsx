"use client";

import { PlanForm } from "@/components/plan/plan-form";

interface Initial {
  peptideSlug: string;
  peptideName: string;
  vialStrengthMg: number;
  doseMcg: number;
  bacWaterMl: number;
  syringeType: never;
  dateMixed: string;
  notes: string;
}

// For simplicity, edit reuses the advanced form (state is internal to PlanForm).
// A fuller build would hydrate PlanForm with these initials - deferred for now.
export function PlanEditor(_props: { initial: Initial }) {
  return <PlanForm mode="advanced" />;
}
