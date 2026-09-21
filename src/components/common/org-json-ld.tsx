import { safeJson } from "@/lib/seo/safe-json";
import { orgNode } from "@/lib/seo/schema";

export function OrgJsonLd() {
  const jsonLd = { "@context": "https://schema.org", ...orgNode };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson(jsonLd) }}
    />
  );
}
