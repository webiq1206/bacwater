# Backlink register

`ledger.json` is the only place a backlink claim may live. `verification-report.md`
and `verification.json` are generated; do not edit them.

```
npm run backlinks:verify              # read every placement live, write the report
npm run backlinks:verify -- --promote  # also write the statuses that were verified
```

## The rule

A placement counts as dofollow only when a verification run read the live page and
found an anchor to `bacwater.ai` with no equity-blocking `rel` and no page-level
nofollow. Four things are checked on every run, because any one of them silently
discards the link:

1. the anchor's own `rel` (`nofollow`, `ugc`, `sponsored`),
2. a page-level `<meta name="robots">` or `<meta name="googlebot">` carrying
   `nofollow` or `none`, which nofollows every link on the page at once,
3. an `X-Robots-Tag` response header carrying the same,
4. that the `href` resolves to our host, rather than to a redirector or a
   look-alike domain.

None of these can be inferred. A high Domain Rating is not evidence, a platform's
own documentation is not evidence, and a successful submission is not evidence.
`scripts/verify-backlinks.ts` writes `attributes` only from HTML it actually read,
and `verifyLedger()` in `src/lib/seo/backlink-ledger.ts` fails the run if a record
claims a live status without them.

A page the run could not read stays exactly as it was, reported under **Could not
verify**. Silence is never promoted to a conclusion in either direction.

## Statuses

| Status | Meaning |
| --- | --- |
| `opportunity` | Researched. Nothing submitted, no link exists. |
| `submitted` | Sent or published by us, not yet seen live by the verifier. |
| `live` | The anchor was read on the live page and passes equity. |
| `live-nofollow` | The anchor was read and does **not** pass equity. |
| `rejected` | Declined, removed, or the page is gone. |

Only the verifier may assign `live` or `live-nofollow`.

## The one channel that scales

`/embed` is the acquisition mechanism rather than a submission: a third party pastes
a snippet, and the attribution anchor lands in **their** page's markup, outside the
iframe. A link inside an iframe belongs to the framed document, so it would be a
self-link and worth nothing — see the comment at the top of
`src/lib/embed/registry.ts`.

Google treats widget links as a link scheme when the publisher did not editorially
place them and does not control the anchor text, so the snippet is built to fail
that description: the anchor text is a brand credit rather than a commercial
keyword phrase, the pasted markup itself tells the publisher they may reword it,
add `rel="nofollow"`, or delete the line, and the widget keeps working without it.
`scripts/test-embed.ts` asserts all three. The corollary is that a share of
installs will legitimately be `live-nofollow`, and that is a correct outcome, not a
failure to fix.

## What runs without anyone

`.github/workflows/backlinks.yml` runs daily at 06:40 UTC, and on demand. It needs
no secrets to be useful:

1. **Discover** — `npm run backlinks:discover` asks each source for pages that
   appear to link here and adds them as `discovered`.
2. **Verify** — `npm run backlinks:verify -- --promote` reads every placement and
   records the real attributes.
3. **Commit** — the updated register is pushed back to `main`, so its git history
   is the audit trail of what was true on which day.
4. **Raise** — `scripts/report-backlink-changes.ts` compares the register before
   and after. If a dofollow link became nofollow, a link disappeared, or the
   register contradicts the live web, it opens (or comments on) a GitHub issue
   labelled `backlinks`.

Step 4 is the reason this runs daily. Acquiring a link is an event someone
notices; **losing** one is silent. A platform rewriting `rel` on output, a page
edited, a post deleted — none of that notifies anybody, and it is usually found
months later if at all. Gains are reported for context but never raise an issue,
because an alert that fires on good news gets ignored.

The job never force-pushes; it rebases, so a human commit landing mid-run wins.

### Discovery sources, and what they miss

| Source | Needs | Finds |
| --- | --- | --- |
| `wikimedia-exturlusage` | nothing | Every page on the major Wikimedia wikis citing this domain. Exact, not an estimate. These links are nofollow, which the verifier records rather than assumes. |
| `google-search-console` | `GSC_CLIENT_ID`, `GSC_CLIENT_SECRET`, `GSC_REFRESH_TOKEN` repository secrets | Validates access to the property. Referring pages are not exposed by the public API, so it adds no leads on its own. |

Be clear-eyed about the gap: finding *everyone* who links to a domain needs
either that domain's Search Console links report or a paid backlink index, and
neither is available to this repository today. A source that is not configured
says so in the log and returns nothing, so an empty run is never mistaken for
"no backlinks exist".

The gap that would close this properly is capturing the `Referer` header on the
`/embed/*` requests, since every install fetches the widget from our own server
and announces the host page for free. That needs somewhere durable to write, and
the only store here is the production database — whose schema is changed as a
separate reviewed operational step, never from a build. It is deliberately not
done unilaterally.

## Adding a placement

Add the record with `status: "opportunity"` (no `placementUrl`) or `"submitted"`
(with one), say what the method and the relevance are, then run the verifier. Do
not hand-write `attributes` or a live status; the run will reject it.

## Not recorded here

Domain Rating and referring-domain counts are absent on purpose. The Ahrefs
connection available to this repository answers `Insufficient plan` for Site
Explorer and even for the free domain-rating endpoint, so any figure would be
recalled rather than measured. Add them once an account that can actually query
them is connected.
