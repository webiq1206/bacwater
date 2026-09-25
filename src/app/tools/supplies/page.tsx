import { withSocialMetadata } from "@/lib/seo/social-metadata";
import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import CalculatorClient from "./calculator-client";
const title="Vial Inventory Calculator: Count Known Measurements",description="Count vials from stated mass, amount per measurement and a known count. No inferred treatment cycle, frequency or supply purchase recommendation.",url="/tools/supplies";
export const metadata:Metadata=withSocialMetadata({title,description,alternates:{canonical:url},openGraph:{title,description,url,type:"website"}});
export default function Page(){return <><WebPageJsonLd name={title} description={description} url={url} /><CalculatorClient /></>;}
