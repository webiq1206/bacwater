"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mlToU100, u100ToMl } from "@/lib/calc/converters";

export default function Page() {
  const [ml, setMl] = useState(0.1);
  const [units, setUnits] = useState(10);
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-10 pb-24">
      <h1 className="text-3xl font-semibold tracking-tight">Syringe Unit Converter</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Convert between mL and U-100 insulin syringe units (100 units = 1 mL).
      </p>
      <Card className="mt-6">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div>
            <Label>Volume (mL)</Label>
            <Input
              type="number"
              step="0.01"
              value={ml}
              onChange={(e) => {
                const v = parseFloat(e.target.value) || 0;
                setMl(v);
                setUnits(mlToU100(v));
              }}
              className="mt-2"
            />
          </div>
          <div>
            <Label>U-100 syringe units</Label>
            <Input
              type="number"
              step="0.5"
              value={units}
              onChange={(e) => {
                const v = parseFloat(e.target.value) || 0;
                setUnits(v);
                setMl(u100ToMl(v));
              }}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
