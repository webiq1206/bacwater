import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Truck } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { AddToCartControl } from "@/components/shop/add-to-cart-control";
import { StockBadge } from "@/components/shop/stock-badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ProductJsonLd } from "@/components/common/product-json-ld";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = await prisma.product.findFirst({ where: { slug, active: true } });
  return p
    ? {
        title: `${p.name} - Buy Online`,
        description: p.description,
        openGraph: { title: p.name, description: p.description },
        alternates: { canonical: `/shop/${slug}` },
      }
    : { title: "Product not found" };
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ where: { active: true }, select: { slug: true } }).catch(() => []);
  return products.map((p) => ({ slug: p.slug }));
}

const FAQS = [
  {
    q: "Do I need a prescription?",
    a: "In the US, bacteriostatic water is prescription-only when labeled for human use. Our products are sold for research and educational purposes only.",
  },
  {
    q: "How is this shipped?",
    a: "Orders ship from our US-licensed vendors within 1-2 business days. Tracked shipping is included.",
  },
  {
    q: "What's your return policy?",
    a: "Sealed items are returnable within 30 days for any reason. Opened items are not returnable for safety reasons.",
  },
];

export default async function PdpPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({ where: { slug, active: true } });
  if (!product) return notFound();

  const related = await prisma.product.findMany({
    where: { active: true, NOT: { id: product.id } },
    take: 3,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 sm:pt-24 pb-24 sm:pb-32">
      <ProductJsonLd product={product} />
      <WebPageJsonLd
        name={`${product.name} - Buy Online`}
        description={product.description}
        url={`/shop/${product.slug}`}
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
          { name: product.name, url: `/shop/${product.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }) }}
      />
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
        { label: product.name, href: `/shop/${product.slug}` },
      ]} />
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} width={600} height={600} fetchPriority="high" className="h-full w-full object-contain" />
            ) : (
              <span className="text-8xl text-muted-foreground">&#x2022;</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            {product.category}
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-serif font-medium tracking-tight">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="text-2xl font-semibold tabular-nums">
              {formatCurrency(product.priceCents)}
            </div>
            <StockBadge inventory={product.inventory} active={product.active} showInStock />
          </div>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {product.description}
          </p>
          <div className="mt-5 border border-border bg-surface p-4">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-success mt-0.5" />
              <div className="text-sm">
                <span className="font-medium">Use it for:</span>{" "}
                <span className="text-muted-foreground">{product.useCase}</span>
              </div>
            </div>
            <div className="mt-2 flex items-start gap-2">
              <Truck className="h-4 w-4 text-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                Ships in 1-2 business days from a US-licensed vendor.
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
                inventory: product.inventory,
                active: product.active,
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

          <div className="mt-8">
            <h2 className="text-lg font-semibold">Learn more</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/learn/what-is-bac-water" className="text-muted-foreground hover:text-foreground underline transition-colors">
                  What is BAC water?
                </Link>
              </li>
              <li>
                <Link href="/learn/how-peptide-reconstitution-works" className="text-muted-foreground hover:text-foreground underline transition-colors">
                  How peptide reconstitution works
                </Link>
              </li>
              <li>
                <Link href="/learn/how-to-use-an-insulin-syringe" className="text-muted-foreground hover:text-foreground underline transition-colors">
                  How to use an insulin syringe
                </Link>
              </li>
            </ul>
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
            <Link key={r.id} href={`/shop/${r.slug}`} className="group block border border-border hover:bg-surface transition-colors p-5">
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {r.imageUrl ? (
                  <img src={r.imageUrl} alt={r.name} width={300} height={300} loading="lazy" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-4xl text-muted-foreground">&#x2022;</span>
                )}
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium leading-tight line-clamp-2 group-hover:underline">
                    {r.name}
                  </div>
                </div>
                <div className="text-sm font-semibold">{formatCurrency(r.priceCents)}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
