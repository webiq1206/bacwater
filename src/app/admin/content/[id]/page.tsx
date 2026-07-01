import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ContentForm } from "@/components/admin/content-form";

interface Props { params: Promise<{ id: string }>; }
export const metadata = { title: "Admin · Content edit", robots: { index: false, follow: false } };

export default async function ContentEditPage({ params }: Props) {
  const { id } = await params;
  const c = id === "new" ? null : await prisma.contentBlock.findUnique({ where: { id } });
  if (id !== "new" && !c) return notFound();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{c ? c.title : "New content"}</h1>
      <div className="mt-6">
        <ContentForm content={c ?? undefined} />
      </div>
    </div>
  );
}
