import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { COMPARISONS } from "@/lib/comparisons/content";

export const metadata = {
  title: "Peptide Reconstitution Guides & BAC Water Education",
  description:
    "Free beginner guides: what BAC water is, how to reconstitute peptides, reading syringes, and safe storage. Written for first-timers.",
};

export default async function LearnPage() {
  const guides = await prisma.contentBlock.findMany({
    where: { kind: "guide", published: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Peptide Reconstitution Guides & BAC Water Education"
        description="Free beginner guides: what BAC water is, how to reconstitute peptides, reading syringes, and safe storage. Written for first-timers."
        url="/learn"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Learning Center", url: "/learn" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Peptide Reconstitution Guides & BAC Water Education",
          description: "Free beginner guides: what BAC water is, how to reconstitute peptides, reading syringes, and safe storage.",
          url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai"}/learn`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: guides.map((g, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai"}/learn/${g.slug}`,
              name: g.title,
            })),
          },
        }) }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Learning Center", href: "/learn" }]} />
      <div className="max-w-3xl">
        <div className="eyebrow">Learning Center</div>
        <h1 className="mt-3 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          Everything you need to reconstitute with confidence.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Short, honest guides written for beginners: how BAC water works, how
          to read a vial, what syringe units mean, and how to store your mixed
          peptide safely.
        </p>
      </div>

      <div className="mt-8 callout-panel">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 accent-check mt-0.5 shrink-0" />
          <div>
            <div className="font-medium text-foreground">Not sure where to start?</div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              If this is your first time, start with <strong className="text-foreground">&ldquo;What is BAC Water?&rdquo;</strong> then
              read <strong className="text-foreground">&ldquo;How Reconstitution Works.&rdquo;</strong> After
              that, you&apos;ll have everything you need
              to <Link href="/plan" className="text-foreground font-medium underline">build your first plan</Link>.
              Looking for a specific peptide? Browse our{" "}
              <Link href="/peptides" className="text-foreground font-medium underline">per-peptide bac water guides</Link>.
            </p>
          </div>
        </div>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {guides.map((g) => (
          <li key={g.id}>
            <Link href={`/learn/${g.slug}`} className="group block border border-border hover:bg-surface transition-colors p-6 h-full">
              <h2 className="text-lg font-semibold tracking-tight group-hover:underline">
                {g.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                {g.body.replace(/[*_#`]/g, "").slice(0, 180)}
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: "var(--color-accent-guide)" }}>
                Read <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Comparison cluster */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Bac water vs. everything else
        </h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Wondering how bacteriostatic water compares to sterile water, saline,
          or the other liquids people ask about? Each guide opens with a direct
          verdict and a side-by-side table.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              href={`/learn/vs/${c.slug}`}
              className="group flex items-center justify-between border border-border p-4 hover:bg-surface transition-colors"
            >
              <span className="font-medium">{c.title}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-10 border border-border bg-surface p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="font-medium text-foreground">Done reading?</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Put what you learned into practice. The Plan Builder does the math for you.
          </p>
        </div>
        <Button asChild variant="brand" className="shrink-0">
          <Link href="/plan">
            Build my plan <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
