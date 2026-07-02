/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { CONTENT } from "./seed-data";

const prisma = new PrismaClient();

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
    name: "1 mL Insulin Syringes (100 pack)",
    category: "syringes",
    description:
      "Sterile, single-use U-100 insulin syringes. 31-gauge x 5/16\" needle, clear markings at every unit, latex-free.",
    useCase:
      "Most popular. Best all-around choice when your dose is between 10 and 60 units.",
    priceCents: 2900,
    imageUrl: "/images/products/syr-ins-1.svg",
    inventory: 300,
  },
  {
    slug: "insulin-syringes-0-5ml-100",
    sku: "SYR-INS-05",
    name: "0.5 mL Insulin Syringes (100 pack)",
    category: "syringes",
    description:
      "Half-mL U-100 insulin syringes. 31-gauge x 5/16\" needle, easier-to-read markings for smaller doses.",
    useCase: "Easier to read. Ideal when your dose is under 50 units.",
    priceCents: 2900,
    imageUrl: "/images/products/syr-ins-05.svg",
    inventory: 240,
  },
  {
    slug: "insulin-syringes-0-3ml-100",
    sku: "SYR-INS-03",
    name: "0.3 mL Insulin Syringes (100 pack)",
    category: "syringes",
    description:
      "Micro-dose U-100 insulin syringes. 31-gauge x 5/16\" needle, half-unit markings for the smallest, most accurate doses.",
    useCase: "Most precise. Best when your dose is under 30 units.",
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


async function main() {
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        description: p.description,
        useCase: p.useCase,
        priceCents: p.priceCents,
        imageUrl: p.imageUrl,
        inventory: p.inventory,
        active: true,
        category: p.category,
      },
      create: { ...p, active: true },
    });
  }

  for (const v of VENDORS) {
    const existing = await prisma.vendor.findFirst({ where: { name: v.name } });
    if (!existing) {
      await prisma.vendor.create({ data: v });
    }
  }

  for (const c of CONTENT) {
    await prisma.contentBlock.upsert({
      where: { slug: c.slug },
      update: { title: c.title, body: c.body, kind: c.kind, published: true },
      create: { ...c, published: true },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
