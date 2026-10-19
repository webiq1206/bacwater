import assert from "node:assert/strict";
import { EMAIL_BRAND, escapeHtml, plainTextToBlocks, renderEmail, senderAddress } from "@/lib/email/layout";
import { contactReplyEmail, formatOrderTime, passwordResetEmail, supplierOrderEmail } from "@/lib/email/templates";
import { REPLY_TEMPLATES } from "@/lib/contact-triage";

let count = 0;
const test = (name: string, run: () => void) => { run(); count++; console.log(`PASS email: ${name}`); };

const resetUrl = "https://bacwater.ai/reset-password#token=abc123";
const all = [
  passwordResetEmail(resetUrl),
  ...REPLY_TEMPLATES.map(t => contactReplyEmail(t.subject("Question about my vial"), t.body("Dana Smith"))),
  supplierOrderEmail("BACwater.ai order ORD-1", "Hello Supplier,\n\nPlease ship:\n\n- 2× BAC Water (AMINO-H2O)\n\nShip to:\nDana Smith\n1 Main St\nAustin, TX 78701"),
];

test("every email has a subject, an HTML body and a plain-text twin", () => {
  for (const email of all) {
    assert.ok(email.subject.trim().length > 0);
    assert.match(email.html, /^<!doctype html>/);
    assert.ok(email.text.trim().length > 40, email.subject);
  }
});

test("every email carries the brand: logo, colors, footer and site link", () => {
  for (const email of all) {
    assert.ok(email.html.includes(EMAIL_BRAND.logoUrl), "logo");
    assert.ok(email.html.includes(`alt="${EMAIL_BRAND.name}"`), "logo alt text");
    assert.ok(email.html.includes(EMAIL_BRAND.colors.ink) && email.html.includes(EMAIL_BRAND.colors.page), "brand colors");
    assert.ok(email.html.includes(EMAIL_BRAND.tagline) && email.text.includes(EMAIL_BRAND.tagline), "tagline");
    assert.ok(email.text.includes(EMAIL_BRAND.siteUrl), "site link in text");
    assert.match(email.html, /max-width:600px/);
    assert.match(email.html, /<meta name="viewport"/);
  }
});

test("no email uses an em dash or en dash", () => {
  for (const email of all) {
    assert.doesNotMatch(email.subject + email.html + email.text, /[–—]/, email.subject);
  }
});

test("every email has a short inbox preview line", () => {
  for (const email of all) {
    const preheader = email.html.match(/<div style="display:none[^>]*>([\s\S]*?)&#8203;/)?.[1] ?? "";
    assert.ok(preheader.length > 10 && preheader.length <= 120, `${email.subject}: ${preheader}`);
  }
});

test("password reset has one clear button, the fallback link and the expiry", () => {
  const email = passwordResetEmail(resetUrl);
  assert.equal(email.subject, "Reset your BACwater.ai password");
  assert.equal((email.html.match(/>Choose a new password</g) ?? []).length, 1);
  assert.equal((email.html.match(new RegExp(escapeHtml(resetUrl).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length, 3, "button href, fallback href and fallback text");
  assert.match(email.text, /Choose a new password:\nhttps:\/\/bacwater\.ai\/reset-password#token=abc123/);
  assert.match(email.text, /30 minutes/);
  assert.equal(email.text.split(resetUrl).length - 1, 1, "plain text shows the link once");
  assert.match(email.text, /ignore this email/);
});

test("text typed by a person is escaped, never rendered as HTML", () => {
  const email = contactReplyEmail(`Re: <script>alert(1)</script>`, `Hi <b>Dana</b>,\n\n<img src=x onerror=alert(1)> & "quotes"`);
  assert.doesNotMatch(email.html, /<script>|<img src=x|<b>Dana/);
  assert.match(email.html, /&lt;script&gt;/);
  assert.match(email.html, /&amp; &quot;quotes&quot;/);
  assert.match(email.text, /<img src=x onerror=alert\(1\)>/, "text version keeps what was typed");
});

test("blank lines make paragraphs, dash lines make lists, addresses become links", () => {
  const blocks = plainTextToBlocks("Hi Dana,\n\nPlease tell me:\n\n- the page\n- the values\n\nSee https://bacwater.ai/plan or write to hello@bacwater.ai.\nThanks");
  assert.deepEqual(blocks.map(b => b.type), ["paragraph", "paragraph", "list", "paragraph"]);
  const html = renderEmail({ subject: "s", preheader: "preview text here", blocks }).html;
  assert.match(html, /<li style="[^"]*">the page<\/li>/);
  assert.match(html, /<a href="https:\/\/bacwater\.ai\/plan"[^>]*>https:\/\/bacwater\.ai\/plan<\/a> or write to <a href="mailto:hello@bacwater\.ai"/);
  assert.match(html, /hello@bacwater\.ai<\/a>\.<br>Thanks/, "trailing period stays outside the link and line breaks are kept");
});

test("a lead-in line followed by dash lines becomes a paragraph and a list", () => {
  const blocks = plainTextToBlocks("Items:\n- 2× BAC Water (AMINO-H2O)\n- 1× BPC-157 (BPC-157)");
  assert.deepEqual(blocks, [{ type: "paragraph", text: "Items:" }, { type: "list", items: ["2× BAC Water (AMINO-H2O)", "1× BPC-157 (BPC-157)"] }]);
  assert.deepEqual(plainTextToBlocks("A line with - a dash inside"), [{ type: "paragraph", text: "A line with - a dash inside" }]);
});

test("contact replies keep the reply templates' greeting and a single team sign-off", () => {
  for (const t of REPLY_TEMPLATES) {
    const email = contactReplyEmail(t.subject("Question"), t.body("Dana Smith"));
    assert.match(email.text, /^Hi Dana,/);
    assert.equal((email.text.match(/The BACwater\.ai team/g) ?? []).length, 1, t.id);
    assert.doesNotMatch(t.body("Dana"), /reconstitution|deterministic/i, t.id);
  }
});

test("sender always shows the brand name", () => {
  assert.equal(senderAddress(undefined, "hello@bacwater.ai"), "BACwater.ai <hello@bacwater.ai>");
  assert.equal(senderAddress("orders@bacwater.ai", "x@y.z"), "BACwater.ai <orders@bacwater.ai>");
  assert.equal(senderAddress("BACwater.ai <hello@bacwater.ai>", "x@y.z"), "BACwater.ai <hello@bacwater.ai>");
});

test("supplier order time is readable and fixed to UTC", () => {
  assert.equal(formatOrderTime(new Date("2026-10-19T13:34:00Z")), "October 19, 2026 at 1:34 PM UTC");
});

console.log(`${count} email checks passed.`);
