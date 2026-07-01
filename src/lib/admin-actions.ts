"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Resend } from "resend";

async function requireAdmin() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "admin")
    throw new Error("Forbidden");
  return session!;
}

// ---------- Orders ----------

export async function updateOrderStatus(publicId: string, status: string, notes?: string) {
  await requireAdmin();
  await prisma.order.update({
    where: { publicId },
    data: {
      status,
      ...(notes !== undefined ? { internalNotes: notes } : {}),
    },
  });
  revalidatePath(`/admin/orders/${publicId}`);
  revalidatePath(`/admin/orders`);
  revalidatePath(`/admin`);
  return { ok: true };
}

export async function updateOrderNotes(publicId: string, notes: string) {
  await requireAdmin();
  await prisma.order.update({ where: { publicId }, data: { internalNotes: notes } });
  revalidatePath(`/admin/orders/${publicId}`);
  return { ok: true };
}

// ---------- Vendors ----------

const vendorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  contactEmail: z.string().email(),
  phone: z.string().optional().nullable(),
  productsSupplied: z.string().optional().nullable(),
  emailTemplate: z.string().min(10),
  notes: z.string().optional().nullable(),
  active: z.coerce.boolean().optional(),
});

export async function upsertVendor(formData: FormData) {
  await requireAdmin();
  const parsed = vendorSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, error: "Invalid vendor input." };
  const data = parsed.data;
  if (data.id) {
    await prisma.vendor.update({
      where: { id: data.id },
      data: {
        name: data.name,
        contactEmail: data.contactEmail,
        phone: data.phone ?? null,
        productsSupplied: data.productsSupplied ?? null,
        emailTemplate: data.emailTemplate,
        notes: data.notes ?? null,
        active: data.active ?? true,
      },
    });
  } else {
    await prisma.vendor.create({
      data: {
        name: data.name,
        contactEmail: data.contactEmail,
        phone: data.phone ?? null,
        productsSupplied: data.productsSupplied ?? null,
        emailTemplate: data.emailTemplate,
        notes: data.notes ?? null,
        active: data.active ?? true,
      },
    });
  }
  revalidatePath("/admin/vendors");
  return { ok: true };
}

export async function deleteVendor(id: string) {
  await requireAdmin();
  await prisma.vendor.delete({ where: { id } });
  revalidatePath("/admin/vendors");
}

// ---------- Vendor submissions ----------

function renderTemplate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export async function draftVendorSubmission(orderPublicId: string, vendorId: string) {
  await requireAdmin();
  const [order, vendor] = await Promise.all([
    prisma.order.findUnique({
      where: { publicId: orderPublicId },
      include: { items: true },
    }),
    prisma.vendor.findUnique({ where: { id: vendorId } }),
  ]);
  if (!order || !vendor) throw new Error("Not found");

  const itemsBlock = order.items
    .map((i) => `- ${i.quantity}× ${i.productName} (${i.sku})`)
    .join("\n");
  const shipTo = [
    order.shippingName,
    order.shippingAddress1,
    order.shippingAddress2,
    `${order.shippingCity ?? ""}, ${order.shippingState ?? ""} ${order.shippingPostal ?? ""}`.trim(),
    order.shippingCountry,
    order.shippingPhone ? `Phone: ${order.shippingPhone}` : "",
  ].filter(Boolean).join("\n");

  const body = renderTemplate(vendor.emailTemplate, {
    vendor_name: vendor.name,
    order_id: order.publicId,
    items: itemsBlock,
    ship_to: shipTo,
    customer_email: order.email,
    placed_at: order.createdAt.toISOString(),
  });
  const subject = `Order ${order.publicId} - BACwater.ai`;

  await prisma.order.update({
    where: { id: order.id },
    data: { vendorStatus: "queued" },
  });

  const submission = await prisma.vendorSubmission.create({
    data: {
      orderId: order.id,
      vendorId: vendor.id,
      status: "draft",
      subject,
      body,
    },
  });
  revalidatePath(`/admin/orders/${orderPublicId}`);
  return { ok: true, submissionId: submission.id };
}

