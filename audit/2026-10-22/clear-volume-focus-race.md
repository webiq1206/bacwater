# Clear-volume focus race

Main browser/privacy run 39819641093, job 119967191822, failed `audit-converters.mjs:99`: after Edit numbers and clearing final liquid volume, expected empty string but received the previous `4`. All earlier converter groups passed. The same source tree passed PR CI and a normal local run, so ordinary reruns alone did not explain it.

A bounded local interleaving reproduced the exact failure: release the existing requestAnimationFrame screen-heading focus after the volume field is selected but before deletion. The trace shows field focus, then heading focus, and no input event. The old value was never deleted; this is a focus race, not arithmetic or volume auto-selection.

The fix moves screen scroll/focus to useLayoutEffect after the screen commits and avoids initial-mount focus. A later frame can no longer steal focus midway through the next input action. Session storage, formulas, validation and research wording are unchanged.

The converter test retains every existing assertion and adds held-frame coverage: editing must focus the inputs heading before delayed frames run; clearing and releasing queued callbacks must leave focus in the volume input and its value empty. Full production build/unit/type checks, all 11 converter groups and 8 focused Chromium/WebKit groups passed locally after the fix. The original deterministic reproducer also passes after the fix. CI must validate this exact follow-up tree before integration. No existing CI run was restarted and no validation/storage gate was waived.

## Advisory gate discovered during repair validation

PR54 browser/privacy run39823532471 stopped before tests at the unchanged dependency-audit gate. The advisory database added GHSA-2464-fhr4-w9xw (critical image optimization) and GHSA-p3m5-59mp-jv5r (high Server Actions DoS) on October22; installed Next16.3.8 is affected. Official advisories identify16.4.1 as patched; npm recommends the stable16.4.2 maintenance release. Pin Next16.4.2 and matching @next companions; no other lockfile package version changes. No audit suppression or forced blanket update.

Sources: https://github.com/advisories/GHSA-2464-fhr4-w9xw ; https://github.com/advisories/GHSA-p3m5-59mp-jv5r ; https://github.com/vercel/next.js/releases/tag/v16.4.2 . Reviewed npm package integrity: sha512-r+oBJojfefUjOiWkBhXgLS+igxX/7BWyK59uHnyOyplMSLtBZ+QLP3okrdYTbrfrbrmNTVWLBPaHDX9KRaIt3w== . The packaged Google font-loader extension extraction is unchanged; the existing narrowly scoped header patch remains necessary and its pinned-version guard is updated after inspection. Security verifier continues to require manifest, lockfile, installed package and all framework companions to agree.

Combined Next16.4.2 + focus-fix local validation: clean npm ci, Prisma generation, zero npm audit findings, production build/unit/type checks, 170 metadata/image pairs, 116 rendered HTTP/schema checks, all 11 converter groups including held-frame regression, and all 8 focused Chromium/WebKit groups passed. Database-backed CI acceptance remains required; no local database pass is claimed.
