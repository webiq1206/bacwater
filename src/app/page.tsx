import Link from "next/link";
import { Term } from "@/components/common/term";
import { RelatedReadingDynamic } from "@/components/learn/related-reading-dynamic";
import {
  ArrowRight,
  Beaker,
  BookOpen,
  Calculator,
  Check,
  FileText,
  Timer,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { CORE_BACWATER_REFERENCES } from "@/lib/content/references";

export const metadata = {
  alternates: { canonical: "/" },
};

const POPULAR_PEPTIDES = [
  { slug: "bpc-157", label: "BPC-157" },
  { slug: "tb-500", label: "TB-500" },
  { slug: "semaglutide", label: "Semaglutide" },
  { slug: "tirzepatide", label: "Tirzepatide" },
  { slug: "ipamorelin", label: "Ipamorelin" },
  { slug: "ghk-cu", label: "GHK-Cu" },
];

const COMMON_COMPARISONS = [
  { slug: "sterile-water", label: "BAC water vs sterile water" },
  { slug: "saline", label: "BAC water vs saline" },
];

const PATHS = [
  {
    href: "/plan",
    icon: Wand2,
    title: "Build my plan",
    body: "Answer a few short questions about the numbers on your vial and get an exact reconstitution plan with every step shown, syringe units, a PDF, and a printable label.",
    cta: "Start the guided builder",
  },
  {
    href: "/tools",
    icon: Calculator,
    title: "Calculators",
    body: "Already know your numbers? Use a single calculator: how much water to add, how many syringe units, mg to mcg, and more.",
    cta: "Open the calculators",
  },
  {
    href: "/learn",
    icon: BookOpen,
    title: "Learning center",
    body: "Plain-language guides on bacteriostatic water, how the math works, reading a syringe, and what you cannot know about your vial.",
    cta: "Read the guides",
  },
];

export default async function HomePage() {
  return (
    <div>
      <WebPageJsonLd
        name="BAC Water Concentration Calculator"
        description="Work out concentration, how much to measure, and how many syringe units that is, from the numbers on your vial. Every step is shown. Nothing is for sale."
        url="/"
        citations={CORE_BACWATER_REFERENCES}
      />
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-32 pb-16 sm:pb-20 text-center">
        <div className="eyebrow">Concentration &amp; measurement calculator</div>
        <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight leading-[1.1] text-balance">
          Concentration and Measurement Calculations
          <br className="hidden sm:block" />
          {" "}for Peptide Reconstitution
        </h1>
        <p className="mt-6 mx-auto max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Enter the numbers on your vial. We work out the concentration, how much
          to measure, and how many syringe units that is. We show every step. We
          sell nothing and recommend no vendor.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="xl" variant="brand">
            <Link href="/plan">
              Guide me step by step <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/tools/reconstitution">Enter everything at once</Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 accent-check" /> Every step shown
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 accent-check" /> Nothing is guessed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 accent-check" /> Nothing for sale
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 accent-check" /> Research use only
          </span>
        </div>
        <div className="mt-10 mx-auto max-w-md bg-surface border border-border rounded-2xl p-4 text-sm text-muted-foreground text-center">
          <strong className="text-foreground">Not sure where to start?</strong>{" "}
          The guided builder walks you through it one question at a time, or open
          your{" "}
          <Link href="/peptides" className="text-foreground font-medium underline">
            compound&apos;s calculator
          </Link>
          .
        </div>
      </section>

      <div className="rule mx-auto max-w-5xl" />

      {/* Definition + quick reference (AEO answer block) */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <div className="eyebrow">The basics</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
            What is bacteriostatic water?
          </h2>
          <p className="mt-4 text-lg text-foreground/90 leading-relaxed">
            Bacteriostatic water is sterile water with 0.9% benzyl alcohol in it.
            Sterile means it had no germs in it when it was made. The benzyl
            alcohol, a{" "}
            <Term id="preservative">preservative</Term>, slows germs from growing
            after you open the vial, so you can use the same vial more than once.
            It is not safe for newborn babies. People use it to turn dried peptide
            powder into a liquid they can measure. The calculators here work out
            how much to add.
          </p>
        </div>
        <div className="mt-8 max-w-3xl overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface text-left">
                <th className="px-4 py-3 font-medium">Question</th>
                <th className="px-4 py-3 font-medium">Quick answer</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium">What is bac water?</td>
                <td className="px-4 py-3">Sterile water plus 0.9% benzyl alcohol preservative</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium">How much water for a 5 mg vial?</td>
                <td className="px-4 py-3">It depends on how strong you want the liquid. Use the calculator instead of guessing.</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium">How long can an opened vial be used?</td>
                <td className="px-4 py-3">Follow the instructions that came with your product. General advice does not tell you how long yours lasts.</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium">Units to mL</td>
                <td className="px-4 py-3">100 units = 1 mL on a U-100 syringe</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium">mg to mcg</td>
                <td className="px-4 py-3">1 mg = 1,000 mcg</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 max-w-3xl flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/tools/bac-water" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">Bac water calculator</Link>
          <Link href="/learn/what-is-bac-water" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">What is bac water?</Link>
          <Link href="/faq" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">BAC water FAQ</Link>
        </div>
      </section>

      <div className="rule mx-auto max-w-5xl" />

      {/* Three paths */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid gap-0 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {PATHS.map((p) => {
            const Icon = p.icon;
            return (
              <Link key={p.href} href={p.href} className="group py-8 md:py-0 md:px-8 first:pt-0 md:first:pl-0 last:pb-0 md:last:pr-0">
                <Icon className="h-5 w-5 accent-check" />
                <h3 className="mt-4 text-lg font-serif font-medium tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.body}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="rule mx-auto max-w-5xl" />

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <div className="eyebrow">How it works</div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
              How the math works.
            </h2>
            <ul className="mt-8 space-y-6">
              {[
                {
                  icon: Beaker,
                  t: "Enter your numbers",
                  b: "Compound, vial amount, how much you want to measure, and your syringe.",
                },
                {
                  icon: FileText,
                  t: "See every step",
                  b: "Concentration, how much to measure, syringe units, and how many measurements per vial — with the formula shown.",
                },
                {
                  icon: Timer,
                  t: "Download, print, save",
                  b: "A PDF and a printable vial label with a QR code back to the plan.",
                },
                {
                  icon: Check,
                  t: "Every number labeled",
                  b: "What you typed, what the site worked out, and what it did not decide.",
                },
              ].map((s) => (
                <li key={s.t} className="flex items-start gap-4">
                  <s.icon className="h-5 w-5 accent-check mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">{s.t}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{s.b}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Button asChild variant="brand">
                <Link href="/plan">Start the builder</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/learn">Learn first</Link>
              </Button>
            </div>
          </div>
          <div className="border border-border rounded-2xl p-6 sm:p-8" style={{ background: "var(--color-accent-guide-soft)" }}>
            <div className="eyebrow">Example</div>
            <div className="mt-2 text-xl font-serif font-medium">BPC-157</div>
            <div className="rule my-5" />
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Vial amount</dt>
                <dd>5 mg</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">BAC water</dt>
                <dd>2 mL</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Concentration</dt>
                <dd>2.5 mg/mL</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Amount to measure</dt>
                <dd>0.25 mg (250 mcg)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Syringe units</dt>
                <dd className="font-medium">10 units</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Measurements per vial</dt>
                <dd>20</dd>
              </div>
            </dl>
            <div className="rule my-5" />
            <p className="text-sm text-muted-foreground">
              This measures <b style={{ color: "var(--color-accent-guide)" }}>10 units</b> on a 1 mL insulin syringe.
            </p>
          </div>
        </div>
      </section>

      <div className="rule mx-auto max-w-5xl" />

      {/* Popular peptides + comparisons (hub-and-spoke linking) */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="eyebrow">Explore</div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
          Compounds and guides
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
          Open the reconstitution calculator and reference for a compound, or
          compare bacteriostatic water with other diluents.
        </p>
        <RelatedReadingDynamic
          useInterest
          hideWhenNoSignal
          topics={["dosage", "reconstitution-method", "storage"]}
          title="Pick up where you left off"
          limit={4}
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_PEPTIDES.map((p) => (
            <Link
              key={p.slug}
              href={`/peptides/${p.slug}`}
              className="group flex items-center justify-between border border-border rounded-xl p-4 hover:bg-muted transition-colors"
            >
              <span className="font-medium">{p.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {COMMON_COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              href={`/learn/vs/${c.slug}`}
              className="group flex items-center justify-between border border-border rounded-xl p-4 hover:bg-muted transition-colors"
            >
              <span className="font-medium">{c.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/peptides" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">All compounds</Link>
          <Link href="/learn" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">Learning center</Link>
          <Link href="/tools/reverse-bac" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">Reverse bac water calculator</Link>
        </div>
      </section>

      <div className="rule mx-auto max-w-5xl" />

      {/* How the math works (trust, honest) */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <div className="eyebrow">How the math works</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
            Here is the formula, your numbers, and how we round.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Every answer shows its work. Concentration is the vial amount divided
            by the water you add. We keep full precision inside and round only
            when we show a number. If an amount lands between the marks on your
            syringe, we tell you, because you cannot measure it. The AI helper
            explains the result in plain words — it never does the math itself.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild variant="brand">
              <Link href="/plan">Start the builder</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/learn">Read the guides</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
