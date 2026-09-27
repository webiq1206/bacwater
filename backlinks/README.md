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
