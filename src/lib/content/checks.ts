/**
 * Publishing checks for ContentBlock rows.
 *
 * `extractMetaDescription` is the same function /learn/[slug] uses to build
 * each guide's meta description, moved here so the admin editor can show the
 * exact description that will ship rather than an approximation of it.
 */

export function extractMetaDescription(body: string): string {
  const paragraphs = body.split(/\n\n+/);
  for (const block of paragraphs) {
    const trimmed = block.trim();
    // Skip markdown headings, list items, table rows, and fenced code blocks
    if (/^#{1,6}\s/.test(trimmed)) continue;
    if (/^[-*+]\s/.test(trimmed)) continue;
    if (/^\d+\.\s/.test(trimmed)) continue;
    if (/^\|/.test(trimmed)) continue;
    if (/^```/.test(trimmed)) continue;
    if (trimmed.length < 20) continue;
    // Strip remaining markdown formatting and normalize whitespace
    const clean = trimmed
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[#_]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (clean.length < 20) continue;
    // Trim at a sentence boundary around 150-160 characters
    if (clean.length <= 160) return clean;
    const cutoff = clean.slice(0, 160);
    const lastSentence = cutoff.search(/[.!?][^.!?]*$/);
    if (lastSentence > 80) return clean.slice(0, lastSentence + 1).trim();
    const lastSpace = cutoff.lastIndexOf(" ");
    return (lastSpace > 80 ? clean.slice(0, lastSpace) : cutoff).trim();
  }
  // Fallback: strip all markdown and truncate
  return body.replace(/[*_#`]/g, "").replace(/\s+/g, " ").trim().slice(0, 155);
}

export interface ContentCheck {
  id: string;
  label: string;
  detail: string;
  /** ok = shipping-ready, warn = worth fixing, block = will publish badly. */
  status: "ok" | "warn" | "block";
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function wordCount(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Everything the editor should know before hitting Publish, derived from the
 * same rules the public routes apply. Ordered most severe first.
 */
export function contentChecks(input: {
  title: string;
  slug: string;
  kind: string;
  body: string;
  published: boolean;
  /** Slugs already taken by other rows, for the uniqueness check. */
  takenSlugs?: string[];
}): ContentCheck[] {
  const checks: ContentCheck[] = [];
  const title = input.title.trim();
  const slug = input.slug.trim();
  const words = wordCount(input.body);
  const description = input.body.trim() ? extractMetaDescription(input.body) : "";

  if (!title) {
    checks.push({
      id: "title-missing",
      label: "Title is empty",
      detail: "The title is the H1 and the browser tab. It cannot be blank.",
      status: "block",
    });
  } else if (title.length > 60) {
    checks.push({
      id: "title-long",
      label: `Title is ${title.length} characters`,
      detail: "Search results cut off around 60. Trim it or accept the truncation.",
      status: "warn",
    });
  } else if (title.length < 25) {
    checks.push({
      id: "title-short",
      label: `Title is only ${title.length} characters`,
      detail: "Short titles win fewer queries. Aim for roughly 30 to 60.",
      status: "warn",
    });
  } else {
    checks.push({
      id: "title-ok",
      label: "Title length is fine",
      detail: `${title.length} characters.`,
      status: "ok",
    });
  }

  if (!slug) {
    checks.push({
      id: "slug-missing",
      label: "Slug is empty",
      detail: "The slug is the URL. It cannot be blank.",
      status: "block",
    });
  } else if (!SLUG_RE.test(slug)) {
    checks.push({
      id: "slug-shape",
      label: "Slug is not URL-safe",
      detail: "Use lowercase letters, numbers, and single hyphens between words.",
      status: "block",
    });
  } else if (input.takenSlugs?.includes(slug)) {
    checks.push({
      id: "slug-taken",
      label: "Slug is already used",
      detail: "Slugs are unique in the database, so saving this will fail.",
      status: "block",
    });
  } else {
    checks.push({
      id: "slug-ok",
      label: "Slug is clean and free",
      detail: `/learn/${slug}`,
      status: "ok",
    });
  }

  if (!description) {
    checks.push({
      id: "desc-missing",
      label: "No usable meta description",
      detail:
        "The description is taken from the first real paragraph. Headings and lists are skipped, so open with a sentence.",
      status: "block",
    });
  } else if (description.length < 70) {
    checks.push({
      id: "desc-short",
      label: "Meta description is thin",
      detail: `"${description}" — ${description.length} characters. Around 120 to 160 reads better in results.`,
      status: "warn",
    });
  } else {
    checks.push({
      id: "desc-ok",
      label: "Meta description looks good",
      detail: `"${description}"`,
      status: "ok",
    });
  }

  if (words < 150) {
    checks.push({
      id: "thin",
      label: `Only ${words} words`,
      detail: "Thin pages rarely rank and rarely help. Consider expanding.",
      status: "warn",
    });
  }

  if (input.kind === "guide" && !/^##\s/m.test(input.body)) {
    checks.push({
      id: "no-headings",
      label: "No section headings",
      detail: "Guides scan better with `## ` sections, and they anchor featured snippets.",
      status: "warn",
    });
  }

  if (input.kind === "faq") {
    checks.push({
      id: "faq-canonical",
      label: "FAQ blocks canonicalise to /faq",
      detail:
        "This will render at /learn/" + (slug || "…") + " as noindex, with the canonical pointing at /faq. That is intended.",
      status: "ok",
    });
  }

  if (!input.published) {
    checks.push({
      id: "unpublished",
      label: "Not published",
      detail: "Draft rows are excluded from /learn, the sitemap, and search.",
      status: "warn",
    });
  }

  const order = { block: 0, warn: 1, ok: 2 } as const;
  return checks.sort((a, b) => order[a.status] - order[b.status]);
}
