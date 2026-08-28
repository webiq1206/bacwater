import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { ArticleJsonLd } from "@/components/common/article-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { References } from "@/components/common/references";
import { ReviewedBy } from "@/components/common/reviewed-by";
import { CORE_BACWATER_REFERENCES } from "@/lib/content/references";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/**
 * Buyer-intent reference for "where to buy bacteriostatic water" and its long
 * tail ("near me", "at Walgreens", "over the counter", "at CVS").
 *
 * This page existed, ranked around position 35 on a large query cluster, and
 * was 301'd away on 2026-07-15 when the store was removed. Removing the store
 * was the right call; removing the only page that answered the question was
 * not, because the demand did not go anywhere. It is restored here as an
 * editorial page about *how to evaluate a source*, which is the part a reader
 * actually cannot get elsewhere. Consistent with llms.txt, it names no vendor
 * and recommends no seller.
 */

const DIRECT_ANSWER =
  "In the United States, bacteriostatic water for injection is a prescription item under its FDA labeling, so a retail pharmacy such as Walgreens or CVS will not usually hand it over the counter without one. In practice people obtain it three ways: with a prescription through a retail or compounding pharmacy, through a medical or veterinary supply distributor, or from research-supply companies that sell it for laboratory use only. Whichever route you use, the thing that matters is whether the vial is genuinely what it claims to be: USP-labelled sterile water with 0.9% benzyl alcohol, sealed, with a visible lot number and expiry date.";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Can you buy bacteriostatic water over the counter?",
    a: "Not typically at a US retail pharmacy. Bacteriostatic Water for Injection USP carries prescription labeling under its FDA-approved package insert, so the pharmacy counter will generally ask for a prescription. Some medical, veterinary, and laboratory suppliers sell it without one for research use. That is a difference in the supplier's channel and intended use, not a sign that one vial is more legitimate than another.",
  },
  {
    q: "Can you buy bacteriostatic water at Walgreens or CVS?",
    a: "Both chains dispense it through the pharmacy counter rather than from the shelf, and generally with a prescription. It is not a front-of-store item, so searching the aisles or the website's retail catalogue will usually come up empty. Call the pharmacy directly and ask whether they stock Bacteriostatic Water for Injection USP and what they require to dispense it.",
  },
  {
    q: "Is bacteriostatic water the same as sterile water?",
    a: "No. Sterile water has nothing added to it and is single-use, because once the seal is broken there is nothing preventing bacterial growth. Bacteriostatic water contains 0.9% benzyl alcohol as a preservative, which is what makes a multi-dose vial possible. Substituting one for the other changes how long an opened vial can be used.",
  },
  {
    q: "How do I know a bacteriostatic water vial is legitimate?",
    a: "Check that the label says Bacteriostatic Water for Injection USP and states 0.9% benzyl alcohol, that the manufacturer is named, and that there is a legible lot number and expiry date. The stopper and any flip-off cap should be intact and unbroken. Reputable suppliers will provide a certificate of analysis or the manufacturer's package insert on request. Vials with no manufacturer, no lot number, or a hand-applied label are the ones to avoid.",
  },
  {
    q: "What does bacteriostatic water cost?",
    a: "A 30 mL multi-dose vial is an inexpensive, commodity item, so an unusually high price is generally paying for the channel rather than the product. Very low prices from an unidentifiable seller are a different warning sign. Price is a weak signal either way; labelling, lot traceability, and seal integrity are the ones worth checking.",
  },
  {
    q: "How much bacteriostatic water do I need?",
    a: "That depends on your vial strength and the amount you want to measure, not on the size of the bac water vial. A single 30 mL vial covers many reconstitutions. Use the BAC water calculator to get the exact volume for your vial before deciding how much to obtain.",
  },
];

const BODY =
  "In the United States, bacteriostatic water for injection is a prescription item under its FDA labeling, so a retail pharmacy such as Walgreens or CVS will not usually hand it over the counter without one. People obtain it with a prescription through a retail or compounding pharmacy, through a medical or veterinary supply distributor, or from research-supply companies that sell it for laboratory use only. What separates a good source from a bad one is not the channel but the vial: it should be labelled Bacteriostatic Water for Injection USP, state 0.9% benzyl alcohol, name its manufacturer, and carry a legible lot number and expiry date with an intact seal. BACwater.ai sells nothing and recommends no vendor; this page describes how to evaluate a source, not where to shop.";

