import { prisma } from "@/lib/db";
import {
  ContactWorkspace,
  type ContactRecord,
  type SenderContext,
} from "@/components/admin/contact-workspace";

export const metadata = { title: "Admin · Contact", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: [{ handled: "asc" }, { createdAt: "desc" }],
    take: 500,
  });

  // Sender context, resolved in two queries rather than one per message, so
  // the right rail can answer "who is this" without another round trip.
  const emails = Array.from(new Set(messages.map((m) => m.email.toLowerCase())));
  const [users, counts] = await Promise.all([
    emails.length
      ? prisma.user.findMany({
          where: { email: { in: emails, mode: "insensitive" } },
          select: { email: true, createdAt: true, _count: { select: { plans: true } } },
        })
      : Promise.resolve([]),
    emails.length
      ? prisma.contactMessage.groupBy({
          by: ["email"],
          _count: { _all: true },
        })
      : Promise.resolve([] as Array<{ email: string; _count: { _all: number } }>),
  ]);

  const messageCounts = new Map(
    counts.map((c) => [c.email.toLowerCase(), c._count._all])
  );
  const senders: Record<string, SenderContext> = {};
  for (const email of emails) {
    const user = users.find((u) => u.email.toLowerCase() === email);
    senders[email] = {
      // "Prior" excludes the message currently on screen.
      priorMessages: Math.max(0, (messageCounts.get(email) ?? 1) - 1),
      hasAccount: Boolean(user),
      accountCreatedAt: user?.createdAt.toISOString() ?? null,
      planCount: user?._count.plans ?? 0,
    };
  }

  const records: ContactRecord[] = messages.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    handled: m.handled,
    handledAt: m.handledAt?.toISOString() ?? null,
    handledByEmail: m.handledByEmail,
    internalNotes: m.internalNotes,
    repliedAt: m.repliedAt?.toISOString() ?? null,
    replySubject: m.replySubject,
    replyBody: m.replyBody,
    createdAt: m.createdAt.toISOString(),
  }));

  return <ContactWorkspace messages={records} senders={senders} />;
}
