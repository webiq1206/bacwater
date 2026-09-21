from pathlib import Path
import re
r=Path('.')
if (r/'src/lib/content/publication-store.ts').exists():
    raise SystemExit('Publication source is already installed.')
def put(p,s):
    q=r/p;q.parent.mkdir(parents=True,exist_ok=True);q.write_text(s)
def replace(p,a,b):
    q=r/p;s=q.read_text()
    if a not in s:raise RuntimeError('Expected source missing: '+p+' '+a[:65])
    q.write_text(s.replace(a,b))

# Additive schema only. Existing content defaults to its existing indexability.
p=r/'prisma/schema.prisma';s=p.read_text();a=s.index('model ContentBlock {');b=s.index('\nmodel ContactMessage',a)
s=s[:a]+'''model ContentBlock {
  id              String   @id @default(cuid())
  slug            String   @unique
  kind            String
  title           String
  body            String
  published       Boolean  @default(true)
  seoTitle        String?
  metaDescription String?
  noindex         Boolean  @default(false)
  canonicalPath   String?
  updatedAt       DateTime @updatedAt
  createdAt       DateTime @default(now())
  redirects       ContentRedirect[]
}

// Aliases point at a content ID, not another alias, avoiding redirect chains.
model ContentRedirect {
  slug      String       @id
  contentId String
  content   ContentBlock @relation(fields: [contentId], references: [id], onDelete: Cascade)
  createdAt DateTime     @default(now())
  @@index([contentId])
}

// Durable discovery outbox. Contains public paths only, never content or secrets.
model IndexNowEvent {
  path          String   @id
  revision      Int      @default(1)
  status        String   @default("pending")
  attempts      Int      @default(0)
  nextAttemptAt DateTime @default(now())
  lastStatus    Int?
  updatedAt     DateTime @updatedAt
  createdAt     DateTime @default(now())
  @@index([status, nextAttemptAt])
}
''' + s[b:];p.write_text(s)

put('src/lib/seo/publication-policy.ts', '''import { STATIC_PAGES, STATIC_LEARN_SLUGS } from "@/lib/seo/sitemap";
import { PEPTIDES } from "@/lib/calc/peptides";
import { COMPARISONS } from "@/lib/comparisons/content";
export const LEGACY_LEARN_SLUGS = new Set(["bac-water-vs-sterile-water", "how-long-bac-water-lasts"]);
export const RESERVED_LEARN_SLUGS = new Set([...STATIC_LEARN_SLUGS, ...LEGACY_LEARN_SLUGS, "vs", "storage-infographic.svg"]);
export const CODE_PUBLIC_PATHS = new Set([
  ...STATIC_PAGES.map(p => p.path || "/"),
  ...PEPTIDES.map(p => `/peptides/${p.slug}`),
  ...COMPARISONS.map(p => `/learn/vs/${p.slug}`),
]);
export const SEARCH_CONTENT_WHERE = { published: true, kind: { in: ["guide", "page"] }, noindex: false, canonicalPath: null };
export function isPublicNotificationPath(path: string): boolean {
  return CODE_PUBLIC_PATHS.has(path) || /^\\/learn\\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path);
}
export function validateCanonicalPath(path: string): boolean {
  return !/[?#%\\\\\\s]/.test(path) && isPublicNotificationPath(path);
}
''')

