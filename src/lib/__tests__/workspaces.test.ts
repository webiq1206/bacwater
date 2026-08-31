/**
 * Assertions for the pure logic behind the processing workspaces: the contact
 * triage classifier and the content publishing checks. Both pre-answer a
 * decision for the admin, so a silent regression would mean the workspace
 * confidently suggests the wrong thing. Runs offline. Run with:
 *   npx tsx src/lib/__tests__/workspaces.test.ts
 */
import {
  classifyContactMessage,
  templateFor,
  REPLY_TEMPLATES,
} from "@/lib/contact-triage";
import { contentChecks, extractMetaDescription } from "@/lib/content/checks";

let failures = 0;
function check(cond: boolean, label: string) {
  if (cond) {
    console.log(`OK   ${label}`);
  } else {
    console.error(`FAIL ${label}`);
    failures++;
  }
}

// ---- Contact triage: topic routing ----------------------------------------

const TOPIC_CASES: Array<[string, string]> = [
  ["How much BPC-157 should I take each day?", "medical"],
  ["Is this safe to use with my other meds?", "medical"],
  ["My doctor asked what concentration this is", "medical"],
  ["Please delete my account and all my data", "privacy"],
  ["GDPR data request", "privacy"],
  ["The calculator page is broken and shows a blank screen", "bug"],
  ["I think the answer is wrong, the math gives me a different number", "bug"],
  ["We'd love to sponsor a guest post on your site", "partnership"],
  ["How much BAC water do I add to a 5mg vial?", "calculation"],
  ["What does the unit reading on the syringe mean?", "calculation"],
];

for (const [message, expected] of TOPIC_CASES) {
  const got = classifyContactMessage({ message });
  check(got.topic === expected, `routes "${message.slice(0, 42)}…" → ${expected} (got ${got.topic})`);
}

check(
  classifyContactMessage({ message: "Hello, I had a question about your website generally." }).isFallback,
  "unmatched message falls back to general"
);

// Medical outranks calculation: the message below matches both vocabularies,
// and mis-routing it would hand the admin a template that answers a dosing
// question the site must not answer.
check(
  classifyContactMessage({
    message: "Should I take 250mcg per dose from a 5mg vial?",
  }).topic === "medical",
  "medical wording outranks calculation wording"
);

// ---- Contact triage: flags -------------------------------------------------

check(
  classifyContactMessage({ message: "Should I take this daily?" }).flags.some(
    (f) => f.id === "medical" && f.severity === "blocker"
  ),
  "medical request raises a blocker flag"
);
check(
  classifyContactMessage({ message: "Where is my order, I want a refund" }).flags.some(
    (f) => f.id === "commerce"
  ),
  "order/refund wording raises the commerce flag"
);
check(
  classifyContactMessage({ message: "hi" }).flags.some((f) => f.id === "thin"),
  "very short message is flagged as thin"
);

// ---- Contact triage: templates --------------------------------------------

check(
  REPLY_TEMPLATES.every((t) => t.body("Dana").includes("Dana")),
  "every template greets the sender by first name"
);
check(
  templateFor("medical").body("Sam").toLowerCase().includes("not a medical service"),
  "the medical template declines rather than advising"
);
check(templateFor("general").subject("Question") === "Re: Question", "subject gains one Re:");
check(templateFor("general").subject("Re: Question") === "Re: Question", "Re: is not doubled");
check(
  templateFor("general").subject(null).startsWith("Re:"),
  "a missing subject still produces a usable one"
);

// ---- Content checks --------------------------------------------------------

const GOOD_BODY = `Bacteriostatic water is sterile water containing 0.9 percent benzyl alcohol, which lets a vial be entered more than once without the contents spoiling between uses.

## How much to add

- Match the volume to the amount you measure
- Keep the concentration easy to read on the syringe

More detail follows in the sections below, covering storage and shelf life in practice.`;

const okChecks = contentChecks({
  title: "How to reconstitute peptides with BAC water",
  slug: "reconstitute-peptides-bac-water",
  kind: "guide",
  body: GOOD_BODY,
  published: true,
});
check(
  okChecks.every((c) => c.status !== "block"),
  "a well-formed published guide has no blockers"
);

const blocked = contentChecks({
  title: "",
  slug: "Not A Slug",
  kind: "guide",
  body: GOOD_BODY,
  published: true,
});
check(
  blocked.some((c) => c.id === "title-missing" && c.status === "block"),
  "an empty title blocks publishing"
);
check(
  blocked.some((c) => c.id === "slug-shape" && c.status === "block"),
  "a non-URL-safe slug blocks publishing"
);
check(blocked[0].status === "block", "blockers sort ahead of warnings and passes");

check(
  contentChecks({
    title: "A perfectly reasonable guide title here",
    slug: "taken-slug",
    kind: "guide",
    body: GOOD_BODY,
    published: true,
    takenSlugs: ["taken-slug"],
  }).some((c) => c.id === "slug-taken" && c.status === "block"),
  "a slug already in use blocks publishing"
);

check(
  contentChecks({
    title: "A perfectly reasonable guide title here",
    slug: "draft-guide",
    kind: "guide",
    body: GOOD_BODY,
    published: false,
  }).some((c) => c.id === "unpublished"),
  "an unpublished row says so"
);

check(
  contentChecks({
    title: "A perfectly reasonable guide title here",
    slug: "headless",
    kind: "guide",
    body: "Just one flowing paragraph of prose with no section headings anywhere in it at all, which is the case being checked here.",
    published: true,
  }).some((c) => c.id === "no-headings"),
  "a guide with no ## sections is flagged"
);

// The description the editor previews must be the one the live page emits:
// headings and lists are skipped in favour of the first real sentence.
check(
  extractMetaDescription(GOOD_BODY).startsWith("Bacteriostatic water is sterile water"),
  "meta description comes from the first real paragraph"
);
check(
  extractMetaDescription("## Heading only\n\n- a list item\n\nThe first real sentence lives here and is long enough to use.")
    .startsWith("The first real sentence"),
  "meta description skips headings and list items"
);
check(extractMetaDescription(GOOD_BODY).length <= 160, "meta description stays within 160 characters");

if (failures > 0) {
  console.error(`\n${failures} workspace assertion(s) failed.`);
  process.exit(1);
}
console.log("\nAll workspace logic tests passed.");