export const metadata: Metadata = {
  title: "Where to Buy Bacteriostatic Water: Sources and How to Vet Them",
  description:
    "Whether bacteriostatic water is prescription or over the counter, why Walgreens and CVS keep it behind the pharmacy counter, and the label checks that separate a legitimate vial from one to avoid.",
  alternates: { canonical: "/learn/where-to-buy-bacteriostatic-water" },
  openGraph: {
    title: "Where to Buy Bacteriostatic Water: Sources and How to Vet Them",
    description:
      "Prescription status, the routes people actually use, and how to check that a vial is what it claims to be.",
    url: "/learn/where-to-buy-bacteriostatic-water",
    type: "website",
    siteName: "BACwater.ai",
  },
};

const CHANNELS = [
  {
    name: "Retail pharmacy",
    examples: "Walgreens, CVS, grocery and big-box pharmacy counters",
    prescription: "Usually required",
    notes:
      "Kept behind the pharmacy counter, not on the shelf. Stock varies by location, so calling ahead saves a trip.",
  },
  {
    name: "Compounding pharmacy",
    examples: "Independent and specialty compounding pharmacies",
    prescription: "Usually required",
    notes:
      "More likely to keep it in stock routinely and to supply larger multi-dose vials.",
  },
  {
    name: "Medical / veterinary supply",
    examples: "Distributors selling to clinics and practices",
    prescription: "Varies by distributor and state",
    notes:
      "Often sells full cases. Manufacturer labelling and lot traceability are typically good.",
  },
  {
    name: "Research supply companies",
    examples: "Laboratory reagent and research-use-only suppliers",
    prescription: "Not required, sold for laboratory use only",
    notes:
      "Quality varies most here. This is where the label and certificate-of-analysis checks below matter the most.",
  },
];

const GREEN_FLAGS = [
  "Label reads Bacteriostatic Water for Injection, USP",
  "States 0.9% benzyl alcohol as the preservative",
  "A named manufacturer, not just a reseller's branding",
  "Legible lot number and expiry date printed on the vial",
  "Intact flip-off cap and an unpunctured rubber stopper",
  "Certificate of analysis or the manufacturer's package insert available on request",
  "Clear statement of volume (10 mL and 30 mL are the common multi-dose sizes)",
];

const RED_FLAGS = [
  "No manufacturer named anywhere on the vial or the listing",
  "No lot number, or a lot number that is hand-written",
  "A printed or hand-applied label over the original one",
  "No expiry date, or an expiry date that has passed",
  "Seal or stopper already broken, dented, or missing its cap",
  "Cloudy contents, visible particles, or discolouration",
  "A seller who will not say who manufactured it or provide documentation",
];

