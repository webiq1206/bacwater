import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MapPin, ShieldCheck, Truck, Lock } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { WebPageJsonLd } from "@/components/common/webpage-json-ld";
import { ProductJsonLd } from "@/components/common/product-json-ld";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Buy Bacteriostatic Water Online",
  description:
    "Buy sealed, research-grade bacteriostatic water and reconstitution supplies with fast US shipping. Order bac water vials, kits, and syringes and skip the pharmacy run.",
  alternates: { canonical: "/buy" },
};

const FAQS = [
  {
    q: "Where can I buy bacteriostatic water?",
    a: "You can order sealed, research-grade bacteriostatic water directly here and have it shipped to you. We also carry the insulin syringes and alcohol prep pads you need to reconstitute, so you can get everything in one order.",
  },
  {
    q: "Can you buy bac water over the counter?",
    a: "In the US, bacteriostatic water is prescription-only when labeled for human use. The products sold here are for laboratory research and educational purposes. We do not provide medical advice.",
  },
  {
    q: "Where can I buy bac water near me?",
    a: "Rather than searching store to store, order online and we ship it to your door across the US, usually within a few business days. That is faster and more reliable than hunting for local stock.",
  },
  {
    q: "How fast does bac water ship?",
    a: "Orders are packed within 1 to 2 business days and shipped with tracking. Standard US delivery typically arrives within 2 to 5 business days. See our shipping and returns policy for details.",
  },
];

export default async function BuyPage() {
  const products = await prisma.product
    .findMany({
      where: { active: true, category: "bac-water" },
      orderBy: { priceCents: "asc" },
    })
    .catch(() => [] as Awaited<ReturnType<typeof prisma.product.findMany>>);

  const featured = products[0];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-10 sm:pt-14 pb-24 sm:pb-32">
      <WebPageJsonLd
        name="Buy Bacteriostatic Water Online"
        description="Buy sealed, research-grade bacteriostatic water and reconstitution supplies with fast US shipping."
        url="/buy"
        breadcrumb={[
          { name: "Home", url: "/" },
          { name: "Buy Bac Water", url: "/buy" },
        ]}
      />
      {featured && (
        <ProductJsonLd
          product={{
            name: featured.name,
            description: featured.description,
            slug: featured.slug,
            sku: featured.sku,
            priceCents: featured.priceCents,
            currency: featured.currency,
            imageUrl: featured.imageUrl,
            inventory: featured.inventory,
          }}
        />
      )}
      <FaqJsonLd items={FAQS} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Buy Bac Water", href: "/buy" },
        ]}
      />

      <div className="max-w-3xl">
        <div className="eyebrow">Buy</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">
          Buy bacteriostatic water online
        </h1>
        {/* Direct answer */}
        <p className="mt-5 text-lg leading-relaxed text-foreground/90">
          You can buy sealed, research-grade bacteriostatic water (bac water)
          right here and have it shipped to your door with tracking. We carry
          bac water vials, multi-packs, and the syringes and prep pads you need
          to reconstitute, so you can order everything at once instead of
          searching store to store.
        </p>
      </div>

      {/* Trust badges */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
        <Badge
          icon={<Truck className="h-5 w-5" />}
          title="Fast US shipping"
          body="Packed in 1 to 2 business days, shipped with tracking."
        />
        <Badge
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Sealed and sterile"
          body="Vials arrive sealed. We never ship opened stock."
        />
        <Badge
          icon={<Lock className="h-5 w-5" />}
          title="Secure checkout"
          body="Encrypted payment through a trusted processor."
        />
      </div>

      {/* Featured products */}
      <section className="mt-12">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Bac water in stock
        </h2>
        {products.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/shop/${p.slug}`}
                className="group block border border-border p-5 hover:bg-surface transition-colors"
              >
                <div className="font-medium">{p.name}</div>
                {p.useCase && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {p.useCase}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold tabular-nums">
                    {formatCurrency(p.priceCents)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: "var(--color-accent-guide)" }}>
                    View <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-muted-foreground">
            Browse the full catalog in the{" "}
            <Link href="/shop" className="text-foreground font-medium underline">
              shop
            </Link>
            .
          </p>
        )}
        <div className="mt-6">
          <Button asChild variant="brand" size="lg">
            <Link href="/shop">
              Shop all supplies <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Near me */}
      <section className="mt-14 border border-border bg-surface p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 accent-check mt-0.5 shrink-0" />
          <div>
            <h2 className="text-xl font-serif font-medium tracking-tight">
              Looking for bac water near you?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Local pharmacies rarely stock bacteriostatic water for research
              use, and availability changes constantly. Instead of driving store
              to store, order online and we deliver nationwide across the United
              States, usually within a few business days. It is the reliable way
              to get bac water near you without the guesswork. See our{" "}
              <Link href="/shipping-returns" className="text-foreground font-medium underline">
                shipping and returns policy
              </Link>{" "}
              for delivery times.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
          Buying bac water: common questions
        </h2>
        <Accordion type="single" collapsible className="mt-4">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Cross links */}
      <section className="mt-14 border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="font-medium text-foreground">
            Not sure how much to order?
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            Build a plan and we calculate exactly what you need, or browse
            per-peptide guides.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Button asChild variant="brand">
            <Link href="/plan">
              Build my plan <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/peptides">Peptide guides</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function Badge({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-card p-5">
      <div style={{ color: "var(--color-accent-guide)" }}>{icon}</div>
      <div className="mt-2 font-medium">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
