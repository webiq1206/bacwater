import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PEPTIDES } from "@/lib/calc/peptides";
import { shortName } from "@/lib/peptides/page-data";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { References } from "@/components/common/references";
import { ReviewedBy } from "@/components/common/reviewed-by";
import { SHELF_LIFE_REFERENCES } from "@/lib/content/references";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const DIRECT_ANSWER =
  "Unopened bacteriostatic water lasts until its printed expiry. Once a multi-dose vial is opened, it is commonly dated and discarded within about 28 days. A reconstituted peptide usually keeps for a few weeks refrigerated, depending on the peptide. Refrigerate mixed vials, keep them out of light, and discard any solution that turns cloudy or develops particles.";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Does bacteriostatic water need to be refrigerated?",
    a: "An unopened vial can be stored at room temperature until its printed expiry. Once you reconstitute a peptide, refrigerate the mixed vial (about 2 to 8 C) and keep it out of light. Refrigeration slows peptide breakdown, but it does not replace clean, aseptic handling.",
  },
  {
    q: "How long does a reconstituted peptide last in the fridge?",
    a: "It depends on the peptide, but a common window is a few weeks refrigerated. Check the specific peptide's shelf life, label the vial with the mix date and a discard date, and stop using it once that date passes or if the solution looks cloudy or off.",
  },
  {
    q: "How long is bacteriostatic water good for after opening?",
    a: "The benzyl alcohol preservative lets you draw from the vial repeatedly, but once a multi-dose vial is opened or first punctured it is commonly dated and discarded within about 28 days, unless the manufacturer states otherwise. That window is the standard multi-dose vial guidance.",
  },
  {
    q: "Can you freeze reconstituted peptides?",
    a: "Freezing a reconstituted (already mixed) vial is generally not recommended, because freeze-thaw cycles can degrade the peptide. Keep mixed vials refrigerated instead. Some unopened lyophilized (freeze-dried) powders can be frozen before mixing, but follow the specific product's guidance.",
  },
];

const STORAGE_SLUGS = [
  "bpc-157",
  "tb-500",
  "ipamorelin",
  "semaglutide",
  "tirzepatide",
  "ghk-cu",
  "melanotan-2",
  "pt-141",
];

export const metadata: Metadata = {
  title: "BAC Water and Peptide Shelf Life: Storage and Refrigeration",
  description:
    "How long reconstituted peptides and opened bacteriostatic water last, why refrigeration and clean technique both matter, and when to discard a vial.",
  alternates: { canonical: "/learn/bac-water-shelf-life" },
  openGraph: {
    title: "BAC Water and Peptide Shelf Life: Storage and Refrigeration",
    description:
      "The definitive guide to how long BAC water and reconstituted peptides last, and how to store them.",
  },
};

