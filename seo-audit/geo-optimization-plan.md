# BACwater.ai GEO Optimization Plan

**Date:** 2026-07-02 (refresh)

Generative Engine Optimization (GEO) / LLM-readiness assessment: can AI systems clearly understand who BACwater.ai is, what it does, what it offers, who it serves, why it is trustworthy, and how it differs? What is quotable, what is not, and where are the genuine gaps.

This is a full refresh. The site has moved well past the earlier draft: the peptide and comparison clusters now exist, the FAQ is keyword-optimized with schema, the crawler allowlist is broad, and the llms.txt is dynamic. The recommendations below reflect that.

---

## What GEO measures here

GEO optimizes content so AI answer engines (Google AI Overviews, Perplexity, ChatGPT with browsing, Claude, Gemini, Apple Intelligence) select BACwater.ai as a source when they generate answers. Selection depends on four things the model can extract without ambiguity:

1. **Entity clarity** who is this, and is the name consistent.
2. **Context clarity** what does it do, for whom, and why does it exist.
3. **Topic clarity** is each page unambiguously about one answerable thing.
4. **Extractability** can a single self-contained sentence or block be lifted as a citation.

---

## Current GEO posture (what is already strong)

These are in place and should be treated as solved. Do not re-litigate them.

- **Crawler allowlist is broad and correct.** `src/app/robots.ts` explicitly allows GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, and CCBot, each with `allow: "/"`, plus a permissive `*` rule. Only `/admin`, `/api`, and `/plan/*/pdf` are disallowed. This is the ideal configuration for citation eligibility.
- **Dynamic llms.txt** at `src/app/llms.txt/route.ts` is generated from the live peptide roster and comparison set, so it never drifts from the site. It carries a one-line summary, key pages, all calculators, every peptide guide with its `what` sentence, every comparison, and a "Key facts" block (benzyl alcohol 0.9%, 100 units = 1 mL, 1 mg = 1,000 mcg, shelf life, deterministic-math claim). This is a genuinely good llms.txt and better than most competitors have.
- **Structured answers are already in HTML.** Peptide pages open with a 40 to 60 word direct answer (`directAnswer()` in `src/lib/peptides/page-data.ts`), carry FAQPage and HowTo JSON-LD, and render every FAQ answer in server HTML through the accordion. Comparison pages open with a verdict, a table, and FAQPage schema. FAQ answers are hardcoded in `src/app/faq/page.tsx` and rendered server-side (the accordion content is present in the DOM, not fetched).
- **Entity schema is consistent.** `OrgJsonLd` plus the inline WebSite JSON-LD in `src/app/layout.tsx` both name the organization "BACwater.ai", matching metadata, llms.txt, and body copy. The header/footer visual wordmark is now "BACwater" + ".ai" (not the old "& Co."), so the earlier entity-name conflict is resolved.
- **Editorial policy page** (`/editorial-policy`) exists and is linked from the footer and llms.txt, giving a process/trust signal AI can reference.

---

## Quotability by page type

"Quotable" means an AI can lift a self-contained factual sentence without the surrounding page.

| Page type | Quotability | Why |
|-----------|-------------|-----|
| `/peptides/[slug]` (24) | HIGH | Opens with a 40 to 60 word direct answer with real numbers; per-strength FAQ answers are each standalone citable units; storage block states a specific day count. |
| `/learn/vs/[topic]` (7) | HIGH | Verdict paragraph is a complete answer; table rows are extractable; FAQ answers are standalone. |
| `/faq` | HIGH | Each of the 9 core answers leads with a direct, factual first sentence. Best-extracting page on the site. |
| `/buy` | MEDIUM-HIGH | Opens with a direct answer; FAQ answers ("Where can I buy", "over the counter", "near me", "how fast") are clean citable units. |
| `/tools/bac-water` (+ tool layouts) | MEDIUM | Server-rendered answer paragraph in `layout.tsx` is quotable; the calculator itself is not. |
| `/` (homepage / pillar) | LOW-MEDIUM | Marketing voice, no definition block, no stats block. The single most under-optimized high-authority page. |
| `/shop/[slug]` (PDPs) | MEDIUM | Product FAQ (prescription, shipping, returns) now carries FAQPage schema and is quotable; body copy is DB-driven and varies. |
| `/about` | MEDIUM | Some quotable claims but thin. |
| Legal (`/terms`, `/privacy`, `/disclaimer`) | LOW | Boilerplate, by design. |

**Net:** the money pages (peptides, comparisons, FAQ, buy) are already highly quotable. The weak spot is the pillar/homepage and the tool pages, which is where the remaining GEO upside is.

---

## Genuine gaps (in priority order)

The prompt is right that the two real gaps are scientific citations and a named/credentialed review signal. Those plus a homepage definition block are the highest-leverage moves.

### Gap 1: No scientific/authority citations (highest impact on citation trust)

AI answer engines weight sources that themselves cite authorities. Right now every factual claim (0.9% benzyl alcohol, 28-day shelf life, refrigeration guidance, U-100 math) is asserted without a reference. Competitors that rank in AI answers (free medical-journal aggregators, peptide-association sites) carry outbound references.

**Do this:**
- Add a short **"References"** or **"Sources"** section to the FAQ hub, each comparison page, and the storage/shelf-life content, linking to primary authorities: USP monograph for Bacteriostatic Water for Injection, an FDA label/DailyMed entry for a benzyl-alcohol-preserved product, and a benzyl-alcohol safety reference.
- Render them as real `<a>` links in server HTML with descriptive anchor text, and mirror the list in a `citation` array or `sameAs`/`about` reference in the page JSON-LD where it fits.
- On the benzyl-alcohol comparison specifically, cite the source for the "refrigeration may impair benzyl-alcohol efficacy" controversy so the site is the page that explains the nuance, not just asserts a number. That nuance is exactly the kind of thing AI engines quote.

