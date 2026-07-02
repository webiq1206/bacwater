/**
 * ImageObject schema for a featured infographic. Gives image search and
 * multimodal answer engines a structured, citable handle on the visual, in
 * addition to the parent Article / FAQPage / WebPage schema on the page.
 */
export function ImageJsonLd({
  url,
  caption,
  width,
  height,
}: {
  url: string;
  caption: string;
  width: number;
  height: number;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  const abs = url.startsWith("http") ? url : `${siteUrl}${url}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: abs,
    url: abs,
    caption,
    width,
    height,
    creditText: "BACwater.ai",
    creator: { "@type": "Organization", name: "BACwater.ai", url: siteUrl },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
