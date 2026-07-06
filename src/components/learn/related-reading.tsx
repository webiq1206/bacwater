import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { CONTENT_TYPE_LABEL } from "@/lib/learn/taxonomy";

export interface RelatedItem {
  url: string;
  title: string;
  excerpt: string;
  contentType: string;
}

/**
 * Presentational "related reading" panel. Renders nothing when there are no
 * items, so callers can drop it in unconditionally.
 */
export function RelatedReadingPanel({
  title = "Related reading",
  items,
}: {
  title?: string;
  items: RelatedItem[];
}) {
  if (!items || items.length === 0) return null;
  return (
    <section className="border border-border bg-surface p-6 sm:p-8">
      <div className="flex items-center gap-2.5 mb-5">
        <BookOpen className="h-5 w-5 accent-check" />
        <h2 className="text-lg font-serif font-medium tracking-tight">{title}</h2>
      </div>
      <ul className="divide-y divide-border">
        {items.map((it) => (
          <li key={it.url} className="first:[&>a]:pt-0 last:[&>a]:pb-0">
            <Link
              href={it.url}
              className="group flex items-center justify-between gap-5 py-4"
            >
              <div className="min-w-0">
                <span className="block text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
                  {CONTENT_TYPE_LABEL[it.contentType] ?? it.contentType}
                </span>
                <div className="mt-1 font-medium leading-snug group-hover:underline">
                  {it.title}
                </div>
                {it.excerpt && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {it.excerpt}
                  </p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