export default function WhereToBuyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24 sm:pb-32">
      <ArticleJsonLd
        title="Where to Buy Bacteriostatic Water: Sources and How to Vet Them"
        body={BODY}
        slug="where-to-buy-bacteriostatic-water"
        createdAt={new Date("2025-06-01")}
        updatedAt={new Date("2026-08-28")}
        citations={CORE_BACWATER_REFERENCES}
      />
      <WebPageJsonLd
        name="Where to Buy Bacteriostatic Water"
        description={DIRECT_ANSWER}
        url="/learn/where-to-buy-bacteriostatic-water"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Learning Center", url: "/learn" },
          {
            name: "Where to buy bacteriostatic water",
            url: "/learn/where-to-buy-bacteriostatic-water",
          },
        ]}
        citations={CORE_BACWATER_REFERENCES}
        reviewed
      />
      <FaqJsonLd items={FAQS} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Learning Center", href: "/learn" },
          {
            label: "Where to buy",
            href: "/learn/where-to-buy-bacteriostatic-water",
          },
        ]}
      />

      <div className="eyebrow">Sourcing</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
        Where to buy bacteriostatic water
      </h1>

      {/* Direct answer, first thing on the page for answer engines and readers */}
      <p className="mt-5 text-lg leading-relaxed text-foreground/90">
        {DIRECT_ANSWER}
      </p>
      <ReviewedBy className="mt-2" updated="August 2026" />

      {/* Ownership disclosure, above the fold */}
      <div className="mt-6 border border-border bg-surface p-4 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">
          We do not sell bacteriostatic water and we do not recommend a vendor.
        </strong>{" "}
        BACwater.ai is a calculator and reference site. This page explains the
        routes people use and how to check what you are handed, so you can judge
        a source yourself.
      </div>

      {/* Channel comparison */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          The four places people actually get it
        </h2>
        <div className="mt-5 overflow-x-auto border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface text-left">
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Prescription</th>
                <th className="px-4 py-3 font-medium">What to expect</th>
              </tr>
            </thead>
            <tbody>
              {CHANNELS.map((c) => (
                <tr key={c.name} className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <div className="font-medium">{c.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {c.examples}
                    </div>
                  </td>
                  <td className="px-4 py-3">{c.prescription}</td>
                  <td className="px-4 py-3">{c.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Prescription requirements vary by state and by supplier. The FDA
          labeling for Bacteriostatic Water for Injection USP is linked in the
          sources at the bottom of this page.
        </p>
      </section>

      {/* Why the pharmacy answer surprises people */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Why Walgreens and CVS come up empty
        </h2>
        <div className="mt-4 space-y-3 text-foreground/90 leading-relaxed">
          <p>
            Searching a pharmacy website for bacteriostatic water usually
            returns nothing, which reads as &ldquo;they do not carry it.&rdquo;
            Both chains generally do. It sits behind the pharmacy counter as a
            dispensed item rather than in the retail catalogue, so it never
            appears in the shelf inventory a website search covers.
          </p>
          <p>
            The practical move is to call the pharmacy directly rather than
            search, and to ask two things: whether they stock Bacteriostatic
            Water for Injection USP, and what they need in order to dispense it.
            Stock varies location to location even within the same chain.
          </p>
          <p>
            Sterile water, saline, and bacteriostatic water are three different
            products and pharmacies stock them separately. If you ask for the
            wrong one you may be told they have it when they have something else
            entirely, so name the full product. The difference matters once a
            vial is open, which is covered in{" "}
            <Link
              href="/learn/vs/sterile-water"
              className="underline decoration-border underline-offset-2 hover:decoration-foreground"
            >
              bac water vs sterile water
            </Link>
            .
          </p>
        </div>
      </section>

      {/* The actual value: how to vet */}
      <section className="mt-14">
        <div className="flex items-center gap-2.5">
          <ShieldCheck
            className="h-5 w-5"
            style={{ color: "var(--color-accent-guide)" }}
          />
          <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
            How to check a vial before you trust it
          </h2>
        </div>
        <p className="mt-4 text-foreground/90 leading-relaxed">
          The channel a vial came through tells you less than the vial itself
          does. Run through this before the first puncture, whatever the source.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="border border-border p-5">
            <h3 className="font-semibold">Signs it checks out</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
              {GREEN_FLAGS.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="border border-border p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <h3 className="font-semibold">Reasons to walk away</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
              {RED_FLAGS.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
          Once a multi-dose vial is opened it is commonly dated and discarded
          within about 28 days, so buying a large quantity to save money often
          means discarding most of it.{" "}
          <Link
            href="/learn/bac-water-shelf-life"
            className="underline decoration-border underline-offset-2 hover:decoration-foreground"
          >
            Shelf life and storage
          </Link>{" "}
          covers what that window depends on.
        </p>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Sourcing FAQ
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
            { href: "/learn/what-is-bac-water", label: "What is BAC water?" },
            { href: "/learn/vs/sterile-water", label: "BAC water vs sterile water" },
            { href: "/learn/vs/sodium-chloride", label: "BAC water vs sodium chloride" },
            { href: "/learn/bac-water-shelf-life", label: "Shelf life and storage" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between border border-border p-4 hover:bg-muted transition-colors"
            >
              <span className="font-medium">{l.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      <References references={CORE_BACWATER_REFERENCES} />

      {/* CTA into the flagship calculator */}
      <section className="mt-12 section-dark rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="font-medium text-foreground">
            Work out how much you need first
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            The amount of bac water to add depends on your vial strength and the
            amount you measure. Get the exact number before you source anything.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Button asChild variant="brand">
            <Link href="/tools/bac-water">
              BAC water calculator <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/peptide-calculator">Peptide calculator</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
