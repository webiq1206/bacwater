import { softwareApplicationLd, type SoftwareAppInput } from "@/lib/seo/schema";

/**
 * Emits SoftwareApplication JSON-LD for the interactive calculators, so answer
 * engines recognize the tools as free, browser-based utilities (not just
 * articles). Use in each tool `layout.tsx`.
 */
export function SoftwareAppJsonLd(props: SoftwareAppInput) {
  const jsonLd = softwareApplicationLd(props);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
