import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ResearchHome } from "@/components/brand/research-home";
import { SupplierRecommendations } from "@/components/partners/supplier-recommendations";
export const metadata = {
 title: "BACwater.ai: Free Calculators, Saved Plans and Vial Labels",
 description: "Check concentration, syringe units and unit conversions. Use the free calculators, save your entered values, and print labels. No product sales or dose recommendations.",
 alternates: { canonical: "/" }
};
export default function HomePage(){return <>
 <WebPageJsonLd name="BAC water calculator" description="Free tools for concentration, mass conversion and U-100 volume arithmetic using numbers supplied by the user." url="/"/>
 <ResearchHome supplier={<SupplierRecommendations/>}/>
</>;}
