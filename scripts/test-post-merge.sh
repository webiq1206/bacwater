#!/bin/bash
set -euo pipefail
# Exercise the hook with fake tools: neither dependencies nor a database are touched.
fixture=$(mktemp -d)
trap 'rm -f -- "$fixture/npm" "$fixture/npx" "$fixture/calls"; rmdir -- "$fixture"' EXIT
cat > "$fixture/npm" <<'STUB'
#!/bin/bash
set -euo pipefail
test "$*" = "ci"
printf 'npm %s\n' "$*" >> "$HOOK_CALLS"
STUB
cat > "$fixture/npx" <<'STUB'
#!/bin/bash
set -euo pipefail
test "$*" = "prisma generate"
printf 'npx %s\n' "$*" >> "$HOOK_CALLS"
STUB
chmod +x "$fixture/npm" "$fixture/npx"
for deployment in '' '1'; do
 export HOOK_CALLS="$fixture/calls"
 : > "$HOOK_CALLS"
 PATH="$fixture:$PATH" REPLIT_DEPLOYMENT="$deployment" bash scripts/post-merge.sh
 diff -u <(printf 'npm ci\nnpx prisma generate\n') "$HOOK_CALLS"
done
echo 'Import hook performs no schema push, migration or seed in either context.'
