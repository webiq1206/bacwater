"use client";

import Link from "next/link";
import { ArrowRight, HelpCircle, Lightbulb, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mgToMcg, mcgToMg } from "@/lib/calc/converters";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { usePersistentState } from "@/lib/use-persistent-state";

export default function MgMcgConverterPage() {
  const [mg, setMg] = usePersistentState("bacwater.tool.mgmcg.mg", 0);
  const [mcg, setMcg] = usePersistentState("bacwater.tool.mgmcg.mcg", 0);
  const hasValue = mg > 0 || mcg > 0;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Tools", href: "/tools" },
        { label: "mg to mcg Converter", href: "/tools/mg-to-mcg" },
      ]} />
      <div className="eyebrow">Converter</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        mg &harr; mcg
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">
        Peptide labels use both milligrams (mg) and micrograms (mcg). They
        measure the same thing at different scales. Type a number in either
        box and the other updates instantly.
      </p>

      {/* Converter card */}
      <div className="border border-border bg-card p-6 sm:p-8 mt-10">
          <div className="grid gap-6 sm:grid-cols-2 items-end">
            <div>
              <label className="text-sm font-medium">Milligrams (mg)</label>
              <p className="text-xs text-muted-foreground mt-0.5">The larger unit. Vial amounts are usually in mg</p>
              <Input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={mg || ""}
                placeholder="0"
                onChange={(e) => {
                  const v = parseFloat(e.target.value) || 0;
                  setMg(v);
                  setMcg(mgToMcg(v));
                }}
                className="mt-2 text-lg h-12"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Micrograms (mcg)</label>
              <p className="text-xs text-muted-foreground mt-0.5">The smaller unit. Measurements are usually in mcg</p>
              <Input
                type="number"
                inputMode="decimal"
                step="10"
                value={mcg || ""}
                placeholder="0"
                onChange={(e) => {
                  const v = parseFloat(e.target.value) || 0;
                  setMcg(v);
                  setMg(mcgToMg(v));
                }}
                className="mt-2 text-lg h-12"
              />
            </div>
          </div>

          <div className="mt-6 callout-panel text-center">
            {hasValue ? (
              <div className="text-xl font-semibold">{mg} mg = {mcg.toLocaleString()} mcg</div>
            ) : (
              <div className="text-xl font-semibold text-muted-foreground">Type a number in either box</div>
            )}
            <p className="mt-1 text-sm text-muted-foreground">1 milligram always equals 1,000 micrograms.</p>
          </div>

          <div className="mt-6 bg-surface border border-border p-4">
            <p className="text-sm font-medium">Quick reference</p>
            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              {[
                [0.1, 100], [0.25, 250], [0.5, 500], [1, 1000],
                [2, 2000], [5, 5000], [10, 10000], [15, 15000],
              ].map(([m, u]) => (
                <div key={m} className="flex justify-between text-muted-foreground">
                  <span>{m} mg</span>
                  <span className="tabular-nums">{u.toLocaleString()} mcg</span>
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
      </div>

      {/* Teaching sections */}
      <div className="mt-16 space-y-10">
        <TeachingSection
          icon={<Scale className="h-5 w-5 text-muted-foreground" />}
          title="What's the difference between mg and mcg?"
        >
          <p>
            Both measure weight, just at different scales, like feet vs. inches.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><b>mg (milligram)</b>: one thousandth of a gram. Vial amounts are usually listed in mg (e.g., &ldquo;5 mg vial&rdquo;).</li>
            <li><b>mcg (microgram)</b>: one millionth of a gram, or one thousandth of a milligram. The amounts you measure are usually listed in mcg (e.g., &ldquo;250 mcg per measurement&rdquo;).</li>
          </ul>
          <p>
            <b>The rule is simple:</b> 1 mg = 1,000 mcg. To go from mg to mcg,
            multiply by 1,000. To go from mcg to mg, divide by 1,000.
          </p>
        </TeachingSection>

        <TeachingSection
          icon={<HelpCircle className="h-5 w-5 text-muted-foreground" />}
          title="Why do labels use both?"
        >
          <p>
            Vial amounts use mg because the total amount of peptide is large enough
            that mg keeps the numbers simple (e.g., &ldquo;5 mg&rdquo; instead of
            &ldquo;5,000 mcg&rdquo;).
          </p>
          <p>
            The amounts you measure use mcg because they are much smaller, and mcg
            avoids confusing decimals (e.g., &ldquo;250 mcg&rdquo; instead of
            &ldquo;0.25 mg&rdquo;).
          </p>
          <p>
            This is why it can feel confusing, but once you know the conversion
            (multiply or divide by 1,000), it becomes second nature.
          </p>
        </TeachingSection>

        <TeachingSection
          icon={<Lightbulb className="h-5 w-5 text-muted-foreground" />}
          title="A real-world example"
        >
          <p>
            You have a <b>5 mg vial</b> of BPC-157 and want to measure <b>250 mcg each time</b>.
          </p>
          <p>
            First, convert 250 mcg to mg: 250 &divide; 1,000 = 0.25 mg.
          </p>
          <p>
            Now you can see how many measurements fit in the vial: 5 mg &divide; 0.25 mg = <b>20 measurements</b>.
          </p>
          <p>
            Our <Link href="/plan" className="text-foreground underline font-medium">plan builder</Link> does
            all of this math for you automatically, including the syringe units
            and BAC water amount.
          </p>
        </TeachingSection>
      </div>

      {/* Related tools */}
      <div className="mt-16">
        <h2 className="text-2xl font-serif font-medium tracking-tight">Related tools</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <RelatedTool href="/tools/syringe-units" title="Syringe Unit Converter" body="Convert between mL and insulin syringe units (100 units = 1 mL)." />
          <RelatedTool href="/tools/bac-water" title="BAC Water Calculator" body="Find out how much BAC water to add to your peptide vial." />
        </div>
      </div>
    </div>
  );
}

function TeachingSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 border-2 border-foreground/20 grid place-items-center shrink-0">{icon}</div>
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
    <Link href={href} className="group block border border-border hover:bg-muted transition-colors p-5">
      <h3 className="font-semibold group-hover:underline">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
        Open <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
