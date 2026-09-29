import type { MetadataRoute } from "next";

// Private routes require actual authorization. Public noindex pages remain fetchable.
const DISALLOW = ["/admin", "/api", "/plan/*/pdf"];

// Answer engines that fetch pages for citations are named explicitly so a
// cautious crawler never has to infer its permission from the wildcard. Each
// group repeats the same public/private split; nothing is opened up or closed
// off that the wildcard did not already say. Search access (Googlebot,
// Bingbot) stays under the wildcard, and Google-Extended does not affect
// Search or AI Overviews inclusion, only Gemini training and grounding.
const AI_AGENTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "Claude-Web", "PerplexityBot", "Google-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      ...AI_AGENTS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOW })),
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
