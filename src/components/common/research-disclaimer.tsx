import Link from "next/link";
import { Info } from "lucide-react";

/**
 * Visible, non-dismissible research-use disclaimer. Placed directly at the
 * point of highest relevance: calculator output and dosage tables, in addition
 * to the persistent site-wide footer version. Required on every page that
 * surfaces reconstitution math or dosing numbers.
 */
export function ResearchDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      role="note"
      className={`flex items-start gap-2.5 border border-border bg-surface px-4 py-3 text-xs text-muted-foreground leading-relaxed ${className}`}
    >
      <Info className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
      <p>
        These tools check the numbers you enter. They do not choose a dose,
        tell you how to use a product or confirm that it is safe. Check the
        label, units and result. Research products are not for people or animals.{" "}
        <Link href="/disclaimer" className="underline hover:text-foreground">
          Read the full disclaimer
        </Link>
        .
      </p>
    </div>
  );
}
