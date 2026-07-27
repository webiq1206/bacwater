# BACWater.ai

The trusted utility for peptide reconstitution: deterministic calculations, personalized plans, printable labels, and premium supplies.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Prisma, NextAuth v5, Stripe, Resend, and Anthropic Claude.

## What's inside

- **Plan builder**: beginner (one-question-at-a-time) and advanced (calculator layout). Deterministic math, plain-English explanations, PDF, printable vial label, QR code.
- **Ecommerce**: shop, cart, guest checkout, Stripe redirect, order tracking.
- **Learning Center**: MDX-lite guides pulled from the database, editable in admin.
- **Standalone tools**: BAC water, reconstitution, dose, syringe unit, mg↔mcg, and supply calculators.
- **AI assistant**: Claude-powered drawer that explains a plan; **never** performs math. Default model is Haiku (cheap, fast). Swap `ANTHROPIC_MODEL` for Sonnet or Opus if you want more depth.
- **Admin panel**: dashboard, orders (with vendor email workflow via Resend), products, vendors, users, content, contact.
- **SEO/GEO/AEO**: metadata, sitemap, robots, Organization + Product + Article + FAQ JSON-LD.

## Local dev

Postgres is required (the Prisma datasource is `postgresql`; a SQLite URL will
not validate).

```bash
npm install
cp .env.example .env         # fill in values, incl. a Postgres DATABASE_URL
createdb bacwater_dev
npm run db:push
npm run db:seed
npm run dev
```

Then visit http://localhost:3000.

## Environment variables

See `.env.example` for the full list. The app runs in **offline test mode** when Stripe, Resend, Google, or Anthropic keys are missing:

- No Stripe key → orders are created and marked "paid" immediately (for admin flow testing).
- No Resend key → vendor emails save as `failed` (draft preserved).
- No Anthropic key → AI drawer returns a friendly "not configured yet" message.
- No Google client → Google sign-in is hidden; email/password still works.

## Admin

The first user whose email matches `ADMIN_EMAILS` (comma-separated) is auto-promoted to admin on signup. You can also promote an existing user from `/admin/users`.

## Deploy on Replit

1. Import this repo into Replit.
2. Replit's Next.js template should be picked up automatically. **Do not let Replit rewrite this to Vite**. Next.js is required for SSR, Prisma, and app router. If it offers to convert, decline and reset.
3. Add the environment variables from `.env.example` in the Replit Secrets panel.
4. Set `DATABASE_URL` to your production database. On Neon, use the **pooled**
   endpoint (`-pooler` in the hostname). The direct endpoint gets terminated
   when Neon's compute auto-suspends (`57P01`), causing intermittent 500s.
5. The deploy build runs `prisma db push` **without** `--accept-data-loss`, so a
   destructive schema change fails the deploy instead of dropping prod data.
   Resolve it deliberately rather than re-adding the flag.
6. Seeding is **not** part of the deploy. `prisma/seed.ts` upserts and force-sets
   `published: true`, so running it against prod reverts content edited in the
   admin panel and re-publishes unpublished guides. Run `npm run db:seed`
   manually, and only when you intend to reset content.
7. Deploy.

## Calculation library

`src/lib/calc/` is the deterministic core.

- `index.ts`: `calculate()`, `recommendBacWaterMl()`, syringe map.
- `peptides.ts`: 20+ curated research peptides with typical strengths and shelf life.
- `converters.ts`: unit conversion helpers.
- `__tests__/calc.test.ts`: assertion-based tests. Run: `npx tsx src/lib/calc/__tests__/calc.test.ts`.

**The AI assistant never runs this math.** All arithmetic is deterministic.

## Disclaimer

BACWater.ai provides calculation tools and research supplies. It is **not** a medical service and does not diagnose, prescribe, or provide medical advice. Products are sold for laboratory research and educational purposes only.