export async function sendVendorSubmission(submissionId: string, editedBody?: string, editedSubject?: string) {
  const session = await requireAdmin();
  const submission = await prisma.vendorSubmission.findUnique({
    where: { id: submissionId },
    include: { vendor: true, order: true },
  });
  if (!submission) throw new Error("Not found");

  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "orders@bacwater.ai";
  const subject = editedSubject ?? submission.subject;
  const body = editedBody ?? submission.body;

  let sent = false;
  if (key) {
    try {
      const resend = new Resend(key);
      await resend.emails.send({
        from,
        to: submission.vendor.contactEmail,
        subject,
        text: body,
      });
      sent = true;
    } catch (e) {
      console.error("Vendor email failed", e);
    }
  }

  await prisma.vendorSubmission.update({
    where: { id: submissionId },
    data: {
      status: sent ? "sent" : "failed",
      sentAt: sent ? new Date() : null,
      sentByEmail: session.user?.email ?? null,
      subject,
      body,
    },
  });
  await prisma.order.update({
    where: { id: submission.orderId },
    data: { vendorStatus: sent ? "submitted" : "queued" },
  });

  revalidatePath(`/admin/orders/${submission.order.publicId}`);
  return { ok: sent, error: sent ? undefined : "Email did not send. Check RESEND_API_KEY. Draft saved." };
}

export async function markVendorConfirmed(submissionId: string, ref: string) {
  await requireAdmin();
  const s = await prisma.vendorSubmission.findUnique({ where: { id: submissionId }, include: { order: true } });
  if (!s) return;
  await prisma.vendorSubmission.update({
    where: { id: submissionId },
    data: { status: "confirmed", confirmationRef: ref },
  });
  await prisma.order.update({
    where: { id: s.orderId },
    data: { vendorStatus: "confirmed" },
  });
  revalidatePath(`/admin/orders/${s.order.publicId}`);
}

// ---------- Products ----------

const productSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  useCase: z.string().optional().nullable(),
  priceCents: z.coerce.number().int().positive(),
  imageUrl: z.string().optional().nullable(),
  inventory: z.coerce.number().int().min(0),
  active: z.coerce.boolean().optional(),
});

export async function upsertProduct(formData: FormData) {
  await requireAdmin();
  const parsed = productSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    active: formData.get("active") === "on",
  });
  if (!parsed.success) return { ok: false, error: "Invalid product." };
  const p = parsed.data;
  if (p.id) {
    await prisma.product.update({ where: { id: p.id }, data: {
      slug: p.slug, sku: p.sku, name: p.name, category: p.category,
      description: p.description, useCase: p.useCase ?? null,
      priceCents: p.priceCents, imageUrl: p.imageUrl ?? null,
      inventory: p.inventory, active: p.active ?? true,
    }});
  } else {
    await prisma.product.create({ data: {
      slug: p.slug, sku: p.sku, name: p.name, category: p.category,
      description: p.description, useCase: p.useCase ?? null,
      priceCents: p.priceCents, imageUrl: p.imageUrl ?? null,
      inventory: p.inventory, active: p.active ?? true,
    }});
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { ok: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { active: false } });
  revalidatePath("/admin/products");
}

// ---------- Content ----------

const contentSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1),
  kind: z.enum(["guide", "faq", "page"]),
  title: z.string().min(1),
  body: z.string().min(1),
  published: z.coerce.boolean().optional(),
});

export async function upsertContent(formData: FormData) {
  await requireAdmin();
  const parsed = contentSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { ok: false, error: "Invalid content." };
  const c = parsed.data;
  if (c.id) {
    await prisma.contentBlock.update({ where: { id: c.id }, data: c });
  } else {
    await prisma.contentBlock.create({ data: c });
  }
  revalidatePath("/admin/content");
  revalidatePath(`/learn/${c.slug}`);
  return { ok: true };
}

export async function deleteContent(id: string) {
  await requireAdmin();
  await prisma.contentBlock.delete({ where: { id } });
  revalidatePath("/admin/content");
}

// ---------- Users ----------

export async function setUserRole(userId: string, role: "user" | "admin") {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}
