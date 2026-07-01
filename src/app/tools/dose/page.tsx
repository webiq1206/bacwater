"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [conc, setConc] = useState(2500); // mcg/mL
  const [ml, setMl] = useState(0.1);
  const dose = conc * ml;
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-10 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight">Dose Calculator</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Given a concentration and a volume, what dose are you drawing?
      </p>
      <Card className="mt-6">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div>
            <Label>Concentration (mcg/mL)</Label>
            <Input type="number" value={conc} onChange={(e) => setConc(parseFloat(e.target.value) || 0)} className="mt-2" />
          </div>
          <div>
            <Label>Volume (mL)</Label>
            <Input type="number" step="0.01" value={ml} onChange={(e) => setMl(parseFloat(e.target.value) || 0)} className="mt-2" />
          </div>
          <div className="rounded-2xl bg-brand-soft border border-emerald-100 p-5 text-center">
            <div className="text-xs uppercase tracking-wider text-emerald-800">Dose</div>
            <div className="mt-1 text-4xl font-semibold text-brand tabular-nums">{dose.toFixed(1)} mcg</div>
            <div className="mt-1 text-xs text-emerald-900/80">
              = {(dose / 1000).toFixed(3)} mg
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
