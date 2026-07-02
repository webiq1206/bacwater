import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CONTENT } from "../../../../../prisma/seed-data";

/**
 * Idempotent DB seeder callable via HTTP.
 *
 * Auth: pass the AUTH_SECRET env var as the `x-seed-secret` header.
 * (Reusing AUTH_SECRET because it's already deployed with the app and
 * lets us seed a fresh prod DB without shipping a new env var.)
 *
 *   curl -X POST https://<host>/api/admin/seed \
 *        -H "x-seed-secret: $AUTH_SECRET"
 *
 * Safe to re-run: all writes are upserts, so nothing duplicates.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCTS = [
  {
    slug: "bac-water-30ml",
    sku: "BAC-30ML",
    name: "Bacteriostatic Water, 30 mL",
    category: "bac-water",
    description:
      "Sterile 0.9% benzyl alcohol bacteriostatic water for reconstitution. Multi-dose 30 mL vial, refrigerator-friendly, sourced from a US-licensed compounding facility.",
    useCase:
      "Used as the diluent for reconstituting research peptides and lyophilized powders.",
    priceCents: 1900,
    imageUrl: "/images/products/bac-30.svg",
    inventory: 200,
  },
  {
    slug: "bac-water-3-pack",
    sku: "BAC-30ML-3",
    name: "Bacteriostatic Water, 30 mL, 3-pack",
    category: "bac-water",
    description:
      "Three 30 mL vials of bacteriostatic water. Best value for weekly protocols and multiple peptides.",
    useCase: "Bulk diluent supply for longer protocols.",
    priceCents: 4900,
    imageUrl: "/images/products/bac-30-3.svg",
    inventory: 120,
  },
  {
    slug: "insulin-syringes-1ml-100",
    sku: "SYR-INS-10",
    name: "Insulin Syringes, 1 mL / 100 units, 31G x 5/16in (100 pack)",
    category: "syringes",
    description:
      "Sterile, single-use U-100 insulin syringes with a 31-gauge needle. Clear markings at every unit, latex-free.",
    useCase:
      "Best all-around choice for peptide dosing when your dose falls between 10 and 60 units.",
    priceCents: 2900,
    imageUrl: "/images/products/syr-ins-1.svg",
    inventory: 300,
  },
  {
    slug: "insulin-syringes-0-5ml-100",
    sku: "SYR-INS-05",
    name: "Insulin Syringes, 0.5 mL / 50 units, 31G x 5/16in (100 pack)",
    category: "syringes",
    description:
      "Half-mL insulin syringes with fine 31-gauge needle for smaller doses.",
    useCase: "Ideal for doses under 50 units where finer resolution helps.",
    priceCents: 2900,
    imageUrl: "/images/products/syr-ins-05.svg",
    inventory: 240,
  },
  {
    slug: "insulin-syringes-0-3ml-100",
    sku: "SYR-INS-03",
    name: "Insulin Syringes, 0.3 mL / 30 units, 31G x 5/16in (100 pack)",
    category: "syringes",
    description:
      "0.3 mL insulin syringes with half-unit markings for the smallest, most accurate doses.",
    useCase: "Best for micro-dosing protocols under 30 units.",
    priceCents: 3200,
    imageUrl: "/images/products/syr-ins-03.svg",
    inventory: 180,
  },
  {
    slug: "alcohol-prep-pads-200",
    sku: "ALC-200",
    name: "Alcohol Prep Pads (200 count)",
    category: "alcohol-pads",
    description:
      "Individually wrapped 70% isopropyl alcohol pads. Sterile, medium size, resealable box.",
    useCase:
      "Sanitize vial tops and injection sites before and after each dose.",
    priceCents: 1200,
    imageUrl: "/images/products/alc-200.svg",
    inventory: 400,
  },
  {
    slug: "starter-kit",
    sku: "KIT-START",
    name: "Reconstitution Starter Kit",
    category: "other",
    description:
      "Everything you need to reconstitute your first peptide vial: 2× BAC water 30 mL, 1 box of 1 mL insulin syringes, 1 box of 200 alcohol prep pads.",
    useCase: "The easiest way to get started: one purchase, one delivery.",
    priceCents: 7900,
    imageUrl: "/images/products/kit-start.svg",
    inventory: 100,
  },
];

const VENDORS = [
  {
    name: "Empower Pharmacy",
    contactEmail: "orders@example-vendor.com",
    productsSupplied: "BAC-30ML, BAC-30ML-3",
    emailTemplate:
      "Hi {vendor_name} team,\n\nPlease fulfill order {order_id}:\n{items}\n\nShip to:\n{ship_to}\n\nCustomer email: {customer_email}\nOrder placed: {placed_at}\n\nReply-all when shipped with tracking. Thanks,\nBACwater.ai",
    active: true,
  },
];


async function seed() {
  const productSummary: string[] = [];
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: { ...p, active: true },
      create: { ...p, active: true },
    });
    productSummary.push(p.sku);
  }

  const vendorSummary: string[] = [];
  for (const v of VENDORS) {
    const existing = await prisma.vendor.findFirst({ where: { name: v.name } });
    if (!existing) {
      const created = await prisma.vendor.create({ data: v });
      vendorSummary.push(created.name);
    } else {
      vendorSummary.push(existing.name + " (exists)");
    }
  }

  const contentSummary: string[] = [];
  for (const c of CONTENT) {
    await prisma.contentBlock.upsert({
      where: { slug: c.slug },
      update: { title: c.title, body: c.body, kind: c.kind, published: true },
      create: { ...c, published: true },
    });
    contentSummary.push(c.slug);
  }

  return { productSummary, vendorSummary, contentSummary };
}

async function handle(req: Request) {
  const secret = process.env.AUTH_SECRET;
  const provided = req.headers.get("x-seed-secret");
  if (!secret || !provided || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await seed();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}

export const POST = handle;
export const GET = handle;
