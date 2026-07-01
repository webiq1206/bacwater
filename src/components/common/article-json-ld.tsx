export function ArticleJsonLd({ title, body, slug, updatedAt }: { title: string; body: string; slug: string; updatedAt: Date }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    articleBody: body,
    url: `${siteUrl}/learn/${slug}`,
    dateModified: updatedAt.toISOString(),
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
