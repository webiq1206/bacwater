import Page from "@/app/admin/content/[id]/page";
export const metadata = { title: "Admin · New content", robots: { index: false, follow: false } };
export default async function NewContent() {
  return <Page params={Promise.resolve({ id: "new" })} />;
}
