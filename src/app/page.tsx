import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { SoftwareAppJsonLd } from "@/components/common/software-app-json-ld";
import { HeroMathContext } from "@/components/brand/hero-math-context";
import { ResearchHome } from "@/components/brand/research-home";
import { SupplierRecommendations } from "@/components/partners/supplier-recommendations";
const title = "BAC Water Calculator | Peptide Reconstitution | BACwater.ai";
const description = "Free BAC water and peptide reconstitution calculator. Check concentration, mL and U-100 units from your own numbers. Live results, no signup.";
export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", type: "website", siteName: "BACwater.ai" },
  twitter: { card: "summary_large_image", title, description }
};
export default function HomePage() { return <>
  <WebPageJsonLd name="BAC Water Calculator" description={description} url="/" />
  <SoftwareAppJsonLd name="BAC Water Calculator" description="Free peptide reconstitution math: concentration, entered-amount volume and U-100 scale conversion. No dose or mixing instructions are selected." url="/" />
  <ResearchHome supplier={<SupplierRecommendations/>} />
  <HeroMathContext />
</>; }
