# BACwater.ai -- GEO Optimization Plan

**Date:** 2026-07-01

GEO (Generative Engine Optimization) / LLM readiness assessment: what content is quotable, what is not, and entity consistency.

---

## What is GEO?

GEO optimizes content for AI-powered search engines (Google AI Overviews, Perplexity, ChatGPT with browsing, Claude) that generate answers by citing web sources. The goal is to make content quotable, citable, and authoritative so AI systems select BACwater.ai as a source in their responses.

---

## Current GEO Readiness

### llms.txt File

**Status:** EXISTS at `public/llms.txt`
**Content:** Well-structured with site description, key page URLs, and site purpose summary.
**Assessment:** Good foundation. Could be expanded with more detail per page.

### robots.txt AI Crawler Rules

**Status:** GOOD -- `src/app/robots.ts` explicitly allows:
- GPTBot (OpenAI)
- ClaudeBot (Anthropic)
- PerplexityBot
- Google-Extended
- CCBot (Common Crawl)

All AI crawlers have `allow: "/"` access.

---

## Quotability Assessment

### What Makes Content Quotable for AI?

1. **Direct-answer format** -- A crisp, standalone sentence that answers a question without needing surrounding context
2. **Definition blocks** -- "X is Y" statements near the top of content
3. **Factual specificity** -- Numbers, measurements, time periods (not vague claims)
4. **Authoritative tone** -- No hedging, no "we think," no "probably"
5. **Self-contained paragraphs** -- Each paragraph can stand alone as a citation

### Page-by-Page Quotability Score

| Page | Quotability | Notes |
|------|-------------|-------|
| Homepage | LOW | Marketing copy, not factual statements. No definitions. |
| `/plan` | LOW | Tool interface, not quotable content. |
| `/plan/new` | LOW | Same -- tool interface. |
| `/shop` | LOW | Product listing, not quotable. |
| `/shop/[slug]` | MEDIUM | Product descriptions are factual. "Ships in 1-2 business days" is quotable. |
| `/learn` | LOW | Listing page, no substantive content. |
| `/learn/[slug]` | MEDIUM-HIGH | Guide articles contain factual content. But lacks direct-answer blocks at top. |
| `/faq` | HIGH | FAQ answers are direct, factual, standalone. Best GEO content on the site. |
| `/about` | MEDIUM | Contains quotable claims about approach, but too short. |
| `/contact` | LOW | Form page, not quotable. |
| `/tools` | LOW | Listing page. |
| `/tools/bac-water` | MEDIUM | Teaching sections contain factual explanations. Calculator itself is not quotable. |
| `/tools/dose` | MEDIUM | Same -- teaching sections have value. |
| `/tools/syringe-units` | MEDIUM | Quick-reference table is factual and quotable. |
| `/tools/mg-to-mcg` | MEDIUM | Conversion facts are quotable. |
| `/tools/supplies` | LOW | Interactive tool, minimal static content. |
| `/tools/reconstitution` | LOW | Calculator interface, minimal static content. |
| `/terms` | LOW | Legal boilerplate. |
| `/privacy` | LOW | Legal, too thin. |
| `/disclaimer` | LOW | Legal, standard. |

---

## Entity Consistency Analysis

### Brand Name Consistency

| Context | Name Used | Consistent? |
|---------|-----------|-------------|
| Organization schema | "BACwater.ai" | Canonical |
| Root layout metadata | "BACwater.ai" | Match |
| Header logo | "BACwater & Co." | DIFFERENT |
| Footer logo | "BACwater & Co." | DIFFERENT |
| OG image | "BACwater & Co." | DIFFERENT |
| llms.txt | "BACwater.ai" | Match |
| About page text | "BACwater.ai" | Match |
| FAQ answers | "BACwater.ai" | Match |

**Problem:** The visual brand ("BACwater & Co.") differs from the schema/metadata brand ("BACwater.ai"). AI systems crawling the page see both and may be confused about the canonical entity name.

