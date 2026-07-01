import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const skusParam = req.nextUrl.searchParams.get("skus");
  const skus = (skusParam || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (skus.length === 0) return NextResponse.json({ products: [] });
  const products = await prisma.product.findMany({ where: { sku: { in: skus } } });
  return NextResponse.json({ products });
}
