export function OrgJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BACWater.ai",
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    sameAs: [] as string[],
    description:
      "BACWater.ai is the trusted utility for peptide reconstitution — deterministic calculations, printable plans, and premium supplies.",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
