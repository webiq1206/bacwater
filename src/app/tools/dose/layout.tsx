import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata: Metadata = {
  title: "Dose Calculator - mcg to Syringe Units",
  description:
    "Enter your vial concentration and draw volume to calculate your exact dose in mcg, mg, and insulin syringe units. Shows the math step by step.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="Dose Calculator"
        description="Enter your vial concentration and draw volume to calculate your exact dose in mcg, mg, and insulin syringe units. Shows the math step by step."
        url="/tools/dose"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Dose Calculator", url: "/tools/dose" },
        ]}
      />
      {children}
    </>
  );
}
