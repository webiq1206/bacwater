# Clear-volume focus race

Main browser/privacy run 39819641093, job 119967191822, failed `audit-converters.mjs:99`: after Edit numbers and clearing final liquid volume, expected empty string but received the previous `4`. All earlier converter groups passed. The same source tree passed PR CI and a normal local run, so ordinary reruns alone did not explain it.

A bounded local interleaving reproduced the exact failure: release the existing requestAnimationFrame screen-heading focus after the volume field is selected but before deletion. The trace shows field focus, then heading focus, and no input event. The old value was never deleted; this is a focus race, not arithmetic or volume auto-selection.

The fix moves screen scroll/focus to useLayoutEffect after the screen commits and avoids initial-mount focus. A later frame can no longer steal focus midway through the next input action. Session storage, formulas, validation and research wording are unchanged.

The converter test retains every existing assertion and adds held-frame coverage: editing must focus the inputs heading before delayed frames run; clearing and releasing queued callbacks must leave focus in the volume input and its value empty. Full production build/unit/type checks, all 11 converter groups and 8 focused Chromium/WebKit groups passed locally after the fix. The original deterministic reproducer also passes after the fix. CI must validate this exact follow-up tree before integration. No existing CI run was restarted and no validation/storage gate was waived.
