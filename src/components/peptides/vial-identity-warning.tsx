import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

/**
 * "What you cannot know about your vial" (PRD v3 §9.8.2). Shown on every
 * compound page. The math on the page is exact for the numbers a user types;
 * it cannot tell them what is actually in the powder. This is the honest,
 * non-commercial content the PRD says to publish regardless of phase.
 */
export function VialIdentityWarning({ compound }: { compound?: string }) {
  const name = compound || "your compound";
  return (
    <section
      className="mt-8 rounded-2xl border border-warning/40 bg-warning/5 p-6 sm:p-8"
      aria-label="What you cannot know about your vial"
    >
      <div className="flex items-center gap-2.5">
        <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: "var(--color-warning)" }} />
        <h2 className="text-lg sm:text-xl font-serif tracking-tight">
          What you cannot know about your vial
        </h2>
      </div>
      <ul className="mt-4 space-y-3 text-sm sm:text-[15px] leading-relaxed text-foreground/90">
        <li>
          <strong>You cannot see what is really inside.</strong> Independent
          testing in this market has found research powders that were mislabeled,
          weaker or stronger than the label, or contaminated. An unlabeled vial
          tells you nothing you can verify.
        </li>
        <li>
          <strong>&ldquo;Research-grade&rdquo; is not a standard.</strong> It is
          not a grade anyone checks. It does not promise that the powder is{" "}
          {name}, that it is pure, or that the amount matches the label.
        </li>
        <li>
          <strong>No calculation fixes this.</strong> The math here is exact for
          the numbers you type. It cannot tell you whether the powder in your
          vial matches what is printed on it.
        </li>
      </ul>
      <Link
        href="/learn/what-you-cannot-know"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:gap-2 transition-all"
      >
        Read more: what you cannot know about your vial{" "}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
