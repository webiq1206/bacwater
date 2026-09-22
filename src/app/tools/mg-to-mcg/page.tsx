import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import CalculatorClient from "./calculator-client";

// The server wrapper owns metadata; the interactive client owns the visible converter.

const TITLE = 'mg to mcg Converter: Milligrams and Micrograms';
const DESCRIPTION = 'Convert milligrams to micrograms and back. Multiply mg by 1,000 or divide mcg by 1,000. Check label units without estimating a dose or choosing a treatment.';
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
