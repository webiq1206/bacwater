import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface RailFact {
  label: string;
  value: string;
  sub?: string;
}

export interface RailSection {
  id: string;
  label: string;
}

/**
 * The facts a reader keeps needing while working through a peptide page —
 * common vial sizes, refrigerated shelf life, category, evidence stage — held
 * in view instead of scrolling away with the At a glance block at the top.
 *
 * Desktop only. Below xl there is no room for a rail, and the page already
 * leads with the same facts, so nothing is lost by dropping it.
 *
 * This duplicates values rather than moving them: the At a glance block stays
 * exactly where it is in the document, so the page's content and reading order
 * are unchanged for crawlers and for anyone on a narrow screen.
 */
export function PeptideRail({
  facts,
  sections,
  compound,
}: {
  facts: RailFact[];
  sections: RailSection[];
  compound: string;
}) {
  return (
    <aside
      aria-label={`${compound} quick reference`}
      className="hidden xl:block xl:sticky xl:top-24 xl:h-fit"
    >
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="eyebrow">Quick reference</div>
        <dl className="mt-3">
          {facts.map((f) => (
            <div
              key={f.label}
              className="border-b border-border py-2.5 last:border-b-0"
            >
              <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {f.label}
              </dt>
              <dd className="mt-0.5 text-sm font-medium">
                {f.value}
                {f.sub ? (
                  <span className="block text-xs font-normal text-muted-foreground">
                    {f.sub}
                  </span>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {sections.length > 0 ? (
        <nav className="mt-4 rounded-2xl border border-border bg-card p-5">
          <div className="eyebrow">On this page</div>
          <ul className="mt-3 space-y-1.5">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <Button asChild variant="brand" className="mt-4 w-full">
        <Link href="/plan">
          Build a full plan <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </aside>
  );
}
