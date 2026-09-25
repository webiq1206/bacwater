import type { Metadata } from "next";
import { BRAND_ICON, searchSnippet, shareImage } from "./search-appearance";

/** Keep each public share card aligned with its canonical page and a raster image. */
export function withSocialMetadata(metadata: Metadata): Metadata {
  const rawTitle = metadata.title;
  const originalTitle = typeof rawTitle === "string" ? rawTitle
    : rawTitle && "absolute" in rawTitle ? rawTitle.absolute
      : rawTitle && "default" in rawTitle ? rawTitle.default : undefined;
  const rawCanonical = metadata.alternates?.canonical;
  const canonical = typeof rawCanonical === "string" || rawCanonical instanceof URL
    ? rawCanonical : rawCanonical?.url;
  if (!originalTitle || !canonical || !metadata.description) return metadata;
  const parsed = new URL(String(canonical), "https://bacwater.ai");
  const path = `${parsed.pathname}${parsed.search}`;
  const privateOrFiltered = typeof metadata.robots === "object" && metadata.robots?.index === false;
  const snippet = privateOrFiltered ? undefined : searchSnippet(path);
  const rawDisplayTitle = snippet?.title || originalTitle;
  const title = /BACwater\.ai/i.test(rawDisplayTitle) ? rawDisplayTitle : `${rawDisplayTitle} | BACwater.ai`;
  const description = snippet?.description || metadata.description;
  const image = shareImage(privateOrFiltered ? "" : path);
  return {
    ...metadata,
    title: { absolute: title },
    description,
    ...(!privateOrFiltered && typeof metadata.robots !== "string" ? {
      robots: { "max-image-preview": "large" as const, "max-snippet": -1, "max-video-preview": -1, ...metadata.robots },
    } : {}),
    icons: { icon: [{ url: BRAND_ICON, type: "image/png", sizes: "192x192" }], apple: BRAND_ICON },
    openGraph: { type: "website", ...metadata.openGraph, title,
      description, url: canonical, siteName: "BACwater.ai", images: [image] },
    twitter: { ...metadata.twitter, card: "summary_large_image", title,
      description, images: [image] },
  };
}
