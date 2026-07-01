import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Admin gate. Uses the auth() wrapper (rather than getToken) so it works
 * consistently regardless of whether AUTH_SECRET rotates the raw JWT
 * encoding. Auth.js handles cookie/JWT decode internally.
 */
export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  if (!req.auth?.user) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if ((req.auth.user as { role?: string })?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
