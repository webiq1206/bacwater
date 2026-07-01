"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const [doses, setDoses] = useState(30);
  const [dosesPerVial, setDosesPerVial] = useState(20);
  const [bacPerVial, setBacPerVial] = useState(2); // mL

  const vials = Math.ceil(doses / Math.max(1, dosesPerVial));
  const bacMl = vials * bacPerVial;
  const bacVials = Math.max(1, Math.ceil(bacMl / 30));
  const syringes = Math.max(1, doses);
  const pads = Math.max(1, doses * 2);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-10 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight">Supply Calculator</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Estimate how many vials, syringes, and pads you need for a cycle.
      </p>
      <Card className="mt-6">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <div>
            <Label>Total doses in cycle</Label>
            <Input type="number" value={doses} onChange={(e) => setDoses(parseInt(e.target.value) || 0)} className="mt-2" />
          </div>
          <div>
            <Label>Doses per peptide vial</Label>
            <Input type="number" value={dosesPerVial} onChange={(e) => setDosesPerVial(parseInt(e.target.value) || 0)} className="mt-2" />
          </div>
          <div>
            <Label>BAC water used per peptide vial (mL)</Label>
            <Input type="number" step="0.5" value={bacPerVial} onChange={(e) => setBacPerVial(parseFloat(e.target.value) || 0)} className="mt-2" />
          </div>
          <div className="rounded-2xl bg-muted/70 p-5 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Peptide vials</span><span className="font-semibold">{vials}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">BAC water (30 mL vials)</span><span className="font-semibold">{bacVials}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Syringes</span><span className="font-semibold">{syringes}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Alcohol prep pads</span><span className="font-semibold">{pads}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
