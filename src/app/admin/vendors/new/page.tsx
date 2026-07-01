import Page from "@/app/admin/vendors/[id]/page";
export const metadata = { title: "Admin · New vendor", robots: { index: false, follow: false } };
export default async function NewVendor() {
  return <Page params={Promise.resolve({ id: "new" })} />;
}
