import { withSocialMetadata } from "@/lib/seo/social-metadata";
import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { SYRINGE_UNIT_FAQS } from "./faqs";
import CalculatorClient from "./calculator-client";
const TITLE = "U-100 Insulin Syringe Units to mL Converter";
const DESCRIPTION = "Convert U-100 insulin syringe units to mL and back: 100 units = 1 mL, 50 units = 0.5 mL, 10 units = 0.1 mL. See the formula and examples. Not dose advice.";
const PATH = "/tools/syringe-units";
export const metadata: Metadata = withSocialMetadata({ title: TITLE, description: DESCRIPTION, alternates: { canonical: PATH }, openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", siteName: "BACwater.ai" } });
export default function Page() {
  // The FAQ items are the same question headings and answers rendered inside the calculator's reference section.
  return <><WebPageJsonLd name={TITLE} description={DESCRIPTION} url={PATH} /><FaqJsonLd items={[...SYRINGE_UNIT_FAQS]} /><CalculatorClient /></>;
}
