# BACwater organic growth operations

Updated September 28, 2026. Repository: webiq1206/bacwater. Public site: https://bacwater.ai.

## Goal and budget

Bring relevant visitors to the free calculators and encourage completed calculations and repeat use. No ad spend, paid listings, purchased links, paid subscriptions, usage-based API purchases or payment-card trials. Existing hosting and ChatGPT account limits still apply. Never promise rankings, traffic or downloads that have not been measured.

## Positioning

Clear math from the visitor's own numbers. Existing BACwater wordmark, forest green (#18382d), off-white (#f7f8f2) and pale green (#eaf0dd). Professional, direct language. No invented testimonials, simulated customers, engagement manipulation, medical claims or dosing advice. Keep product-first selection and blend/IU distinctions intact. Preserve research-only language and existing affiliate disclosures and attributed supplier links.

## Implemented distribution assets

- /share-tools: original reference cards, a captioned 32-second video and a working widget preview with installation code.
- /embed/mass-converter.js: a standalone web component bundled from the site's exact decimal mass-conversion implementation. No network requests after loading, storage, advertising or analytics inside the widget. The host website's own practices still apply.
- public/growth: three 1000 x 1500 PNG cards plus SVG sources, a landscape MP4, poster and VTT captions.
- Calculator share controls send a canonical public tool URL with only fixed campaign fields, never entered values or saved-plan identifiers.
- Shared-plan viewers get a separate entry point for their own calculation. Existing plan sharing still exposes the saved calculation, as disclosed, and never private notes.
- Approved analytics events now include calculator_shared, embed_code_copied and four bounded arrival categories. Existing verified-configuration and visitor-consent gates remain required.

These paths are only public after this release is deployed. Check /version.json, the page and widget before directing readers to them. Repository main and production are separate states.

## Recurring workflow

### Daily opportunity research

Search publicly accessible discussions and resource pages for a current, specific need related to concentration arithmetic, mass conversion, scale conversion, or calculator usability. Read actual context when available; snippets alone do not verify a posting opportunity. Check dates and community rules. Record at most five qualified, new opportunities in docs/growth/opportunities.json. Deduplicate by canonical URL. A competitor's launch thread is not an invitation to advertise.

Use the appropriate existing calculator URL. Keep arithmetic education separate from personal medical instructions. Do not fabricate research findings, keyword volumes or firsthand product use. Do not post repeated links or send unsolicited automated messages. Research tasks do not imply that posts or outreach were sent.

### Weekly website improvement

Read the latest main, this file and the opportunity log. Inspect live discovery, sharing and calculator routes. When useful and supported by evidence, make one focused improvement, test it, and commit a normal fast-forward update. Avoid repeated metadata rewrites without performance evidence, duplicate articles, thin keyword variants or changing calculation logic for marketing. Verify production separately. Never alter production schema or run database seeding.

### Weekly content production

Use verified recurring questions to choose one arithmetic topic. Check all numbers with deterministic code. Produce up to three original branded graphics and one short captioned explainer when the topic warrants them. Reuse existing assets when no meaningful new topic exists. Record public-ready copy and links in the content queue. Never claim external publication without a returned post URL and a successful read-back.

## Publishing and account boundaries

The owner authorized publishing BACwater content through shared WEB IQ accounts on September 28, 2026. Preserve WEB IQ names, bios and all other client content. Use only Pinterest board 1120129807261632904 (BACwater.ai | Calculators & Unit Guides) and YouTube playlist PLKfaE4AyuK2A (BACwater.ai | Calculator Guides). Reddit profile posts use a [BACwater.ai] title prefix and explicit affiliation. No unrelated boards, playlists, profile rebranding, unsolicited messages or repeated community promotion.

Read publications.json before any write and deduplicate. Three pins and one Reddit profile post have successful creation and read-back evidence. YouTube upload wIHXYAaqOEg returned success but could not be retrieved; playlist insertion returned videoNotFound. Do not re-upload or claim it is live. Check the existing video on the next content run and add it to the dedicated playlist only when retrievable. Publish at most one distinct new Pinterest guide per weekly content run. Keep further Reddit community participation in research until context and rules support it.

All four connectors have verified read access. Search Console includes owner access to sc-domain:bacwater.ai. Connection identifiers stay in private automation configuration. No spend or new account registrations occurred.

## Measurement

No current traffic baseline is established in this release. The older repo Search Console audit is historical, not current performance. Once account access is authorized, compare the latest complete 28-day period with the previous 28 days for clicks, impressions, CTR and landing pages. Verify receiving-side GA4 settings before enabling optional measurement. Count calculator completions and repeat use only from validated data. Consent-based samples are incomplete; do not describe them as total users.

## Quality and release checks

Run npm run build:widget, npm run test:growth and npm run build. The growth test compares the distributed widget with a fresh bundle, exercises bidirectional conversion and invalid-input clearing, and checks clean tool links and bounded source categories. Verify the widget preview, copy fallback, error handling, narrow layout and new public assets.

Regenerate cards with node scripts/generate-growth-assets.mjs. This uses sharp already present through the Next.js dependency tree. Optional video regeneration uses the documented ffmpeg command in content-queue.json. Do not add media-generation tools or paid services to production startup.

Maintain current status in status.json. Keep private account data, credentials, connection links and raw visitor information out of this public repository.
