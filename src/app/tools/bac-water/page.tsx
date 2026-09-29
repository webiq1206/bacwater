import { withSocialMetadata } from "@/lib/seo/social-metadata";
import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { BAC_WATER_FAQS } from "./faqs";
import CalculatorClient from "./calculator-client";

// This route is a client component (the calculator is interactive), which
// cannot export metadata. The page is split so this server wrapper owns the
// title, description, and self-referencing canonical, and the interactive UI
// lives in ./calculator-client. Without this every tool page inherited the
// layout's default title and had no canonical, so Google saw six duplicate,
// canonical-less pages and indexed none of them (or picked its own host).

const TITLE = 'BAC Water Calculator: Volume and Concentration';
const DESCRIPTION = 'See how BAC water volume changes concentration. Enter your vial amount and final volume to check the math in mg/mL and U-100 units. Instructions set the volume.';
const PATH = "/tools/bac-water";

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
      <WebPageJsonLd name={'BAC Water Calculator'} description={DESCRIPTION} url={PATH} />
      {/* Same questions and answers as the visible "Common questions" reference section. */}
      <FaqJsonLd items={[...BAC_WATER_FAQS]} />
      <CalculatorClient />
    </>
  );
}
