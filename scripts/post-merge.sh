#!/bin/bash
set -euo pipefail

# This hook runs in the Replit development workspace after a Git pull/merge.
# Importing source must never mutate a database. Schema changes require a
# separate reviewed operation with a verified backup and explicit target.
npm ci
npx prisma generate

echo "Source dependencies and Prisma client refreshed. No database writes performed."
