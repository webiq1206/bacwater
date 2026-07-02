/**
 * Shared content freshness marker. Bump this during each quarterly content
 * audit (see docs/content-freshness.md) so every generated page shows an
 * accurate "Last reviewed" date. One edit updates the whole peptide and
 * comparison clusters at once.
 */
export const LAST_REVIEWED = "July 2026";

/**
 * Machine-readable form of the same review date, for schema.org `dateModified`
 * and `lastReviewed`. Keep in sync with LAST_REVIEWED above.
 */
export const LAST_REVIEWED_ISO = "2026-07-01";
