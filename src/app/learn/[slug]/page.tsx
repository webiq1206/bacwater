import { ARTICLE_GUIDES, presentArticle } from "@/lib/learn/article-presentation";
import { GuideFigure } from "@/components/learn/guide-figure";
import { withSocialMetadata } from "@/lib/seo/social-metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ArticleJsonLd } from "@/components/common/article-json-ld";
import { PreferredSourceButton } from "@/components/common/preferred-source-button";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { getCatalog, relatedContent } from "@/lib/learn/catalog";
import { RelatedReadingPanel } from "@/components/learn/related-reading";
import { References } from "@/components/common/references";
import { ReviewedBy } from "@/components/common/reviewed-by";
import { guideReferences } from "@/lib/content/references";
import { renderBody } from "@/lib/content/render";
import { extractMetaDescription } from "@/lib/content/checks";

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const g = await prisma.contentBlock.findFirst({ where: { slug, published: true } });
  if (!g) return withSocialMetadata({ title: "Guide not found", robots: { index: false, follow: false } });

  // FAQ content blocks are canonicalized to /faq; noindex the /learn/faq-* URLs
  // so search engines see one authoritative version of each FAQ answer.
  if (g.kind === "faq") {
    return withSocialMetadata({
      title: g.title,
      robots: { index: false, follow: true },
      alternates: { canonical: "/faq" },
    });
  }

  const description = g.metaDescription || extractMetaDescription(g.body);
  const searchTitle = g.seoTitle || g.title;
  const canonical = g.canonicalPath || `/learn/${slug}`;
  return withSocialMetadata({
    title: searchTitle,
    description,
    robots: { index: !g.noindex, follow: true },
    openGraph: {
      title: searchTitle,
      description,
      url: canonical,
      type: "article",
      publishedTime: g.createdAt.toISOString(),
      modifiedTime: g.updatedAt.toISOString(),
      siteName: "BACwater.ai",
    },
    alternates: { canonical },
  });
}

export const dynamic = "force-dynamic";

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await prisma.contentBlock.findFirst({ where: { slug, published: true } });
  if (!guide) return notFound();

  const refs = guideReferences(slug);
  const presentation = Object.hasOwn(ARTICLE_GUIDES, slug) ? ARTICLE_GUIDES[slug] : undefined;
  const display = presentArticle(guide.body);

  // Tag-driven related content: surface the most relevant peptides, guides,
  // comparisons, and FAQs for this article, not just the newest guides.
  const catalog = await getCatalog();
  const self = catalog.find((e) => e.url === `/learn/${slug}`);
  const relatedReading = presentation ? presentation.related.map(url => catalog.find(e => e.url === url)).filter((e): e is NonNullable<typeof e> => Boolean(e)) : relatedContent(catalog, {
    peptide: self?.peptideTags[0],
    topics: self?.topicTags ?? [],
    excludeUrl: `/learn/${slug}`,
    limit: 4,
  });


  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-14 sm:pt-20 pb-24 sm:pb-32">
      {!guide.canonicalPath && guide.kind !== "faq" && <ArticleJsonLd title={guide.title} body={guide.body} slug={guide.slug} createdAt={guide.createdAt} updatedAt={guide.updatedAt} citations={refs} />}
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Learning center", href: "/learn" },
        { label: guide.title, href: `/learn/${guide.slug}` },
      ]} />
      <div className="eyebrow">Guide</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-serif font-medium tracking-tight">{guide.title}</h1>
      <ReviewedBy
        className="mt-3"
        updated={guide.updatedAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      />
      <article className="mt-4 prose prose-neutral max-w-none">
        {renderBody(display.opening)}
        <GuideFigure slug={slug}/>
        {renderBody(display.body)}
        {display.corrections.length > 0 && <aside className="mt-7 rounded-xl border p-4 text-sm not-prose"><h2 className="font-semibold">Correction note</h2>{display.corrections.map(note => <p className="mt-2" key={note}>{note}</p>)}</aside>}
      </article>

      <References references={refs} />

      <div className="section-dark mt-10 rounded-2xl p-6 sm:p-8 flex flex-wrap items-center gap-3 justify-between">
        <div>
          <div className="font-medium">{presentation?.cta || "Choose your next calculation"}</div>
          <div className="text-sm text-muted-foreground">
            {presentation?.description || "Choose the product first, then enter values from instructions you already have."}
          </div>
        </div>
        <Button asChild variant="brand">
          <Link href={presentation?.href || "/peptide-calculator"}>
            {presentation?.cta || "Choose a product"} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {relatedReading.length > 0 && (
        <div className="mt-14">
          <RelatedReadingPanel title="Also worth reading" items={relatedReading} />
        </div>
      )}

      {/* Optional source preference follows the useful reading and task links. */}
      <div className="mt-6 rounded-2xl border border-border p-6 sm:p-8">
        <div className="font-medium">Want more of this in your search results?</div>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          Choose BACwater.ai as a preferred source where Google supports it.
          Google controls eligibility and placement; this does not guarantee a ranking.{" "}
          <Link href="/preferred-source" className="underline hover:text-foreground">
            What this does
          </Link>
          .
        </p>
        <PreferredSourceButton className="mt-4" />
      </div>


    </div>
  );
}
