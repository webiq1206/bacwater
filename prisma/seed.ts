/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { CONTENT } from "./seed-data";
import { retailFromCostCents } from "../src/lib/pricing";

const prisma = new PrismaClient();

// Supplier costs are researched estimates (single-unit reseller prices; the
// Bac Water Co. bulk quote will likely lower BAC water). Retail is derived as
// cost × 1.25 rounded to the nearest whole dollar — see src/lib/pricing.ts.

const PRODUCTS = [
  {
    slug: "bac-water-30ml",
    sku: "BAC-30ML",
    name: "Bacteriostatic Water, 30 mL",
    category: "bac-water",
    description:
      "Clean, germ-free BAC water for mixing peptides. It has 0.9% benzyl alcohol, a germ-fighting preservative. This is a 30 mL bottle you can use many times. Keep it in the fridge after you open it. It comes from a licensed US maker.",
    useCase:
      "Use it to mix dried research peptides and powders into a liquid. It is the standard liquid for this job.",
    supplierCostCents: 1999,
    imageUrl: "/images/products/bac-30.svg",
    inventory: 200,
  },
  {
    slug: "bac-water-3-pack",
    sku: "BAC-30ML-3",
    name: "Bacteriostatic Water, 30 mL, 3-pack",
    category: "bac-water",
    description:
      "This pack has three 30 mL bottles of BAC water. It is the best value if you use it every week. It is also handy if you mix more than one peptide.",
    useCase: "A larger supply of mixing liquid for longer plans.",
    supplierCostCents: 4900,
    imageUrl: "/images/products/bac-30-3.svg",
    inventory: 120,
  },
  {
    slug: "insulin-syringes-1ml-100",
    sku: "SYR-INS-10",
    name: "1 mL Insulin Syringes (100 pack)",
    category: "syringes",
    description:
      "These are clean, one-time-use U-100 insulin syringes. The needle is 31-gauge and 5/16 inch. The scale is easy to read, with a mark at every unit. They are latex-free.",
    useCase:
      "Our most popular pick. It is the best all-around choice for doses of 10 to 60 units.",
    supplierCostCents: 1999,
    imageUrl: "/images/products/syr-ins-1.svg",
    inventory: 300,
  },
  {
    slug: "insulin-syringes-0-5ml-100",
    sku: "SYR-INS-05",
    name: "0.5 mL Insulin Syringes (100 pack)",
    category: "syringes",
    description:
      "These are 0.5 mL U-100 insulin syringes. The needle is 31-gauge and 5/16 inch. The marks are easier to read for smaller doses.",
    useCase: "Easier to read. It works best for doses under 50 units.",
    supplierCostCents: 1999,
    imageUrl: "/images/products/syr-ins-05.svg",
    inventory: 240,
  },
  {
    slug: "insulin-syringes-0-3ml-100",
    sku: "SYR-INS-03",
    name: "0.3 mL Insulin Syringes (100 pack)",
    category: "syringes",
    description:
      "These are 0.3 mL U-100 insulin syringes for very small doses. The needle is 31-gauge and 5/16 inch. They have half-unit marks for the most exact doses.",
    useCase: "The most exact choice. It works best for doses under 30 units.",
    supplierCostCents: 2200,
    imageUrl: "/images/products/syr-ins-03.svg",
    inventory: 180,
  },
  {
    slug: "alcohol-prep-pads-200",
    sku: "ALC-200",
    name: "Alcohol Prep Pads (200 count)",
    category: "alcohol-pads",
    description:
      "Each pad is wrapped on its own and holds 70% isopropyl alcohol (rubbing alcohol). The pads are clean and medium size. They come in a box you can reseal.",
    useCase:
      "Use them to clean the vial top before each draw and to keep your work surface tidy.",
    supplierCostCents: 599,
    imageUrl: "/images/products/alc-200.svg",
    inventory: 400,
  },
  {
    slug: "starter-kit",
    sku: "KIT-START",
    name: "Reconstitution Starter Kit",
    category: "other",
    description:
      "This kit has all you need to mix your first peptide vial. You get two 30 mL bottles of BAC water. You also get one box of 1 mL insulin syringes. And you get one box of 200 alcohol prep pads.",
    useCase: "The easiest way to start. You buy once and get it all in one delivery.",
    supplierCostCents: 6596,
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
    const priceCents = retailFromCostCents(p.supplierCostCents);
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        description: p.description,
        useCase: p.useCase,
        supplierCostCents: p.supplierCostCents,
        priceCents,
        imageUrl: p.imageUrl,
        inventory: p.inventory,
        active: true,
        category: p.category,
      },
      create: { ...p, priceCents, active: true },
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
