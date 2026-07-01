"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mgToMcg, mcgToMg } from "@/lib/calc/converters";

export default function Page() {
  const [mg, setMg] = useState(1);
  const [mcg, setMcg] = useState(1000);
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <h1 className="text-3xl font-semibold tracking-tight">mg ↔ mcg Converter</h1>
      <p className="mt-2 text-sm text-muted-foreground">1 mg = 1,000 mcg.</p>
      <Card className="mt-6">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div>
            <Label>Milligrams (mg)</Label>
            <Input
              type="number"
              step="0.1"
              value={mg}
              onChange={(e) => {
                const v = parseFloat(e.target.value) || 0;
                setMg(v);
                setMcg(mgToMcg(v));
              }}
              className="mt-2"
            />
          </div>
          <div>
            <Label>Micrograms (mcg)</Label>
            <Input
              type="number"
              step="10"
              value={mcg}
              onChange={(e) => {
                const v = parseFloat(e.target.value) || 0;
                setMcg(v);
                setMg(mcgToMg(v));
              }}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
