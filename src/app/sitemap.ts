import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const STATIC = [
  "",
  "/plan",
  "/plan/new",
  "/shop",
  "/learn",
  "/faq",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/disclaimer",
  "/tools",
  "/tools/reconstitution",
  "/tools/bac-water",
  "/tools/dose",
  "/tools/syringe-units",
  "/tools/mg-to-mcg",
  "/tools/supplies",
];

const PRIORITIES: Record<string, number> = {
  "": 1,
  "/plan": 0.9, "/plan/new": 0.9,
  "/shop": 0.8, "/learn": 0.8,
  "/faq": 0.7, "/about": 0.7, "/contact": 0.7,
  "/terms": 0.3, "/privacy": 0.3, "/disclaimer": 0.3,
};

function getPriority(path: string): number {
  if (path in PRIORITIES) return PRIORITIES[path];
  if (path.startsWith("/tools")) return 0.9;
  return 0.7;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  const [products, guides] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.contentBlock.findMany({ where: { kind: "guide", published: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
  ]);
  const now = new Date();
  return [
    ...STATIC.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: getPriority(p) })),
    ...products.map((p) => ({ url: `${base}/shop/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...guides.map((g) => ({ url: `${base}/learn/${g.slug}`, lastModified: g.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
