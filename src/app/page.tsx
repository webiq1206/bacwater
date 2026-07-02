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
          The Plan Builder walks you through everything step by step. Just
          answer 3 quick questions and we&apos;ll handle the rest.
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
                  <img src={p.imageUrl} alt={p.name} className="h-full w-full object-contain" />
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
