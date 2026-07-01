import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Truck } from "lucide-react";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { AddToCartControl } from "@/components/shop/add-to-cart-control";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ProductJsonLd } from "@/components/common/product-json-ld";

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug } });
  return p
    ? {
        title: p.name,
        description: p.description,
        openGraph: { title: p.name, description: p.description },
      }
    : { title: "Product not found" };
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { slug: true } }).catch(() => []);
  return products.map((p) => ({ slug: p.slug }));
}

const FAQS = [
  {
    q: "Do I need a prescription?",
    a: "In the US, bacteriostatic water is prescription-only when labeled for human use. Our products are sold for research and educational purposes only.",
  },
  {
    q: "How is this shipped?",
    a: "Orders ship from our US-licensed vendors within 1–2 business days. Tracked shipping is included.",
  },
  {
    q: "What's your return policy?",
    a: "Sealed items are returnable within 30 days for any reason. Opened items are not returnable for safety reasons.",
  },
];

export default async function PdpPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return notFound();

  const related = await prisma.product.findMany({
    where: { active: true, NOT: { id: product.id } },
    take: 3,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <ProductJsonLd product={product} />
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square rounded-3xl bg-muted flex items-center justify-center text-8xl">
            {product.category === "bac-water" ? "💧" : product.category === "syringes" ? "💉" : product.category === "alcohol-pads" ? "🧴" : "📦"}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.category}
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <div className="mt-4 text-2xl font-semibold tabular-nums">
            {formatCurrency(product.priceCents)}
          </div>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {product.description}
          </p>
          <div className="mt-5 rounded-2xl border border-border bg-muted/50 p-4">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-brand mt-0.5" />
              <div className="text-sm">
                <span className="font-medium">Use it for:</span>{" "}
                <span className="text-muted-foreground">{product.useCase}</span>
              </div>
            </div>
            <div className="mt-2 flex items-start gap-2">
              <Truck className="h-4 w-4 text-brand mt-0.5" />
              <div className="text-sm text-muted-foreground">
                Ships in 1–2 business days from a US-licensed vendor.
              </div>
            </div>
          </div>

          <div className="mt-6">
            <AddToCartControl
              product={{
                id: product.id,
                slug: product.slug,
                sku: product.sku,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.imageUrl,
              }}
            />
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Frequently asked</h2>
            <Accordion type="single" collapsible className="mt-2">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`f-${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-semibold tracking-tight">Also useful</h3>
          <Button asChild variant="ghost">
            <Link href="/shop">
              Shop all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {related.map((r) => (
            <Link key={r.id} href={`/shop/${r.slug}`}>
              <Card className="h-full hover:shadow-[var(--shadow-lift)] transition-shadow">
                <CardContent className="p-5">
                  <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center text-4xl">
                    {r.category === "bac-water" ? "💧" : r.category === "syringes" ? "💉" : r.category === "alcohol-pads" ? "🧴" : "📦"}
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium leading-tight line-clamp-2">
                        {r.name}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">{formatCurrency(r.priceCents)}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
