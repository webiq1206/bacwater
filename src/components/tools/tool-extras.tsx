import Link from "next/link";
import { FaqJsonLd } from "@/components/common/faq-json-ld";
import { SoftwareAppJsonLd } from "@/components/common/software-app-json-ld";

export interface QuickRef {
  head: string[];
  rows: string[][];
  caption?: string;
}

export interface ToolExtrasProps {
  /** SoftwareApplication schema for the calculator. */
  app: { name: string; description: string; url: string };
  /** Numeric answers as a table (table-snippet target). */
  quickRef?: QuickRef;
  /** Conversational "related questions" (populates PAA); rendered in HTML. */
  faqs?: { q: string; a: string }[];
}

const LINK = "text-muted-foreground hover:text-foreground underline transition-colors";

/**
 * Shared AEO + schema + internal-linking block for the tool `layout.tsx`
 * files. Emits SoftwareApplication JSON-LD, a server-rendered quick-reference
 * table, a Related-questions FAQ (FAQPage schema + always-in-DOM answers via
 * native details), and contextual links into the peptide / FAQ / buy clusters.
 */
export function ToolExtras({ app, quickRef, faqs }: ToolExtrasProps) {
  return (
    <>
      <SoftwareAppJsonLd name={app.name} description={app.description} url={app.url} />

      {quickRef && (
        <section className="mt-14 border-t border-border pt-8 max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight">Quick reference</h2>
          <div className="mt-4 overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface text-left">
                  {quickRef.head.map((h) => (
                    <th key={h} className="px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quickRef.rows.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 tabular-nums">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {quickRef.caption && (
            <p className="mt-2 text-xs text-muted-foreground">{quickRef.caption}</p>
          )}
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <section className="mt-12 max-w-3xl">
          <h2 className="text-lg font-semibold tracking-tight">Related questions</h2>
          <FaqJsonLd items={faqs} />
          <div className="mt-4 border-t border-border">
            {faqs.map((f, i) => (
              <details key={i} className="group border-b border-border py-3">
                <summary className="cursor-pointer list-none font-medium marker:hidden">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 max-w-3xl">
        <h2 className="text-lg font-semibold tracking-tight">Explore more</h2>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li><Link href="/peptides" className={LINK}>Peptide guides</Link></li>
          <li><Link href="/faq" className={LINK}>BAC water FAQ</Link></li>
          <li><Link href="/tools/bac-water" className={LINK}>Bac water calculator</Link></li>
          <li><Link href="/tools" className={LINK}>All calculators</Link></li>
        </ul>
      </section>
    </>
  );
}
