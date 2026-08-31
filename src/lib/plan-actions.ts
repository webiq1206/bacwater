"use server";

import { z } from "zod";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { calculate, type CalcInput, type SyringeType } from "@/lib/calc";
import { defaultPlanName } from "@/lib/plan-name";

const inputSchema = z.object({
  name: z.string().max(120).optional().nullable(),
  peptideSlug: z.string().optional().nullable(),
  peptideName: z.string().optional().nullable(),
  vialStrengthMg: z.number().positive(),
  doseMcg: z.number().positive(),
  bacWaterMl: z.number().positive().optional(),
  syringeType: z.enum([
    "insulin-0.3ml",
    "insulin-0.5ml",
    "insulin-1ml",
    "tuberculin-1ml",
    "syringe-3ml",
  ]),
  injectionsPerWeek: z.number().min(1).max(28).optional().nullable(),
  dateMixed: z.string().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export async function computePlanAction(raw: unknown) {
  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid input.", issues: parsed.error.issues };
  }
  const result = calculate({
    peptideSlug: parsed.data.peptideSlug ?? undefined,
    peptideName: parsed.data.peptideName ?? undefined,
    vialStrengthMg: parsed.data.vialStrengthMg,
    doseMcg: parsed.data.doseMcg,
    injectionsPerWeek: parsed.data.injectionsPerWeek ?? undefined,
    bacWaterMl: parsed.data.bacWaterMl,
    syringeType: parsed.data.syringeType as SyringeType,
    dateMixed: parsed.data.dateMixed ?? null,
  });
  return { ok: true as const, result };
}

export async function savePlanAction(raw: unknown, notes?: string) {
  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false as const, error: "Invalid input." };

  const session = await auth();
  const input: CalcInput = {
    peptideSlug: parsed.data.peptideSlug ?? undefined,
    peptideName: parsed.data.peptideName ?? undefined,
    vialStrengthMg: parsed.data.vialStrengthMg,
    doseMcg: parsed.data.doseMcg,
    injectionsPerWeek: parsed.data.injectionsPerWeek ?? undefined,
    bacWaterMl: parsed.data.bacWaterMl,
    syringeType: parsed.data.syringeType as SyringeType,
    dateMixed: parsed.data.dateMixed ?? null,
  };
  const result = calculate(input);

  const publicId = nanoid(10);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  // For anonymous saves, issue a secret the saving device keeps; presenting it
  // later (after sign-in) proves this device created the plan and may claim it.
  const claimToken = userId ? null : nanoid(24);
  const name =
    (parsed.data.name && parsed.data.name.trim()) ||
    defaultPlanName({
      peptideName: result.input.peptideName,
      vialStrengthMg: result.input.vialStrengthMg,
      dateMixed: result.input.dateMixed ?? null,
    });
  const plan = await prisma.plan.create({
    data: {
      publicId,
      name,
      userId,
      claimToken,
      peptideSlug: result.input.peptideSlug,
      peptideName: result.input.peptideName,
      vialStrengthMg: result.input.vialStrengthMg,
      doseMcg: result.input.doseMcg,
      bacWaterMl: result.input.bacWaterMl,
      syringeType: result.input.syringeType,
      dateMixed: result.input.dateMixed ? new Date(result.input.dateMixed) : null,
      finalConcentrationMgPerMl: result.finalConcentrationMgPerMl,
      doseVolumeMl: result.doseVolumeMl,
      syringeUnits: result.syringeUnits,
      dosesPerVial: result.dosesPerVial,
      expirationDate: result.expiration.date ? new Date(result.expiration.date) : null,
      notes: notes || parsed.data.notes || null,
      data: JSON.stringify(result),
    },
  });

  revalidatePath("/plans");
  return {
    ok: true as const,
    publicId: plan.publicId,
    id: plan.id,
    // Lets the client route post-save: signed-in users go straight to My
    // Plans; signed-out users get a sign-in/create-account prompt.
    ownedByUser: Boolean(userId),
    // Only returned to the device that created the plan (this response).
    claimToken,
  };
}

/**
 * Attach plans that were saved on this device while signed out to the current
 * user's account. Requires the per-plan claim token issued at save time as
 * proof this device created the plan — knowing a shared plan URL is not
 * enough. Atomic per plan: `claimed` reflects only rows actually updated.
 */
export async function claimDevicePlansAction(
  claims: Array<{ publicId: string; claimToken: string }>
) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return { ok: false as const, error: "Not signed in.", claimed: [] as string[] };

  const valid = Array.isArray(claims)
    ? claims
        .filter(
          (c) =>
            c &&
            typeof c.publicId === "string" &&
            c.publicId.length > 0 &&
            typeof c.claimToken === "string" &&
            c.claimToken.length > 0
        )
        .slice(0, 100)
    : [];
  if (valid.length === 0) return { ok: true as const, claimed: [] as string[] };

  const claimed: string[] = [];
  for (const c of valid) {
    // updateMany's where clause makes the token check + ownership assignment a
    // single atomic statement; count tells us whether we actually won the row.
    const res = await prisma.plan.updateMany({
      where: { publicId: c.publicId, userId: null, claimToken: c.claimToken },
      data: { userId, claimToken: null },
    });
    if (res.count === 1) claimed.push(c.publicId);
  }
  if (claimed.length > 0) revalidatePath("/plans");
  return { ok: true as const, claimed };
}

