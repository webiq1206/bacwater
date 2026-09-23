#!/bin/bash
set -euo pipefail

# This hook runs in the Replit development workspace after a Git pull/merge.
# Keep the development database aligned with the committed Prisma schema so
# Replit does not infer destructive production migrations from stale dev state.
# Production deployments never run this schema sync.
npm ci
npx prisma generate

if [ -z "${REPLIT_DEPLOYMENT:-}" ]; then
  echo "Synchronizing the Replit development database with the committed Prisma schema..."
  npx prisma db push --skip-generate
else
  echo "Deployment context detected. Skipping all schema writes."
fi
