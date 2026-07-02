export function ArticleJsonLd({ title, body, slug, createdAt, updatedAt }: { title: string; body: string; slug: string; createdAt: Date; updatedAt: Date }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  const plainBody = body
    .replace(/[*_`#>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const url = `${siteUrl}/learn/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    articleBody: plainBody,
    image: `${siteUrl}/opengraph-image`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    datePublished: createdAt.toISOString(),
    dateModified: updatedAt.toISOString(),
    author: {
      "@type": "Organization",
      name: "BACwater.ai",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "BACwater.ai",
      url: siteUrl,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