export async function updatePlanNotesAction(publicId: string, notes: string) {
  const session = await auth();
  const plan = await prisma.plan.findUnique({ where: { publicId } });
  if (!plan) return { ok: false as const };
  if (plan.userId && plan.userId !== (session?.user as { id?: string } | undefined)?.id)
    return { ok: false as const, error: "Not authorized." };
  await prisma.plan.update({ where: { id: plan.id }, data: { notes } });
  revalidatePath(`/plan/${publicId}`);
  return { ok: true as const };
}

export async function updatePlanNameAction(publicId: string, name: string) {
  const session = await auth();
  const plan = await prisma.plan.findUnique({ where: { publicId } });
  if (!plan) return { ok: false as const };
  if (plan.userId && plan.userId !== (session?.user as { id?: string } | undefined)?.id)
    return { ok: false as const, error: "Not authorized." };
  const trimmed = name.trim().slice(0, 120);
  await prisma.plan.update({
    where: { id: plan.id },
    data: {
      name:
        trimmed ||
        defaultPlanName({
          peptideName: plan.peptideName,
          vialStrengthMg: plan.vialStrengthMg,
          dateMixed: plan.dateMixed ? plan.dateMixed.toISOString().slice(0, 10) : null,
        }),
    },
  });
  revalidatePath(`/plan/${publicId}`);
  revalidatePath("/plans");
  return { ok: true as const };
}

export async function togglePlanArchivedAction(publicId: string) {
  const session = await auth();
  const plan = await prisma.plan.findUnique({ where: { publicId } });
  if (!plan) return { ok: false as const };
  if (plan.userId && plan.userId !== (session?.user as { id?: string } | undefined)?.id)
    return { ok: false as const };
  await prisma.plan.update({ where: { id: plan.id }, data: { archived: !plan.archived } });
  revalidatePath("/plans");
  return { ok: true as const, archived: !plan.archived };
}

export async function deletePlanAction(publicId: string) {
  const session = await auth();
  const plan = await prisma.plan.findUnique({ where: { publicId } });
  if (!plan) return;
  if (plan.userId && plan.userId !== (session?.user as { id?: string } | undefined)?.id)
    return;
  await prisma.plan.delete({ where: { id: plan.id } });
  revalidatePath("/plans");
  redirect("/plans");
}

export async function duplicatePlanAction(publicId: string) {
  const plan = await prisma.plan.findUnique({ where: { publicId } });
  if (!plan) return { ok: false as const };
  const session = await auth();
  const newPublicId = nanoid(10);
  const created = await prisma.plan.create({
    data: {
      publicId: newPublicId,
      name: plan.name ? `${plan.name} (copy)`.slice(0, 120) : null,
      userId: (session?.user as { id?: string } | undefined)?.id ?? plan.userId,
      peptideSlug: plan.peptideSlug,
      peptideName: plan.peptideName,
      vialStrengthMg: plan.vialStrengthMg,
      doseMcg: plan.doseMcg,
      bacWaterMl: plan.bacWaterMl,
      syringeType: plan.syringeType,
      dateMixed: null,
      finalConcentrationMgPerMl: plan.finalConcentrationMgPerMl,
      doseVolumeMl: plan.doseVolumeMl,
      syringeUnits: plan.syringeUnits,
      dosesPerVial: plan.dosesPerVial,
      expirationDate: null,
      notes: plan.notes,
      data: plan.data,
    },
  });
  revalidatePath("/plans");
  return { ok: true as const, publicId: created.publicId };
}

/**
 * Load one plan's full stored snapshot for the My Plans workspace.
 *
 * The list ships summary rows only — a `CalcResult` blob per plan would make
 * the page heavy for anyone with a lot of them — so the selected plan's detail
 * is fetched here on demand.
 *
 * Owned plans are restricted to their owner. Unowned (guest) plans stay
 * readable, which matches /plan/[id] already being link-accessible.
 */
export async function getPlanDetailAction(publicId: string) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const plan = await prisma.plan.findUnique({ where: { publicId } });
  if (!plan) return { ok: false as const, error: "Plan not found." };
  if (plan.userId && plan.userId !== userId)
    return { ok: false as const, error: "Not authorized." };

  let result: unknown = null;
  try {
    result = JSON.parse(plan.data);
  } catch {
    // A corrupt snapshot shouldn't blank the pane; the caller falls back to
    // the plan's own columns.
    result = null;
  }

  return {
    ok: true as const,
    plan: {
      publicId: plan.publicId,
      name: plan.name,
      peptideName: plan.peptideName,
      notes: plan.notes ?? "",
      archived: plan.archived,
      vialStrengthMg: plan.vialStrengthMg,
      doseMcg: plan.doseMcg,
      dosesPerVial: plan.dosesPerVial,
      dateMixed: plan.dateMixed?.toISOString() ?? null,
      expirationDate: plan.expirationDate?.toISOString() ?? null,
      createdAt: plan.createdAt.toISOString(),
      result,
    },
  };
}

/**
 * Same authorization as `deletePlanAction`, but returns instead of
 * redirecting, so the workspace can drop the row and advance the selection
 * without a full page navigation.
 */
export async function removePlanAction(publicId: string) {
  const session = await auth();
  const plan = await prisma.plan.findUnique({ where: { publicId } });
  if (!plan) return { ok: false as const, error: "Plan not found." };
  if (plan.userId && plan.userId !== (session?.user as { id?: string } | undefined)?.id)
    return { ok: false as const, error: "Not authorized." };
  await prisma.plan.delete({ where: { id: plan.id } });
  revalidatePath("/plans");
  return { ok: true as const };
}
