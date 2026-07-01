"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, HelpCircle, Lightbulb, Ruler, Syringe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mlToU100, u100ToMl } from "@/lib/calc/converters";

export default function SyringeUnitConverterPage() {
  const [ml, setMl] = useState(0.1);
  const [units, setUnits] = useState(10);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <div className="eyebrow">Converter</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        Syringe units &harr; mL
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">
        Insulin syringes are marked in &ldquo;units&rdquo; instead of milliliters.
        Type a number in either box and the other updates instantly.
      </p>

      {/* Converter card */}
      <Card className="mt-10">
        <CardContent className="p-7 sm:p-9">
          <div className="grid gap-6 sm:grid-cols-2 items-end">
            <div>
              <label className="text-sm font-medium">Syringe units</label>
              <p className="text-xs text-muted-foreground mt-0.5">The number you see on an insulin syringe</p>
              <Input
                type="number"
                inputMode="decimal"
                step="1"
                value={units}
                onChange={(e) => {
                  const v = parseFloat(e.target.value) || 0;
                  setUnits(v);
                  setMl(u100ToMl(v));
                }}
                className="mt-2 text-lg h-12"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Milliliters (mL)</label>
              <p className="text-xs text-muted-foreground mt-0.5">The actual volume of liquid</p>
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={ml}
                onChange={(e) => {
                  const v = parseFloat(e.target.value) || 0;
                  setMl(v);
                  setUnits(mlToU100(v));
                }}
                className="mt-2 text-lg h-12"
              />
            </div>
          </div>

          <div className="mt-6 bg-muted border border-border p-5 text-center">
            <div className="text-lg font-medium text-foreground">
              {units} units = {ml} mL
            </div>
            <p className="mt-1 text-xs text-foreground/70">
              On a U-100 insulin syringe, 100 units always equals 1 mL.
            </p>
          </div>

          <div className="mt-6 bg-muted/60 border border-border p-4">
            <p className="text-sm font-medium">Quick reference</p>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              {[
                [5, 0.05], [10, 0.1], [15, 0.15], [20, 0.2],
                [25, 0.25], [30, 0.3], [50, 0.5], [100, 1.0],
              ].map(([u, m]) => (
                <div key={u} className="flex justify-between text-muted-foreground">
                  <span>{u} units</span>
                  <span className="tabular-nums">{m} mL</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="brand" size="lg">
              <Link href="/plan">
                Build a full plan <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/tools/dose">Dose calculator</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teaching sections */}
      <div className="mt-16 space-y-10">
        <TeachingSection
          icon={<Syringe className="h-5 w-5 text-muted-foreground" />}
          title="What are syringe units?"
        >
          <p>
            Insulin syringes use a special scale called &ldquo;units&rdquo;
            instead of milliliters (mL). This scale was designed for insulin, but
            the same syringes are commonly used for peptide injections.
          </p>
          <p>
            On a <b>U-100 syringe</b> (the most common type), the conversion is
            simple: <b>100 units = 1 mL</b>. So each unit is 0.01 mL, a tiny
            amount of liquid.
          </p>
        </TeachingSection>

        <TeachingSection
          icon={<Ruler className="h-5 w-5 text-muted-foreground" />}
          title="How do I read my syringe?"
        >
          <p>
            Look at the markings on the barrel of your syringe. Most insulin
            syringes have numbers printed along the side. Those are units.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><b>0.3 mL syringe</b>: goes up to 30 units, each tiny line = 0.5 units</li>
            <li><b>0.5 mL syringe</b>: goes up to 50 units, each line = 1 unit</li>
            <li><b>1 mL syringe</b>: goes up to 100 units, each line = 1 unit</li>
          </ul>
          <p>
            When a plan says &ldquo;draw 10 units,&rdquo; pull the plunger back until
            the top of the rubber stopper lines up with the 10 mark.
          </p>
        </TeachingSection>

        <TeachingSection
          icon={<HelpCircle className="h-5 w-5 text-muted-foreground" />}
          title="Why not just use mL?"
        >
          <p>
            Syringe units exist because insulin doses are very small, often just
            a few hundredths of a milliliter. Saying &ldquo;10 units&rdquo; is
            easier and less error-prone than saying &ldquo;0.1 mL.&rdquo;
          </p>
          <p>
            For peptide reconstitution, working in units makes dosing simpler.
            That&apos;s why our plan builder gives you your dose in units.
            just draw to that line on your syringe.
          </p>
        </TeachingSection>
      </div>

      {/* Related tools */}
      <div className="mt-16">
        <h2 className="text-2xl font-serif font-medium tracking-tight">Related tools</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <RelatedTool href="/tools/dose" title="Dose Calculator" body="Know your concentration and volume? Find out exactly what dose you're getting." />
          <RelatedTool href="/tools/mg-to-mcg" title="mg ↔ mcg Converter" body="Convert between milligrams and micrograms. 1 mg = 1,000 mcg." />
        </div>
      </div>
    </div>
  );
}

function TeachingSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 border border-border grid place-items-center shrink-0">{icon}</div>
        <h3 className="text-lg font-serif font-medium">{title}</h3>
      </div>
      <div className="mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed pl-[52px]">
        {children}
      </div>
    </div>
  );
}

function RelatedTool({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="group">
      <Card className="h-full hover:bg-muted/50 transition-colors">
        <CardContent className="p-6">
          <h3 className="font-semibold group-hover:underline">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:gap-2 transition-all">
            Open <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
