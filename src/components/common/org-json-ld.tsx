export function OrgJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BACwater.ai",
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description:
      "BACwater.ai is the complete BAC water calculator and reconstitution guide: deterministic calculations, printable plans, and premium supplies.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@bacwater.ai",
      contactType: "customer service",
      availableLanguage: "English",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
