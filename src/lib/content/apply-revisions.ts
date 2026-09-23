import type { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";
import { EDITORIAL_REVISIONS } from "./editorial-revisions";
const hash=(value:string)=>createHash("sha256").update(value).digest("hex");
type Revision={slug:string;kind:string;title:string;body:string;previousTitle:string;previousBodySha256:string};
export async function applyEditorialRevisions(prisma:PrismaClient, apply=false, revisions:readonly Revision[]=EDITORIAL_REVISIONS) {
 const results:{slug:string;status:string}[]=[];
  for (const revision of revisions) {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.contentBlock.findUnique({ where: { slug: revision.slug } });
      if (!existing) { results.push({ slug: revision.slug, status: "not-present" }); return; }
      if (existing.title === revision.title && existing.body === revision.body) { results.push({ slug: revision.slug, status: "already-current" }); return; }
      if (existing.kind !== revision.kind || existing.title !== revision.previousTitle || hash(existing.body) !== revision.previousBodySha256) {
        results.push({ slug: revision.slug, status: "preserved-independent-edit" }); return;
      }
      if (!apply) { results.push({ slug: revision.slug, status: "eligible-dry-run" }); return; }
      // CAS prevents a concurrent editor's change from being overwritten. All flags and SEO fields stay intact.
      const changed = await tx.contentBlock.updateMany({
        where: { id: existing.id, updatedAt: existing.updatedAt, title: existing.title, body: existing.body },
        data: { title: revision.title, body: revision.body },
      });
      if (changed.count !== 1) throw new Error(`Concurrent editorial edit: ${revision.slug}`);
      if (existing.published && (existing.kind === "guide" || existing.kind === "faq")) {
        await tx.indexNowEvent.upsert({ where: { path: existing.kind === "faq" ? "/faq" : `/learn/${revision.slug}` },
          create: { path: existing.kind === "faq" ? "/faq" : `/learn/${revision.slug}` },
          update: { revision: { increment: 1 }, status: "pending", attempts: 0, nextAttemptAt: new Date() },
        });
      }
      results.push({ slug: revision.slug, status: "updated-existing-default" });
    });
  }
 return results;
}
