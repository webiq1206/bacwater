import { safeJson } from "@/lib/seo/safe-json";
import { SITE_URL, orgRef, citationLd } from "@/lib/seo/schema";
import { LAST_REVIEWED_ISO } from "@/lib/content-meta";
import { shareImage } from "@/lib/seo/search-appearance";
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
  createdAt?: Date;
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
    image: `${SITE_URL}${shareImage(new URL(url, SITE_URL).pathname).url}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    ...(createdAt && !Number.isNaN(createdAt.getTime()) ? {datePublished:createdAt.toISOString()} : {}),
    dateModified: updatedAt.toISOString(),
    author: orgRef,
    publisher: orgRef,
  };
  const citation = citationLd(citations);
  if (citation) jsonLd.citation = citation;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(jsonLd) }}
    />
  );
}
