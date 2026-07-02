import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { ReviewedBy } from "@/components/common/reviewed-by";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { References } from "@/components/common/references";
import { CORE_BACWATER_REFERENCES } from "@/lib/content/references";

export const metadata = {
  title: "Free Printable Peptide Vial Labels",
  description:
    "Free printable peptide vial labels with QR codes. Build a plan and download labels showing strength, concentration, dose, mix date, and discard date.",
  alternates: { canonical: "/tools/vial-labels" },
  openGraph: {
    title: "Free Printable Peptide Vial Labels",
    description:
      "Free printable peptide vial labels with QR codes, generated from your reconstitution plan.",
  },
};

const FIELDS: { field: string; example: string }[] = [
  { field: "Peptide name", example: "BPC-157" },
  { field: "Vial strength", example: "5 mg" },
  { field: "Concentration", example: "2.5 mg/mL" },
  { field: "Dose", example: "250 mcg = 10 units" },
  { field: "Date mixed", example: "2026-07-01" },
  { field: "Discard by", example: "Based on shelf life" },
  { field: "QR code", example: "Links to the saved plan" },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Are the vial labels really free?",
    a: "Yes. The vial labels are included free with any reconstitution plan you build. Enter your peptide, vial strength, dose, and syringe in the Plan Builder, save the plan, and the printable labels are generated for you at no cost. There is no separate charge or account tier for the labels.",
  },
  {
    q: "What information goes on a peptide vial label?",
    a: "A complete peptide vial label shows the peptide name, the vial strength in milligrams, the final concentration, the dose in mcg and syringe units, the date you mixed it, and a discard-by date based on the peptide's refrigerated shelf life. A QR code links back to the full saved plan. This keeps similar-looking vials from getting mixed up.",
  },
  {
    q: "Do the labels include a QR code?",
    a: "Yes. Each printable label and the downloadable plan PDF include a QR code that links back to your saved plan on BACwater.ai. Scanning it opens the full reconstitution details, so you can confirm the concentration, dose, and dates from the vial without digging through notes.",
  },
];

export default function VialLabelsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Free Printable Peptide Vial Labels"
        description="Free printable peptide vial labels with QR codes, generated from your saved reconstitution plan. Each label shows the peptide, vial strength, concentration, dose in units, mix date, and discard date."
        url="/tools/vial-labels"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Vial Labels", url: "/tools/vial-labels" },
        ]}
        reviewed
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Vial Labels", href: "/tools/vial-labels" },
        ]}
      />

      <div className="eyebrow">Free tool</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        Free Printable Peptide Vial Labels
      </h1>

      <p className="mt-4 text-foreground/90 leading-relaxed">
        The{" "}
        <Link
          href="/plan"
          className="underline decoration-border underline-offset-2 hover:decoration-foreground"
        >
          Plan Builder
        </Link>{" "}
        generates free printable peptide vial labels, each with a QR code, from
        your reconstitution plan. The labels show the peptide, vial strength,
        concentration, dose in units, mix date, and discard date, so you can
        label vials clearly and avoid mix-ups between similar batches.
      </p>
      <ReviewedBy className="mt-2" />

      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
        For research use only. This tool helps you organize and label research
        materials and is not medical advice.
      </p>

      {/* What a complete label includes */}
      <h2 className="mt-14 text-2xl sm:text-3xl font-serif font-medium tracking-tight">
        What a complete peptide vial label includes
      </h2>
      <p className="mt-4 text-foreground/90 leading-relaxed">
        A good vial label carries everything you need to draw a dose with
        confidence without hunting for your notes. The example values below are
        illustrative and match the way the Plan Builder calculates a 5 mg vial
        reconstituted for a 250 mcg dose.
      </p>
      <div className="mt-5 overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-left">
              <th className="px-4 py-3 font-medium">Field</th>
              <th className="px-4 py-3 font-medium">Example</th>
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((row) => (
              <tr key={row.field} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{row.field}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {row.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
        Not sure how a vial strength turns into a concentration and a syringe
        reading? Every{" "}
        <Link
          href="/peptides"
          className="underline decoration-border underline-offset-2 hover:decoration-foreground"
        >
          peptide guide
        </Link>{" "}
        walks through the math, and the Plan Builder fills these numbers in for
        you.
      </p>

      {/* Why label */}
      <h2 className="mt-14 text-2xl sm:text-3xl font-serif font-medium tracking-tight">
        Why label your vials
      </h2>
      <p className="mt-4 text-foreground/90 leading-relaxed">
        Reconstituted vials look almost identical once they are in the fridge.
        A clear label is the simplest way to keep two similar peptides, or two
        different concentrations of the same peptide, from getting confused. It
        also removes guesswork at dose time: the strength, concentration, and
        syringe units are printed right there, so you are not relying on memory.
      </p>
      <p className="mt-4 text-foreground/90 leading-relaxed">
        The discard-by date matters just as much. A reconstituted peptide has a
        limited refrigerated shelf life, and a printed date tells you at a
        glance whether a vial is still within it. The QR code adds a backstop:
        scan it to reopen the full saved plan and confirm every detail against
        the label.
      </p>

      {/* How to get labels */}
      <h2 className="mt-14 text-2xl sm:text-3xl font-serif font-medium tracking-tight">
        How to get your labels
      </h2>
      <ol className="mt-5 space-y-4">
        <li className="flex gap-4">
          <span className="step-number step-number--filled text-[11px] shrink-0">
            1
          </span>
          <div>
            <div className="font-medium">Build a plan in the Plan Builder</div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Head to the{" "}
              <Link
                href="/plan"
                className="underline decoration-border underline-offset-2 hover:decoration-foreground"
              >
                Plan Builder
              </Link>{" "}
              and enter what is on your vial: peptide, strength, dose, and
              syringe.
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="step-number step-number--filled text-[11px] shrink-0">
            2
          </span>
          <div>
            <div className="font-medium">
              Review the calculated concentration, units, and dates
            </div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              The plan works out the final concentration, the syringe reading in
              units, the mix date, and the expiration date so the label reflects
              your exact vial.
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="step-number step-number--filled text-[11px] shrink-0">
            3
          </span>
          <div>
            <div className="font-medium">Save, then print or download</div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              From your saved plan you can open the printable vial-label sheet or
              download the plan PDF. Both include a QR code that links back to
              the plan.
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="step-number step-number--filled text-[11px] shrink-0">
            4
          </span>
          <div>
            <div className="font-medium">The labels are included</div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              The vial labels print on standard paper or label sheets. Print at
              100% scale, cut along the outlines, and stick them on your vials.
              You can print several at once and set the mix date per label.
            </p>
          </div>
        </li>
      </ol>

      {/* FAQ */}
      <h2 className="mt-14 text-2xl sm:text-3xl font-serif font-medium tracking-tight">
        Frequently asked questions
      </h2>
      <FaqJsonLd items={FAQS} />
      <Accordion type="single" collapsible className="mt-5 border-t border-border">
        {FAQS.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>
              <p className="leading-relaxed">{item.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <References references={CORE_BACWATER_REFERENCES} />

      {/* Closing CTA */}
      <div className="mt-14 border border-border bg-surface p-6">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Get your free vial labels
        </h2>
        <p className="mt-3 text-foreground/90 leading-relaxed">
          Build a reconstitution plan and your printable, QR-coded vial labels
          come with it. Need supplies too? Everything you need is in the{" "}
          <Link
            href="/shop"
            className="underline decoration-border underline-offset-2 hover:decoration-foreground"
          >
            shop
          </Link>
          .
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="brand">
            <Link href="/plan">Build a plan to get your labels</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tools">All tools</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
