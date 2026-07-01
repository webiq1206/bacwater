# BACwater.ai -- Topic Cluster Map

**Date:** 2026-07-01

Pillar pages and supporting content clusters for topical authority in BAC water / peptide reconstitution.

---

## Cluster Architecture

BACwater.ai's content should be organized around 4 topic clusters, each with a pillar page and supporting content. Pillar pages are hub pages that link to all supporting pages. Supporting pages link back to the pillar and to each other.

---

## Cluster 1: BAC Water (Core Topic)

**Pillar Page:** `/learn` (Learning Center -- the hub for all educational content)

| Role | Page | Status | Primary Keyword |
|------|------|--------|----------------|
| Pillar | `/learn` | EXISTS | peptide reconstitution guides |
| Support | `/learn/what-is-bac-water` | EXISTS (DB) | what is bacteriostatic water |
| Support | `/learn/bac-water-vs-sterile-water` | NEW | bac water vs sterile water |
| Support | `/learn/bac-water-shelf-life` | NEW | how long does bac water last |
| Support | `/learn/how-to-store-bac-water` | NEW | how to store bac water |
| Support | `/learn/benzyl-alcohol-in-bac-water` | NEW | benzyl alcohol bac water |
| Tool | `/tools/bac-water` | EXISTS | bac water calculator |
| Product | `/shop/[bac-water-slug]` | EXISTS (DB) | buy bacteriostatic water |

**Internal linking pattern:**
- Pillar (`/learn`) links to all support pages
- Each support page links back to pillar and to 2-3 siblings
- Each support page links to the relevant tool (`/tools/bac-water`)
- Each support page links to the relevant product(s) in shop
- Tool page links to pillar and 1-2 support pages

---

## Cluster 2: Peptide Reconstitution (Process Topic)

**Pillar Page:** `/plan` (Plan Builder -- the main reconstitution tool)

| Role | Page | Status | Primary Keyword |
|------|------|--------|----------------|
| Pillar | `/plan` | EXISTS | peptide reconstitution plan |
| Support | `/plan/new` | EXISTS | reconstitution for beginners |
| Support | `/learn/how-peptide-reconstitution-works` | EXISTS (DB) | how to reconstitute peptides |
| Support | `/learn/how-to-reconstitute-bpc-157` | NEW | reconstitute bpc-157 |
| Support | `/learn/how-to-reconstitute-tirzepatide` | NEW | reconstitute tirzepatide |
| Support | `/learn/how-to-reconstitute-semaglutide` | NEW | reconstitute semaglutide |
| Support | `/learn/how-to-reconstitute-tb-500` | NEW | reconstitute tb-500 |
| Support | `/learn/too-much-bac-water` | NEW | what if too much bac water |
| Support | `/learn/how-to-store-reconstituted-peptides` | NEW | store reconstituted peptides |
| Support | `/learn/peptide-reconstitution-chart` | NEW | reconstitution chart |
| Tool | `/tools/reconstitution` | EXISTS | reconstitution calculator |

**Internal linking pattern:**
- Pillar (`/plan`) links to `/plan/new` and key guides
- Peptide-specific guides link to plan builder with pre-filled defaults
- Each guide links to reconstitution calculator
- Reconstitution guide links to storage guide
- Chart page links to calculator and plan builder

---

## Cluster 3: Syringes and Dosing (Measurement Topic)

**Pillar Page:** `/tools` (Calculators & Tools -- the hub for all tools)

| Role | Page | Status | Primary Keyword |
|------|------|--------|----------------|
| Pillar | `/tools` | EXISTS | peptide calculators |
| Support | `/tools/dose` | EXISTS | peptide dose calculator |
| Support | `/tools/syringe-units` | EXISTS | syringe units to ml |
| Support | `/tools/mg-to-mcg` | EXISTS | mg to mcg converter |
| Support | `/learn/how-to-read-an-insulin-syringe` | NEW | how to read insulin syringe |
| Support | `/learn/insulin-syringe-sizes` | NEW | insulin syringe sizes |
| Support | `/learn/needle-gauge-guide` | NEW | what gauge needle for peptides |

