import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import CalculatorClient from "./calculator-client";
const title="Dose and Volume Calculator: mg, mcg and mL",description="Convert an entered amount to mL or find mass in a measured volume using a known concentration. Formulas, unit checks and no dose recommendation.",url="/tools/dose";
export const metadata:Metadata={title,description,alternates:{canonical:url},openGraph:{title,description,url,type:"website"}};
export default function Page(){return <><WebPageJsonLd name={title} description={description} url={url} /><CalculatorClient /></>;}
