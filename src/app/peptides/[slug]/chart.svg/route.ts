import { PEPTIDES } from "@/lib/calc/peptides";
import { peptideChartSvg, hasChart } from "@/lib/infographics/peptide-chart";
import { svgResponse } from "@/lib/infographics/svg";

export function generateStaticParams() {
  return PEPTIDES.filter(hasChart).map((p) => ({ slug: p.slug }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const p = PEPTIDES.find((x) => x.slug === slug);
  if (!p || !hasChart(p)) {
    return new Response("Not found", { status: 404 });
  }
  return svgResponse(peptideChartSvg(p));
}
