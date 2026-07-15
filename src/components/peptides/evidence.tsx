import { BadgeCheck, HelpCircle } from "lucide-react";
import type { EvidenceClass } from "@/lib/calc/peptides";

/**
 * Evidence badge (PRD v3 §9.1.2). Makes the distinction between an FDA-approved
 * molecule and a research-use compound visible at a glance, so anecdote never
 * sits next to approved medicine without a marker.
 */
export function EvidenceBadge({ evidence }: { evidence: EvidenceClass }) {
  if (evidence === "fda-approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-medium">
        <BadgeCheck className="h-3.5 w-3.5" style={{ color: "var(--color-success)" }} />
        FDA-approved prescription molecule
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-xs font-medium">
      <HelpCircle className="h-3.5 w-3.5" style={{ color: "var(--color-warning)" }} />
      Research use — limited or no human data
    </span>
  );
}

/**
 * "What nobody knows" evidence card (PRD v3 §9.1.3). Honest, non-instructional.
 */
export function WhatNobodyKnows({
  compound,
  evidence,
}: {
  compound: string;
  evidence: EvidenceClass;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <h2 className="text-lg font-serif tracking-tight">What nobody knows</h2>
      {evidence === "fda-approved" ? (
        <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-foreground/90">
          {compound} is an approved molecule, so its approved product has
          official labeling — that labeling, not this site, is the reference for
          amounts. But an unapproved research powder sold under the same name is
          a different thing. There is no assurance it is actually {compound},
          that it is pure, or that the amount matches the label.
        </p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm sm:text-[15px] leading-relaxed text-foreground/90">
          <li>How much, if any, is safe for a person.</li>
          <li>Whether it does anything in people, and what it does over the long term.</li>
          <li>What is actually in your vial — the powder&apos;s identity, purity, and strength.</li>
        </ul>
      )}
    </div>
  );
}