put('src/lib/seo/indexnow.ts', '''import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo/sitemap";
import { isPublicNotificationPath } from "@/lib/seo/publication-policy";
export const INDEXNOW_KEY = "27a00f2a35ea4c5f9ccf890a624f8259";
const MAX_ATTEMPTS = 6;
export async function queueIndexNow(tx: Prisma.TransactionClient, paths: string[]) {
  for (const path of new Set(paths.filter(isPublicNotificationPath))) {
    await tx.indexNowEvent.upsert({ where: { path },
      create: { path },
      update: { revision: { increment: 1 }, status: "pending", attempts: 0, nextAttemptAt: new Date(), lastStatus: null },
    });
  }
}
export function indexNowEnabled(origin = SITE_URL): boolean {
  try { const u = new URL(origin); return process.env.INDEXNOW_ENABLED !== "false" && u.origin === "https://bacwater.ai"; } catch { return false; }
}
export function notificationOutcome(status: number, attempt: number): string {
  if (status === 200) return "submitted";
  if (status === 202) return "accepted";
  if (status === 403 || status === 404) return "blocked";
  if (status === 400 || status === 422) return "rejected";
  return attempt >= MAX_ATTEMPTS ? "failed" : "pending";
}
/** One bounded drain, not an unbounded worker or a claim of index inclusion. */
export async function flushIndexNow(options: { client?: PrismaClient; transport?: typeof fetch; origin?: string } = {}) {
  const client = options.client ?? prisma, transport = options.transport ?? fetch;
  const origin = options.origin ?? SITE_URL;
  if (!indexNowEnabled(origin)) return { enabled: false, attempted: 0, accepted: 0 };
  const now = new Date();
  await client.indexNowEvent.updateMany({ where: { status: "processing", nextAttemptAt: { lte: now } }, data: { status: "pending" } });
  const candidates = await client.indexNowEvent.findMany({ where: { status: "pending", attempts: { lt: MAX_ATTEMPTS }, nextAttemptAt: { lte: now } }, orderBy: { nextAttemptAt: "asc" }, take: 100 });
  const batch = [];
  for (const event of candidates) {
    if (!isPublicNotificationPath(event.path)) {
      await client.indexNowEvent.updateMany({ where: { path: event.path, revision: event.revision }, data: { status: "rejected" } });
      continue;
    }
    const lease = await client.indexNowEvent.updateMany({ where: { path: event.path, revision: event.revision, status: "pending" }, data: { status: "processing", attempts: { increment: 1 }, nextAttemptAt: new Date(now.getTime() + 60000) } });
    if (lease.count) batch.push(event);
  }
  if (!batch.length) return { enabled: true, attempted: 0, accepted: 0 };
  let status = 0, retryAfter = 0;
  try {
    const keyLocation = `${new URL(origin).origin}/${INDEXNOW_KEY}.txt`;
    const ownership = await transport(keyLocation, { redirect: "error", signal: AbortSignal.timeout(8000), cache: "no-store" });
    if (ownership.status !== 200 || (await ownership.text()).trim() !== INDEXNOW_KEY) status = 403;
    else {
      const response = await transport("https://api.indexnow.org/indexnow", { method: "POST", redirect: "error", signal: AbortSignal.timeout(12000), headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify({ host: "bacwater.ai", key: INDEXNOW_KEY, keyLocation, urlList: batch.map(e => `${new URL(origin).origin}${e.path}`) }) });
      status = response.status;
      const retry = response.headers.get("retry-after");
      if (retry) retryAfter = Math.max(0, Number.isFinite(Number(retry)) ? Number(retry) * 1000 : Date.parse(retry) - Date.now());
      await response.body?.cancel();
    }
  } catch { status = 0; }
  for (const event of batch) {
    const attempt = event.attempts + 1;
    const delay = Math.min(86400000, Math.max(60000 * 2 ** Math.min(attempt - 1, 8), retryAfter || 0));
    await client.indexNowEvent.updateMany({ where: { path: event.path, revision: event.revision, status: "processing" }, data: { status: notificationOutcome(status, attempt), nextAttemptAt: new Date(Date.now() + delay), lastStatus: status || null } });
  }
  return { enabled: true, attempted: batch.length, accepted: status === 200 || status === 202 ? batch.length : 0, httpStatus: status || null };
}
''')

