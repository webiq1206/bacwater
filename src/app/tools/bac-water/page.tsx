import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import CalculatorClient from "./calculator-client";

// This route is a client component (the calculator is interactive), which
// cannot export metadata. The page is split so this server wrapper owns the
// title, description, and self-referencing canonical, and the interactive UI
// lives in ./calculator-client. Without this every tool page inherited the
// layout's default title and had no canonical, so Google saw six duplicate,
// canonical-less pages and indexed none of them (or picked its own host).

const TITLE = 'BAC Water Calculator: How Much to Add to a Vial';
const DESCRIPTION = 'Free BAC water calculator. Enter your vial size and target measurement to get exactly how much bacteriostatic water to add for clean syringe units. Research use.';
const PATH = "/tools/bac-water";

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
      <WebPageJsonLd name={'BAC Water Calculator'} description={DESCRIPTION} url={PATH} />
      <CalculatorClient />
    </>
  );
}
