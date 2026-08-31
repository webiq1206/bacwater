import { prisma } from "@/lib/db";
import { ContentWorkspace, type ContentRecord } from "@/components/admin/content-workspace";

export const metadata = { title: "Admin · Content", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ id?: string; new?: string }>;
}

export default async function AdminContentPage({ searchParams }: Props) {
  const { id, new: isNew } = await searchParams;
  const items = await prisma.contentBlock.findMany({ orderBy: { updatedAt: "desc" } });
  const blocks: ContentRecord[] = items.map((c) => ({
    id: c.id,
    slug: c.slug,
    kind: c.kind,
    title: c.title,
    body: c.body,
    published: c.published,
    updatedAt: c.updatedAt.toISOString(),
  }));
  return (
    <ContentWorkspace
      blocks={blocks}
      initialId={id && blocks.some((b) => b.id === id) ? id : undefined}
      startNew={isNew === "1"}
    />
  );
}