put('src/lib/content/publication-store.ts', '''import { z } from "zod";
import { Prisma, type PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/db";
import { CODE_PUBLIC_PATHS, RESERVED_LEARN_SLUGS, validateCanonicalPath } from "@/lib/seo/publication-policy";
import { queueIndexNow } from "@/lib/seo/indexnow";
const schema = z.object({
  id: z.string().optional().nullable(),
  slug: z.string().trim().min(1).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  kind: z.enum(["guide", "page", "faq"]), title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(100000), published: z.boolean(),
  seoTitle: z.string().trim().max(200).optional().nullable(),
  metaDescription: z.string().trim().max(320).optional().nullable(),
  noindex: z.boolean().optional(), canonicalPath: z.string().trim().max(250).optional().nullable(),
  expectedUpdatedAt: z.string().datetime().optional(),
});
export type PublicationInput = z.input<typeof schema>;
export class PublicationError extends Error {}
export function publicationMessage(e: unknown): string {
  if (e instanceof PublicationError) return e.message;
  if (e instanceof z.ZodError) return e.issues[0]?.message ?? "Check the content fields.";
  if (e instanceof Prisma.PrismaClientKnownRequestError && ["P2002", "P2025", "P2034"].includes(e.code)) return "This record or URL changed. Refresh the editor before retrying; your draft has not been discarded.";
  return "The publication could not be saved. Your draft is still in the editor. Retry after checking the connection.";
}
export async function savePublication(raw: unknown, client: PrismaClient = prisma) {
  const c = schema.parse(raw);
  if (RESERVED_LEARN_SLUGS.has(c.slug)) throw new PublicationError("This URL is maintained in the repository, not the content editor. Use its source page or choose a new URL.");
  return client.$transaction(async tx => {
    const old = c.id ? await tx.contentBlock.findUnique({ where: { id: c.id }, include: { redirects: true } }) : null;
    if (c.id && !old) throw new PublicationError("This content was deleted. Refresh before saving.");
    if (old && RESERVED_LEARN_SLUGS.has(old.slug)) throw new PublicationError("This is a repository-managed page. Changing this database copy would not change the public page.");
    if (old && c.expectedUpdatedAt && old.updatedAt.toISOString() !== c.expectedUpdatedAt) throw new PublicationError("Another edit was saved first. Refresh before retrying; your draft is still here.");
    const existing = await tx.contentBlock.findUnique({ where: { slug: c.slug }, select: { id: true } });
    const alias = await tx.contentRedirect.findUnique({ where: { slug: c.slug } });
    if ((existing && existing.id !== c.id) || (alias && alias.contentId !== c.id)) throw new PublicationError("That URL is already in use, including its saved redirects. Choose another slug.");
    const self = `/learn/${c.slug}`;
    const canonicalPath = c.canonicalPath && c.canonicalPath !== self ? c.canonicalPath : null;
    if (canonicalPath && (!validateCanonicalPath(canonicalPath) || c.noindex || c.kind === "faq")) throw new PublicationError("Use a valid public canonical path, and choose either a canonical duplicate or noindex. FAQ copies already canonicalize to /faq.");
    if (canonicalPath && !CODE_PUBLIC_PATHS.has(canonicalPath)) {
      const targetSlug = canonicalPath.slice("/learn/".length);
      const target = await tx.contentBlock.findFirst({ where: { slug: targetSlug, published: true, noindex: false, canonicalPath: null, kind: { in: ["guide", "page"] } } });
      if (!target || target.id === c.id || RESERVED_LEARN_SLUGS.has(target.slug)) throw new PublicationError("The canonical must point directly to a published, indexable page. Redirects and canonical chains are not accepted.");
    }
    const dependents = old ? await tx.contentBlock.findMany({ where: { canonicalPath: `/learn/${old.slug}`, published: true }, select: { id: true, slug: true } }) : [];
    if (dependents.length && (!c.published || c.noindex || canonicalPath || c.kind === "faq")) throw new PublicationError("Other published pages use this page as their canonical. Update those references before excluding this page.");
    const data = { slug: c.slug, kind: c.kind, title: c.title, body: c.body, published: c.published, seoTitle: c.seoTitle || null, metaDescription: c.metaDescription || null, noindex: c.noindex ?? old?.noindex ?? false, canonicalPath };
    const block = old ? await tx.contentBlock.update({ where: { id: old.id }, data }) : await tx.contentBlock.create({ data });
    if (alias?.contentId === block.id) await tx.contentRedirect.delete({ where: { slug: c.slug } });
    if (old && old.slug !== block.slug) {
      if (old.published) await tx.contentRedirect.upsert({ where: { slug: old.slug }, create: { slug: old.slug, contentId: block.id }, update: { contentId: block.id } });
      await tx.contentBlock.updateMany({ where: { canonicalPath: `/learn/${old.slug}` }, data: { canonicalPath: self } });
    }
    const paths = [...new Set([
      ...(old?.published ? [`/learn/${old.slug}`, ...old.redirects.map(a => `/learn/${a.slug}`)] : []),
      ...(block.published ? [self, ...(old?.redirects ?? []).map(a => `/learn/${a.slug}`)] : []),
      ...dependents.map(d => `/learn/${d.slug}`),
      ...(old?.published || block.published ? ["/learn", "/faq", "/sitemap"] : []),
    ])];
    await queueIndexNow(tx, paths);
    return { block, paths };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 10000 });
}
export async function deletePublication(id: string, client: PrismaClient = prisma) {
  return client.$transaction(async tx => {
    const block = await tx.contentBlock.findUnique({ where: { id }, include: { redirects: true } });
    if (!block) return { paths: [] as string[] };
    if (RESERVED_LEARN_SLUGS.has(block.slug)) throw new PublicationError("This database copy belongs to a repository-managed URL. Deleting it would not remove the source page.");
    if (await tx.contentBlock.count({ where: { canonicalPath: `/learn/${block.slug}`, published: true } })) throw new PublicationError("Update pages that canonicalize here before deleting this content.");
    const paths = block.published ? [`/learn/${block.slug}`, ...block.redirects.map(a => `/learn/${a.slug}`), "/learn", "/faq", "/sitemap"] : [];
    await tx.contentBlock.delete({ where: { id } });
    await queueIndexNow(tx, paths);
    return { paths };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
''')

