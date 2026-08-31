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

// ---------- Contact triage ----------

/**
 * Mark a message handled (or reopen it). Stamps who and when so the queue
 * shows whether a teammate already dealt with something.
 */
export async function setContactHandled(id: string, handled: boolean) {
  const session = await requireAdmin();
  const updated = await prisma.contactMessage.update({
    where: { id },
    data: {
      handled,
      handledAt: handled ? new Date() : null,
      handledByEmail: handled ? session.user?.email ?? null : null,
    },
  });
  revalidatePath("/admin/contact");
  revalidatePath("/admin");
  return { ok: true as const, handled: updated.handled };
}

export async function saveContactNotes(id: string, notes: string) {
  await requireAdmin();
  await prisma.contactMessage.update({
    where: { id },
    data: { internalNotes: notes.slice(0, 4000) || null },
  });
  revalidatePath("/admin/contact");
  return { ok: true as const };
}

/**
 * Send a reply from the workspace and close the message in one action.
 *
 * Mirrors the vendor-email behaviour: with no RESEND_API_KEY the draft is
 * still persisted and the message is NOT marked handled or replied, and the
 * caller is told plainly that nothing was sent. A silent no-op here would
 * look like a delivered reply.
 */
export async function replyToContact(id: string, subject: string, body: string) {
  const session = await requireAdmin();
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) return { ok: false as const, error: "Message not found." };
  if (!subject.trim() || !body.trim())
    return { ok: false as const, error: "Subject and body are both required." };

  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "hello@bacwater.ai";

  let sent = false;
  let failure: string | undefined;
  if (key) {
    try {
      const resend = new Resend(key);
      await resend.emails.send({ from, to: message.email, subject, text: body });
      sent = true;
    } catch (e) {
      console.error("Contact reply failed", e);
      failure = "Resend rejected the message. Draft saved.";
    }
  } else {
    failure = "RESEND_API_KEY is not set, so nothing was sent. Draft saved.";
  }

  await prisma.contactMessage.update({
    where: { id },
    data: {
      replySubject: subject,
      replyBody: body,
      ...(sent
        ? {
            repliedAt: new Date(),
            handled: true,
            handledAt: new Date(),
            handledByEmail: session.user?.email ?? null,
          }
        : {}),
    },
  });
  revalidatePath("/admin/contact");
  revalidatePath("/admin");
  return sent ? { ok: true as const } : { ok: false as const, error: failure };
}

export async function deleteContactMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/contact");
  revalidatePath("/admin");
  return { ok: true as const };
}

// ---------- Content workspace ----------

const contentBlockSchema = z.object({
  id: z.string().optional().nullable(),
  slug: z.string().min(1).max(160),
  kind: z.enum(["guide", "faq", "page"]),
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  published: z.boolean(),
});

export type ContentBlockInput = z.input<typeof contentBlockSchema>;

/**
 * Create-or-update that hands the saved row back.
 *
 * `upsertContent` above takes a FormData and returns only `{ ok }`, which
 * forced the old editor to redirect to the list to see its own result. The
 * workspace stays put instead, so it needs the persisted values (id, and the
 * server-side updatedAt) to reconcile its local queue.
 */
export async function saveContentBlock(input: ContentBlockInput) {
  await requireAdmin();
  const parsed = contentBlockSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid content." };
  const c = parsed.data;

  // Slug is unique in the database; catching it here gives a usable message
  // instead of an unhandled Prisma error in the action.
  const clash = await prisma.contentBlock.findUnique({ where: { slug: c.slug } });
  if (clash && clash.id !== c.id)
    return { ok: false as const, error: `The slug "${c.slug}" is already used by "${clash.title}".` };

  const data = {
    slug: c.slug,
    kind: c.kind,
    title: c.title,
    body: c.body,
    published: c.published,
  };
  // Capture the old slug before writing: renaming a block leaves the previous
  // /learn/<slug> route cached until it is revalidated too.
  const previousSlug = c.id
    ? (await prisma.contentBlock.findUnique({ where: { id: c.id }, select: { slug: true } }))?.slug
    : undefined;

  const saved = c.id
    ? await prisma.contentBlock.update({ where: { id: c.id }, data })
    : await prisma.contentBlock.create({ data });

  revalidatePath("/admin/content");
  revalidatePath("/admin");
  revalidatePath("/learn");
  revalidatePath(`/learn/${saved.slug}`);
  if (previousSlug && previousSlug !== saved.slug) revalidatePath(`/learn/${previousSlug}`);

  return {
    ok: true as const,
    block: {
      id: saved.id,
      slug: saved.slug,
      kind: saved.kind,
      title: saved.title,
      body: saved.body,
      published: saved.published,
      updatedAt: saved.updatedAt.toISOString(),
    },
  };
}

export async function toggleContentPublished(id: string) {
  await requireAdmin();
  const block = await prisma.contentBlock.findUnique({ where: { id } });
  if (!block) return { ok: false as const, error: "Not found." };
  const updated = await prisma.contentBlock.update({
    where: { id },
    data: { published: !block.published },
  });
  revalidatePath("/admin/content");
  revalidatePath("/admin");
  revalidatePath("/learn");
  revalidatePath(`/learn/${updated.slug}`);
  return { ok: true as const, published: updated.published };
}

// ---------- Plans ----------

/**
 * Fetch one plan's full stored snapshot for the admin workspace.
 *
 * The queue only ships summary rows: a `CalcResult` blob per plan across 200
 * plans would be megabytes of payload for data the admin will look at one row
 * at a time. This loads the selected row on demand instead.
 */
export async function getAdminPlanDetail(publicId: string) {
  await requireAdmin();
  const plan = await prisma.plan.findUnique({
    where: { publicId },
    include: { user: { select: { id: true, email: true, name: true, role: true, createdAt: true } } },
  });
  if (!plan) return { ok: false as const, error: "Plan not found." };

  let result: unknown = null;
  let parseError: string | null = null;
  try {
    result = JSON.parse(plan.data);
  } catch {
    // Older or truncated rows exist; the workspace falls back to the
    // denormalised columns rather than blowing up the pane.
    parseError = "The stored calculation snapshot could not be parsed.";
  }

  return {
    ok: true as const,
    plan: {
      publicId: plan.publicId,
      name: plan.name,
      notes: plan.notes,
      archived: plan.archived,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
      peptideName: plan.peptideName,
      vialStrengthMg: plan.vialStrengthMg,
      doseMcg: plan.doseMcg,
      bacWaterMl: plan.bacWaterMl,
      syringeType: plan.syringeType,
      syringeUnits: plan.syringeUnits,
      dosesPerVial: plan.dosesPerVial,
      dateMixed: plan.dateMixed?.toISOString() ?? null,
      expirationDate: plan.expirationDate?.toISOString() ?? null,
      owner: plan.user
        ? {
            id: plan.user.id,
            email: plan.user.email,
            name: plan.user.name,
            role: plan.user.role,
            createdAt: plan.user.createdAt.toISOString(),
          }
        : null,
      result,
      parseError,
    },
  };
}

export async function setPlanArchivedAsAdmin(publicId: string, archived: boolean) {
  await requireAdmin();
  await prisma.plan.update({ where: { publicId }, data: { archived } });
  revalidatePath("/admin/plans");
  revalidatePath("/plans");
  return { ok: true as const, archived };
}

export async function deletePlanAsAdmin(publicId: string) {
  await requireAdmin();
  await prisma.plan.delete({ where: { publicId } });
  revalidatePath("/admin/plans");
  revalidatePath("/admin");
  revalidatePath("/plans");
  return { ok: true as const };
}
