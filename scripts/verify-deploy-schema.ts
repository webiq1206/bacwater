import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const requiredTables = ["ContentBlock", "ContentRedirect", "IndexNowEvent", "RequestBudget"];
const requiredColumns: Record<string, string[]> = {
  ContentBlock: ["seoTitle", "metaDescription", "noindex", "canonicalPath"],
};

async function main() {
  const tables = await prisma.$queryRaw<Array<{ table_name: string }>>`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `;
  const tableSet = new Set(tables.map((row) => row.table_name));

  const missingTables = requiredTables.filter((name) => !tableSet.has(name));
  if (missingTables.length) {
    throw new Error(
      `Production schema verification failed. Missing required tables: ${missingTables.join(", ")}. No database changes were attempted.`,
    );
  }

  for (const [table, columns] of Object.entries(requiredColumns)) {
    const rows = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${table}
    `;
    const columnSet = new Set(rows.map((row) => row.column_name));
    const missing = columns.filter((name) => !columnSet.has(name));
    if (missing.length) {
      throw new Error(
        `Production schema verification failed. ${table} is missing: ${missing.join(", ")}. No database changes were attempted.`,
      );
    }
  }

  console.log(
    "Production schema verified. Required SEO metadata, redirects, IndexNow queue, and request-budget tables are present. No database writes were performed.",
  );
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