put('src/lib/seo/publication.ts', '''import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { flushIndexNow } from "@/lib/seo/indexnow";
export function revalidatePublication(slugs: Array<string | undefined> = []) {
  // At this inventory size a full layout invalidation also purges related-reading
  // excerpts that could otherwise keep an unpublished article in a cached page.
  revalidatePath("/", "layout");
  for (const slug of new Set(slugs)) if (slug) revalidatePath(`/learn/${slug}`);
}
export function publishDiscoveryChange(paths: string[]) {
  revalidatePublication(paths.filter(p => p.startsWith("/learn/")).map(p => p.slice(7)));
  after(async () => {
    try { await flushIndexNow(); } catch { console.error("Publication notification drain failed; pending events remain in the outbox."); }
  });
}
''')

# Keep existing callers, but route every CMS write through one validated transaction.
p=r/'src/lib/admin-actions.ts';s=p.read_text();s=s.replace('import { revalidatePublication } from "@/lib/seo/publication";', 'import { publishDiscoveryChange } from "@/lib/seo/publication";\nimport { savePublication, deletePublication, publicationMessage, type PublicationInput } from "@/lib/content/publication-store";')
a=s.index('const contentSchema =');b=s.index('// ---------- Users ----------',a)
s=s[:a]+'''export async function upsertContent(formData: FormData) {
  return saveContentBlock({ ...Object.fromEntries(formData.entries()),
    published: formData.get("published") === "on", noindex: formData.get("noindex") === "on",
  } as PublicationInput);
}
export async function deleteContent(id: string) {
  await requireAdmin();
  try { const result = await deletePublication(id); publishDiscoveryChange(result.paths); return { ok: true as const }; }
  catch (e) { return { ok: false as const, error: publicationMessage(e) }; }
}

''' + s[b:]
a=s.index('const contentBlockSchema =');b=s.index('// ---------- Plans ----------',a)
s=s[:a]+'''export type ContentBlockInput = PublicationInput;
export async function saveContentBlock(input: ContentBlockInput) {
  await requireAdmin();
  try {
    const result = await savePublication(input);
    publishDiscoveryChange(result.paths);
    return { ok: true as const, block: { ...result.block, createdAt: result.block.createdAt.toISOString(), updatedAt: result.block.updatedAt.toISOString() } };
  } catch (e) { return { ok: false as const, error: publicationMessage(e) }; }
}
export async function toggleContentPublished(id: string, published?: boolean, expectedUpdatedAt?: string) {
  await requireAdmin();
  const old = await prisma.contentBlock.findUnique({ where: { id } });
  if (!old) return { ok: false as const, error: "Content not found." };
  const result = await saveContentBlock({ ...old, kind: old.kind as "guide" | "faq" | "page", published: published ?? !old.published, expectedUpdatedAt });
  return result.ok ? { ok: true as const, published: result.block.published, updatedAt: result.block.updatedAt } : result;
}

''' + s[b:];p.write_text(s)

