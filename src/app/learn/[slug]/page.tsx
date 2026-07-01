import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArticleJsonLd } from "@/components/common/article-json-ld";

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const g = await prisma.contentBlock.findUnique({ where: { slug } });
  return g
    ? {
        title: g.title,
        description: g.body.replace(/[*_#`]/g, "").slice(0, 155),
        openGraph: { title: g.title, description: g.body.slice(0, 155) },
      }
    : { title: "Guide not found" };
}

export async function generateStaticParams() {
  const guides = await prisma.contentBlock.findMany({
    where: { kind: "guide", published: true },
    select: { slug: true },
  }).catch(() => []);
  return guides.map((g) => ({ slug: g.slug }));
}

// tiny markdown-lite renderer for bold + paragraphs
function renderBody(body: string) {
  const paragraphs = body.split(/\n\n+/);
  return paragraphs.map((p, i) => {
    const html = p
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
  const guide = await prisma.contentBlock.findUnique({ where: { slug } });
  if (!guide) return notFound();
  const related = await prisma.contentBlock.findMany({
    where: { kind: "guide", published: true, NOT: { id: guide.id } },
    take: 3,
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-14 sm:pt-20 pb-24 sm:pb-32">
      <ArticleJsonLd title={guide.title} body={guide.body} slug={guide.slug} updatedAt={guide.updatedAt} />
      <Link href="/learn" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All guides
      </Link>
      <h1 className="mt-4 text-4xl sm:text-5xl font-serif font-medium tracking-tight">{guide.title}</h1>
      <article className="mt-4 prose prose-neutral max-w-none">
        {renderBody(guide.body)}
      </article>

      <div className="mt-10 rounded-3xl border border-border bg-muted/50 p-6 flex flex-wrap items-center gap-3 justify-between">
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

      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">Also worth reading</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {related.map((r) => (
            <li key={r.id}>
              <Link href={`/learn/${r.slug}`} className="group">
                <Card className="h-full">
                  <CardContent className="p-4">
                    <div className="text-sm font-semibold group-hover:underline">
                      {r.title}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
