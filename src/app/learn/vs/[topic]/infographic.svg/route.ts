import { COMPARISONS, findComparison } from "@/lib/comparisons/content";
import { comparisonSvg } from "@/lib/infographics/comparison";
import { svgResponse } from "@/lib/infographics/svg";

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ topic: c.slug }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ topic: string }> }
) {
  const { topic } = await params;
  const c = findComparison(topic);
  if (!c) return new Response("Not found", { status: 404 });
  return svgResponse(comparisonSvg(c));
}