# Discovery only includes published, self-canonical, indexable CMS entries.
p=r/'src/lib/learn/catalog.ts';s=p.read_text();s=s.replace('import { cache } from "react";', 'import { cache } from "react";\nimport { SEARCH_CONTENT_WHERE, RESERVED_LEARN_SLUGS } from "@/lib/seo/publication-policy";')
s=s.replace('where: { published: true, kind: "guide" },','where: SEARCH_CONTENT_WHERE,').replace('.filter((b) => !REDIRECTED.has(b.slug))','.filter((b) => !REDIRECTED.has(b.slug) && !RESERVED_LEARN_SLUGS.has(b.slug))')
s=s.replace('dose, mix date, and discard date.', 'measurement and mix date. Storage limits come from the product instructions.')
p.write_text(s)
p=r/'src/app/sitemap-learn.xml/route.ts';s=p.read_text().replace('import { prisma } from "@/lib/db";', 'import { prisma } from "@/lib/db";\nimport { SEARCH_CONTENT_WHERE } from "@/lib/seo/publication-policy";').replace('where: { kind: "guide", published: true },','where: SEARCH_CONTENT_WHERE,');p.write_text(s)
p=r/'src/app/learn/[slug]/page.tsx';s=p.read_text();s=s.replace('if (!g) return { title: "Guide not found" };','if (!g) return { title: "Guide not found", robots: { index: false, follow: false } };')
s=s.replace('const description = extractMetaDescription(g.body);','const description = g.metaDescription || extractMetaDescription(g.body);\n  const searchTitle = g.seoTitle || g.title;\n  const canonical = g.canonicalPath || `/learn/${slug}`;')
s=s.replace('    title: g.title,\n    description,','    title: searchTitle,\n    description,\n    robots: { index: !g.noindex, follow: true },',1).replace('      title: g.title,\n      description,','      title: searchTitle,\n      description,',1).replace('      url: `/learn/${slug}`,','      url: canonical,',1).replace('alternates: { canonical: `/learn/${slug}` },','alternates: { canonical },')
a=s.index('export async function generateStaticParams');b=s.index('export default async function GuidePage',a);s=s[:a]+'export const dynamic = "force-dynamic";\n\n'+s[b:]
s=s.replace('Mark BACwater.ai as a preferred source on Google and our guides show\n          up first when they are relevant.', 'Choose BACwater.ai as a preferred source where Google supports it.\n          Google controls eligibility and placement; this does not guarantee a ranking.')
s=s.replace('Turn what you just learned into an exact reconstitution plan.', 'Check the arithmetic using values from instructions you already have.')
p.write_text(s)

# Resolve old published slugs before rendering, producing a real HTTP redirect.
p=r/'src/proxy.ts';s=p.read_text();s=s.replace('import { auth } from "@/lib/auth";', 'import { auth } from "@/lib/auth";\nimport { prisma } from "@/lib/db";\nimport { RESERVED_LEARN_SLUGS } from "@/lib/seo/publication-policy";')
s=s.replace('auth((req) => {','auth(async (req) => {')
s=s.replace('  if (!pathname.startsWith("/admin")) return NextResponse.next();','''  if (pathname.startsWith("/learn/")) {
    const slug = pathname.slice(7);
    if (!slug.includes("/") && !RESERVED_LEARN_SLUGS.has(slug)) {
      try {
        const alias = await prisma.contentRedirect.findUnique({ where: { slug }, include: { content: { select: { slug: true, published: true } } } });
        if (alias?.content.published) return NextResponse.redirect(new URL(`/learn/${alias.content.slug}`, process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai"), 308);
      } catch { return new NextResponse("Content temporarily unavailable", { status: 503, headers: { "Retry-After": "300", "Cache-Control": "no-store" } }); }
    }
    return NextResponse.next();
  }
  if (!pathname.startsWith("/admin")) return NextResponse.next();''')
