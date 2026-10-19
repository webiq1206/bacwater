import { plainTextToBlocks, renderEmail, type RenderedEmail } from "./layout";

/** Sent when someone asks to reset the password on a password-based account. */
export function passwordResetEmail(resetUrl: string): RenderedEmail {
  return renderEmail({
    subject: "Reset your BACwater.ai password",
    preheader: "Use this link within 30 minutes to choose a new password.",
    heading: "Reset your password",
    blocks: [
      { type: "paragraph", text: "We got a request to reset the password for your BACwater.ai account. Tap the button below to choose a new one." },
      { type: "button", label: "Choose a new password", href: resetUrl },
      { type: "note", text: "This link works once and expires in 30 minutes. After that, request a new link from the sign-in page." },
      { type: "link", label: "Button not working? Copy and paste this link into your browser:", href: resetUrl },
      { type: "paragraph", text: "Didn't ask for this? You can ignore this email. Your password stays the same." },
    ],
    reason: "You're getting this because someone asked to reset the password for this email address.",
  });
}

/** A reply written by the team in the admin contact workspace. */
export function contactReplyEmail(subject: string, body: string): RenderedEmail {
  const blocks = plainTextToBlocks(body);
  // Skip a short greeting such as "Hi Dana," so the inbox preview shows the first real sentence.
  const first = blocks.find(b => b.type === "paragraph" && !/^(hi|hello|hey|dear)\b[^\n]{0,40}$/i.test(b.text.trim()));
  const preview = first && first.type === "paragraph" ? first.text.replace(/\s+/g, " ") : subject;
  return renderEmail({
    subject,
    preheader: preview.length > 110 ? `${preview.slice(0, 107).trimEnd()}...` : preview,
    blocks,
    reason: "You're getting this because you sent us a message through bacwater.ai/contact. Reply to this email to continue the conversation.",
  });
}

/** An order passed to a supplier, drafted from the supplier's template and editable before sending. */
export function supplierOrderEmail(subject: string, body: string): RenderedEmail {
  return renderEmail({
    subject,
    preheader: subject,
    heading: subject,
    blocks: plainTextToBlocks(body),
    reason: "Sent by the BACwater.ai orders team. Reply to this email with questions or a confirmation number.",
  });
}

/** Readable order time for supplier emails, in UTC so it never shifts by server. */
export function formatOrderTime(date: Date): string {
  return `${new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeStyle: "short", timeZone: "UTC" }).format(date)} UTC`;
}
