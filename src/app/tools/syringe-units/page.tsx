import { withSocialMetadata } from "@/lib/seo/social-metadata";
import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { SEARCH_SNIPPETS } from "@/lib/seo/search-appearance";
import { SYRINGE_UNIT_FAQS } from "./faqs";
import CalculatorClient from "./calculator-client";
const PATH = "/tools/syringe-units";
const { title: TITLE, description: DESCRIPTION } = SEARCH_SNIPPETS[PATH];
export const metadata: Metadata = withSocialMetadata({ title: TITLE, description: DESCRIPTION, alternates: { canonical: PATH }, openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", siteName: "BACwater.ai" } });
export default function Page() {
  // The FAQ items are the same question headings and answers rendered inside the calculator's reference section.
  return <><WebPageJsonLd name={TITLE} description={DESCRIPTION} url={PATH} /><FaqJsonLd items={[...SYRINGE_UNIT_FAQS]} /><CalculatorClient /></>;
}
