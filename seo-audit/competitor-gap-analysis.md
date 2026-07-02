> **Reconciliation note (read first).** This analysis was produced by researching the **live** bacwater.ai, which at audit time was running a pre-deploy build. Several items it flags as "not visible" are **already implemented in the codebase and ship on the next Replit republish**: the "BAC water vs X" comparison hub (`/learn/vs/*` ×7), FAQPage + HowTo + Product + ImageObject schema, the FAQ hub with schema, segmented sitemaps, and a dynamic llms.txt. Treat those as **done, pending deploy**. The genuinely-open opportunities that remain - and that this session did **not** already cover - are: **scientific citations, named/credentialed reviewer + medically-reviewed signal, per-peptide + per-vial-size landing pages, a reverse-BAC calculator, a draggable syringe visualization, a "where to buy 2026" commercial-investigation layer, marketing the printable-labels asset for links, and freshness "2026" framing.** Those flow into implementation-roadmap.md.

---

# BAC Water / Peptide Reconstitution - Competitor & Gap Analysis for bacwater.ai

*Prepared July 2026. Scope: organic search competition across the calculator, per-peptide dosing, "buy bac water," and comparison/shelf-life query clusters.*

## 1. Executive summary

The SERPs for bacwater.ai's target clusters are **fragmented across four competitor archetypes**, with no single domain dominating all of them:

1. **Pure calculator/tool sites** - peptidefox.com, peptidedeck.com, howmuchbacwater.com, praxpeptides.com's tool, helloregimen.com.
2. **Content/blog authority sites** - freemedicaljournals.com, thepeptidecatalog.com, jaycampbell.com.
3. **Peptide/bac-water ecommerce vendors** - bacteriostaticwater.com, praxpeptides, adaptpeptides, purehealthpeptides, nationwidepeptides, simplepeptide.
4. **A wildcard high-authority retailer** - **riteaid.com** now hosts a medically-reviewed reconstitution calculator (biggest strategic threat: national-pharmacy authority + a real tool).

bacwater.ai's differentiator - a productized **Plan Builder → PDF + printable vial labels with QR codes + saved plans** - is genuinely unique and under-leveraged as an organic asset. No competitor found offers save-able plans, PDF exports, or QR-coded labels.

## 2. Competitor deep-dive (top 9)

| # | Domain | Archetype | Ranks for |
|---|--------|-----------|-----------|
| 1 | **peptidefox.com** | Tool + content | Calculator, per-peptide, comparison. **Strongest citations** (12 PubMed/DOI refs). Blends (GLOW/KLOW). |
| 2 | **peptidedeck.com** | Tool + reviews | Calculator, per-peptide, half-life/microdosing tools, **"best legit vendors 2026"** review moat. |
| 3 | **freemedicaljournals.com** | Content | **Per-peptide, per-vial-size static pages** (5mg vs 10mg BPC-157). Bylined "Dr. Paul Watson," "medically reviewed." Wins the long-tail. |
| 4 | **riteaid.com** | Retailer + tool | Real calculator, "Reviewed by Rite Aid Health Team," LegitScript badge, last-updated dates. Authority wildcard. |
| 5 | **praxpeptides.com** | Vendor + tool | **Best calculator UX** - real-time draggable syringe visualization, capacity warnings. Nearest direct archetype (tool + bac water sales). |
| 6 | **bacteriostaticwater.com** | Ecommerce | "Buy bac water" incumbent (exact-match domain, 100+ reviews/SKU). **Thin content, no calculator** - a content vacuum to exploit. |
| 7 | **jaycampbell.com** | Personal brand | Calculator + peptide education; large community/backlinks; peptides one of many topics. |
| 8 | **thepeptidecatalog.com** | Review/affiliate | "Where to buy 2026," "bac vs sterile vs saline 2026" roundups (freshness framing). |
| 9 | **worldpeptideassociation.com** | Per-peptide tool network | URL-per-peptide calculators (tirzepatide-calculator, retatrutide-calculator). |

Watchlist: helloregimen.com (app + reverse-BAC calc), peptidecalcs.com, dlpeptides.com & exploring-peptides.com (strong "bac vs sterile"), umbrellalabs.is, palmettopeptides.com.

## 3. Where bacwater.ai is ahead

