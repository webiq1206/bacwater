/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";

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

const CONTENT: Array<{ slug: string; kind: string; title: string; body: string }> = [
  {
    slug: "what-is-bac-water",
    kind: "guide",
    title: "What is BAC Water?",
    body: `Bacteriostatic water is sterile water mixed with 0.9% benzyl alcohol. The alcohol prevents bacterial growth, which is why the same vial can be used across multiple doses over several weeks. Regular sterile water for injection does **not** contain the preservative. It's single-use only. For any peptide you plan to draw from more than once, BAC water is the right choice.`,
  },
  {
    slug: "how-peptide-reconstitution-works",
    kind: "guide",
    title: "How peptide reconstitution works",
    body: `Peptides are shipped as a freeze-dried powder. To use them, you add BAC water to the vial, which dissolves the powder into a stable solution you can draw from. The key idea: the *concentration* depends on how much BAC water you add. Less water = more concentrated (smaller draw for the same dose). More water = less concentrated (larger draw). Choose an amount that gives you clean, round numbers on your syringe.`,
  },
  {
    slug: "how-to-read-a-peptide-vial",
    kind: "guide",
    title: "How to read a peptide vial label",
    body: `A peptide vial label shows: the peptide name, the strength (usually in mg), a lot number, and sometimes an expiration for the powder. The strength is the total amount of peptide inside, not the dose. Your dose is a fraction of the total, measured in mcg (micrograms). Confirm the strength before you calculate anything.`,
  },
  {
    slug: "how-to-use-an-insulin-syringe",
    kind: "guide",
    title: "How to use an insulin syringe",
    body: `Insulin syringes are marked in **units** on the U-100 scale: 100 units = 1 mL. A 1 mL insulin syringe has 100 markings; a 0.5 mL has 50; a 0.3 mL has 30 (often with half-unit ticks). Read the level from the top of the plunger, not from the tip. Tap out bubbles before injecting.`,
  },
  {
    slug: "what-syringe-units-mean",
    kind: "guide",
    title: "What syringe units mean",
    body: `On a U-100 insulin syringe, one "unit" = 0.01 mL. So 10 units = 0.1 mL, 25 units = 0.25 mL, and so on. When our planner tells you to draw "10 units", it means to pull the plunger back until the top of the plunger sits at the 10-unit mark.`,
  },
  {
    slug: "how-to-store-reconstituted-peptides",
    kind: "guide",
    title: "How to store reconstituted peptides",
    body: `Refrigerate reconstituted peptides at 36-46°F (2-8°C). Keep them upright, protected from light, and away from the freezer coils. Most reconstituted peptides remain stable for ~28-30 days; a few last longer, a few less. Never re-freeze a reconstituted vial.`,
  },
  {
    slug: "how-long-bac-water-lasts",
    kind: "guide",
    title: "How long BAC water lasts",
    body: `Sealed BAC water is stable until its printed expiration (usually 12-24 months). Once punctured, a 30 mL vial is generally considered good for ~28 days refrigerated. If it looks cloudy or has particles, discard it.`,
  },
  {
    slug: "bac-water-vs-sterile-water",
    kind: "guide",
    title: "BAC water vs. sterile water",
    body: `Sterile water for injection has no preservative. It's fine for a single-use reconstitution, but every time you re-enter the vial you introduce contamination risk. BAC water contains 0.9% benzyl alcohol, which suppresses bacterial growth and makes multi-dose vials safe over weeks. For anything you'll draw from more than once, use BAC water.`,
  },
  {
    slug: "common-mistakes-to-avoid",
    kind: "guide",
    title: "Common reconstitution mistakes to avoid",
    body: `**Shaking the vial**: swirl gently. Shaking can denature peptides. **Aiming the water at the powder**: angle it against the wall of the vial. **Skipping the label**: always write the peptide name, date mixed, and expiration on the vial. **Guessing the concentration**: use a calculator (like this one) every time. **Reusing syringes**: always use fresh, sterile syringes.`,
  },
  {
    slug: "faq-general",
    kind: "faq",
    title: "Frequently asked questions",
    body: `**Do I need a prescription for BAC water?** In the US, BAC water is prescription-only when marketed for human use. We provide research-use products intended for laboratory research and educational purposes, not for personal administration.

**Is BACwater.ai a medical service?** No. We provide a calculation utility and supplies. We do not diagnose, prescribe, or provide medical advice.

**Can I save my plans?** Yes. Create a free account and every plan you build is stored with a permanent link.

**Do you ship internationally?** Currently US only. International shipping is on the roadmap.`,
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
