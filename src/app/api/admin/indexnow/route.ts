import { NextRequest, NextResponse } from "next/server";
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