### Gap 2: No named or credentialed review signal

E-E-A-T here is company-level by design (no bylines), which is a legitimate choice, but AI engines still look for a "who stands behind this" signal. `LAST_REVIEWED` prints a date, which is good, but there is no reviewer entity.

**Do this without inventing a persona:**
- Attach a **reviewer/publisher block** to the editorial policy and reference it from content pages: "Reviewed by the BACwater.ai editorial team against the sources listed below, last updated {date}." Keep it organizational, not a fake MD.
- In JSON-LD, add `reviewedBy` / `publisher` as the Organization and a `dateModified` matching `LAST_REVIEWED` on the peptide and comparison `WebPage`/`Article` schema. This gives the model a machine-readable freshness + accountability pair.
- If a real credentialed reviewer is ever available, expose them as a `Person` with `sameAs`. Until then, the organizational reviewer is the honest version.

### Gap 3: Homepage/pillar has no definition or stats block

The homepage is the highest-authority URL and the one most likely to be fetched for the head term "bacteriostatic water" / "bac water calculator", yet it opens with marketing copy and never defines the entity or states a fact.

**Do this:**
- Add a server-rendered **definition block** near the top: "Bacteriostatic water (bac water) is sterile water with 0.9% benzyl alcohol added as a preservative, used to reconstitute lyophilized peptides for multi-dose use." One sentence, bolded lead, above the fold.
- Add a compact **"Key facts" / quick-reference block** (the same facts already in llms.txt: 100 units = 1 mL, 1 mg = 1,000 mcg, ~28 to 30 day refrigerated shelf life, deterministic math). Factoid lists are among the most-lifted structures in AI Overviews.

### Gap 4: Tool pages under-answer in server HTML

`/tools/bac-water/layout.tsx` has a good server-rendered answer paragraph, but the calculators' teaching content is client-rendered. Move a short "How it works" + "Quick reference" block into each tool `layout.tsx` (see the AEO plan for the shared pattern) so the answer survives even when JS is skipped by a crawler.

---

## "Who / what / for whom" clarity check

An AI asked "what is BACwater.ai and who is it for?" should be able to answer from the site alone. It can, mostly:

- **Who:** "BACwater.ai" appears consistently in schema, metadata, llms.txt, and the wordmark. GOOD.
- **What:** "The complete BAC water calculator and reconstitution guide" plus a supply shop. Consistent across homepage H1, root description, llms.txt, and org schema. GOOD.
- **For whom:** "Built for beginners / first-timers doing peptide reconstitution, for research and educational use only." Present on the homepage and llms.txt. GOOD, but reinforce it in the About page opening sentence and the org schema `description` so it is machine-readable in one field.
- **Differentiation:** "Deterministic, verified, tested math, never AI-generated; shows the formula; printable labels + PDF." Stated on the homepage trust section and llms.txt. GOOD. Make this a single quotable sentence in the org schema description so it travels with the entity.

**Action:** tighten the Organization JSON-LD `description` to one sentence that carries who + what + for-whom + differentiator, e.g. "BACwater.ai is a peptide reconstitution calculator and research-supply shop for first-time users, providing deterministic, verified bac water math (never AI-generated), printable vial labels, and PDF plans, for research and educational use only."

---

## Entity consistency (current state)

| Context | Name used | Consistent |
|---------|-----------|------------|
| Organization schema | BACwater.ai | Canonical |
| WebSite schema | BACwater.ai | Match |
| Root metadata / title template | BACwater.ai | Match |
| Header + footer wordmark | "BACwater" + ".ai" | Match (resolved) |
| llms.txt | BACwater.ai | Match |
| FAQ / peptide / comparison copy | BACwater.ai | Match |

The old "BACwater & Co." conflict is gone. Keep it that way: never reintroduce a "& Co." variant in any schema, metadata, OG image, or llms.txt.

**Terminology consistency (keep enforcing):**
- Use "bacteriostatic water (bac water)" on first mention per page, then "bac water".
- Spell out "micrograms (mcg)" and "milligrams (mg)" on first use per page.
- Always "U-100 insulin syringe" (100 units = 1 mL) as the reference unit.

---

## Prioritized GEO checklist

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | Add a References/Sources block (USP, FDA/DailyMed, benzyl-alcohol safety) to FAQ, comparisons, and storage content, as real links + JSON-LD `citation` | HIGH |
| 2 | Add an organizational reviewer + `dateModified`/`reviewedBy` to peptide and comparison JSON-LD, tied to `LAST_REVIEWED` | HIGH |
| 3 | Add a definition block + "Key facts" quick-reference to the homepage (server HTML) | HIGH |
| 4 | Tighten Organization schema `description` to one who/what/for-whom/differentiator sentence | MEDIUM |
| 5 | Move a short "How it works" + "Quick reference" block into each tool `layout.tsx` (server-rendered) | MEDIUM |
| 6 | Cite the refrigeration/benzyl-alcohol-efficacy controversy explicitly on `/learn/vs/benzyl-alcohol` | MEDIUM |
| 7 | Reinforce the "for research/beginners" audience sentence on `/about` and in org schema | LOW |

---

## What AI is likely already citing vs not

**Likely cited now:** the FAQ hub, per-peptide "how much bac water for X mg" answers, the comparison verdicts and tables, and the "where to buy / over the counter / near me" answers on `/buy`. These are the pages built as answerable units.

**Not yet citable / under-leveraged:** the homepage (no definition/stats block), the interactive calculator results (JS-only, by nature), and any claim that needs a source the model can trust (no references yet). Closing Gaps 1 to 3 is what converts the site from "eligible" to "preferred" as a citation.
