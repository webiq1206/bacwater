import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import CalculatorClient from "./calculator-client";
const title="Reverse BAC Water Calculator: Final Volume Math",description="Explore the relationship between stated mass, final volume and a U-100 reading. A mathematical check, not a diluent or preparation recommendation.",url="/tools/reverse-bac";
export const metadata:Metadata={title,description,alternates:{canonical:url},openGraph:{title,description,url,type:"website"}};
export default function Page(){return <><WebPageJsonLd name={title} description={description} url={url} /><CalculatorClient /></>;}
