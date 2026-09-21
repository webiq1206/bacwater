import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import CalculatorClient from "./calculator-client";
const TITLE = "U-100 Syringe Units to mL Converter";
const DESCRIPTION = "Convert U-100 syringe units to mL and back. See the formula, check examples, and distinguish syringe scale from capacity. This is not a dose recommendation.";
const PATH = "/tools/syringe-units";
export const metadata: Metadata = { title: TITLE, description: DESCRIPTION, alternates: { canonical: PATH }, openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", siteName: "BACwater.ai" } };
export default function Page() {
  return <><WebPageJsonLd name={TITLE} description={DESCRIPTION} url={PATH} /><CalculatorClient /></>;
}
