import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ArticleJsonLd } from "@/components/common/article-json-ld";
import { HowToJsonLd } from "@/components/common/howto-json-ld";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { getCatalog, relatedContent } from "@/lib/learn/catalog";
import { RelatedReadingPanel } from "@/components/learn/related-reading";
import { References } from "@/components/common/references";
import { ReviewedBy } from "@/components/common/reviewed-by";
import { guideReferences } from "@/lib/content/references";
import { HOWTO_SCHEMAS } from "@/lib/learn/howto-schema";

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

  // FAQ content blocks are canonicalized to /faq; noindex the /learn/faq-* URLs
  // so search engines see one authoritative version of each FAQ answer.
  if (g.kind === "faq") {
    return {
      title: g.title,
      robots: { index: false, follow: true },
      alternates: { canonical: "/faq" },
    };
  }

  const description = extractMetaDescription(g.body);
  return {
    title: g.title,
    description,
    openGraph: {
      title: g.title,
      description,
      url: `/learn/${slug}`,
      type: "website",
      siteName: "BACwater.ai",
    },
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

export const dynamic = "auto";

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderBlock(block: string, i: number) {
  if (block.startsWith("### ")) {
    return <h3 key={i} className="mt-8 text-lg font-semibold tracking-tight">{block.slice(4)}</h3>;
  }
  if (block.startsWith("## ")) {
    return <h2 key={i} className="mt-10 text-xl font-semibold tracking-tight">{block.slice(3)}</h2>;
  }

  const lines = block.split("\n");

  // Unordered list: lines starting with "- " or "* "
  if (lines.every((l) => /^[-*]\s/.test(l.trim()))) {
    return (
      <ul key={i} className="mt-4 list-disc pl-6 space-y-1 text-base leading-relaxed text-foreground/90">
        {lines.map((l, j) => (
          <li key={j} dangerouslySetInnerHTML={{ __html: inlineMarkdown(l.replace(/^[-*]\s/, "").trim()) }} />
        ))}
      </ul>
    );
  }

  // Ordered list: lines starting with "N. "
  if (lines.every((l) => /^\d+\.\s/.test(l.trim()))) {
    return (
      <ol key={i} className="mt-4 list-decimal pl-6 space-y-1 text-base leading-relaxed text-foreground/90">
        {lines.map((l, j) => (
          <li key={j} dangerouslySetInnerHTML={{ __html: inlineMarkdown(l.replace(/^\d+\.\s/, "").trim()) }} />
        ))}
      </ol>
    );
  }

  // Markdown table: every line starts with "|"
  if (lines.every((l) => l.trim().startsWith("|"))) {
    const rows = lines
      .filter((l) => !/^\|[-:| ]+\|$/.test(l.trim()))
      .map((l) =>
        l
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((cell) => cell.trim())
      );
    if (rows.length < 1) {
      return null;
    }
    const [head, ...body] = rows;
    return (
      <div key={i} className="mt-4 overflow-x-auto">
        <table className="w-full text-sm border border-border">
          <thead>
            <tr className="bg-surface text-left">
              {head.map((cell, j) => (
                <th key={j} className="px-3 py-2 font-medium border-b border-border" dangerouslySetInnerHTML={{ __html: inlineMarkdown(cell) }} />
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, j) => (
              <tr key={j} className="border-t border-border">
                {row.map((cell, k) => (
                  <td key={k} className="px-3 py-2" dangerouslySetInnerHTML={{ __html: inlineMarkdown(cell) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <p
      key={i}
      className="mt-4 text-base leading-relaxed text-foreground/90"
      dangerouslySetInnerHTML={{ __html: inlineMarkdown(block) }}
    />
  );
}

function renderBody(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => renderBlock(block, i));
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

  const howtoSchema = HOWTO_SCHEMAS[slug];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-14 sm:pt-20 pb-24 sm:pb-32">
      <ArticleJsonLd title={guide.title} body={guide.body} slug={guide.slug} createdAt={guide.createdAt} updatedAt={guide.updatedAt} citations={refs} />
      {howtoSchema && (
        <HowToJsonLd
          name={guide.title}
          description={howtoSchema.description}
          steps={howtoSchema.steps}
          supplies={howtoSchema.supplies}
          tools={howtoSchema.tools}
          totalTime={howtoSchema.totalTime}
        />
      )}
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

      <div className="section-dark mt-10 rounded-2xl p-6 sm:p-8 flex flex-wrap items-center gap-3 justify-between">
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
