import type { ReactNode } from "react";
/** The two-line answer a reader came for, before any detail. */
export function ShortAnswer({ children, title = "Short answer" }: { children: ReactNode; title?: string }) {
  return <aside className="bac-short-answer not-prose" aria-label={title}><p className="bac-short-answer-title">{title}</p><p>{children}</p></aside>;
}
