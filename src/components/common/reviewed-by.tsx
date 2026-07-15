import Link from "next/link";
import { LAST_REVIEWED } from "@/lib/content-meta";

/**
 * Company-level accountability line. We deliberately do not use individual
 * bylines or imply medical credentials — peptides here are research-use-only,
 * and a fabricated "clinician-reviewed" claim would be worse than none. We only
 * assert what is actually true and verifiable: the page is compiled by the site
 * team and checked against the sources cited on it, and it is explicitly not a
 * medical review. Pairs with an organization-level `reviewedBy` in the page
 * schema (an Organization, never a named/credentialed person).
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
      Compiled and maintained by the{" "}
      <Link
        href="/editorial-policy"
        className="underline decoration-border underline-offset-2 hover:decoration-foreground"
      >
        BACwater.ai editorial team
      </Link>{" "}
      and checked against the sources cited on this page. This is general
      research information, not a medical review.{" "}
      {updated ? `Last updated ${updated}.` : `Last updated ${LAST_REVIEWED}.`}
    </div>
  );
}
