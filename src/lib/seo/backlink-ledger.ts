/**
 * The backlink register and its rules.
 *
 * One file is the source of truth for every placement, so a claim cannot exist
 * in prose without a matching record. Status is deliberately narrow, and the
 * two "live" statuses are the only ones a verification run may assign:
 *
 *   opportunity  researched, nothing submitted. No link exists.
 *   submitted    sent or published by us, not yet seen live by the verifier.
 *   live         the anchor was read on the live page and passes equity.
 *   live-nofollow the anchor was read and does NOT pass equity.
 *   rejected     the platform declined, removed it, or the page is gone.
 *
 * `attributes` is only ever written by scripts/verify-backlinks.ts from HTML it
 * actually read. A human or an agent may set `opportunity` or `submitted`, but
 * may not hand-write a `live` status: promoting a record is the verifier's job,
 * and verifyLedger() fails the run when a record claims otherwise.
 */

export type PlacementStatus = "opportunity" | "submitted" | "live" | "live-nofollow" | "rejected";

export interface VerifiedAttributes {
  /** ISO timestamp of the run that read the page. */
  checkedAt: string;
  httpStatus: number | null;
  /** rel tokens found on the anchor. */
  rel: string[];
  dofollow: boolean;
  anchorText: string | null;
  /** Absolute destination the anchor actually points at. */
  destination: string | null;
  pageNofollow: boolean;
  pageNoindex: boolean;
  /** Why the run reached its conclusion, or why it could not. */
  note: string;
}

export interface Placement {
  id: string;
  /** Host, for grouping. */
  domain: string;
  /** The page that carries (or would carry) the link. Null when not yet placed. */
  placementUrl: string | null;
  /** The page on our site the link points at. */
  destinationPath: string;
  status: PlacementStatus;
  /** How the link is or would be earned, in one line. No outreach implied. */
  method: string;
  /** Why this platform is relevant to a reconstitution calculator. */
  relevance: string;
  /** What still has to happen, and who can do it. Empty when live. */
  nextStep: string;
  /** Anything a reader needs in order to judge the record. */
  notes?: string;
  /** Written only by the verifier, from HTML it read. */
  attributes?: VerifiedAttributes;
}

export interface Ledger {
  site: string;
  /** Host used for anchor matching. */
  host: string;
  updated: string;
  placements: Placement[];
}

export const LIVE_STATUSES: readonly PlacementStatus[] = ["live", "live-nofollow"];

/**
 * Structural and honesty checks. These are what stop the register drifting into
 * a list of claims: a live status with no verification attached is a failure,
 * not a warning.
 */
export function verifyLedger(ledger: Ledger): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const placement of ledger.placements) {
    const where = `placement "${placement.id}"`;
    if (seen.has(placement.id)) problems.push(`${where}: duplicate id`);
    seen.add(placement.id);
    if (!/^[a-z0-9][a-z0-9-]*$/.test(placement.id)) problems.push(`${where}: id must be lowercase kebab-case`);
    if (!placement.destinationPath.startsWith("/")) problems.push(`${where}: destinationPath must be a site-relative path`);
    if (!placement.method.trim()) problems.push(`${where}: method is required`);
    if (!placement.relevance.trim()) problems.push(`${where}: relevance is required`);

    const isLive = LIVE_STATUSES.includes(placement.status);
    if (isLive && !placement.placementUrl) problems.push(`${where}: a live status needs the page the link is on`);
    if (isLive && !placement.attributes) {
      problems.push(`${where}: status "${placement.status}" without verified attributes. Only scripts/verify-backlinks.ts may set a live status.`);
    }
    if (placement.status === "live" && placement.attributes && !placement.attributes.dofollow) {
      problems.push(`${where}: recorded as live (dofollow) but the verified attributes say it is not dofollow`);
    }
    if (placement.status === "live-nofollow" && placement.attributes?.dofollow) {
      problems.push(`${where}: recorded as live-nofollow but the verified attributes say it is dofollow`);
    }
    if (placement.status === "opportunity" && placement.placementUrl) {
      problems.push(`${where}: an opportunity has no placement URL yet; put the target page in notes instead`);
    }
    if (!isLive && placement.attributes) {
      problems.push(`${where}: attributes are only written for a verified live placement`);
    }
    if (!isLive && !placement.nextStep.trim()) problems.push(`${where}: a non-live placement must say what happens next`);
  }
  return problems;
}

export function countByStatus(ledger: Ledger): Record<PlacementStatus, number> {
  const counts: Record<PlacementStatus, number> = { opportunity: 0, submitted: 0, live: 0, "live-nofollow": 0, rejected: 0 };
  for (const placement of ledger.placements) counts[placement.status] += 1;
  return counts;
}