**Recommendation:** Pick one. Use "BACwater.ai" in all schema and metadata. If "BACwater & Co." is the visual brand, document it as a DBA name in the Organization schema description. Do not use "& Co." in any structured data, metadata, or llms.txt.

### Core Descriptors

| Descriptor | Used In | Consistent? |
|------------|---------|-------------|
| "The complete BAC water calculator and reconstitution guide" | Homepage H1, root description, llms.txt, org schema | YES |
| "For research use only" | Terms, disclaimer, tool pages, FAQ | YES |
| "Exact math / verified formulas" | Homepage, about, tool pages | YES |
| "Beginner-friendly" | Learn description, tool descriptions | YES |

---

## GEO Optimization Recommendations

### Priority 1: Add Direct-Answer Blocks to Content Pages

Every learn article and tool page should start with a 1-2 sentence direct answer in a visually distinct block. This is the most impactful GEO improvement.

**Example for `/learn/what-is-bac-water`:**
```html
<div class="direct-answer">
  <p><strong>Bacteriostatic water (BAC water) is sterile water that contains
  0.9% benzyl alcohol as a preservative.</strong> The benzyl alcohol prevents
  bacterial growth, allowing the same vial to be used for multiple doses over
  28-30 days.</p>
</div>
```

**Example for `/tools/bac-water`:**
```html
<div class="direct-answer">
  <p><strong>The right amount of BAC water depends on your peptide's vial
  strength and your target dose.</strong> Most users add 1-2 mL to get a
  concentration that yields 5-10 units on a standard insulin syringe.</p>
</div>
```

### Priority 2: Structure FAQ Answers for AI Extraction

Current FAQ answers are already well-formatted. Enhance by:
1. Making each answer start with a direct, complete sentence (not "It depends" or "Well...")
2. Including specific numbers and facts in the first sentence
3. Adding FAQ schema for PDP page FAQs (currently not in structured data)

### Priority 3: Add Factual Claims with Specificity

Replace vague statements with specific, citable facts throughout the site:

| Vague (Current) | Specific (Recommended) |
|-----------------|----------------------|
| "We take accuracy seriously" | "Every calculation is deterministic (no AI), backed by automated tests, and shows the formula used" |
| "Products ship quickly" | "Orders ship within 1-2 business days from US-licensed vendors via tracked shipping" |
| "The same vial can be used multiple times" | "An opened BAC water vial remains sterile for up to 28 days when refrigerated at 2-8C" |

### Priority 4: Expand llms.txt

Current llms.txt is a good start. Expand with:
- Per-page descriptions (not just titles)
- Key facts about the site (e.g., "All calculations are deterministic, not AI-generated")
- Entity definitions (e.g., "Bacteriostatic water: sterile water with 0.9% benzyl alcohol")

### Priority 5: Ensure Consistent Entity References

- Fix "BACwater & Co." vs "BACwater.ai" inconsistency
- Always use "bacteriostatic water" (full term) at least once per page before abbreviating to "BAC water"
- Always spell out "micrograms (mcg)" and "milligrams (mg)" on first use per page
- Reference "insulin syringe (U-100)" consistently

### Priority 6: Add Structured Knowledge Blocks

For tool pages, add a "Key Facts" or "Quick Reference" section with citable bullet points:

```markdown
## Key Facts
- 1 mL on an insulin syringe = 100 units
- BAC water contains 0.9% benzyl alcohol
- Most reconstituted peptides last 28-30 days refrigerated
- A typical reconstitution uses 1-2 mL of BAC water
```

These factoid blocks are highly extractable by AI systems.

---

## Content That AI Systems Are Likely Already Citing

Based on current content structure, the most likely pages to be cited by AI:

1. **FAQ page** -- direct Q&A format is ideal for AI extraction
2. **Learn articles** -- if they contain factual statements about BAC water
3. **Tool page teaching sections** -- explanatory content below calculators

## Content AI Systems Cannot Currently Cite

1. **Calculator results** -- interactive/JS-rendered, not in HTML source
2. **Homepage** -- marketing copy without factual definitions
3. **Product descriptions** -- client-rendered in some contexts
4. **About page** -- too thin and vague
