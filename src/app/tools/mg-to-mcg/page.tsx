import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import CalculatorClient from "./calculator-client";

// This route is a client component (the calculator is interactive), which
// cannot export metadata. The page is split so this server wrapper owns the
// title, description, and self-referencing canonical, and the interactive UI
// lives in ./calculator-client. Without this every tool page inherited the
// layout's default title and had no canonical, so Google saw six duplicate,
// canonical-less pages and indexed none of them (or picked its own host).

const TITLE = 'mg to mcg Converter for Peptide Dosing';
const DESCRIPTION = 'Convert milligrams to micrograms and back for peptide labels. 1 mg equals 1,000 mcg — type either value and the other updates instantly. Research use only.';
const PATH = "/tools/mg-to-mcg";

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
      <WebPageJsonLd name={'mg to mcg Converter'} description={DESCRIPTION} url={PATH} />
      <CalculatorClient />
    </>
  );
}
