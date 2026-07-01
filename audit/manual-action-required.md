# BACwater.ai -- Manual Action Required

**Date:** 2026-07-01

Items that cannot be automated and require human action: account setup, DNS changes, third-party service configuration, and content decisions.

---

## Analytics and Tracking

### M1: Set Up Google Analytics 4 (GA4)

**Priority:** High
**Why:** No analytics tracking was found in the codebase. Without GA4, there is no data on traffic, user behavior, conversions, or content performance.

**Steps:**
1. Go to https://analytics.google.com
2. Create a new GA4 property for bacwater.ai
3. Copy the Measurement ID (G-XXXXXXXXXX)
4. Add to the site (either via `next/script` in root layout or Google Tag Manager)
5. Set up conversion events: plan_created, add_to_cart, purchase, contact_form_submit
6. Set up custom dimensions: plan_peptide, product_category

### M2: Set Up Google Search Console

**Priority:** High
**Why:** Required to monitor indexing status, crawl errors, search performance, and submit the sitemap.

**Steps:**
1. Go to https://search.google.com/search-console
2. Add property: bacwater.ai
3. Verify ownership via DNS TXT record or HTML file upload
4. Submit sitemap: https://bacwater.ai/sitemap.xml
5. Monitor: Index Coverage, Core Web Vitals, Enhancements (FAQ, Product)

### M3: Set Up Bing Webmaster Tools

**Priority:** Medium
**Why:** Bing powers DuckDuckGo and some AI tools. Free indexing monitoring.

**Steps:**
1. Go to https://www.bing.com/webmasters
2. Add and verify bacwater.ai
3. Submit sitemap

---

## DNS and Domain

### M4: Verify www vs non-www Redirect

**Priority:** Medium
**Why:** Both www.bacwater.ai and bacwater.ai should resolve, with one redirecting to the other. Without this, Google may index both as separate sites.

**Steps:**
1. Check DNS for both A records (or CNAME for www)
2. Verify that one redirects 301 to the other
3. If using a CDN (Vercel/Replit), check their domain settings
4. Ensure `metadataBase` in `src/app/layout.tsx` matches the canonical domain

### M5: Verify HTTPS Certificate

**Priority:** Low (likely already handled by hosting)
**Steps:** Visit https://bacwater.ai and verify no certificate warnings. Check with SSL checker tool.

---

## Brand and Social

### M6: Create Social Profiles

**Priority:** Medium
**Why:** The Organization schema `sameAs` array is empty. Social profiles help establish entity identity in Google's Knowledge Graph.

**Steps:**
1. Create profiles on relevant platforms (if not already):
   - Instagram
   - YouTube
   - Twitter/X
   - Facebook
2. Add profile URLs to `sameAs` array in `src/components/common/org-json-ld.tsx`
3. Ensure all profiles use consistent naming ("BACwater.ai" not "BACwater & Co.")

### M7: Create a Proper Logo Image

**Priority:** Critical (blocks Organization schema fix)
**Why:** The Organization schema currently points to favicon.ico. Google requires a proper logo image.

**Steps:**
1. Create or export a logo as PNG or WebP, at least 112x112px (recommended 512x512)
2. Save to `public/images/logo.png`
3. Agent can then update the schema reference

### M8: Resolve Brand Name Decision

**Priority:** High
**Why:** "BACwater & Co." (header/footer) vs "BACwater.ai" (schema/metadata) creates entity confusion.

**Decision needed:**
- Is the legal/canonical name "BACwater.ai" or "BACwater & Co."?
- Which should appear in structured data?
- Should the other be documented as a trade name/DBA?

---

## Content Decisions

### M9: Product Photography

**Priority:** High
**Why:** Product images are SVG placeholders. Real product photos are required for Product rich results and user trust.

**Steps:**
1. Photograph actual products (BAC water vials, syringes, prep pads, kits)
2. Upload to hosting/CDN
3. Update product records in admin panel with real image URLs

### M10: Privacy Policy Expansion

**Priority:** High
**Why:** Current privacy policy is ~60 words. For a site processing payments (Stripe), collecting user data, and using AI features, this is a potential compliance gap.

**Decision needed:**
- What analytics services are in use? (GA4, Hotjar, etc.)
- What third-party processors handle data? (Stripe, Resend, DB hosting)
- Does the site serve international users? (GDPR applicability)
- What is the data retention policy?
- Is there a DPO or privacy contact beyond privacy@bacwater.ai?

**The agent can write the expanded policy once these answers are provided.**

### M11: Medical Disclaimer Review

**Priority:** Medium
**Why:** The site sells BAC water and syringes "for research use." The disclaimer should be reviewed by legal counsel to ensure it is adequate.

**Steps:**
1. Have legal counsel review `/disclaimer` page content
2. Confirm "for research use only" language is sufficient
3. Consider adding to each product page (currently only in terms/disclaimer)

---

## Third-Party Integrations

### M12: Verify Stripe Webhook Configuration

**Priority:** Medium (not SEO-related, but discovered during audit)
**Why:** If Stripe webhooks are not configured, order confirmation and payment status may not sync correctly.

**Steps:**
1. Verify Stripe webhook endpoint is configured in Stripe dashboard
2. Ensure webhook secret is set in environment variables

### M13: Email Deliverability (Resend)

**Priority:** Low
**Why:** Ensure transactional emails (order confirmations, contact form receipts) are deliverable.

**Steps:**
1. Verify domain DNS records (SPF, DKIM, DMARC) for bacwater.ai
2. Check Resend dashboard for delivery rates

---

## Monitoring Setup

### M14: Set Up Uptime Monitoring

**Priority:** Low
**Steps:** Use a free service (UptimeRobot, Better Stack, etc.) to monitor bacwater.ai availability.

### M15: Set Up Structured Data Monitoring

**Priority:** Medium
**Steps:**
1. After implementing schema changes, test with https://validator.schema.org
2. Test with https://search.google.com/test/rich-results
3. Monitor "Enhancements" in Google Search Console for FAQ, Product, Article errors

### M16: Core Web Vitals Monitoring

**Priority:** Medium
**Steps:**
1. Run PageSpeed Insights: https://pagespeed.web.dev/?url=https://bacwater.ai
2. Monitor CWV in Google Search Console
3. Address any LCP, CLS, or INP issues

---

## Summary

| # | Task | Priority | Can Agent Do? |
|---|------|----------|--------------|
| M1 | GA4 setup | High | NO -- requires Google account |
| M2 | Search Console setup | High | NO -- requires verification |
| M3 | Bing Webmaster setup | Medium | NO -- requires account |
| M4 | www redirect verification | Medium | NO -- requires DNS access |
| M5 | HTTPS certificate check | Low | NO -- requires hosting access |
| M6 | Social profile creation | Medium | NO -- requires account creation |
| M7 | Logo image creation | Critical | NO -- requires design asset |
| M8 | Brand name decision | High | NO -- requires business decision |
| M9 | Product photography | High | NO -- requires physical photos |
| M10 | Privacy policy content decisions | High | PARTIAL -- agent writes, human provides facts |
| M11 | Legal disclaimer review | Medium | NO -- requires legal counsel |
| M12 | Stripe webhook verification | Medium | NO -- requires Stripe dashboard |
| M13 | Email deliverability check | Low | NO -- requires Resend dashboard |
| M14 | Uptime monitoring setup | Low | NO -- requires third-party account |
| M15 | Structured data testing | Medium | PARTIAL -- agent can run tests |
| M16 | Core Web Vitals monitoring | Medium | PARTIAL -- agent can run PageSpeed |
