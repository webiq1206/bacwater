import Page from "@/app/admin/products/[id]/page";
export const metadata = { title: "Admin · New product", robots: { index: false, follow: false } };
export default async function NewProduct() {
  return <Page params={Promise.resolve({ id: "new" })} />;
}
