"use client";
import { clearMassNumbers } from "@/lib/calculator-session";
import { useMassDraft } from "@/lib/use-calculator-session";
export function SessionNotice() {
  const [draft, patch] = useMassDraft();
  if (!draft.vial && !draft.amount && !draft.volume) return null;
  if (!draft.reviewProduct) return <div data-session-notice className="mb-3 flex flex-wrap items-center justify-between gap-x-3 text-xs text-muted-foreground"><p>Entries kept in this tab.</p><button type="button" className="min-h-11 underline" onClick={clearMassNumbers} aria-label="Start with blank numbers">Start over</button></div>;
  return <div data-session-notice className="mb-4 rounded-xl border bg-card p-3 text-xs leading-relaxed">
    <p><strong>Your numbers were kept.</strong> Check them against the new product&apos;s label and instructions.</p>
    <div className="mt-1 flex flex-wrap gap-x-5"><button type="button" className="min-h-11 underline" onClick={() => patch({ reviewProduct: false })}>I checked these numbers</button><button type="button" className="min-h-11 underline" onClick={clearMassNumbers}>Start with blank numbers</button></div>
  </div>;
}