1. **Productized workflow** (Plan Builder → PDF + printable QR vial labels + "My Plans"). A real, defensible moat nobody matches. Link-bait potential.
2. **Tool + commerce + education under one exact-intent domain** ("bac water"). Only prax matches the triad, and prax dilutes the bac-water focus.
3. **Editorial & Sourcing Policy + Learning Center taxonomy** - more editorial infrastructure than the pure vendors.
4. **Clean information architecture** vs. the fragmented per-URL calculator networks.
5. **(Post-deploy) comparison hub + full schema + segmented sitemaps + llms.txt** - moves ahead of most of the field on technical GEO/AEO.

## 4. Where bacwater.ai is behind (genuinely open)

1. **No scientific citations** - peptidefox's 12 PubMed/DOI refs set the YMYL E-E-A-T bar. **Largest remaining trust gap.**
2. **No named author / "medically reviewed by" signal** - freemedicaljournals (Dr. Paul Watson) and riteaid (Health Team, LegitScript, dates) outsignal on trust.
3. **No per-peptide, per-vial-size URL granularity** - freemedicaljournals ranks by having separate pages for each vial size; the tool-driven model collapses that long-tail. (Mitigated: our per-peptide pages have per-strength anchor-linked FAQ entries, but not dedicated URLs.)
4. **Calculator UX trails praxpeptides** - no draggable/animated syringe; no reverse-BAC calculator.
5. **No commercial-investigation ("best vendors / where to buy 2026") layer** - peptidedeck/thepeptidecatalog capture buyers upstream.
6. **Likely weaker domain authority/backlinks** than riteaid and jaycampbell.
7. **No freshness "2026" framing** on money pages.

## 5. Prioritized opportunities

Effort: **S** <1d · **M** 1–3d · **L** 1–2wk · **XL** ongoing.

**Tier 1 (do first)**
1. **Scientific-citations layer** on core Learn pages (0.9% benzyl alcohol, 28-day multi-dose window, swirl-don't-shake aggregation, reconstitution kinetics). Neutralizes peptidefox's edge. **M.**
2. **Named + credentialed reviewer + "medically/scientifically reviewed" + visible last-updated** on guides. Note: current strategy is deliberately company-level (no individual bylines) per the content spec - resolve this tension explicitly (see ai-search-readiness-analysis.md). **S–M.**
3. **Per-peptide + per-vial-size landing pages** for top-volume queries (5mg/10mg BPC-157, 10mg/20mg/30mg/60mg tirzepatide, retatrutide), pre-filling the Plan Builder. **L.**
4. **Amplify the printable QR vial-labels asset** as a standalone linkable page ("Free Printable Peptide Vial Labels") for backlinks + brand search. **S–M.**
5. **Reverse-BAC calculator** ("I want dose X at Y units - how much water?"). Distinct, searchable, few offer it. **M.**

**Tier 2**
6. Draggable/animated syringe visualization with capacity warnings (match prax/regimen). **M–L.**
7. "Where to buy bacteriostatic water (2026)" + "how to choose a supplier" content that funnels to the shop. **M.**
8. Dedicated calculator hub page optimized for head terms ("bac water calculator," "peptide reconstitution calculator") with the tool above the fold. **M.**
9. Freshness "Updated [Month 2026]" framing on money pages/H1s. **S.**

**Tier 3 (compounding)**
10. Peptide glossary/entity pages (benzyl alcohol, lyophilization, U-100, subcutaneous) for topical-authority breadth + internal linking. **L.**
11. HowTo-schema'd step-by-step reconstitution with images/short video per peptide. **M.**
12. Backlink/brand outreach: pitch the free calculator + labels to peptide communities and "best calculator" roundups. **XL.**
13. PWA/app (peptidefox, helloregimen, peptidecalculatorapp all have apps). **XL.**

## 6. Bottom line

bacwater.ai holds a **unique product moat** (Plan Builder + printable QR labels) and, post-deploy, matches or beats the field on comparison content + schema + sitemaps + llms.txt. The remaining battleground is **trust and long-tail granularity**: add citations + a credentialed review signal, build per-vial-size landing pages, ship a reverse calculator, and market the labels for links. Do those and a strong product becomes a strong organic position.

*Caveat: thepeptidecatalog.com (403) and howmuchbacwater.com could not be fully crawled; schema observations for competitors are inferred from rich-result behavior, not raw HTML. Confirm with a live Rich Results Test.*
