interface Product {
  name: string;
  description: string;
  slug: string;
  sku: string;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  inventory: number;
}

export function ProductJsonLd({ product }: { product: Product }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl || undefined,
    sku: product.sku,
    brand: { "@type": "Brand", name: "BACwater.ai" },
    url: `${siteUrl}/shop/${product.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
      url: `${siteUrl}/shop/${product.slug}`,
      availability:
        product.inventory > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
