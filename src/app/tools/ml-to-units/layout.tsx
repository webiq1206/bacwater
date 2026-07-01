import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata: Metadata = {
  title: "mL to Units Converter",
  description:
    "Convert between milliliters and insulin syringe units. Simple two-way converter for U-100 insulin syringes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="mL to Units Converter"
        description="Convert between milliliters and insulin syringe units. Simple two-way converter for U-100 insulin syringes."
        url="/tools/ml-to-units"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "mL to Units Converter", url: "/tools/ml-to-units" },
        ]}
      />
      {children}
    </>
  );
}
