import { SITE_URL, orgRef, citationLd } from "@/lib/seo/schema";
import { LAST_REVIEWED_ISO } from "@/lib/content-meta";
import type { Reference } from "@/lib/content/references";

export function ArticleJsonLd({
  title,
  body,
  slug,
  url: urlOverride,
  createdAt,
  updatedAt,
  citations,
}: {
  title: string;
  body: string;
  slug?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
  citations?: Reference[];
}) {
  const plainBody = body
    .replace(/[*_`#>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const url = urlOverride ?? `${SITE_URL}/learn/${slug}`;
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    articleBody: plainBody,
    image: `${SITE_URL}/opengraph-image`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    datePublished: createdAt.toISOString(),
    dateModified: updatedAt.toISOString(),
    author: orgRef,
    publisher: orgRef,
    reviewedBy: orgRef,
    lastReviewed: LAST_REVIEWED_ISO,
  };
  const citation = citationLd(citations);
  if (citation) jsonLd.citation = citation;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
