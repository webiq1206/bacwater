"use client";
import { formatCurrency } from "@/lib/utils";

interface Product {
  name: string;
  description: string;
  slug: string;
  priceCents: number;
  currency: string;
  imageUrl: string | null;
  inventory: number;
}

export function ProductJsonLd({ product }: { product: Product }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl || undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: (product.priceCents / 100).toFixed(2),
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
