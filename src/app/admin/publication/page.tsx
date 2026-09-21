import Link from "next/link";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/require-admin";
import { flushIndexNow, indexNowEnabled } from "@/lib/seo/indexnow";

export const metadata = { title: "Admin: publishing status", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function retry() {
  "use server";
  await requireAdminPage();
  if (!indexNowEnabled()) return;
  await prisma.indexNowEvent.updateMany({
    where: { status: { in: ["pending", "blocked", "failed", "rejected"] } },
    data: { status: "pending", attempts: 0, nextAttemptAt: new Date() },
  });
  try {
    await flushIndexNow();
  } catch {
    console.error("Manual publication retry did not finish; events remain queued.");
  }
  revalidatePath("/admin/publication");
}

export default async function PublicationPage() {
  await requireAdminPage();
  const states = await prisma.indexNowEvent.groupBy({ by: ["status"], _count: true });
  const events = await prisma.indexNowEvent.findMany({ orderBy: { updatedAt: "desc" }, take: 100 });
  const enabled = indexNowEnabled();
  const retryable = states.some(s => ["pending", "blocked", "failed", "rejected"].includes(s.status) && s._count > 0);

  return (
    <section className="min-w-0">
      <h1 className="text-2xl font-semibold">Publishing status</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed">
        Publication changes update the website and its discovery files. IndexNow notifications are stored separately and retried on subsequent publishing activity or with the button below. A submitted or accepted notification does not mean a URL has been indexed.
      </p>
      <p className="mt-3 font-medium">Delivery: {enabled ? "enabled for bacwater.ai" : "disabled in this environment"}</p>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Notification counts">
        {states.length ? states.map(s => <span key={s.status} className="rounded-full border border-border px-3 py-1 text-sm">{s.status}: {s._count}</span>) : <p className="text-sm text-muted-foreground">No notification events yet.</p>}
      </div>
      <form action={retry} className="my-5">
        <button className="min-h-11 rounded-lg border border-border px-4 text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={!enabled || !retryable} aria-describedby="notification-retry-help">Retry pending notifications</button>
        <p id="notification-retry-help" className="mt-2 text-xs leading-relaxed text-muted-foreground">{!enabled ? "Delivery stays off outside the production site. Queued records are retained." : retryable ? "Retries up to 100 eligible notifications. Check their resulting statuses below." : "There are no failed or pending notifications to retry."}</p>
      </form>

      <h2 className="mb-3 text-base font-semibold">Latest notifications</h2>
      {events.length === 0 ? (
        <p className="rounded-xl border border-border p-5 text-sm">Publishing or changing a public article creates a notification here. Draft-only edits do not disclose their URL.</p>
      ) : (
        <>
          <ul className="space-y-3 md:hidden" aria-label="Publication notification queue">
            {events.map(e => (
              <li key={e.path} className="min-w-0 rounded-xl border border-border bg-card p-4">
                <p className="break-all text-sm font-medium leading-relaxed">{e.path}</p>
                <dl className="mt-3 grid grid-cols-3 gap-3 text-xs">
                  <div><dt className="text-muted-foreground">Status</dt><dd className="mt-1 font-medium">{e.status}</dd></div>
                  <div><dt className="text-muted-foreground">Attempts</dt><dd className="mt-1 tabular-nums">{e.attempts}</dd></div>
                  <div><dt className="text-muted-foreground">HTTP response</dt><dd className="mt-1">{e.lastStatus ?? "Not received"}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto rounded-xl border border-border md:block" role="region" aria-label="Publication notification queue" tabIndex={0}>
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Latest 100 publication notifications</caption>
              <thead><tr><th scope="col" className="p-3">Public path</th><th scope="col" className="p-3">Status</th><th scope="col" className="p-3">Attempts</th><th scope="col" className="p-3">HTTP response</th></tr></thead>
              <tbody>{events.map(e => <tr key={e.path} className="border-t border-border"><td className="p-3 break-all">{e.path}</td><td className="p-3">{e.status}</td><td className="p-3">{e.attempts}</td><td className="p-3">{e.lastStatus ?? "Not received"}</td></tr>)}</tbody>
            </table>
          </div>
        </>
      )}
      <p className="mt-5"><Link href="/admin/content" className="inline-flex min-h-11 items-center underline">Return to content</Link></p>
    </section>
  );
}
