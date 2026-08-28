/**
 * Ads are off by default and gated behind an explicit opt-in env flag.
 *
 * They were switched on 2026-07-15 on a six-week-old domain with no backlinks,
 * while Google was still deciding how much of the site to index at all. Ad
 * density on thin-to-medium content is a quality signal at exactly the wrong
 * moment, and the units never filled anyway (the ad-unit slot ID is still the
 * placeholder), so leaving them on cost impressions for zero revenue.
 *
 * Turn ads back on by setting NEXT_PUBLIC_ADS_ENABLED=true once organic clicks
 * justify it. Every ad placement stays wired up in the meantime.
 */
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
