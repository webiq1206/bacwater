import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Shop supplies",
  description:
    "Premium bacteriostatic water, insulin syringes, and alcohol prep pads. Shop directly — no planner required.",
};

const CATEGORY_LABELS: Record<string, string> = {
  "bac-water": "BAC Water",
  syringes: "Syringes",
  "alcohol-pads": "Alcohol Prep Pads",
  other: "Kits & other",
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
      <div className="max-w-3xl">
        <h1 className="text-4xl font-semibold tracking-tight">Shop supplies</h1>
        <p className="mt-3 text-muted-foreground">
          The essentials — sourced from US-licensed vendors, priced fairly.
          Shop directly, or start a plan and we&apos;ll pre-fill your cart.
        </p>
      </div>

      <div className="mt-10 space-y-14">
        {Object.entries(byCategory).map(([cat, items]) => (
          <section key={cat}>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">
                {CATEGORY_LABELS[cat] || cat}
              </h2>
              <div className="text-xs text-muted-foreground">
                {items.length} product{items.length === 1 ? "" : "s"}
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <Link key={p.id} href={`/shop/${p.slug}`} className="group">
                  <Card className="h-full transition-shadow hover:shadow-[var(--shadow-lift)]">
                    <CardContent className="p-5">
                      <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center text-5xl">
                        {cat === "bac-water" ? "💧" : cat === "syringes" ? "💉" : cat === "alcohol-pads" ? "🧴" : "📦"}
                      </div>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium leading-tight line-clamp-2">
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
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