s=s.replace('matcher: ["/admin/:path*"],','matcher: ["/admin/:path*", "/learn/:slug"],');p.write_text(s)

put('src/app/api/admin/indexnow/route.ts', '''import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo/sitemap";
import { getCatalog } from "@/lib/learn/catalog";
import { CODE_PUBLIC_PATHS } from "@/lib/seo/publication-policy";
import { flushIndexNow, queueIndexNow, indexNowEnabled } from "@/lib/seo/indexnow";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function authorized() {
  const session = await auth(); const user = session?.user as { id?: string; role?: string } | undefined;
  return Boolean(user?.id && user.role === "admin");
}
const privateHeaders = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
export async function GET() {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  const states = await prisma.indexNowEvent.groupBy({ by: ["status"], _count: true });
  return NextResponse.json({ enabled: indexNowEnabled(), states, note: "Notifications are not proof of indexing. GET never submits URLs." }, { headers: privateHeaders });
}
export async function POST(req: NextRequest) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: privateHeaders });
  if (req.headers.get("origin") !== new URL(SITE_URL).origin) return NextResponse.json({ error: "Origin not allowed" }, { status: 403, headers: privateHeaders });
  try {
    const text = await req.text(); if (text.length > 2048) return NextResponse.json({ error: "Request too large" }, { status: 413, headers: privateHeaders });
    const body = text ? JSON.parse(text) : {};
    if (body.submitAll === true) {
      const catalog = await getCatalog(true);
      await prisma.$transaction(tx => queueIndexNow(tx, [...CODE_PUBLIC_PATHS, ...catalog.map(e => e.url)]));
    }
    return NextResponse.json(await flushIndexNow(), { headers: privateHeaders });
  } catch { return NextResponse.json({ error: "Notification processing failed. Queued events remain available for retry." }, { status: 503, headers: privateHeaders }); }
}
''')

put('src/app/admin/publication/page.tsx', '''import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/require-admin";
import { flushIndexNow, indexNowEnabled } from "@/lib/seo/indexnow";
export const metadata = { title: "Admin: publishing status", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
async function retry() {
  "use server";
  await requireAdminPage();
  await prisma.indexNowEvent.updateMany({ where: { status: { in: ["pending", "blocked", "failed", "rejected"] } }, data: { status: "pending", attempts: 0, nextAttemptAt: new Date() } });
  try { await flushIndexNow(); } catch { console.error("Manual publication retry did not finish; events remain queued."); }
  revalidatePath("/admin/publication");
}
export default async function PublicationPage() {
  await requireAdminPage();
  const states = await prisma.indexNowEvent.groupBy({ by: ["status"], _count: true });
  const events = await prisma.indexNowEvent.findMany({ orderBy: { updatedAt: "desc" }, take: 100 });
  return <section><h1 className="text-2xl font-semibold">Publishing status</h1><p className="mt-3 max-w-3xl text-sm">Publication changes update the website and its discovery files. IndexNow notifications are stored separately and retried on subsequent publishing activity or with the button below. A submitted or accepted notification does not mean a URL has been indexed.</p><p className="mt-3 font-medium">Delivery: {indexNowEnabled() ? "enabled for bacwater.ai" : "disabled in this environment"}</p><p className="mt-2 text-sm">{states.map(s => `${s.status}: ${s._count}`).join(" · ") || "No notification events yet."}</p><form action={retry} className="my-5"><button className="min-h-11 rounded-lg border px-4" type="submit">Retry pending notifications</button></form><div className="overflow-x-auto" role="region" aria-label="Publication notification queue" tabIndex={0}><table className="w-full text-left text-sm"><caption className="sr-only">Latest 100 publication notifications</caption><thead><tr><th scope="col" className="p-3">Public path</th><th scope="col" className="p-3">Status</th><th scope="col" className="p-3">Attempts</th><th scope="col" className="p-3">HTTP response</th></tr></thead><tbody>{events.map(e => <tr key={e.path} className="border-t"><td className="p-3 break-all">{e.path}</td><td className="p-3">{e.status}</td><td className="p-3">{e.attempts}</td><td className="p-3">{e.lastStatus ?? "Not received"}</td></tr>)}</tbody></table></div><p className="mt-5"><Link href="/admin/content" className="underline">Return to content</Link></p></section>;
}
''')
replace('src/app/admin/layout.tsx','    { href: "/admin/plans", label: "Plans", icon: "plans" as const },','    { href: "/admin/publication", label: "Publishing", icon: "content" as const },\n    { href: "/admin/plans", label: "Plans", icon: "plans" as const },')

