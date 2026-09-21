import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import CalculatorClient from "./calculator-client";

// This route is a client component (the calculator is interactive), which
// cannot export metadata. The page is split so this server wrapper owns the
// title, description, and self-referencing canonical, and the interactive UI
// lives in ./calculator-client. Without this every tool page inherited the
// layout's default title and had no canonical, so Google saw six duplicate,
// canonical-less pages and indexed none of them (or picked its own host).

const TITLE = 'Syringe Units to mL Converter: U-100 and U-40';
const DESCRIPTION = 'Convert syringe units to mL and back using your actual syringe scale. U-100 means 100 units per mL; this tool does not convert units directly into milligrams.';
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
