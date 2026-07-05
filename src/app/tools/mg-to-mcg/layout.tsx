import type { Metadata } from "next";
import Link from "next/link";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ToolExtras } from "@/components/tools/tool-extras";

export const metadata: Metadata = {
  alternates: { canonical: "/tools/mg-to-mcg" },
  title: "mg to mcg Converter - Milligrams to Micrograms",
  description:
    "Convert between milligrams and micrograms for peptide dosing. Vial labels use mg, dose protocols use mcg. This makes switching instant.",
  openGraph: {
    title: "mg to mcg Converter - Milligrams to Micrograms",
    description:
      "Convert between milligrams and micrograms for peptide dosing. Vial labels use mg, dose protocols use mcg. This makes switching instant.",
    url: "/tools/mg-to-mcg",
    type: "website",
    siteName: "BACwater.ai",
  },
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
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24">
        <section className="max-w-3xl mb-10 border border-border p-5 sm:p-6">
          <p className="text-base leading-relaxed text-foreground/90">
            <strong>1 milligram (mg) = 1,000 micrograms (mcg).</strong>{" "}
            To convert mg to mcg, multiply by 1,000. To convert mcg to mg, divide by 1,000. Peptide vial labels typically use mg (e.g., 5 mg BPC-157), while dose amounts use mcg (e.g., 250 mcg per draw). Use the converter below for instant results.
          </p>
        </section>
      </div>
      {children}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-24">
        <section className="mt-14 border-t border-border pt-8 max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight">Related guides</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/learn/how-to-read-a-peptide-vial" className="text-muted-foreground hover:text-foreground underline transition-colors">How to read a peptide vial label</Link></li>
            <li><Link href="/learn/how-peptide-reconstitution-works" className="text-muted-foreground hover:text-foreground underline transition-colors">How peptide reconstitution works</Link></li>
            <li><Link href="/learn/peptide-reconstitution-chart" className="text-muted-foreground hover:text-foreground underline transition-colors">Peptide reconstitution quick-reference chart</Link></li>
          </ul>
        </section>
        <ToolExtras
          app={{
            name: "mg to mcg Converter",
            description:
              "Convert between milligrams and micrograms for peptide dosing, with a quick-reference table.",
            url: "/tools/mg-to-mcg",
          }}
          quickRef={{
            head: ["Milligrams (mg)", "Micrograms (mcg)"],
            rows: [
              ["0.25 mg", "250 mcg"],
              ["0.5 mg", "500 mcg"],
              ["1 mg", "1,000 mcg"],
              ["2.5 mg", "2,500 mcg"],
              ["5 mg", "5,000 mcg"],
              ["10 mg", "10,000 mcg"],
            ],
            caption: "1 mg equals 1,000 mcg. Multiply mg by 1,000 to get mcg.",
          }}
          faqs={[
            {
              q: "How many mcg are in a mg?",
              a: "There are 1,000 micrograms (mcg) in 1 milligram (mg). To convert mg to mcg, multiply by 1,000; to convert mcg to mg, divide by 1,000.",
            },
            {
              q: "How many mcg is 0.25 mg?",
              a: "0.25 mg is 250 mcg. Multiply 0.25 by 1,000 to convert milligrams to micrograms.",
            },
            {
              q: "Why do vials use mg but doses use mcg?",
              a: "Vials are labeled by total content in milligrams (for example 5 mg), while individual doses are small enough that micrograms (for example 250 mcg) state them more precisely.",
            },
          ]}
        />
      </div>
    </>
  );
}
