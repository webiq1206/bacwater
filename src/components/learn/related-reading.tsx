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
      <div className="flex items-center gap-2.5 mb-4">
        <BookOpen className="h-5 w-5 accent-check" />
        <h2 className="text-lg font-serif font-medium tracking-tight">{title}</h2>
      </div>
      <ul className="divide-y divide-border">
        {items.map((it) => (
          <li key={it.url}>
            <Link
              href={it.url}
              className="group flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
                    {CONTENT_TYPE_LABEL[it.contentType] ?? it.contentType}
                  </span>
                </div>
                <div className="font-medium group-hover:underline">
                  {it.title}
                </div>
                {it.excerpt && (
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                    {it.excerpt}
                  </p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 mt-1 shrink-0 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
