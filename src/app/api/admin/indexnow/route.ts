import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PEPTIDES } from "@/lib/calc/peptides";
import { COMPARISONS } from "@/lib/comparisons/content";
import { SITE_URL, STATIC_PAGES } from "@/lib/seo/sitemap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Submit the site's URLs to IndexNow (Bing, Yandex, etc.) for instant
 * indexing. The IndexNow key is verified via the public key file at
 * /<key>.txt. The key is public by design, so it is safe to keep here.
 *
 * Auth: pass AUTH_SECRET as the `x-seed-secret` header (same as the seeder).
 *   curl -X POST https://<host>/api/admin/indexnow -H "x-seed-secret: $AUTH_SECRET"
 *
 * Also runnable as a GET with ?secret=... for convenience.
 */
const INDEXNOW_KEY = "27a00f2a35ea4c5f9ccf890a624f8259";

// Slugs that redirect and must not be submitted.
const REDIRECTED = new Set(["bac-water-vs-sterile-water"]);

async function collectUrls(): Promise<string[]> {
  const paths: string[] = [];

  for (const p of STATIC_PAGES) paths.push(p.path || "/");
  for (const p of PEPTIDES) paths.push(`/peptides/${p.slug}`);
  for (const c of COMPARISONS) paths.push(`/learn/vs/${c.slug}`);

  const guides = await prisma.contentBlock
    .findMany({
      where: { kind: "guide", published: true },
      select: { slug: true },
    })
    .catch(() => [] as { slug: string }[]);
  for (const g of guides)
    if (!REDIRECTED.has(g.slug)) paths.push(`/learn/${g.slug}`);

  const products = await prisma.product
    .findMany({ where: { active: true }, select: { slug: true } })
    .catch(() => [] as { slug: string }[]);
  for (const pr of products) paths.push(`/shop/${pr.slug}`);

  const unique = Array.from(new Set(paths));
  return unique.map((p) => `${SITE_URL}${p}`);
}

async function submit(): Promise<Response> {
  const host = new URL(SITE_URL).host;
  const urlList = await collectUrls();
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return NextResponse.json({
    ok: res.ok,
    indexNowStatus: res.status,
    submitted: urlList.length,
    host,
  });
}

function authorized(req: NextRequest): boolean {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-seed-secret");
  const query = req.nextUrl.searchParams.get("secret");
  return header === secret || query === secret;
}

export async function POST(req: NextRequest) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return submit();
}

export async function GET(req: NextRequest) {
  if (!authorized(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return submit();
}
