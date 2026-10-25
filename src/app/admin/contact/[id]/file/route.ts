import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES = new Set(["application/pdf", "image/png", "image/jpeg", "image/webp", "text/plain"]);

/** Staff download for a file the visitor attached to a finished request. */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;
  if (!user?.id || user.role !== "admin") return new NextResponse("Unauthorized", { status: 401 });
  const { id } = await context.params;
  const row = await prisma.contactAttachment.findUnique({
    where: { messageId: id },
    include: { message: { select: { attachmentName: true, attachmentType: true } } },
  });
  if (!row || !TYPES.has(row.message.attachmentType || "")) return new NextResponse("Not found", { status: 404 });
  const name = (row.message.attachmentName || "attachment").replace(/["\r\n]/g, "");
  const ascii = name.replace(/[^\w. -]+/g, "").trim().slice(0, 80) || "attachment";
  return new NextResponse(new Uint8Array(row.data), {
    headers: {
      "Content-Type": row.message.attachmentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