export default function ShelfLifePage() {
  const storageRows = STORAGE_SLUGS.map((slug) =>
    PEPTIDES.find((p) => p.slug === slug)
  ).filter((p): p is (typeof PEPTIDES)[number] => Boolean(p));

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="BAC Water and Peptide Shelf Life"
        description={DIRECT_ANSWER}
        url="/learn/bac-water-shelf-life"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Learning Center", url: "/learn" },
          { name: "Shelf life and storage", url: "/learn/bac-water-shelf-life" },
        ]}
        citations={SHELF_LIFE_REFERENCES}
        reviewed
      />
      <FaqJsonLd items={FAQS} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learning Center", href: "/learn" },
          { label: "Shelf life and storage", href: "/learn/bac-water-shelf-life" },
        ]}
      />

      <div className="eyebrow">Safety and storage</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        How long does BAC water and reconstituted peptide last?
      </h1>

      {/* Direct answer */}
      <p className="mt-5 text-lg leading-relaxed text-foreground/90">
        {DIRECT_ANSWER}
      </p>
      <ReviewedBy className="mt-2" />

      {/* Quick reference */}
      <section className="mt-10">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Shelf life at a glance
        </h2>
        <div className="mt-5 overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface text-left">
                <th className="px-4 py-3 font-medium">State</th>
                <th className="px-4 py-3 font-medium">How long it keeps</th>
                <th className="px-4 py-3 font-medium">Storage</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium">Unopened bac water</td>
                <td className="px-4 py-3">Until printed expiry</td>
                <td className="px-4 py-3">Room temperature, out of light</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium">Opened bac water vial</td>
                <td className="px-4 py-3">About 28 days once punctured</td>
                <td className="px-4 py-3">Refrigerate; date the vial</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium">Reconstituted peptide</td>
                <td className="px-4 py-3">A few weeks (peptide dependent)</td>
                <td className="px-4 py-3">Refrigerate 2 to 8 C, out of light</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium">Lyophilized powder</td>
                <td className="px-4 py-3">Months to years unopened</td>
                <td className="px-4 py-3">Per product label; often cold</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          The 28-day window for an opened multi-dose vial reflects standard
          multi-dose vial guidance. Always defer to the discard date on your own
          product label.
        </p>
      </section>

      {/* The refrigeration nuance */}
      <section className="mt-14">
        <div className="flex items-center gap-2.5">
          <ShieldCheck
            className="h-5 w-5"
            style={{ color: "var(--color-accent-guide)" }}
          />
          <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
            Refrigeration: helpful, but not a substitute for clean technique
          </h2>
        </div>
        <div className="mt-4 space-y-3 text-foreground/90 leading-relaxed">
          <p>
            The standard advice is correct: refrigerate reconstituted peptides.
            Cold storage slows the chemical breakdown of the peptide itself, so a
            mixed vial stays potent longer in the fridge than at room
            temperature.
          </p>
          <p>
            Here is a small thing to know. The preservative in BAC water is
            benzyl alcohol. It is what fights germs. Germ-fighting works a little
            slower when it is cold. That does not mean the fridge is bad. It
            means two things keep your vial safe, not one. The cold keeps the
            peptide strong. Clean habits keep germs out. You need both.
          </p>
          <p>
            Clean habits means: wipe the rubber top before each poke, do not
            touch the needle, and pull the liquid out gently. Keep the vial cold
            and out of light, use a fresh needle each time, and respect the
            discard date. If the liquid ever looks cloudy, changes color, or has
            floating bits, throw it out, no matter the date.
          </p>
        </div>
      </section>

      {/* Per-peptide storage */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Refrigerated shelf life by peptide
        </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Common reconstituted shelf-life windows for popular peptides. These are
          general guides; confirm against your own product and label the vial
          with a discard date.
        </p>
        <div className="mt-5 overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface text-left">
                <th className="px-4 py-3 font-medium">Peptide</th>
                <th className="px-4 py-3 font-medium">Refrigerated</th>
                <th className="px-4 py-3 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {storageRows.map((p) => (
                <tr key={p.slug} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/peptides/${p.slug}`}
                      className="underline decoration-border underline-offset-4 hover:decoration-foreground"
                    >
                      {shortName(p.name)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {p.refrigeratedShelfDays} days
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.storageNote}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* When to discard */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          When to discard a vial
        </h2>
        <ul className="mt-4 space-y-2 text-foreground/90 leading-relaxed list-disc pl-5">
          <li>The solution is cloudy, discolored, or has visible particles.</li>
          <li>It is past the discard date you wrote on the label.</li>
          <li>An opened bac water vial is more than about 28 days old.</li>
          <li>The vial was left unrefrigerated far longer than intended.</li>
          <li>The seal or stopper looks compromised.</li>
        </ul>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Shelf life and storage FAQ
        </h2>
        <Accordion type="single" collapsible className="mt-4">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Keep reading */}
      <section className="mt-14">
        <h2 className="text-xl font-serif font-medium tracking-tight">
          Keep reading
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { href: "/learn/vs/benzyl-alcohol", label: "BAC water vs benzyl alcohol" },
            { href: "/learn/how-long-bac-water-lasts", label: "How long BAC water lasts" },
            { href: "/learn/what-is-bac-water", label: "What is BAC water?" },
            { href: "/faq", label: "BAC water FAQ" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between border border-border p-4 hover:bg-surface transition-colors"
            >
              <span className="font-medium">{l.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      <References references={SHELF_LIFE_REFERENCES} />

      {/* CTA */}
      <section className="mt-12 border border-border bg-surface p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="font-medium text-foreground">
            Print a discard date on every vial
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            The Plan Builder calculates your mix date and discard date and prints
            them on a vial label.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Button asChild variant="brand">
            <Link href="/plan">
              Build a plan <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tools/vial-labels">Vial labels</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
