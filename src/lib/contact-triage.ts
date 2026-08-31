/**
 * Deterministic triage for inbound contact messages.
 *
 * The workspace uses this to pre-answer the two decisions an admin makes on
 * every message — what kind of message is this, and what do I say back — so
 * the common case is one keystroke instead of a blank textarea. It is plain
 * keyword matching on purpose: no model call, no latency, and the admin can
 * always see and edit what it suggested before anything is sent.
 */

export type ContactTopic =
  | "calculation"
  | "medical"
  | "privacy"
  | "bug"
  | "partnership"
  | "general";

export interface ContactFlag {
  id: string;
  label: string;
  detail: string;
  severity: "blocker" | "warning";
}

interface Rule {
  topic: ContactTopic;
  patterns: RegExp[];
}

// Order matters: the first rule that matches wins, so the narrow, high-stakes
// categories are checked before the broad ones.
const RULES: Rule[] = [
  {
    topic: "medical",
    patterns: [
      /\bshould i (take|use|inject|try|start|stop)\b/i,
      /\b(is|are) (it|this|they) safe\b/i,
      /\b(side effects?|adverse|reaction|prescri\w+|diagnos\w+|treat(ment|ing)?)\b/i,
      /\b(my|the) doctor\b/i,
    ],
  },
  {
    topic: "privacy",
    patterns: [
      /\b(delete|erase|remove) (my|all my|the) (data|account|information|plans?)\b/i,
      /\b(gdpr|ccpa|right to be forgotten|data request|privacy request)\b/i,
      /\bunsubscribe\b/i,
    ],
  },
  {
    topic: "bug",
    patterns: [
      /\b(bug|error|broken|crash\w*|not working|doesn'?t work|won'?t load|blank (page|screen)|500|404)\b/i,
      /\b(wrong|incorrect) (answer|number|result|math|calculation)\b/i,
      // "the answer is wrong", "my total doesn't match" — the complaint and the
      // noun are usually separated by a few words, so match across the gap too.
      /\b(answer|number|result|math|calculation|total)s?\b[^.?!]{0,40}\b(wrong|incorrect|off by|doesn'?t match|does not match)\b/i,
    ],
  },
  {
    topic: "partnership",
    patterns: [
      /\b(partner\w*|affiliate|sponsor\w*|advertis\w*|guest post|backlink|collaborat\w*|press|media enquir\w*|interview)\b/i,
      /\b(wholesale|bulk order|distribut\w*)\b/i,
    ],
  },
  {
    topic: "calculation",
    patterns: [
      /\b(bac(teriostatic)? water|reconstitut\w*|dilut\w*|syringe|units?|vial|mcg|\bmg\b|dose|dosing|concentration|half.?life|expir\w*|shelf life)\b/i,
      /\b(calculator|plan|planner)\b/i,
    ],
  },
];

export interface ClassifiedContact {
  topic: ContactTopic;
  /** True when nothing matched and "general" is a fallback, not a finding. */
  isFallback: boolean;
  flags: ContactFlag[];
}

export function classifyContactMessage(input: {
  subject?: string | null;
  message: string;
}): ClassifiedContact {
  const haystack = `${input.subject ?? ""}\n${input.message}`;

  let topic: ContactTopic = "general";
  let isFallback = true;
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(haystack))) {
      topic = rule.topic;
      isFallback = false;
      break;
    }
  }

  const flags: ContactFlag[] = [];
  if (topic === "medical") {
    flags.push({
      id: "medical",
      label: "Medical advice request",
      detail:
        "Reads as a request for medical guidance. BACwater.ai is not a medical service — answer the tool question only and refer them to a clinician.",
      severity: "blocker",
    });
  }
  if (/\b(refund|charge|payment|invoice|order|shipped|shipping)\b/i.test(haystack)) {
    flags.push({
      id: "commerce",
      label: "Asks about an order",
      detail:
        "Mentions an order or payment. The site sells nothing today, so this is likely a mistaken sender or a phishing probe — verify before replying.",
      severity: "warning",
    });
  }
  if (input.message.trim().length < 25) {
    flags.push({
      id: "thin",
      label: "Very short message",
      detail: "Not much to go on. Consider asking what they were trying to do.",
      severity: "warning",
    });
  }
  if (/https?:\/\//i.test(input.message) && topic === "partnership") {
    flags.push({
      id: "links",
      label: "Contains links",
      detail: "Link-bearing outreach is usually SEO spam. Check before replying.",
      severity: "warning",
    });
  }

  return { topic, isFallback, flags };
}

