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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24">
        <section className="max-w-3xl mb-10 border border-border p-5 sm:p-6">
          <p className="text-base leading-relaxed text-foreground/90">
            <strong>On a U-100 insulin syringe, 100 units = 1 mL.</strong>{" "}
            So 10 units = 0.1 mL, 50 units = 0.5 mL, and 1 unit = 0.01 mL. The unit markings make it easier to measure small peptide doses without doing decimal math. Enter any value below to convert instantly.
          </p>
        </section>
      </div>
      {children}
    </>
  );
}
