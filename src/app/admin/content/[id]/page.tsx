import { redirect } from "next/navigation";

interface Props { params: Promise<{ id: string }>; }

export const metadata = { title: "Admin · Content", robots: { index: false, follow: false } };

/**
 * Editing happens in the /admin/content workspace now — queue, editor, and
 * live preview on one screen. Old bookmarks land there with the row selected.
 */
export default async function ContentEditRedirect({ params }: Props) {
  const { id } = await params;
  redirect(id === "new" ? "/admin/content?new=1" : `/admin/content?id=${encodeURIComponent(id)}`);
}
