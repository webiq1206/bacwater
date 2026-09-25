"use server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { takeActionBudget } from "@/lib/security/action-budget";
const schema = z.object({
  requestId: z.string().uuid(), name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254), subject: z.string().trim().max(200),
  message: z.string().trim().min(1).max(4000), website: z.literal(""),
});
export async function submitContactAction(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(["requestId", "name", "email", "subject", "message", "website"].map((key) => [key, formData.get(key) ?? ""])));
  if (!parsed.success) return { ok: false as const, error: "Check your name, email and message. Keep the message under 4,000 characters." };
  const { requestId, name, email, subject, message } = parsed.data;
  try {
    // Retrying an already saved request must work even after a limit is reached.
    const prior = await prisma.contactMessage.findUnique({ where: { id: requestId } });
    if (!prior && !await takeActionBudget("contact", email)) return { ok: false as const, error: "Messages are temporarily limited. Your text is still here. Please wait five minutes and try again." };
    // Unique primary key provides race-safe deduplication of the same submission.
    const stored = await prisma.contactMessage.upsert({ where: { id: requestId }, update: {}, create: { id: requestId, name, email, subject: subject || null, message } });
    if (stored.name !== name || stored.email !== email || (stored.subject || "") !== subject || stored.message !== message) return { ok: false as const, error: "An earlier version of this message was already saved. Refresh before sending a different message." };
    return { ok: true as const };
  } catch { return { ok: false as const, error: "Your message could not be saved. Your text is still here; please retry." }; }
}
