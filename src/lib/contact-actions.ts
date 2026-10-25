"use server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { takeActionBudget } from "@/lib/security/action-budget";
import { parseVisitorPhone, validateAttachment } from "@/lib/contact-request";

const schema = z.object({
  requestId: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(1).max(40),
  message: z.string().trim().min(1).max(4000),
  website: z.literal(""),
});

const INVALID = "Check your name, phone, email, and note. Keep the note under 4,000 characters.";

/**
 * Saves a finished one-step request.
 * A visitor who leaves the form unfinished never calls this, and staff are not emailed.
 */
export async function submitContactAction(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(["requestId", "name", "email", "phone", "message", "website"].map((key) => [key, formData.get(key) ?? ""])));
  if (!parsed.success) return { ok: false as const, error: INVALID };
  const phone = parseVisitorPhone(parsed.data.phone);
  if (!phone) return { ok: false as const, error: "Enter a phone number with 7 to 15 digits." };
  const { requestId, name, email, message } = parsed.data;

  const rawFile = formData.get("attachment");
  let attachment: { name: string; type: string; bytes: Uint8Array } | null = null;
  if (rawFile instanceof File && rawFile.size > 0) {
    const bytes = new Uint8Array(await rawFile.arrayBuffer());
    const checked = validateAttachment({ name: rawFile.name, bytes });
    if (!checked.ok) return { ok: false as const, error: checked.error };
    attachment = { name: checked.name, type: checked.type, bytes };
  }

  try {
    // Retrying an already saved request must work even after a limit is reached.
    const prior = await prisma.contactMessage.findUnique({ where: { id: requestId } });
    if (!prior && !await takeActionBudget("contact", email)) return { ok: false as const, error: "Messages are temporarily limited. Your text is still here. Please wait five minutes and try again." };
    const stored = await prisma.contactMessage.upsert({
      where: { id: requestId },
      update: {},
      create: {
        id: requestId,
        name,
        email,
        phone,
        subject: null,
        message,
        attachmentName: attachment?.name ?? null,
        attachmentType: attachment?.type ?? null,
        attachment: attachment ? { create: { data: Buffer.from(attachment.bytes) } } : undefined,
      },
    });
    const same = stored.name === name
      && stored.email === email
      && (stored.phone || "") === phone
      && (stored.subject || "") === ""
      && stored.message === message
      && (stored.attachmentName || "") === (attachment?.name || "");
    if (!same) return { ok: false as const, error: "An earlier version of this message was already saved. Refresh before sending a different message." };
    return { ok: true as const, reference: stored.id };
  } catch {
    return { ok: false as const, error: "Your message could not be saved. Your text is still here; please retry." };
  }
}
