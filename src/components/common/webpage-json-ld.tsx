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
