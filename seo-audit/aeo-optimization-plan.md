# BACwater.ai -- AEO Optimization Plan

**Date:** 2026-07-01

AEO (Answer Engine Optimization) readiness: direct-answer blocks, FAQ structure, and extractability for featured snippets, People Also Ask, and AI-generated answers.

---

## What is AEO?

AEO optimizes content so it appears in:
- **Google Featured Snippets** (position 0)
- **People Also Ask** boxes
- **Google AI Overviews**
- **Voice assistant answers** (Alexa, Siri, Google Assistant)
- **AI chatbot citations** (ChatGPT, Perplexity, Claude)

The key principle: structure content so a single paragraph or list can answer a question without needing the rest of the page.

---

## Current AEO Readiness Assessment

### Score: 3/10

**Strengths:**
- FAQ page has FAQPage schema with 7 Q&A pairs (Google can pull these into People Also Ask)
- Tool pages have question-format H1s ("How much BAC water do I add?")
- llms.txt exists and describes the site well
- AI crawlers are explicitly allowed in robots.ts

**Weaknesses:**
- No direct-answer blocks at the top of any page
- No definition blocks ("X is Y" format)
- Learn articles have no heading hierarchy (all body text is `<p>` tags)
- FAQ answers don't link to tools or guides (missed contextual depth)
- Tool pages are client-rendered (teaching content is JS-only)
- No summary/TL;DR blocks on any content page
- Product detail FAQs (3 per PDP) have no FAQPage schema

---

## Direct-Answer Block Implementation

### What is a Direct-Answer Block?

A direct-answer block is a visually distinct element at the top of a content page that provides a concise, self-contained answer to the page's primary question. It should be:
- **In the first 200 words** of page content (above the fold)
- **Self-contained** -- readable without any other context
- **Factually specific** -- includes numbers, measurements, or definitions
- **Server-rendered HTML** -- not hidden behind JS interactivity

### Pages That Need Direct-Answer Blocks

| Page | Primary Question | Proposed Direct Answer |
|------|-----------------|----------------------|
| `/tools/bac-water` | How much BAC water do I add? | "The amount of BAC water to add depends on your vial strength and target dose. Most users add 1-2 mL of bacteriostatic water to create a concentration where each dose equals 5-10 units on a standard U-100 insulin syringe. For example, adding 2 mL to a 5 mg BPC-157 vial creates a 2.5 mg/mL concentration, making a 250 mcg dose exactly 10 units." |
| `/tools/dose` | What dose am I drawing? | "Your dose depends on two things: the concentration of your reconstituted peptide (mg/mL) and the volume you draw (in mL or syringe units). On a U-100 insulin syringe, 10 units = 0.1 mL. If your concentration is 2.5 mg/mL and you draw 10 units, your dose is 250 mcg." |
| `/tools/syringe-units` | How do syringe units convert to mL? | "On a U-100 insulin syringe, 100 units = 1 mL. So 10 units = 0.1 mL, 50 units = 0.5 mL, and 1 unit = 0.01 mL. The unit markings make it easier to measure small peptide doses accurately." |
| `/tools/mg-to-mcg` | How many mcg in a mg? | "1 milligram (mg) = 1,000 micrograms (mcg). To convert mg to mcg, multiply by 1,000. To convert mcg to mg, divide by 1,000. Peptide vial labels typically use mg, while dose protocols use mcg." |
| `/tools/supplies` | How much do I need for a cycle? | "The supplies you need depend on your peptide, dose, injection frequency, and cycle length. A typical 4-week daily protocol requires 1 peptide vial, 1 BAC water vial, 28 syringes, and 56 alcohol prep pads." |
| `/faq` | (multiple) | Already has Q&A format -- enhance with more factual specificity |
| `/about` | What is BACwater.ai? | "BACwater.ai is a peptide reconstitution calculator and supply shop. Every calculation uses deterministic, verified formulas (never AI-generated math), shows the work step-by-step, and produces printable plans with vial labels." |

### Implementation Pattern

Since tool pages are client components, the direct-answer block should be in a server-rendered wrapper. Create a `layout.tsx` or add static HTML before the client component:

```tsx
// In the layout.tsx for each tool page (already exists)
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="direct-answer" role="region" aria-label="Quick answer">
        <p><strong>The right amount of BAC water depends on your vial strength
        and target dose.</strong> Most users add 1-2 mL to create a
        concentration where each dose equals 5-10 units on a standard U-100
        insulin syringe.</p>
      </section>
      {children}
    </>
  );
}
```

---

## FAQ Structure Optimization

### Current State

The FAQ page (`/faq`) has 7 hardcoded Q&A pairs with FAQPage schema. These are well-structured for AEO.

### Improvements Needed

1. **Include database FAQs in JSON-LD** -- Currently only hardcoded items are in the schema. Fix at `src/app/faq/page.tsx:47-55`:

