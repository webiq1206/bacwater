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
import { renderBody } from "@/lib/content/render";
import { extractMetaDescription } from "@/lib/content/checks";

interface Props { params: Promise<{ slug: string }>; }

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
