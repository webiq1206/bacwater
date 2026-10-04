# Beginner input follow-up

Base: main `4adfe9a6e572bfa70417f84af2ee7bff63c40477`.

## Reproduced input error

The shared vial field used a formatted derived amount as its controlled text value. Simulating individual keys `0`, `.`, `4` yielded `4`, not `0.4`. Preserve raw text for a per-time amount; keep the existing conversion for day/week schedules and existing numeric validation. A native Node source probe reproduced the old result and verified the corrected sequence, invalid text, decimal prefixes, arithmetic and schedule handoffs. This is source evidence, not a rendered browser test.

Browser regression coverage now types decimals one key at a time, checks invalid text remains editable and blocks results, and verifies the resulting 0.08 mL calculation. Invalid optional amounts also hide results and copy actions. An empty optional amount still permits concentration-only results.

## Beginner guidance

Explain concentration as the amount in each 1 mL, distinguish final liquid volume from water added, and tell the reader where to find their own input. Unit help includes a concrete 5 mg/mL example and a visible return button, with focus restoration coverage. No amount is recommended and no calculation formula changed.

## Repeated WebKit gate

Main search workflow `37208370128` failed on both its first attempt and one unchanged-source retry. Other six required workflows passed. The reported error concerns an automatic product detail RSC request for `/products/5-amino-1mq` during directory/search navigation. Automatic prefetch on changing directory cards is a suspected contributor, not a proven root cause.

This candidate disables speculative prefetch on directory card title links, adds failed-request diagnostics, and explicitly tests actual product detail navigation in all six browser/viewport configurations. The assertion against browser runtime errors remains intact. Cloud results must establish whether this resolves the gate; do not describe main as all green or retry repeatedly to obtain a pass.

## Remaining release gates

Cloud CI and independent review of input/state behavior are required. No heavy local build was run on the resource-constrained shared Windows machine. No Replit import, deployment, live customer submission or database mutation occurred. Shared authenticated browser approval remains pending; production source parity, runtime configuration, database backup and full live interaction coverage remain unverified. Cloud emulation and public screenshots do not establish physical mobile acceptance or completion of the full audit.
