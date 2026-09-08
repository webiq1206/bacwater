/**
 * Google "Preferred Sources" integration constants.
 *
 * Preferred Sources lets a reader tell Google which publications they want to
 * see more often. Once a user picks BACwater.ai, our pages become more likely
 * to appear in Top Stories, AI Overviews, and AI Mode, badged as "Preferred".
 *
 * Google's publisher guide gives site owners three ways to help readers do
 * this, and this module holds the shared pieces all three need:
 *
 *  1. The standard button   - `PREFERRED_SOURCE_SCRIPT` + a container div
 *                             carrying `google-add-preferred-source-btn`.
 *  2. A custom button       - same script, our own markup, driven by the
 *                             library's programmatic API.
 *  3. A plain deeplink      - `preferredSourceDeeplink()`, which needs no
 *                             JavaScript at all and works in email or social.
 *
 * Eligibility is decided by Google, not by us: the entry has to be a domain or
 * a subdomain (never a subdirectory), the site has to be indexed, and it has to
 * publish fresh content. That is why the deeplink below is built from the
 * canonical apex host rather than from the current page's URL.
 */

import { SITE_URL } from "@/lib/seo/schema";

/**
 * The host users add as a preferred source.
 *
 * Google only lists domains and subdomains in the source preferences tool, so
 * `bacwater.ai` is the eligible entry and `bacwater.ai/learn` is not. A leading
 * "www." is stripped to match the apex host that next.config.ts redirects to
 * and that every canonical tag declares; pointing readers at the non-canonical
 * host would ask them to add a domain we deliberately do not serve.
 */
export const PREFERRED_SOURCE_DOMAIN = new URL(SITE_URL).host.replace(
  /^www\./,
  ""
);

/** Human-readable publication name, used in copy and structured data. */
export const PREFERRED_SOURCE_PUBLICATION = "BACwater.ai";

/**
 * Google's publisher library. It renders the branded button, opens the
 * confirmation overlay, and returns the reader to the page they were on.
 *
 * Loading it requires CSP allowances for `news.google.com` (the script),
 * `www.gstatic.com` (the overlay's assets), and `www.google.com` +
 * `news.google.com` in `frame-src` (the overlay itself). See next.config.ts.
 */
export const PREFERRED_SOURCE_SCRIPT =
  "https://news.google.com/swg/js/v1/publisher.js";

/** The attribute Google's library looks for when it hydrates a container. */
export const PREFERRED_SOURCE_BUTTON_ATTR = "google-add-preferred-source-btn";

/**
 * A no-JavaScript route to the same outcome: Google's source preferences tool,
 * pre-filled with our domain, where the reader confirms in one click.
 *
 * Used as the `<noscript>` path and as the automatic fallback when the library
 * is blocked (ad blockers, tracking-protection modes, a CSP mismatch), so the
 * call to action is never a dead control.
 */
export function preferredSourceDeeplink(
  domain: string = PREFERRED_SOURCE_DOMAIN
): string {
  return `https://www.google.com/preferences/source?q=${encodeURIComponent(domain)}`;
}
