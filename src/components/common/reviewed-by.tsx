import Link from "next/link";
import { LAST_REVIEWED } from "@/lib/content-meta";

/**
 * Company-level accountability line. We deliberately do not use individual
 * bylines (peptides are research-use-only, and implying medical credentials
 * would be worse than none). Instead we state a described, verifiable
 * team-level review process plus a last-reviewed date, which answer engines can
 * lift as a self-contained trust statement. Pairs with `reviewedBy` +
 * `lastReviewed` in the page schema.
 */
export function ReviewedBy({
  className = "",
  updated,
}: {
  className?: string;
  /** When set, shows this page's real "Last updated" date instead of the
   *  site-wide review date. Pass a formatted string like "August 2026". */
  updated?: string;
}) {
  return (
    <div className={`text-xs text-muted-foreground ${className}`}>
      Reviewed and maintained by the{" "}
      <Link
        href="/editorial-policy"
        className="underline decoration-border underline-offset-2 hover:decoration-foreground"
      >
        BACwater.ai editorial team
      </Link>{" "}
      against cited sources.{" "}
      {updated ? `Last updated ${updated}.` : `Last reviewed ${LAST_REVIEWED}.`}
    </div>
  );
}
