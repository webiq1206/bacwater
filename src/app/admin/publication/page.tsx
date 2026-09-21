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
  await prisma.indexNowEvent.updateMany({ where: { status: { in: ["pending", "blocked", "failed", "rejected"] } }, data: { status: "pending", attempts: 0, nextAttemptAt: new Date() } });
  try { await flushIndexNow(); } catch { console.error("Manual publication retry did not finish; events remain queued."); }
  revalidatePath("/admin/publication");
}
export default async function PublicationPage() {
  await requireAdminPage();
  const states = await prisma.indexNowEvent.groupBy({ by: ["status"], _count: true });
  const events = await prisma.indexNowEvent.findMany({ orderBy: { updatedAt: "desc" }, take: 100 });
  return <section><h1 className="text-2xl font-semibold">Publishing status</h1><p className="mt-3 max-w-3xl text-sm">Publication changes update the website and its discovery files. IndexNow notifications are stored separately and retried on subsequent publishing activity or with the button below. A submitted or accepted notification does not mean a URL has been indexed.</p><p className="mt-3 font-medium">Delivery: {indexNowEnabled() ? "enabled for bacwater.ai" : "disabled in this environment"}</p><p className="mt-2 text-sm">{states.map(s => `${s.status}: ${s._count}`).join(" · ") || "No notification events yet."}</p><form action={retry} className="my-5"><button className="min-h-11 rounded-lg border px-4" type="submit">Retry pending notifications</button></form><div className="overflow-x-auto" role="region" aria-label="Publication notification queue" tabIndex={0}><table className="w-full text-left text-sm"><caption className="sr-only">Latest 100 publication notifications</caption><thead><tr><th scope="col" className="p-3">Public path</th><th scope="col" className="p-3">Status</th><th scope="col" className="p-3">Attempts</th><th scope="col" className="p-3">HTTP response</th></tr></thead><tbody>{events.map(e => <tr key={e.path} className="border-t"><td className="p-3 break-all">{e.path}</td><td className="p-3">{e.status}</td><td className="p-3">{e.attempts}</td><td className="p-3">{e.lastStatus ?? "Not received"}</td></tr>)}</tbody></table></div><p className="mt-5"><Link href="/admin/content" className="underline">Return to content</Link></p></section>;
}
