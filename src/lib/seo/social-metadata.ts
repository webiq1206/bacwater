import type { Metadata } from "next";

/** Keep each public share card aligned with its canonical page and a raster image. */
export function withSocialMetadata(metadata: Metadata): Metadata {
  const rawTitle = metadata.title;
  const title = typeof rawTitle === "string" ? rawTitle
    : rawTitle && "absolute" in rawTitle ? rawTitle.absolute
      : rawTitle && "default" in rawTitle ? rawTitle.default : undefined;
  const rawCanonical = metadata.alternates?.canonical;
  const canonical = typeof rawCanonical === "string" || rawCanonical instanceof URL
    ? rawCanonical : rawCanonical?.url;
  if (!title || !canonical || !metadata.description) return metadata;
  const image = { url: "/opengraph-image", width: 1200, height: 630,
    alt: "BACwater.ai free calculation tools and reference guides" };
  return {
    ...metadata,
    openGraph: { type: "website", ...metadata.openGraph, title,
      description: metadata.description, url: canonical, siteName: "BACwater.ai", images: [image] },
    twitter: { ...metadata.twitter, card: "summary_large_image", title,
      description: metadata.description, images: [image] },
  };
}
