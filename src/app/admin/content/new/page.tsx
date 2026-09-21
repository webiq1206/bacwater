import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/require-admin";

export const metadata = { title: "Admin · New content", robots: { index: false, follow: false } };

export default async function NewContentRedirect() {
  await requireAdminPage();
  redirect("/admin/content?new=1");
}
