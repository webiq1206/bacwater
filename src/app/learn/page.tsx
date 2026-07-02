import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

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

      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {guides.map((g) => (
          <li key={g.id}>
            <Link href={`/learn/${g.slug}`} className="group block border border-border hover:bg-surface transition-colors p-6 h-full">
              <h2 className="text-lg font-semibold tracking-tight group-hover:underline">
                {g.title}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                {g.body.replace(/[*_#`]/g, "").slice(0, 180)}
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:gap-2 transition-all">
                Read <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
