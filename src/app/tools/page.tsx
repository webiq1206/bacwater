import Link from "next/link";
import { ArrowRight, Beaker, Droplets, FlaskConical, Repeat, Ruler, Scale, ShoppingCart, Tag } from "lucide-react";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { SITE_URL } from "@/lib/seo/schema";

export const metadata = {
  alternates: { canonical: "/tools" },
  title: "Free Peptide Calculators & Tools",
  description:
    "Free calculators for BAC water, reconstitution, dose, syringe units, mg/mcg conversion, and supply planning. Plain-language, no jargon.",
  openGraph: {
    title: "Free Peptide Calculators & Tools",
    description:
      "Free calculators for BAC water, reconstitution, dose, syringe units, mg/mcg conversion, and supply planning. Plain-language, no jargon.",
    url: "/tools",
    type: "website",
    siteName: "BACwater.ai",
  },
};

const TOOLS = [
  {
    href: "/tools/reconstitution",
    icon: Beaker,
    title: "Work out my whole plan",
    body: "The full calculator. Enter your compound, vial amount, how much you want to measure, and your syringe to get the BAC water amount, syringe units, and step-by-step instructions.",
    bestFor: "Best for: doing everything in one place.",
    tag: "Most popular",
  },
  {
    href: "/tools/bac-water",
    icon: Droplets,
    title: "How much water should I add?",
    body: "Enter your vial amount and the amount you want to measure. We'll give you the water amount that makes the syringe math clean.",
    bestFor: "Best for: you have the vial and need the water amount.",
    tag: null,
  },
  {
    href: "/tools/dose",
    icon: FlaskConical,
    title: "How much am I measuring?",
    body: "Already mixed your vial? Enter the concentration and how much you're measuring to see the amount in mg and mcg.",
    bestFor: "Best for: checking a measurement from a mixed vial.",
    tag: null,
  },
  {
    href: "/tools/supplies",
    icon: ShoppingCart,
    title: "How many supplies will I need?",
    body: "Tell us what you're running, how often, and for how long. We'll count the syringes, pads, and vials. Counts only, nothing for sale.",
    bestFor: "Best for: planning how much to source.",
    tag: null,
  },
  {
    href: "/tools/syringe-units",
    icon: Ruler,
    title: "How many syringe units is this?",
    body: "Convert between milliliters (mL) and U-100 insulin syringe units, either way, with a quick-reference table.",
    bestFor: "Best for: a fast mL ↔ units conversion.",
    tag: null,
  },
  {
    href: "/tools/mg-to-mcg",
    icon: Scale,
    title: "Convert mg and mcg",
    body: "Switch between milligrams and micrograms. Vial amounts are often in mg and measurements in mcg. This makes switching easy.",
    bestFor: "Best for: a quick unit conversion.",
    tag: null,
  },
  {
    href: "/tools/reverse-bac",
    icon: Repeat,
    title: "How much water gets me a specific mark?",
    body: "Want your amount to land on exact units? Pick the amount and the units you want to land on, and get the precise BAC water to add.",
    bestFor: "Best for: landing on a clean, readable syringe mark.",
    tag: "New",
  },
  {
    href: "/tools/vial-labels",
    icon: Tag,
    title: "Printable vial labels",
    body: "Generate printable vial labels with a QR code, showing the vial amount, concentration, the amount to measure, mix date, and discard date.",
    bestFor: "Best for: labeling a mixed vial.",
    tag: null,
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Free Peptide Calculators & Tools"
        description="Free calculators for BAC water, reconstitution, dose, syringe units, mg/mcg conversion, and supply planning. Plain-language, no jargon."
        url="/tools"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Peptide reconstitution calculators",
            itemListElement: TOOLS.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.title,
              url: `${SITE_URL}${t.href}`,
            })),
          }),
        }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }]} />
      <div className="max-w-3xl">
        <div className="eyebrow">Free tools</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          Free Peptide Calculators &amp; Converters
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Quick, focused peptide calculators and unit converters for when you
          need a single answer. Everything below is free, runs instantly in
          your browser, and explains the math in plain English. For research
          and educational use.
        </p>
      </div>

      <div className="section-dark mt-6 max-w-3xl rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex-1">
          <div className="eyebrow" style={{ color: "var(--color-accent-guide)" }}>New to peptides?</div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Skip the single calculators and start with the{" "}
            <span className="text-foreground font-medium">Plan Builder</span> that
            walks you through everything step by step and gives you a complete,
            printable reconstitution plan.
          </p>
        </div>
        <Link
          href="/plan"
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg px-5 h-12 text-sm font-medium whitespace-nowrap"
          style={{ background: "var(--color-primary)", color: "var(--color-primary-foreground)" }}
        >
          Open the Plan Builder <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 max-w-3xl flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span><strong className="text-foreground">100 units</strong> = 1 mL (U-100)</span>
        <span><strong className="text-foreground">1 mg</strong> = 1,000 mcg</span>
        <span><strong className="text-foreground">5 mg + 2 mL</strong> = 2.5 mg/mL</span>
      </div>

      <div className="mt-10 grid gap-0 md:grid-cols-2 lg:grid-cols-3 border border-border divide-x divide-y divide-border">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} className="group p-6 hover:bg-muted transition-colors flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <Icon className="h-5 w-5 accent-check shrink-0" />
                {t.tag ? (
                  <span className="badge-match">
                    {t.tag}
                  </span>
                ) : null}
              </div>
              <span className="mt-3 block text-base font-medium group-hover:underline">
                {t.title}
              </span>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                {t.body}
              </p>
              <p className="mt-2 text-xs font-medium text-foreground/80">{t.bestFor}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: "var(--color-accent-guide)" }}>
                Open <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