```tsx
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    ...CORE.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
    ...dbFaqs.map((f) => ({
      "@type": "Question",
      name: f.title,
      acceptedAnswer: { "@type": "Answer", text: f.body },
    })),
  ],
};
```

2. **Add inline links in FAQ answers:**
   - "How much BAC water should I add?" -> "Use our [BAC water calculator](/tools/bac-water) for an exact answer."
   - "What syringe should I use?" -> "See our [syringe unit converter](/tools/syringe-units) for conversion help."

3. **Add FAQPage schema to product detail pages:**
   PDPs at `/shop/[slug]` have 3 hardcoded FAQs (prescription, shipping, returns) that are only visible -- not in structured data. Add FAQPage JSON-LD.

4. **Add FAQ sections to learn articles:**
   Each learn article should end with 2-3 related questions in FAQ format with FAQPage schema. This enables the article to appear in multiple People Also Ask results.

---

## Extractability Improvements

### Problem: Learn Article Body Has No Heading Hierarchy

**File:** `src/app/learn/[slug]/page.tsx:32-46`

The `renderBody()` function only handles bold and italic. Markdown headings (`## Heading`) render as plain paragraphs. This means:
- Google cannot identify content sections
- Featured snippets cannot pull specific sections
- AI systems cannot navigate the article structure

**Fix:** Update `renderBody()` to parse `##` and `###` headings:

```tsx
function renderBody(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("### ")) {
      return <h3 key={i} className="mt-8 text-lg font-semibold">{block.slice(4)}</h3>;
    }
    if (block.startsWith("## ")) {
      return <h2 key={i} className="mt-10 text-xl font-semibold">{block.slice(3)}</h2>;
    }
    const html = block
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return <p key={i} className="mt-4 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
  });
}
```

### Problem: Tool Page Content Is Client-Rendered

Teaching sections on tool pages (explanations of BAC water, syringe units, etc.) are inside `"use client"` components. While Google does execute JS, this adds latency and risk for AI crawlers.

**Fix options:**
1. Move teaching content to the `layout.tsx` wrapper (server-rendered)
2. Split tool pages into server wrapper + client calculator
3. Duplicate key facts in `<noscript>` blocks (least recommended)

**Recommended:** Option 1 -- each tool page already has a `layout.tsx`. Add the educational content sections there.

---

## AEO Content Templates

### For Tool Pages

```
[Direct-answer block: 2-3 sentences answering the page's question]

[Interactive calculator]

## How [Topic] Works
[2-3 paragraphs of educational content with H3 subheadings]

## Quick Reference
[Table or bullet list of key facts/conversions]

## Related Questions
[2-3 FAQ items with FAQPage schema]
```

### For Learn Articles

```
[Direct-answer block: 1-2 sentences, bolded key definition]

[Article body with H2/H3 hierarchy]

## Key Takeaways
[3-5 bullet points summarizing the article]

## Frequently Asked Questions
[2-3 Q&A pairs related to the article topic]

[CTA: "Build a plan" banner -- already exists]
```

---

## People Also Ask Targets

Questions BACwater.ai should aim to appear in:

| Question | Target Page | Current Answer? |
|----------|-------------|----------------|
| What is bacteriostatic water? | `/learn/what-is-bac-water` or `/faq` | FAQ has answer |
| How much BAC water to add to peptide? | `/tools/bac-water` | No direct-answer block |
| How long does BAC water last? | `/learn/bac-water-shelf-life` (new) | No content |
| What syringe for peptides? | `/faq` | FAQ has answer |
| How to reconstitute BPC-157? | `/learn/how-to-reconstitute-bpc-157` (new) | No content |
| How many units is 0.1 mL? | `/tools/syringe-units` | Calculator answers but no text answer |
| Can you reuse BAC water? | `/faq` (new Q) | No content |
| BAC water vs sterile water? | `/learn/bac-water-vs-sterile-water` (new) | No content |
| How to store reconstituted peptides? | `/learn/how-to-store-reconstituted-peptides` (new) | No content |
| What does 10 units look like on a syringe? | `/learn/how-to-read-an-insulin-syringe` (new) | No content |

---

## Implementation Priority

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | Add direct-answer blocks to 6 tool pages | HIGH -- enables featured snippets |
| 2 | Fix learn article heading hierarchy (renderBody) | HIGH -- enables section extraction |
| 3 | Include DB FAQs in FAQPage JSON-LD | MEDIUM -- expands FAQ rich results |
| 4 | Add FAQ sections to learn articles | MEDIUM -- multiplies PAA presence |
| 5 | Add FAQPage schema to PDP page FAQs | MEDIUM -- enables product FAQ snippets |
| 6 | Move teaching content to server-rendered layouts | MEDIUM -- improves crawl reliability |
| 7 | Create new content for uncovered PAA targets | HIGH -- expands topical coverage |
| 8 | Add "Key Takeaways" blocks to learn articles | LOW -- nice-to-have for AI citation |
