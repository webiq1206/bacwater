interface BreadcrumbItem {
  name: string;
  url: string;
}

interface WebPageJsonLdProps {
  name: string;
  description: string;
  url: string;
  breadcrumb?: BreadcrumbItem[];
}

export function WebPageJsonLd({ name, description, url, breadcrumb }: WebPageJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: url.startsWith("http") ? url : `${siteUrl}${url}`,
    isPartOf: {
      "@type": "WebSite",
      name: "BACwater.ai",
      url: siteUrl,
    },
  };

  if (breadcrumb && breadcrumb.length > 0) {
    jsonLd.breadcrumb = {
      "@type": "BreadcrumbList",
      itemListElement: breadcrumb.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
