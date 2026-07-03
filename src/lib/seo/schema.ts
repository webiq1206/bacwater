/**
 * Shared schema.org building blocks.
 *
 * Centralizes the site URL, a single stable Organization node (@id graph), and
 * small helpers for citations and SoftwareApplication so every JSON-LD emitter
 * references one Organization entity instead of re-declaring an inline copy.
 * This gives answer engines one confident publisher to attribute and cite.
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";

/** Stable @id for the one Organization entity, referenced everywhere. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** A lightweight reference to the Organization node (use inside other nodes). */
export const orgRef = { "@id": ORG_ID } as const;

/** The full Organization node, emitted once sitewide by OrgJsonLd. */
export const orgNode = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "BACwater.ai",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description:
    "BACwater.ai is the complete BAC water calculator and reconstitution guide: deterministic calculations, printable plans, and premium supplies.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@bacwater.ai",
    contactType: "customer service",
    availableLanguage: "English",
  },
} as const;

/** Absolute URL helper for schema and metadata. */
export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path}`;
}

export interface CitationInput {
  title: string;
  source: string;
  url: string;
}

/** schema.org `citation` array from a list of references. */
export function citationLd(refs: readonly CitationInput[] | undefined) {
  if (!refs || refs.length === 0) return undefined;
  return refs.map((r) => ({
    "@type": "CreativeWork",
    name: r.title,
    url: r.url,
    publisher: { "@type": "Organization", name: r.source },
  }));
}

export interface SoftwareAppInput {
  name: string;
  description: string;
  url: string;
}

/**
 * SoftwareApplication node for the interactive calculators. Free, browser-based
 * utility apps, so category = HealthApplication and price = 0.
 */
export function softwareApplicationLd({ name, description, url }: SoftwareAppInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: absoluteUrl(url),
    applicationCategory: "HealthApplication",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    publisher: orgRef,
  };
}