# Add SEO controls and accessible labels to the existing content workspace.
p=r/'src/components/admin/content-workspace.tsx';s=p.read_text()
s=s.replace('  updatedAt: string;','  updatedAt: string;\n  seoTitle?: string | null;\n  metaDescription?: string | null;\n  noindex?: boolean;\n  canonicalPath?: string | null;',1)
s=s.replace('body: "", published: false };','body: "", published: false, seoTitle: "", metaDescription: "", noindex: false, canonicalPath: "" };')
s=s.replace('body: saved.body, published: saved.published }','body: saved.body, published: saved.published, seoTitle: saved.seoTitle, metaDescription: saved.metaDescription, noindex: saved.noindex, canonicalPath: saved.canonicalPath }')
s=s.replace('draft.published !== saved.published))','draft.published !== saved.published ||\n            (draft.seoTitle || "") !== (saved.seoTitle || "") ||\n            (draft.metaDescription || "") !== (saved.metaDescription || "") ||\n            !!draft.noindex !== !!saved.noindex ||\n            (draft.canonicalPath || "") !== (saved.canonicalPath || "")))')
s=s.replace('          published: draft.published,','          published: draft.published,\n          seoTitle: draft.seoTitle, metaDescription: draft.metaDescription,\n          noindex: draft.noindex, canonicalPath: draft.canonicalPath,\n          expectedUpdatedAt: saved?.updatedAt,',1)
s=s.replace('await toggleContentPublished(saved.id)', 'await toggleContentPublished(saved.id, !saved.published, saved.updatedAt)').replace('{ ...r, published: res.published }','{ ...r, published: res.published, updatedAt: res.updatedAt }')
s=s.replace('      await deleteContent(saved.id);','      const removal = await deleteContent(saved.id);\n      if (!removal.ok) { toast({ title: "Not deleted", description: removal.error, variant: "destructive" }); return; }')
s=s.replace('                    value={draft.slug}', '                    aria-label="Content slug"\n                    value={draft.slug}')
s=s.replace('                  value={draft.kind}', '                  aria-label="Content kind"\n                  value={draft.kind}')
s=s.replace('                  value={draft.title}', '                  aria-label="Content title"\n                  value={draft.title}')
s=s.replace('                  value={draft.body}', '                  aria-label="Content body"\n                  value={draft.body}')
s=s.replace('                  onClick={togglePublish}', '                  onClick={togglePublish}\n                  aria-pressed={draft.published}')
anchor='''                {saved && saved.published ? ('''
controls='''                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  <label className="block text-xs">Search title (optional)<Input aria-label="Search title" value={draft.seoTitle || ""} onChange={e => patch({ seoTitle: e.target.value })} maxLength={200} /></label>
                  <label className="block text-xs">Search description (optional)<Textarea aria-label="Search description" value={draft.metaDescription || ""} onChange={e => patch({ metaDescription: e.target.value })} maxLength={320} /></label>
                  <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={!!draft.noindex} onChange={e => patch({ noindex: e.target.checked })} />Exclude this page from search</label>
                  <label className="block text-xs">Canonical path (optional)<Input aria-label="Canonical path" placeholder="/learn/preferred-page" value={draft.canonicalPath || ""} onChange={e => patch({ canonicalPath: e.target.value })} /></label>
                  <p className="text-xs leading-relaxed text-muted-foreground">Leave the canonical empty for an original page. Published content is public even when excluded from search. Unpublish content to remove public access. Renamed published URLs redirect automatically.</p>
                  <Link href="/admin/publication" className="text-xs underline">Check discovery notifications</Link>
                </div>

'''
if anchor not in s:raise RuntimeError('Missing editor insert anchor')
s=s.replace(anchor,controls+anchor)
p.write_text(s)
p=r/'src/app/admin/content/page.tsx';s=p.read_text().replace('    published: c.published,','    published: c.published,\n    seoTitle: c.seoTitle, metaDescription: c.metaDescription, noindex: c.noindex, canonicalPath: c.canonicalPath,');p.write_text(s)

