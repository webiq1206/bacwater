import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ArticleJsonLd } from "@/components/common/article-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { getCatalog, relatedContent } from "@/lib/learn/catalog";
import { RelatedReadingPanel } from "@/components/learn/related-reading";
import { References } from "@/components/common/references";
import { ReviewedBy } from "@/components/common/reviewed-by";
import { guideReferences } from "@/lib/content/references";

interface Props { params: Promise<{ slug: string }>; }

function extractMetaDescription(body: string): string {
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

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const g = await prisma.contentBlock.findFirst({ where: { slug, published: true } });
  if (!g) return { title: "Guide not found" };
  const description = extractMetaDescription(g.body);
  return {
    title: g.title,
    description,
    openGraph: { title: g.title, description },
    alternates: { canonical: `/learn/${slug}` },
  };
}

export async function generateStaticParams() {
  const guides = await prisma.contentBlock.findMany({
    where: { kind: "guide", published: true },
    select: { slug: true },
  }).catch(() => []);
  return guides.map((g) => ({ slug: g.slug }));
}

function renderBody(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("### ")) {
      return <h3 key={i} className="mt-8 text-lg font-semibold tracking-tight">{block.slice(4)}</h3>;
    }
    if (block.startsWith("## ")) {
      return <h2 key={i} className="mt-10 text-xl font-semibold tracking-tight">{block.slice(3)}</h2>;
    }
    const html = block
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return (
      <p
        key={i}
        className="mt-4 text-base leading-relaxed text-foreground/90"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await prisma.contentBlock.findFirst({ where: { slug, published: true } });
  if (!guide) return notFound();

  const refs = guideReferences(slug);

  // Tag-driven related content: surface the most relevant peptides, guides,
  // comparisons, and FAQs for this article, not just the newest guides.
  const catalog = await getCatalog();
  const self = catalog.find((e) => e.url === `/learn/${slug}`);
  const relatedReading = relatedContent(catalog, {
    peptide: self?.peptideTags[0],
    topics: self?.topicTags ?? [],
    excludeUrl: `/learn/${slug}`,
    limit: 4,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-14 sm:pt-20 pb-24 sm:pb-32">
      <ArticleJsonLd title={guide.title} body={guide.body} slug={guide.slug} createdAt={guide.createdAt} updatedAt={guide.updatedAt} citations={refs} />
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Learning Center", href: "/learn" },
        { label: guide.title, href: `/learn/${guide.slug}` },
      ]} />
      <div className="eyebrow">Guide</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">{guide.title}</h1>
      <ReviewedBy
        className="mt-3"
        updated={guide.updatedAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      />
      <article className="mt-4 prose prose-neutral max-w-none">
        {renderBody(guide.body)}
      </article>

      <References references={refs} />

      <div className="mt-10 border border-border bg-surface p-6 flex flex-wrap items-center gap-3 justify-between">
        <div>
          <div className="font-medium">Ready to build a plan?</div>
          <div className="text-sm text-muted-foreground">
            Turn what you just learned into an exact reconstitution plan.
          </div>
        </div>
        <Button asChild variant="brand">
          <Link href="/plan">
            Build my plan <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {relatedReading.length > 0 && (
        <div className="mt-14">
          <RelatedReadingPanel title="Also worth reading" items={relatedReading} />
        </div>
      )}
    </div>
  );
}
