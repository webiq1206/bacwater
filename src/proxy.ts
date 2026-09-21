import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { RESERVED_LEARN_SLUGS } from "@/lib/seo/publication-policy";

/**
 * Admin gate. Uses the auth() wrapper (rather than getToken) so it works
 * consistently regardless of whether AUTH_SECRET rotates the raw JWT
 * encoding. Auth.js handles cookie/JWT decode internally.
 */
export const proxy = auth(async (req) => {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/learn/")) {
    const slug = pathname.slice(7);
    if (!slug.includes("/") && !RESERVED_LEARN_SLUGS.has(slug)) {
      try {
        const alias = await prisma.contentRedirect.findUnique({ where: { slug }, include: { content: { select: { slug: true, published: true } } } });
        if (alias?.content.published) return NextResponse.redirect(new URL(`/learn/${alias.content.slug}`, process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai"), 308);
      } catch { return new NextResponse("Content temporarily unavailable", { status: 503, headers: { "Retry-After": "300", "Cache-Control": "no-store" } }); }
    }
    return NextResponse.next();
  }
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  if (!req.auth?.user) {
    const url = new URL("/signin", process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai");
    url.pathname = "/signin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if ((req.auth.user as { role?: string })?.role !== "admin") {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai"));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/learn/:slug"],
};
