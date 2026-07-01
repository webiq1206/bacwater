"use client";

import { useState } from "react";
import { recommendBacWaterMl } from "@/lib/calc";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [vial, setVial] = useState(5);
  const [dose, setDose] = useState(250);
  const rec = recommendBacWaterMl(vial, dose);
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-10 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight">BAC Water Calculator</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Get the recommended BAC water amount for clean syringe math.
      </p>
      <Card className="mt-6">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div>
            <Label>Vial strength (mg)</Label>
            <Input type="number" step="0.5" value={vial} onChange={(e) => setVial(parseFloat(e.target.value) || 0)} className="mt-2" />
          </div>
          <div>
            <Label>Dose (mcg)</Label>
            <Input type="number" step="10" value={dose} onChange={(e) => setDose(parseFloat(e.target.value) || 0)} className="mt-2" />
          </div>
          <div className="rounded-2xl bg-brand-soft border border-emerald-100 p-5 text-center">
            <div className="text-xs uppercase tracking-wider text-emerald-800">Recommended</div>
            <div className="mt-1 text-4xl font-semibold text-brand tabular-nums">{rec} mL</div>
            <div className="mt-1 text-xs text-emerald-900/80">
              Targets ~10 units per dose on a U-100 syringe.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
