import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  serverExternalPackages: ["@prisma/client", "bcryptjs", "@react-pdf/renderer", "qrcode"],
  async redirects() {
    return [
      {
        // Consolidated into the dedicated comparison page to avoid duplicate
        // content across two near-identical URLs.
        source: "/learn/bac-water-vs-sterile-water",
        destination: "/learn/vs/sterile-water",
        permanent: true,
      },
      {
        // DB guide duplicated the static shelf-life editorial at
        // /learn/bac-water-shelf-life. Redirect consolidates link equity and
        // prevents keyword cannibalization on storage/shelf-life searches.
        source: "/learn/how-long-bac-water-lasts",
        destination: "/learn/bac-water-shelf-life",
        permanent: true,
      },
      // Legacy/compat paths: permanent (308) redirects so link equity
      // consolidates and crawlers see a clean redirect (not a render-time 307).
      { source: "/plan/advanced", destination: "/plan", permanent: true },
      {
        source: "/tools/ml-to-units",
        destination: "/tools/syringe-units",
        permanent: true,
      },
      // Store removed (PRD v3 §5/§14.1). 301 the commerce URLs to the closest
      // reference or calculator rather than 404ing them.
      { source: "/shop", destination: "/tools", permanent: true },
      { source: "/shop/:path*", destination: "/tools", permanent: true },
      { source: "/buy", destination: "/tools/bac-water", permanent: true },
      { source: "/cart", destination: "/plan", permanent: true },
      { source: "/checkout", destination: "/plan", permanent: true },
      { source: "/checkout/:path*", destination: "/plan", permanent: true },
      { source: "/shipping-returns", destination: "/", permanent: true },
      // The "where to buy" page was a store funnel and recommended vendors,
      // which the site no longer does. Consolidate into the bac-water reference.
      {
        source: "/learn/where-to-buy-bacteriostatic-water",
        destination: "/learn/what-is-bac-water",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://pagead2.googlesyndication.com https://*.googlesyndication.com https://adservice.google.com https://*.googleadservices.com https://partner.googleadservices.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net; frame-ancestors 'none'" },
        ],
      },
    ];
  },
};

export default nextConfig;
