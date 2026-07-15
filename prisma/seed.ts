/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { CONTENT } from "./seed-data";

const prisma = new PrismaClient();

// BACwater.ai sells nothing (PRD v3), so there are no products or vendors to
// seed. Only the editable content blocks are seeded.
async function main() {
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
