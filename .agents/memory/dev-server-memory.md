---
name: Dev server OOM on this repl
description: next dev (Turbopack) gets OOM-killed in the 8GB container; workflow runs a production build instead
---

**Rule:** The "Start application" workflow runs `npm run start -- -p 5000` (production build), not `next dev`. After code changes, run `NODE_OPTIONS='--max-old-space-size=4096' npm run build` then restart the workflow.

**Why:** `next dev` (Next 16 Turbopack) was repeatedly OOM-killed while compiling routes — the 8GB container is shared with VNC/recording/tsserver processes and memory peaked at the cgroup cap. `--max-old-space-size` did not help (native Turbopack memory).

**How to apply:** Don't switch the workflow back to `next dev` unless memory pressure is resolved; expect silent workflow "FINISHED" state + ERR_CONNECTION_REFUSED as the OOM symptom. Also: the dev DB schema had drifted (missing columns) — run `npx prisma db push` + `npx prisma generate` when Prisma type/column errors appear.
