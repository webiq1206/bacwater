import { shippingSvg } from "@/lib/infographics/static";
import { svgResponse } from "@/lib/infographics/svg";

export const revalidate = 86400;

export function GET() {
  return svgResponse(shippingSvg());
}
