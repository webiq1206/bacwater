"use client";

import {
  AlertTriangle,
  Check,
  ClipboardList,
  Info,
  ListChecks,
  MessageCircle,
  SlidersHorizontal,
  Snowflake,
} from "lucide-react";
import type { CalcResult } from "@/lib/calc";
import { SyringeVisual } from "@/components/plan/syringe-visual";
import { ShelfLifeTimeline } from "@/components/plan/shelf-life-timeline";
import { formatDate } from "@/lib/utils";
import {
  formatConcentration,
  formatDose,
  formatMl,
  formatUnits,
} from "@/lib/calc/format";
import { SupplyRecommender } from "@/components/plan/supply-recommender";
import { ResearchDisclaimer } from "@/components/common/research-disclaimer";
import { ProvenanceChip, type Provenance } from "@/components/common/provenance-chip";
import { Callout } from "@/components/common/callout";
import { WhatIfExplorer } from "@/components/plan/what-if-explorer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
  result: CalcResult;
}

export function PlanResults({ result }: Props) {
  const { syringeReadout } = result;
  const doseLabel = formatDose(result.input.doseMcg);
  // BAC water is a user input to the concentration math, but the builder offers
  // a recommended amount most people accept. Label it "we calculated" when it
  // matches that recommendation, "you entered" when it was overridden, so the
  // provenance chip stays honest either way.
  const bacSource: Provenance =
    Math.abs(result.usedBacMl - result.recommendedBacMl) < 0.01
      ? "calculated"
      : "user";

  return (
    <div className="space-y-5">
      {/* 1, PLAN SUMMARY (hero) ------------------------------------------- */}
      <section className="border border-border bg-card rounded-2xl p-6 sm:p-8">
        <div className="eyebrow">Your plan</div>
        <h2 className="mt-1 text-2xl sm:text-3xl font-serif tracking-tight">
          {result.input.peptideName || "Reconstitution plan"}
        </h2>

        <div className="mt-6 rounded-xl bg-accent-guide-soft p-5 sm:p-6">
          <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
            Measure this much each time
          </div>
          <div className="mt-1 result-hero">
            {syringeReadout.kind === "u100"
              ? `${formatUnits(syringeReadout.valueRounded)} units`
              : `${formatMl(syringeReadout.valueRounded)} mL`}
          </div>
          <div className="mt-1.5 text-sm text-muted-foreground">
            on your{" "}
            {result.input.syringeType
              .replace("insulin-", "")
              .replace("ml", " mL")}{" "}
            syringe · that&apos;s {doseLabel} ={" "}
            {result.doseVolumeMl.toFixed(3)} mL
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
          <Stat label="Vial" value={`${result.input.vialStrengthMg} mg`} source="user" />
          <Stat label="BAC water" value={`${formatMl(result.usedBacMl)} mL`} source={bacSource} />
          <Stat
            label="Concentration"
            value={`${formatConcentration(result.finalConcentrationMgPerMl)} mg/mL`}
            sub={`${result.finalConcentrationMcgPerMl.toLocaleString()} mcg/mL`}
            source="calculated"
          />
          <Stat label="Measures / vial" value={`${result.dosesPerVial}`} source="calculated" />
        </div>

        <div className="mt-6">
          <SyringeVisual
            fillPercent={syringeReadout.fillPercent}
            readoutLabel={syringeReadout.displayLabel}
            scale={syringeReadout.kind}
            maxLabel={syringeReadout.kind === "u100" ? "100 units" : "1 mL"}
          />
        </div>

        {result.warnings.length > 0 && (
          <div className="mt-6 space-y-2">
            {result.warnings.map((w, i) => (
              <div key={i} className="warning-strip flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> {w}
              </div>
            ))}
          </div>
        )}

        <ResearchDisclaimer className="mt-6" />
      </section>

      {/* 2, PLAIN ENGLISH (supporting) ----------------------------------- */}
      <section className="callout-panel rounded-2xl">
        <div className="flex items-center gap-2.5 mb-3">
          <MessageCircle className="h-5 w-5 accent-check" />
          <h3 className="text-lg font-serif tracking-tight">In plain English</h3>
        </div>
        <div className="text-[15px] leading-relaxed space-y-3">
          <p>
            Your vial holds{" "}
            <strong>
              {result.input.vialStrengthMg} mg
            </strong>{" "}
            of {result.input.peptideName || "peptide"} powder. Add{" "}
            <strong>{formatMl(result.usedBacMl)} mL of BAC water</strong> and
            swirl gently until it&apos;s clear.
          </p>
          <p>
            Measuring{" "}
            <strong>{result.syringeReadout.displayLabel}</strong> each time gives
            you <strong>{doseLabel}</strong>. You&apos;ll get about{" "}
            <strong>{result.dosesPerVial} measurements</strong> from the vial.
          </p>
          {result.secondary && (
            <p>
              Because this is a blend, each draw also delivers{" "}
              <strong>
                {formatDose(result.secondary.companionDoseMcg)}
              </strong>{" "}
              of {result.secondary.peptideName}.
            </p>
          )}
        </div>
      </section>

      {/* 2b, UNDERSTAND YOUR PLAN (the §15 clarity self-check) ----------- */}
      <PlanSelfCheck result={result} bacSource={bacSource} doseLabel={doseLabel} />

      {/* 3, RECOMMENDED SUPPLIES / SHOP ---------------------------------- */}
      <SupplyRecommender supplies={result.supplies} />

      {/* 4, DOSAGE REFERENCE (visual) ------------------------------------ */}
      <DosageReference result={result} />

      {/* 5, SECONDARY INFO (collapsed by default) ------------------------ */}
      <section className="border border-border bg-card rounded-2xl px-6 sm:px-8">
        <Accordion type="multiple">
          <AccordionItem value="steps" className="border-b-0 border-t border-border first:border-t-0">
            <AccordionTrigger>
              <span className="flex items-center gap-2.5">
                <ListChecks className="h-4 w-4 accent-check" />
                Step-by-step mixing instructions
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground mb-4">
                Follow these in order. Take your time. There&apos;s no rush.
              </p>
              <ol className="space-y-4">
                {result.instructions.map((s, i) => (
                  <li key={i} className="flex gap-4 text-sm text-foreground">
                    <span className="step-number--filled step-number text-[11px] shrink-0">
                      {i + 1}
                    </span>
                    <span className="pt-1 leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="storage" className="border-b-0 border-t border-border">
            <AccordionTrigger>
              <span className="flex items-center gap-2.5">
                <Snowflake className="h-4 w-4 accent-check" />
                Storage &amp; shelf life
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  {result.expiration.note}
                </p>
                <div className="text-right">
                  <div className="text-2xl font-serif tabular-nums text-foreground">
                    {result.expiration.days} days
                  </div>
                  <div className="text-xs text-muted-foreground">refrigerated</div>
                  <div className="mt-1.5 flex justify-end">
                    <ProvenanceChip source="research" />
                  </div>
                  {result.expiration.date && (
                    <div className="mt-1 text-sm font-medium text-foreground">
                      Discard {formatDate(result.expiration.date)}
                    </div>
                  )}
                </div>
              </div>
              <ShelfLifeTimeline
                peptideName={result.input.peptideName}
                shelfDays={result.expiration.days}
                dateMixed={result.input.dateMixed}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="whatif" className="border-b-0 border-t border-border">
            <AccordionTrigger>
              <span className="flex items-center gap-2.5">
                <SlidersHorizontal className="h-4 w-4 accent-check" />
                What if I used more or less water?
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <WhatIfExplorer
                vialStrengthMg={result.input.vialStrengthMg}
                doseMcg={result.input.doseMcg}
                actualBacMl={result.usedBacMl}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="assumptions" className="border-b-0 border-t border-border">
            <AccordionTrigger>
              <span className="flex items-center gap-2.5">
                <Info className="h-4 w-4 accent-check" />
                How we calculated this
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-muted-foreground">
                {result.assumptions.map((a, i) => (
                  <li key={i} className="flex gap-2.5">
                    <Check className="h-4 w-4 mt-0.5 accent-check shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="next" className="border-b-0 border-t border-border">
            <AccordionTrigger>
              <span className="flex items-center gap-2.5">
                <ClipboardList className="h-4 w-4 accent-check" />
                What to do next
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ol className="space-y-3 text-sm">
                {[
                  ["Save your plan", "get a permanent link, PDF, and printable vial labels."],
                  ["Gather your supplies", "the list above tells you exactly what to order."],
                  ["Follow the instructions", "the step-by-step guide walks you through mixing."],
                  ["Measure to the mark", "the syringe diagram shows exactly where to measure."],
                ].map(([title, rest], i) => (
                  <li key={i} className="flex gap-3">
                    <span className="step-number step-number--filled shrink-0 mt-0.5 h-5 w-5 text-[9px]">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">
                      <strong className="text-foreground">{title}</strong>
                      <span className="text-muted-foreground">: {rest}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}

/**
 * The §15 clarity self-check. The PRD's bar for a good result is that a user can
 * answer a short set of questions about their own plan unaided: how much water,
 * how strong, how much they measure, where it lands, how many measurements, how
 * long it lasts, and which numbers came from them versus the calculator. This
 * section answers each with the plan's own values and a provenance chip, then
 * states plainly what the plan did NOT decide.
 */
function PlanSelfCheck({
  result,
  bacSource,
  doseLabel,
}: {
  result: CalcResult;
  bacSource: Provenance;
  doseLabel: string;
}) {
  const { syringeReadout } = result;
  const syringeName = result.input.syringeType
    .replace("insulin-", "")
    .replace("ml", " mL");

  const rows: {
    q: string;
    a: React.ReactNode;
    source?: Provenance;
  }[] = [
    {
      q: "How much water do I add?",
      a: `${formatMl(result.usedBacMl)} mL of BAC water`,
      source: bacSource,
    },
    {
      q: "How strong is the mixed vial?",
      a: `${formatConcentration(result.finalConcentrationMgPerMl)} mg/mL (${result.finalConcentrationMcgPerMl.toLocaleString()} mcg/mL)`,
      source: "calculated",
    },
    {
      q: "How much do I measure each time?",
      a: `${doseLabel}, which is ${result.doseVolumeMl.toFixed(3)} mL`,
      source: "user",
    },
    {
      q: "Where does that land on my syringe?",
      a: `${syringeReadout.displayLabel} on your ${syringeName} syringe`,
      source: "calculated",
    },
    {
      q: "How many measurements will the vial give?",
      a: `About ${result.dosesPerVial}`,
      source: "calculated",
    },
    {
      q: "How long does it last once mixed?",
      a: `${result.expiration.days} days refrigerated`,
      source: "research",
    },
  ];

  return (
    <section className="border border-border bg-card rounded-2xl p-6 sm:p-8">
      <h3 className="text-lg font-serif tracking-tight">Can you answer these?</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        A good plan is one you understand. Here is every number it depends on, and
        where each came from.
      </p>

      <dl className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-4">
        {rows.map((row) => (
          <div key={row.q} className="flex flex-col">
            <dt className="text-sm font-medium text-foreground">{row.q}</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="tabular-nums">{row.a}</span>
              {row.source && <ProvenanceChip source={row.source} />}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 pt-5 border-t border-border text-sm text-muted-foreground leading-relaxed">
        <span className="font-medium text-foreground">Which numbers are mine?</span>{" "}
        You entered the vial amount, how much to measure, and your syringe. The
        site worked out the concentration, the syringe units, and the measurements
        per vial. The shelf life comes from published research.
      </div>

      <Callout variant="note" className="mt-5" title="What this plan does not decide">
        This plan turns the numbers on your vial into a concentration and a
        syringe measurement. It does not decide how much to use, how often, or
        whether a compound is safe or right for anyone. Those are not math, and
        this site does not answer them.{" "}
        <a
          href="/learn/what-you-cannot-know"
          className="font-medium underline underline-offset-4"
        >
          Read what no calculation can verify about your vial.
        </a>
      </Callout>
    </section>
  );
}

/**
 * A compact, visual dosage reference so users can see what common draws deliver
 * at their concentration. Mirrors the dosage table in the downloadable PDF; the
 * user's own dose row is highlighted.
 */
function DosageReference({ result }: { result: CalcResult }) {
  const isU100 = result.syringeReadout.kind === "u100";
  const concMcgPerMl = result.finalConcentrationMcgPerMl;

  type Row = { draw: string; volume: string; amount: string; active: boolean };
  const rows: Row[] = [];

  if (isU100) {
    const userUnits = Math.round(result.syringeReadout.valueRounded / 5) * 5;
    for (let u = 5; u <= 50; u += 5) {
      const ml = u / 100;
      rows.push({
        draw: `${u} units`,
        volume: `${ml.toFixed(2)} mL`,
        amount: formatDose(Math.round(ml * concMcgPerMl)),
        active: u === userUnits,
      });
    }
  } else {
    const userMl = Math.round(result.syringeReadout.valueRounded * 10) / 10;
    for (let i = 1; i <= 10; i++) {
      const ml = i / 10;
      rows.push({
        draw: `${ml.toFixed(1)} mL`,
        volume: `${ml.toFixed(2)} mL`,
        amount: formatDose(Math.round(ml * concMcgPerMl)),
        active: Math.abs(ml - userMl) < 0.001,
      });
    }
  }

  return (
    <section className="border border-border bg-card rounded-2xl p-6 sm:p-8">
      <h3 className="text-lg font-serif tracking-tight">Dosage reference</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        At {formatConcentration(result.finalConcentrationMgPerMl)} mg/mL, here&apos;s
        what each amount delivers. Your amount is highlighted.
      </p>
      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">Measure</th>
              <th className="px-4 py-2.5 font-medium">Volume</th>
              <th className="px-4 py-2.5 font-medium text-right">Delivers</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className={
                  r.active
                    ? "bg-accent-guide-soft font-medium text-foreground"
                    : "border-t border-border text-muted-foreground"
                }
              >
                <td className="px-4 py-2.5 tabular-nums">
                  {r.draw}
                  {r.active && (
                    <span className="ml-2 text-[10px] uppercase tracking-wide accent-check">
                      your amount
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 tabular-nums">{r.volume}</td>
                <td className="px-4 py-2.5 tabular-nums text-right">{r.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  sub,
  source,
}: {
  label: string;
  value: string;
  sub?: string;
  source?: Provenance;
}) {
  return (
    <div className="bg-card px-4 py-4">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1.5 text-lg tabular-nums text-foreground">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      {source && (
        <div className="mt-1.5">
          <ProvenanceChip source={source} />
        </div>
      )}
    </div>
  );
}
