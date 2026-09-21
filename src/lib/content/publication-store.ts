import { z } from "zod";
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
    const proposedCanonical = c.canonicalPath === undefined ? old?.canonicalPath : c.canonicalPath;
    const canonicalPath = proposedCanonical && proposedCanonical !== self ? proposedCanonical : null;
    const noindex = c.noindex ?? old?.noindex ?? false;
    if (canonicalPath && (!validateCanonicalPath(canonicalPath) || noindex || c.kind === "faq")) throw new PublicationError("Use a valid public canonical path, and choose either a canonical duplicate or noindex. FAQ copies already canonicalize to /faq.");
    if (canonicalPath && !CODE_PUBLIC_PATHS.has(canonicalPath)) {
      const targetSlug = canonicalPath.slice("/learn/".length);
      const target = await tx.contentBlock.findFirst({ where: { slug: targetSlug, published: true, noindex: false, canonicalPath: null, kind: { in: ["guide", "page"] } } });
      if (!target || target.id === c.id || RESERVED_LEARN_SLUGS.has(target.slug)) throw new PublicationError("The canonical must point directly to a published, indexable page. Redirects and canonical chains are not accepted.");
    }
    const dependents = old ? await tx.contentBlock.findMany({ where: { canonicalPath: `/learn/${old.slug}`, published: true }, select: { id: true, slug: true } }) : [];
    if (dependents.length && (!c.published || noindex || canonicalPath || c.kind === "faq")) throw new PublicationError("Other published pages use this page as their canonical. Update those references before excluding this page.");
    const data = { slug: c.slug, kind: c.kind, title: c.title, body: c.body, published: c.published, seoTitle: c.seoTitle === undefined ? old?.seoTitle ?? null : c.seoTitle || null, metaDescription: c.metaDescription === undefined ? old?.metaDescription ?? null : c.metaDescription || null, noindex, canonicalPath };
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