# Do not present an unknown clinical review as established fact.
put('src/components/common/reviewed-by.tsx','''import Link from "next/link";
export function ReviewedBy({ className = "", updated }: { className?: string; updated?: string }) {
  return <div className={`text-xs text-muted-foreground ${className}`}>Published by <Link href="/editorial-policy" className="underline">BACwater.ai</Link>. General reference, not a medical review. {updated ? `Content updated ${updated}.` : "Consult the cited product-specific sources."}</div>;
}
''')
p=r/'src/components/common/article-json-ld.tsx';s=p.read_text().replace('    reviewedBy: orgRef,\n    lastReviewed: LAST_REVIEWED_ISO,\n','');p.write_text(s)
p=r/'src/lib/seo/schema.ts';s=p.read_text();s=re.sub(r'\s*reviewedBy: orgRef,?','',s);s=re.sub(r'\s*lastReviewed: LAST_REVIEWED_ISO,?','',s);p.write_text(s)
p=r/'src/lib/content/checks.ts';s=p.read_text().replace('Search results cut off around 60. Trim it or accept the truncation.','Search display varies. Check whether the important meaning fits; character count is an editing guide.').replace('Short titles win fewer queries. Aim for roughly 30 to 60.','Check that this short title describes the page and its distinct purpose.').replace('Thin pages rarely rank and rarely help. Consider expanding.','Review whether the page answers its intended question. Length alone does not establish thin content.').replace('and they anchor featured snippets.','and make longer explanations easier to navigate.').replace(' — ', ': ');p.write_text(s)
p=r/'src/lib/infographics/static.ts';s=p.read_text().replace('{ big: "Fridge", sub: "Keep mixed vials cold, per your product\'s instructions" }','{ big: "Temperature", sub: "Use the exact product label" }').replace('{ big: "Dark", sub: "Keep in the box or foil" }','{ big: "Packaging", sub: "Use product-specific protection" }').replace('{ big: "Freezing", sub: "Can damage many peptides. Check your instructions" }','{ big: "No guessing", sub: "Math cannot establish stability" }').replace('Four rules that keep a mixed vial usable for its full shelf life.','Storage and discard limits are product-specific, not calculated.');p.write_text(s)

# Expose only a non-secret build identity for post-deploy verification.
p=r/'next.config.ts';s=p.read_text().replace('import type { NextConfig } from "next";','import type { NextConfig } from "next";\nimport { execFileSync } from "node:child_process";\nlet buildCommit = "unavailable";\ntry { const value = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); if (/^[a-f0-9]{40}$/.test(value)) buildCommit = value; } catch {}')
s=s.replace('const nextConfig: NextConfig = {','const nextConfig: NextConfig = {\n  env: { BACWATER_BUILD_COMMIT: buildCommit },')
p.write_text(s)
put('src/app/version.json/route.ts','''export const dynamic = "force-static";
export function GET() {
  return Response.json({ release: "2026-09-21-publication", commit: process.env.BACWATER_BUILD_COMMIT || "unavailable" }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
''')
print('Publication source installed. Tests and an additive schema deployment are still required.')
