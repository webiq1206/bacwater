import { ExternalLink } from "lucide-react";
import type { CompoundStudies } from "@/lib/peptides/studies";

/**
 * "What published research looked at" (PRD v3 §9.1.3). Each study is shown with
 * a plain-language gloss, its real reported details, and a link to the source.
 * The footer is required and non-dismissible: study details are not instructions.
 */
export function StudyTable({ data }: { data: CompoundStudies }) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight">
        What published research looked at
      </h2>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {data.humanEvidence} {data.fdaStatus}
      </p>

      <ul className="mt-6 space-y-4">
        {data.studies.map((s, i) => (
          <li key={i} className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <p className="text-[15px] leading-relaxed text-foreground/90">{s.gloss}</p>
            <dl className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-x-4 gap-y-3 text-sm">
              <Cell label="Tested on" value={s.species} />
              <Cell label="Amount" value={s.amount} />
              <Cell label="How often" value={s.frequency} />
              <Cell label="How long" value={s.duration} />
              <Cell label="Route" value={s.route} />
            </dl>
            <a
              href={s.sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span className="underline underline-offset-2">{s.sourceTitle}</span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-xl border border-warning/40 bg-warning/5 p-4 text-sm leading-relaxed text-foreground/90">
        These are study details, not instructions. An amount given to animals
        cannot be turned into a safe amount for a person.
      </p>
    </section>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-foreground">{value}</dd>
    </div>
  );
}
