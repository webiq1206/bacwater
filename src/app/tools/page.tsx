import Link from "next/link";
import { ArrowRight, Beaker, Calculator, Droplets, FlaskConical, Ruler, Scale, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  title: "Free Peptide Calculators & Tools",
  description:
    "Free calculators for BAC water, reconstitution, dose, syringe units, mg/mcg conversion, and supply planning. Beginner-friendly, no jargon.",
};

const TOOLS = [
  {
    href: "/tools/reconstitution",
    icon: Beaker,
    title: "Reconstitution Calculator",
    body: "The full calculator. Enter your peptide, vial size, dose, and syringe to get BAC water amount, syringe units, doses per vial, and step-by-step instructions.",
    tag: "Most popular",
  },
  {
    href: "/tools/bac-water",
    icon: Droplets,
    title: "BAC Water Calculator",
    body: "Just need to know how much BAC water to add? Enter your vial size and dose. We'll give you the right amount for easy syringe math.",
    tag: null,
  },
  {
    href: "/tools/dose",
    icon: FlaskConical,
    title: "Dose Calculator",
    body: "Already mixed your vial? Enter your concentration and how much you're drawing to find out your exact dose in mg and mcg.",
    tag: null,
  },
  {
    href: "/tools/supplies",
    icon: ShoppingCart,
    title: "Supply Calculator",
    body: "Planning a cycle? Tell us what you're running, how often, and for how long. We'll build your full shopping list with quantities and reasons.",
    tag: null,
  },
  {
    href: "/tools/syringe-units",
    icon: Ruler,
    title: "Syringe Unit Converter",
    body: "Convert between milliliters (mL) and insulin syringe units. Simple two-way converter with a quick-reference table.",
    tag: null,
  },
  {
    href: "/tools/mg-to-mcg",
    icon: Scale,
    title: "mg ↔ mcg Converter",
    body: "Convert between milligrams and micrograms. Vial labels use mg, doses use mcg. This makes switching between them easy.",
    tag: null,
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Free Peptide Calculators & Tools"
        description="Free calculators for BAC water, reconstitution, dose, syringe units, mg/mcg conversion, and supply planning. Beginner-friendly, no jargon."
        url="/tools"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
        ]}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }]} />
      <div className="max-w-3xl">
        <div className="eyebrow">Free tools</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          Calculators &amp; converters
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Quick, focused tools for when you need a single answer. Everything
          below is free, runs instantly in your browser, and explains the math
          in plain English. For research and educational use.
        </p>
      </div>

      <div className="mt-4 border border-border p-4 max-w-3xl">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <b className="text-foreground">New to peptides?</b> Start with the{" "}
          <Link href="/plan" className="underline font-medium text-foreground">Plan Builder</Link> instead. It walks
          you through everything step by step and gives you a complete,
          printable reconstitution plan.
        </p>
      </div>

      <div className="mt-10 grid gap-0 md:grid-cols-2 lg:grid-cols-3 border border-border divide-x divide-y divide-border">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} className="group p-6 hover:bg-muted/50 transition-colors flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                {t.tag ? (
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground border border-border px-2 py-0.5">
                    {t.tag}
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 text-base font-medium group-hover:underline">
                {t.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                {t.body}
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                Open <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
