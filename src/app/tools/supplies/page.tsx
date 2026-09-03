import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import CalculatorClient from "./calculator-client";

// This route is a client component (the calculator is interactive), which
// cannot export metadata. The page is split so this server wrapper owns the
// title, description, and self-referencing canonical, and the interactive UI
// lives in ./calculator-client. Without this every tool page inherited the
// layout's default title and had no canonical, so Google saw six duplicate,
// canonical-less pages and indexed none of them (or picked its own host).

const TITLE = 'Peptide Supply Calculator: Vials, Water & Syringes';
const DESCRIPTION = 'Plan a full peptide cycle: enter your compound, the amount you measure and cycle length to count the vials, BAC water, syringes and alcohol pads you need.';
const PATH = "/tools/supplies";

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
      <WebPageJsonLd name={'Peptide Supply Calculator'} description={DESCRIPTION} url={PATH} />
      <CalculatorClient />
    </>
  );
}