**Internal linking pattern:**
- Pillar (`/tools`) links to all tool pages
- Each tool page links back to pillar and to 2-3 sibling tools (ALREADY IMPLEMENTED)
- New learn guides link to relevant calculator tools
- Calculator pages link to relevant learn guides

---

## Cluster 4: Supplies and Shopping (Commercial Topic)

**Pillar Page:** `/shop` (Shop Supplies)

| Role | Page | Status | Primary Keyword |
|------|------|--------|----------------|
| Pillar | `/shop` | EXISTS | buy bacteriostatic water |
| Support | `/shop/[slug]` | EXISTS (DB) | (per product) |
| Support | `/tools/supplies` | EXISTS | peptide supply calculator |
| Support | `/learn/multi-dose-vial-hygiene` | NEW | multi-dose vial hygiene |
| Support | `/faq` | EXISTS | bac water faq |

**Internal linking pattern:**
- Pillar (`/shop`) links to all products and to supply calculator
- Supply calculator links to shop with pre-filled cart
- Product pages link to relevant guides (BAC water -> what-is-bac-water)
- FAQ links to shop for product questions

---

## Cross-Cluster Linking

Clusters should link to each other at natural intersection points:

| From Cluster | To Cluster | Link Point |
|-------------|------------|------------|
| BAC Water | Reconstitution | "What is BAC water?" links to "How reconstitution works" |
| BAC Water | Supplies | BAC water guides link to shop products |
| Reconstitution | Syringes | Reconstitution guides link to syringe unit converter |
| Reconstitution | Supplies | Plan builder links to supply calculator and shop |
| Syringes | Reconstitution | Syringe guide links to reconstitution calculator |
| Supplies | All | Supply calculator links to plan builder, learning center |

---

## Visual Cluster Map

```
                    HOMEPAGE (/)
                   /    |    \     \
                  /     |     \     \
               PLAN   SHOP   LEARN  TOOLS
               /plan  /shop  /learn /tools
                |       |      |      |
          +-----+   +---+   +-+---+  +--------+
          |     |   |   |   |     |  |    |    |
        /new  guides products guides recon dose units
              (reconst) (BAC, etc) (BAC)  calc  calc  conv
                |         |        |       |    |     |
              peptide   product  storage  mg/mcg supply
              specific  detail   shelf    conv   calc
              guides    pages    life

Cross-links: <==>
- Learn articles <=> Tools (contextual)
- Products <=> Learn articles (related guides)
- Plan builder <=> Shop (supply pre-fill)
- FAQ <=> Everything (answer links)
```

---

## Missing Cluster Connections (Current Gaps)

| Gap | Impact | Fix |
|-----|--------|-----|
| Shop PDPs do not link to learn articles | HIGH | Add "Learn more" links on product pages |
| Learn articles do not link to tools | HIGH | Add inline tool links in article body |
| FAQ does not link to tools or learn | MEDIUM | Add links in FAQ answer text |
| Tools do not link to learn articles | MEDIUM | Add "Learn more" links in teaching sections |
| About does not link to learn, tools, or FAQ | LOW | Add contextual links in about copy |
| Contact does not link anywhere | LOW | Add "Try FAQ first" link |

---

## Content Creation Roadmap (by Cluster)

### Phase 1: Fill Critical Gaps (Weeks 1-2)
- Create: `bac-water-vs-sterile-water`
- Create: `how-to-reconstitute-bpc-157`
- Create: `how-to-store-reconstituted-peptides`
- Create: `bac-water-shelf-life`
- Add direct-answer blocks to all existing tool pages
- Wire `WebPageJsonLd` with BreadcrumbList on all pages

### Phase 2: Expand Reconstitution Cluster (Weeks 3-4)
- Create: `how-to-reconstitute-tirzepatide`
- Create: `how-to-reconstitute-semaglutide`
- Create: `peptide-reconstitution-chart`
- Create: `too-much-bac-water`

### Phase 3: Expand Syringe/Dosing Cluster (Weeks 5-6)
- Create: `how-to-read-an-insulin-syringe`
- Create: `insulin-syringe-sizes`
- Create: `needle-gauge-guide`

### Phase 4: Deepen Supply Cluster (Weeks 7-8)
- Create: `multi-dose-vial-hygiene`
- Create: `peptide-reconstitution-glossary`
- Expand about page content
- Expand privacy policy
