import type { Metadata } from "next";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata: Metadata = {
  title: "mg to mcg Converter - Milligrams to Micrograms",
  description:
    "Convert between milligrams and micrograms for peptide dosing. Vial labels use mg, dose protocols use mcg — this makes switching instant.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd
        name="mg to mcg Converter"
        description="Convert between milligrams and micrograms for peptide dosing. Vial labels use mg, dose protocols use mcg - this makes switching instant."
        url="/tools/mg-to-mcg"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "mg to mcg Converter", url: "/tools/mg-to-mcg" },
        ]}
      />
      {children}
    </>
  );
}
