import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata: Metadata = {
  title: "BAC Water Calculator - How Much to Add",
  description:
    "Enter your peptide and vial size to find out exactly how much bacteriostatic water to add for clean, easy-to-measure doses on a standard insulin syringe.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="BAC Water Calculator"
        description="Enter your peptide and vial size to find out exactly how much bacteriostatic water to add for clean, easy-to-measure doses on a standard insulin syringe."
        url="/tools/bac-water"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "BAC Water Calculator", url: "/tools/bac-water" },
        ]}
      />
      {children}
    </>
  );
}
