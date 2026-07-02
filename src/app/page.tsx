import Link from "next/link";
import {
  ArrowRight,
  Beaker,
  BookOpen,
  Check,
  FileText,
  ShoppingBag,
  Timer,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
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
    title: "Build My Plan",
    body: "Answer a few short questions and get an exact, personalized reconstitution plan with instructions, syringe units, PDF, and printable label.",
    cta: "Start my plan",
  },
  {
    href: "/shop",
    icon: ShoppingBag,
    title: "Shop Supplies",
    body: "Buy premium BAC water, insulin syringes, and alcohol prep pads. Skip the planner if you already know what you need.",
    cta: "Shop supplies",
  },
  {
    href: "/learn",
    icon: BookOpen,
    title: "Learn",
    body: "Beginner-friendly guides on BAC water, reconstitution, syringes, and storage. Written by people who use them every day.",
    cta: "Read the guides",
  },
];

export default async function HomePage() {
  const featured = await prisma.product
    .findMany({ where: { active: true }, take: 4, orderBy: { createdAt: "asc" } })
    .catch(() => []);

  return (
    <div>
      <WebPageJsonLd
        name="BAC Water Calculator and Reconstitution Guide"
        description="Bacteriostatic water (bac water) is sterile water with 0.9% benzyl alcohol added as a preservative, the standard diluent for reconstituting lyophilized peptides. Calculate exactly how much to add for your vial."
        url="/"
        citations={CORE_BACWATER_REFERENCES}
      />
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pt-20 sm:pt-32 pb-16 sm:pb-20 text-center">
        <div className="eyebrow">
          The complete guide to peptide reconstitution
        </div>
        <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight leading-[1.1] text-balance">
          The Complete BAC Water Calculator
          <br className="hidden sm:block" />
          {" "}&amp; Reconstitution Guide
        </h1>
        <p className="mt-6 mx-auto max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Answer a few short questions. We&apos;ll do the math, print your
          labels, and ship the exact supplies you need. Made for first-timers.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="xl" variant="brand">
            <Link href="/plan">
              Build my plan <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link href="/shop">Shop supplies</Link>
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 accent-check" /> Exact, verified math
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 accent-check" /> Printable labels
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 accent-check" /> Built for beginners
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 accent-check" /> For research use
          </span>
        </div>
        <div className="mt-10 mx-auto max-w-md bg-surface border border-border p-4 text-sm text-muted-foreground text-center">
          <strong className="text-foreground">Not sure where to start?</strong>{" "}
          The Plan Builder walks you through everything step by step, or jump
          straight to your{" "}
          <Link href="/peptides" className="text-foreground font-medium underline">
            peptide&apos;s bac water calculator
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
            Bacteriostatic water (bac water) is sterile water with 0.9% benzyl
            alcohol added as a preservative. It is the standard diluent for
            reconstituting lyophilized peptides, because the preservative lets
            you draw from one vial safely for weeks. The calculators here work
            out exactly how much to add for your vial.
          </p>
        </div>
        <div className="mt-8 max-w-3xl overflow-x-auto border border-border">
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
                <td className="px-4 py-3 font-medium">How much for a 5 mg vial?</td>
                <td className="px-4 py-3">2 mL is a common start (250 mcg = 10 units)</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3 font-medium">How long does it last?</td>
                <td className="px-4 py-3">About 28 days once opened and refrigerated</td>
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
          <Link href="/buy" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">Buy bac water</Link>
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
              A calmer way to reconstitute.
            </h2>
            <ul className="mt-8 space-y-6">
              {[
                {
                  icon: Beaker,
                  t: "Answer 5 short questions",
                  b: "Peptide, vial strength, dose, syringe. That's it.",
                },
                {
                  icon: FileText,
                  t: "Get an exact plan",
                  b: "BAC water amount, syringe units, doses per vial, storage, expiration.",
                },
                {
                  icon: Timer,
                  t: "Download, print, save",
                  b: "PDF + printable vial label with a QR code back to the plan.",
                },
                {
                  icon: ShoppingBag,
                  t: "Get supplies in one click",
                  b: "We pre-fill your cart with exactly what you need.",
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
                <Link href="/plan">Start my plan</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/learn">Learn first</Link>
              </Button>
            </div>
          </div>
          <div className="border border-border p-6 sm:p-8" style={{ background: "var(--color-accent-guide-soft)" }}>
            <div className="eyebrow">Example plan</div>
            <div className="mt-2 text-xl font-serif font-medium">BPC-157</div>
            <div className="rule my-5" />
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Vial strength</dt>
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
                <dt className="text-muted-foreground">Dose</dt>
                <dd>0.25 mg (250 mcg)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Syringe units</dt>
                <dd className="font-medium">10 units</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Doses per vial</dt>
                <dd>20</dd>
              </div>
            </dl>
            <div className="rule my-5" />
            <p className="text-sm text-muted-foreground">
              Draw <b style={{ color: "var(--color-accent-guide)" }}>10 units</b> on a 1 mL insulin syringe.
            </p>
          </div>
        </div>
      </section>

      <div className="rule mx-auto max-w-5xl" />

      {/* Featured products */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Shop</div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-medium tracking-tight">Premium supplies</h2>
          </div>
          <Link href="/shop" className="text-sm font-medium hover:underline inline-flex items-center gap-1">
            See everything <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-0 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border border border-border">
          {featured.map((p) => (
            <Link key={p.id} href={`/shop/${p.slug}`} className="group p-6 hover:bg-surface transition-colors">
              <div className="aspect-square bg-muted flex items-center justify-center">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} width={400} height={400} loading="lazy" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-4xl text-muted-foreground">&#x2022;</span>
                )}
              </div>
              <div className="mt-4">
                <div className="text-sm font-medium leading-tight line-clamp-2 group-hover:underline">
                  {p.name}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {formatCurrency(p.priceCents)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="rule mx-auto max-w-5xl" />

      {/* Popular peptides + comparisons (hub-and-spoke linking) */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="eyebrow">Explore</div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
          Popular peptides and guides
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
          Jump straight to the reconstitution guide and calculator for your
          peptide, or compare bac water with other diluents.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {POPULAR_PEPTIDES.map((p) => (
            <Link
              key={p.slug}
              href={`/peptides/${p.slug}`}
              className="group flex items-center justify-between border border-border p-4 hover:bg-surface transition-colors"
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
              className="group flex items-center justify-between border border-border p-4 hover:bg-surface transition-colors"
            >
              <span className="font-medium">{c.label}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link href="/peptides" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">All peptides</Link>
          <Link href="/learn" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">Learning center</Link>
          <Link href="/tools/reverse-bac" className="font-medium underline underline-offset-4 decoration-border hover:decoration-foreground">Reverse bac water calculator</Link>
        </div>
      </section>

      <div className="rule mx-auto max-w-5xl" />

      {/* Trust */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-2xl">
          <div className="eyebrow">Trust</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
            You can trust the math.
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Every calculation shows exactly how the answer was reached, warns
            you about anything unusual, and never guesses. The AI assistant
            explains results in plain English. It never does the math itself.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild variant="brand">
              <Link href="/plan">Build my plan</Link>
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
