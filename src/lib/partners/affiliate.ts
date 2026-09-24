/** Owner-supplied referral link, authorized September 24, 2026.
 * No visitor data, automatic redirects, tracking pixels or simulated clicks.
 */
export const AFFILIATE_REFERRAL_URL = "https://aminoclub.com?utm_source=affiliate_marketing&code=WEBIQ";
export const AFFILIATE_DISCLOSURE = "We may earn a commission if you buy through this link.";
export const RESEARCH_ONLY_NOTICE = "For in-vitro laboratory research only. Not for human consumption, human use, or animal use.";

/** Keep the individual listing destination; copy only the owner's two parameters. */
export function productAffiliateUrl(source: string): string {
  const url = new URL(source);
  if (url.protocol !== "https:" || url.hostname !== "www.aminoclub.com" ||
      url.username || url.password || url.port || url.search || url.hash ||
      !/^\/us\/products\/[a-z0-9-]+$/.test(url.pathname)) {
    throw new Error("Unrecognized research product destination");
  }
  const referral = new URL(AFFILIATE_REFERRAL_URL);
  url.searchParams.set("utm_source", referral.searchParams.get("utm_source")!);
  url.searchParams.set("code", referral.searchParams.get("code")!);
  return url.toString();
}

/** Keep promotion away from articles that discuss clinical or animal studies. */
export function supplierPromotionAllowed(path: string): boolean {
  return !/^\/(?:learn|peptides|compare-calculators|editorial-policy|methodology)(?:\/|$)/.test(path);
}
