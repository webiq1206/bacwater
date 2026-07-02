import { NextRequest, NextResponse } from "next/server";
import { getCatalog, relatedContent } from "@/lib/learn/catalog";
import { isTopic, isContentType, type Topic, type ContentType } from "@/lib/learn/taxonomy";

export const revalidate = 3600;

/**
 * Lightweight recommendation endpoint. Given a current signal (peptide,
 * topics, content types), returns the top related Learn entries. Used by the
 * contextual "related reading" panels on the calculator and FAQ hub.
 *
 * Example: /api/related?peptide=tirzepatide&topics=dosage,storage&limit=4
 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const peptide = sp.get("peptide") || undefined;
  const topics = (sp.get("topics") || "")
    .split(",")
    .map((t) => t.trim())
    .filter((t): t is Topic => isTopic(t));
  const types = (sp.get("types") || "")
    .split(",")
    .map((t) => t.trim())
    .filter((t): t is ContentType => isContentType(t));
  const excludeUrl = sp.get("exclude") || undefined;
  const limit = Math.min(8, Math.max(1, parseInt(sp.get("limit") || "4", 10) || 4));

  const catalog = await getCatalog();
  const items = relatedContent(catalog, {
    peptide,
    topics,
    types,
    excludeUrl,
    limit,
  });

  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" } }
  );
}
