import Link from "next/link";
import {
  ArrowRight,
  Beaker,
  BookOpen,
  Check,
  FileText,
  Lock,
  ShoppingBag,
  Sparkles,
  Timer,
  Wand2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

const PATHS = [
  {
    href: "/plan",
    icon: Wand2,
    title: "Build My Plan",
    body: "Answer a few short questions and get an exact, personalized reconstitution plan — with instructions, syringe units, PDF, and printable label.",
    cta: "Start my plan",
    tint: "bg-brand-soft",
  },
  {
    href: "/shop",
    icon: ShoppingBag,
    title: "Shop Supplies",
    body: "Buy premium BAC water, insulin syringes, and alcohol prep pads. Skip the planner if you already know what you need.",
    cta: "Shop supplies",
    tint: "bg-secondary",
  },
  {
    href: "/learn",
    icon: BookOpen,
    title: "Learn",
    body: "Beginner-friendly guides on BAC water, reconstitution, syringes, and storage — written by people who use them every day.",
    cta: "Read the guides",
    tint: "bg-accent",
  },
];

export default async function HomePage() {
  const featured = await prisma.product
    .findMany({ where: { active: true }, take: 4, orderBy: { createdAt: "asc" } })
    .catch(() => []);

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 sm:pt-28 pb-8 text-center">
          <div className="eyebrow">
            The trusted utility for peptide reconstitution
          </div>
          <h1 className="mt-5 text-5xl sm:text-7xl font-serif font-medium tracking-tight leading-[1.02] text-balance">
            Reconstitute peptides,
            <br />
            <span className="italic text-brand-ink">calmly</span>.
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
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-brand" /> Exact, verified math
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-brand" /> Printable labels
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-brand" /> Built for beginners
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-brand" /> No account needed
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-8 sm:pt-10 pb-16 sm:pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {PATHS.map((p) => {
            const Icon = p.icon;
            return (
              <Link key={p.href} href={p.href} className="group">
                <Card className="h-full transition-shadow hover:shadow-[var(--shadow-lift)]">
                  <CardContent className="p-7 flex h-full flex-col">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${p.tint}`}>
                      <Icon className="h-5 w-5 text-brand" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {p.body}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand group-hover:gap-2 transition-all">
                      {p.cta} <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="rounded-3xl border border-border bg-card overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8 sm:p-12">
            <div>
              <Badge variant="brand">How it works</Badge>
              <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
                A calmer way to reconstitute.
              </h2>
              <ul className="mt-6 space-y-4 text-sm">
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
                  <li key={s.t} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft">
                      <s.icon className="h-4 w-4 text-brand" />
                    </span>
                    <div>
                      <div className="font-medium">{s.t}</div>
                      <div className="text-muted-foreground">{s.b}</div>
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
            <div className="rounded-2xl bg-muted p-6 sm:p-8">
              <div className="rounded-xl bg-background border border-border p-5 shadow-[var(--shadow-soft)]">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Example plan
                </div>
                <div className="mt-1 text-lg font-semibold">BPC-157</div>
                <dl className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
                  <dt className="text-muted-foreground">Vial strength</dt>
                  <dd className="text-right">5 mg</dd>
                  <dt className="text-muted-foreground">BAC water</dt>
                  <dd className="text-right">2 mL</dd>
                  <dt className="text-muted-foreground">Concentration</dt>
                  <dd className="text-right">2.5 mg/mL</dd>
                  <dt className="text-muted-foreground">Dose</dt>
                  <dd className="text-right">250 mcg</dd>
                  <dt className="text-muted-foreground">Syringe units</dt>
                  <dd className="text-right font-semibold text-brand">10 units</dd>
                  <dt className="text-muted-foreground">Doses per vial</dt>
                  <dd className="text-right">20</dd>
                </dl>
                <div className="mt-5 rounded-lg bg-brand-soft border border-emerald-100 p-3 text-xs text-emerald-900">
                  Draw <b>10 units</b> on a 1 mL insulin syringe.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight">Premium supplies</h2>
            <p className="text-sm text-muted-foreground mt-1">
              BAC water, insulin syringes, and alcohol prep pads — the essentials.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/shop">
              See everything <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <Link key={p.id} href={`/shop/${p.slug}`} className="group">
              <Card className="h-full transition-shadow hover:shadow-[var(--shadow-lift)]">
                <CardContent className="p-5">
                  <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center text-4xl">
                    {p.category === "bac-water" ? "💧" : p.category === "syringes" ? "💉" : p.category === "alcohol-pads" ? "🧴" : "📦"}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-sm leading-tight line-clamp-2">
                        {p.name}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {p.category === "bac-water" ? "BAC water" : p.category === "syringes" ? "Syringes" : p.category === "alcohol-pads" ? "Alcohol pads" : "Kit"}
                      </div>
                    </div>
                    <div className="font-semibold text-sm shrink-0">
                      {formatCurrency(p.priceCents)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24">
        <div className="rounded-3xl border border-border p-8 sm:p-12 bg-gradient-to-br from-emerald-50/60 to-transparent">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-brand text-xs font-medium">
              <Lock className="h-3.5 w-3.5" /> Accurate. Transparent. Verified.
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
              You can trust the math.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Every calculation shows exactly how the answer was reached, warns
              you about anything unusual, and never guesses. The AI assistant
              explains results in plain English — it never does the math itself.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild variant="brand">
                <Link href="/plan">Build my plan</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/learn">Read the guides</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
