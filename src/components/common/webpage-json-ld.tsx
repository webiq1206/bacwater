import { SITE_URL, WEBSITE_ID, orgRef, citationLd } from "@/lib/seo/schema";
import { LAST_REVIEWED_ISO } from "@/lib/content-meta";
import type { Reference } from "@/lib/content/references";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface WebPageJsonLdProps {
  name: string;
  description: string;
  url: string;
  breadcrumb?: BreadcrumbItem[];
  /** When set, emits `citation` for the page's primary sources. */
  citations?: Reference[];
  /**
   * When true, marks the page as editorially reviewed (adds `reviewedBy` +
   * `lastReviewed` + `dateModified`). Use on content pages, not funnel pages.
   */
  reviewed?: boolean;
}

export function WebPageJsonLd({ name, description, url, breadcrumb, citations, reviewed }: WebPageJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    isPartOf: {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: "BACwater.ai",
      url: SITE_URL,
    },
  };

  if (reviewed) {
    jsonLd.reviewedBy = orgRef;
    jsonLd.lastReviewed = LAST_REVIEWED_ISO;
    jsonLd.dateModified = LAST_REVIEWED_ISO;
  }

  const citation = citationLd(citations);
  if (citation) jsonLd.citation = citation;

  // Breadcrumb schema is intentionally NOT emitted here. The visible
  // <Breadcrumbs> component renders the single BreadcrumbList for the page, so
  // emitting a second one from WebPage would duplicate the graph. The
  // `breadcrumb` prop is retained for call-site compatibility.
  void breadcrumb;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
