/**
 * Reusable FAQPage schema. Pass the same Q&A pairs shown on the page so the
 * structured data matches the visible content (a requirement for rich results).
 */
export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  if (!items.length) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
