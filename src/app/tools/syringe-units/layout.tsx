import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata: Metadata = {
  title: "Syringe Unit Converter - mL to Units",
  description:
    "Convert between milliliters and insulin syringe units instantly. Two-way converter with a quick-reference table for U-100 insulin syringes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="Syringe Unit Converter"
        description="Convert between milliliters and insulin syringe units instantly. Two-way converter with a quick-reference table for U-100 insulin syringes."
        url="/tools/syringe-units"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Syringe Unit Converter", url: "/tools/syringe-units" },
        ]}
      />
      {children}
    </>
  );
}
