import { redirect } from "next/navigation";

export const metadata = { title: "Admin · New content", robots: { index: false, follow: false } };

export default function NewContentRedirect() {
  redirect("/admin/content?new=1");
}
