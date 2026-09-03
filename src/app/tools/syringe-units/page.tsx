import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import CalculatorClient from "./calculator-client";

// This route is a client component (the calculator is interactive), which
// cannot export metadata. The page is split so this server wrapper owns the
// title, description, and self-referencing canonical, and the interactive UI
// lives in ./calculator-client. Without this every tool page inherited the
// layout's default title and had no canonical, so Google saw six duplicate,
// canonical-less pages and indexed none of them (or picked its own host).

const TITLE = 'Syringe Units to mL Converter (Insulin U-100)';
const DESCRIPTION = 'Convert insulin syringe units to milliliters and back instantly. On a U-100 syringe, 100 units equal 1 mL — type either value and the other updates. Research use.';
const PATH = "/tools/syringe-units";

export const metadata: Metadata = {
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
};

export default function Page() {
  return (
    <>
      <WebPageJsonLd name={'Syringe Units to mL Converter'} description={DESCRIPTION} url={PATH} />
      <CalculatorClient />
    </>
  );
}
