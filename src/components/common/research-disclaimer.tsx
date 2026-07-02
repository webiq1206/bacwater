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
        This is general reconstitution math for research and informational
        purposes only. It is not medical advice and does not create a
        doctor-patient relationship. Always confirm any dose against the
        product&apos;s own documentation and a licensed healthcare provider
        before use.{" "}
        <Link href="/disclaimer" className="underline hover:text-foreground">
          Read the full disclaimer
        </Link>
        .
      </p>
    </div>
  );
}
