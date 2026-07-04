import Link from "next/link";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";

export const metadata = {
  alternates: { canonical: "/shop" },
  title: "Buy BAC Water, Syringes & Supplies",
  description:
    "Premium bacteriostatic water, insulin syringes, and alcohol prep pads. Everything you need to reconstitute peptides safely. Free shipping available.",
  openGraph: {
    title: "Buy BAC Water, Syringes & Supplies",
    description:
      "Premium bacteriostatic water, insulin syringes, and alcohol prep pads. Everything you need to reconstitute peptides safely. Free shipping available.",
    url: "/shop",
    type: "website",
    siteName: "BACwater.ai",
  },
};

const CATEGORY_INFO: Record<string, { label: string; hint: string }> = {
  "bac-water": {
    label: "Bacteriostatic Water",
    hint: "The sterile liquid you mix with your peptide powder. Contains 0.9% benzyl alcohol to keep bacteria from growing.",
  },
  syringes: {
    label: "Insulin Syringes",
    hint: "Used to draw your dose from the reconstituted vial. Marked in units (100 units = 1 mL) for precise, easy dosing.",
  },
  "alcohol-pads": {
    label: "Alcohol Prep Pads",
    hint: "Wipe the vial top before drawing and the injection site before injecting. Two pads per injection is standard.",
  },
  other: {
    label: "Kits & Bundles",
    hint: "Everything you need in one package. Great if you're starting from scratch.",
  },
};

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { priceCents: "asc" }],
  });
  const byCategory = products.reduce<Record<string, typeof products>>((acc, p) => {
    (acc[p.category] ||= []).push(p);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Buy BAC Water, Syringes & Supplies"
        description="Premium bacteriostatic water, insulin syringes, and alcohol prep pads. Everything you need to reconstitute peptides safely. Free shipping available."
        url="/shop"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Peptide Reconstitution Supplies",
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai"}/shop/${p.slug}`,
            name: p.name,
          })),
        }) }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }]} />
      <div className="max-w-3xl">
        <div className="eyebrow">Shop</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          Buy BAC Water, Syringes &amp; Reconstitution Supplies
        </h1>
        <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
          Premium bacteriostatic water, insulin syringes, and reconstitution
          supplies sourced from US-licensed vendors. Not sure what to buy? Use
          our{" "}
          <Link href="/tools/supplies" className="font-medium underline">
            supply calculator
          </Link>{" "}
          or{" "}
          <Link href="/plan" className="font-medium underline">
            build a plan
          </Link>{" "}
          and we&apos;ll pre-fill your cart with exactly what you need.
        </p>
      </div>

      <div className="mt-8 callout-panel">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 accent-check mt-0.5 shrink-0" />
          <div>
            <div className="font-medium text-foreground">Not sure how much to order?</div>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Build a <Link href="/plan" className="text-foreground font-medium underline">mixing plan</Link> first.
              It tells you exactly what supplies you need and pre-fills your cart.
              Or use the <Link href="/tools/supplies" className="text-foreground font-medium underline">supply calculator</Link> to
              figure out quantities for a full cycle.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-14">
        {Object.keys(byCategory).length === 0 && (
          <div className="border border-border p-8 sm:p-12 text-center">
            <div className="text-lg font-serif font-medium tracking-tight">Products are on the way</div>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Our shop is being restocked. In the meantime, build a mixing plan and
              we&apos;ll show you exactly what you need.
            </p>
            <Link href="/plan" className="mt-6 inline-block text-sm font-medium underline hover:no-underline">
              Build a plan
            </Link>
          </div>
        )}
        {Object.entries(byCategory).map(([cat, items]) => {
          const info = CATEGORY_INFO[cat] ?? { label: cat, hint: "" };
          return (
            <section key={cat}>
              <div>
                <h2 className="text-2xl font-serif font-medium tracking-tight">
                  {info.label}
                </h2>
                {info.hint ? (
                  <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                    {info.hint}
                  </p>
                ) : null}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => {
                  const isMostPopular = p.slug === "insulin-syringes-1ml-100" || p.slug === "bac-water-30ml";
                  return (
                    <Link key={p.id} href={`/shop/${p.slug}`} className="group block border border-border hover:bg-surface transition-colors p-5 relative">
                      {isMostPopular && (
                        <span className="badge-match absolute top-3 right-3">Most popular</span>
                      )}
                      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} width={400} height={400} loading="lazy" className="h-full w-full object-contain" />
                        ) : (
                          <span className="text-5xl text-muted-foreground">&#x2022;</span>
                        )}
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium leading-tight line-clamp-2 group-hover:underline">
                            {p.name}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {p.useCase}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-semibold">
                            {formatCurrency(p.priceCents)}
                          </div>
                          {p.inventory <= 0 ? (
                            <Badge variant="warning" className="mt-1">Sold out</Badge>
                          ) : p.inventory < 20 ? (
                            <Badge variant="outline" className="mt-1">Low stock</Badge>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
