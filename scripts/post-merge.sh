#!/bin/bash
set -euo pipefail
# Match the deploy lockfile. Never modify or seed the production database here.
npm ci
npx prisma generate
