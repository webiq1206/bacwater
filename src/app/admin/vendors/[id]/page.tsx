import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { VendorForm } from "@/components/admin/vendor-form";

interface Props { params: Promise<{ id: string }>; }
export const metadata = { title: "Admin · Vendor edit", robots: { index: false, follow: false } };

export default async function EditVendor({ params }: Props) {
  const { id } = await params;
  const v = id === "new" ? null : await prisma.vendor.findUnique({ where: { id } });
  if (id !== "new" && !v) return notFound();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{v ? v.name : "New vendor"}</h1>
      <div className="mt-6">
        <VendorForm vendor={v ?? undefined} />
      </div>
    </div>
  );
}
