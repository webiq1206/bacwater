import { withSocialMetadata } from "@/lib/seo/social-metadata";
import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { SEARCH_SNIPPETS } from "@/lib/seo/search-appearance";
import { BAC_WATER_FAQS } from "./faqs";
import CalculatorClient from "./calculator-client";

// Keep server metadata and the WebPage description aligned with the search
// catalog. The interactive calculator lives in ./calculator-client.
const PATH = "/tools/bac-water";
const { title: TITLE, description: DESCRIPTION } = SEARCH_SNIPPETS[PATH];

export const metadata: Metadata = withSocialMetadata({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
    type: "website",
    siteName: "BACwater.ai",
  },
});

export default function Page() {
  return (
    <>
      <WebPageJsonLd name={TITLE} description={DESCRIPTION} url={PATH} />
      {/* Same questions and answers as the visible "Common questions" reference section. */}
      <FaqJsonLd items={[...BAC_WATER_FAQS]} />
      <CalculatorClient />
    </>
  );
}
