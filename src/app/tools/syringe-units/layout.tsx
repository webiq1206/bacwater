import type { Metadata } from "next";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ToolExtras } from "@/components/tools/tool-extras";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/syringe-units" },
  title: "Syringe Unit Converter - mL to Units",
  description:
    "Convert between milliliters and insulin syringe units instantly. Two-way converter with a quick-reference table for U-100 insulin syringes.",
  openGraph: {
    title: "Syringe Unit Converter - mL to Units",
    description:
      "Convert between milliliters and insulin syringe units instantly. Two-way converter with a quick-reference table for U-100 insulin syringes.",
    url: "/tools/syringe-units",
    type: "website",
    siteName: "BACwater.ai",
  },
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <section className="mt-14 border-t border-border pt-8 max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight">Related guides</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/learn/what-syringe-units-mean" className="text-muted-foreground hover:text-foreground underline transition-colors">What syringe units mean</Link></li>
            <li><Link href="/learn/how-to-use-an-insulin-syringe" className="text-muted-foreground hover:text-foreground underline transition-colors">How to use an insulin syringe</Link></li>
            <li><Link href="/learn/insulin-syringe-sizes" className="text-muted-foreground hover:text-foreground underline transition-colors">Insulin syringe sizes explained</Link></li>
          </ul>
        </section>
        <ToolExtras
          app={{
            name: "Syringe Unit Converter",
            description:
              "Two-way converter between milliliters and U-100 insulin syringe units, with a quick-reference table.",
            url: "/tools/syringe-units",
          }}
          quickRef={{
            head: ["Units (U-100)", "Milliliters"],
            rows: [
              ["1 unit", "0.01 mL"],
              ["5 units", "0.05 mL"],
              ["10 units", "0.1 mL"],
              ["20 units", "0.2 mL"],
              ["25 units", "0.25 mL"],
              ["50 units", "0.5 mL"],
              ["100 units", "1 mL"],
            ],
            caption: "On a U-100 insulin syringe, 100 units equals 1 mL.",
          }}
          faqs={[
            {
              q: "How many units is 0.1 mL?",
              a: "On a U-100 insulin syringe, 0.1 mL is 10 units. Each 0.01 mL equals 1 unit, so multiply the milliliters by 100 to get units.",
            },
            {
              q: "Is a unit the same as a milliliter?",
              a: "No. A milliliter is a volume; a unit is a mark on a U-100 insulin syringe. There are 100 units in 1 mL, so 1 unit is 0.01 mL.",
            },
            {
              q: "What is a U-100 syringe?",
              a: "A U-100 syringe is graduated so that 100 units equal 1 mL. The fine unit markings make small peptide doses easy to measure without decimal math.",
            },
          ]}
        />
      </div>
    </>
  );
}