export interface ReplyTemplate {
  id: ContactTopic;
  label: string;
  description: string;
  subject: (original?: string | null) => string;
  body: (senderName: string) => string;
}

function firstName(name: string): string {
  const trimmed = name.trim().split(/\s+/)[0];
  return trimmed || "there";
}

function re(original?: string | null): string {
  const s = (original ?? "").trim();
  if (!s) return "Re: your message to BACwater.ai";
  return /^re:/i.test(s) ? s : `Re: ${s}`;
}

const SIGNOFF = "\n\nBACwater.ai\nhttps://bacwater.ai";

export const REPLY_TEMPLATES: ReplyTemplate[] = [
  {
    id: "calculation",
    label: "Tool / calculation question",
    description: "Points them at the planner and offers to check their numbers.",
    subject: re,
    body: (name) =>
      `Hi ${firstName(name)},

Thanks for writing in.

The plan builder at https://bacwater.ai/plan will work this out end to end: enter the vial strength printed on your label, the amount you want to measure, and the syringe you have, and it returns the BAC water volume, the syringe reading, how many measures the vial yields, and a printable label. Every number is deterministic arithmetic, not an estimate.

If the numbers it gives you don't match what you expected, reply with the vial strength and the amount you're aiming for and I'll walk through the math with you.${SIGNOFF}`,
  },
  {
    id: "medical",
    label: "Medical question — decline and refer",
    description: "Declines to advise, keeps the door open for tool questions.",
    subject: re,
    body: (name) =>
      `Hi ${firstName(name)},

Thanks for writing in, and I'm sorry — this isn't something I can help with.

BACwater.ai is a calculation tool. It works out reconstitution volumes and syringe readings from numbers you supply. It is not a medical service, and we don't advise on whether a compound is appropriate for anyone, what amount to use, or how it might affect you. Please take those questions to a qualified clinician.

If you have a question about how the calculator itself works, I'm glad to answer that.${SIGNOFF}`,
  },
  {
    id: "privacy",
    label: "Data / privacy request",
    description: "Acknowledges the request and states what is held.",
    subject: re,
    body: (name) =>
      `Hi ${firstName(name)},

Thanks for reaching out — your request is noted and I'm handling it now.

For context on what exists: an account holds your email address and the reconstitution plans you chose to save. Plans saved without an account are held against a random link ID rather than a person. Nothing is sold or shared with advertisers.

I'll confirm here once the deletion is complete.${SIGNOFF}`,
  },
  {
    id: "bug",
    label: "Bug report",
    description: "Thanks them and asks for the details needed to reproduce.",
    subject: re,
    body: (name) =>
      `Hi ${firstName(name)},

Thanks for flagging this — genuinely useful.

So I can reproduce it, could you tell me:

- which page you were on (the full URL helps)
- the values you entered
- what you expected versus what you saw
- your browser and whether it was phone or desktop

If a calculation looks wrong, the exact vial strength and amount you entered is usually enough for me to trace it.${SIGNOFF}`,
  },
  {
    id: "partnership",
    label: "Partnership / press",
    description: "Short, polite decline of unsolicited outreach.",
    subject: re,
    body: (name) =>
      `Hi ${firstName(name)},

Thanks for the note. We aren't taking on guest posts, link exchanges, or sponsorship placements at the moment, so I'll pass on this one.

If you're working on something specific to peptide reconstitution accuracy, feel free to send the details and I'll take a look.${SIGNOFF}`,
  },
  {
    id: "general",
    label: "General acknowledgement",
    description: "Neutral reply when nothing more specific fits.",
    subject: re,
    body: (name) =>
      `Hi ${firstName(name)},

Thanks for writing in — I've read your message.

Could you tell me a little more about what you were trying to do? If it relates to a specific calculation, the vial strength on your label and the amount you're aiming to measure is usually all I need.${SIGNOFF}`,
  },
];

export function templateFor(topic: ContactTopic): ReplyTemplate {
  return (
    REPLY_TEMPLATES.find((t) => t.id === topic) ??
    REPLY_TEMPLATES[REPLY_TEMPLATES.length - 1]
  );
}

export const TOPIC_LABELS: Record<ContactTopic, string> = {
  calculation: "Tool question",
  medical: "Medical",
  privacy: "Privacy",
  bug: "Bug report",
  partnership: "Outreach",
  general: "General",
};
