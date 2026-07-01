import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

interface Props { params: Promise<{ id: string }>; }
export const metadata = { title: "Admin · Product edit", robots: { index: false, follow: false } };

export default async function EditProduct({ params }: Props) {
  const { id } = await params;
  const p = id === "new" ? null : await prisma.product.findUnique({ where: { id } });
  if (id !== "new" && !p) return notFound();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{p ? p.name : "New product"}</h1>
      <div className="mt-6">
        <ProductForm product={p ?? undefined} />
      </div>
    </div>
  );
}
