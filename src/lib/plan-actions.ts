"use server";

import { z } from "zod";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { calculate, type CalcInput, type SyringeType } from "@/lib/calc";

const inputSchema = z.object({
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
    bacWaterMl: parsed.data.bacWaterMl,
    syringeType: parsed.data.syringeType as SyringeType,
    dateMixed: parsed.data.dateMixed ?? null,
  };
  const result = calculate(input);

  const publicId = nanoid(10);
  const plan = await prisma.plan.create({
    data: {
      publicId,
      userId: (session?.user as { id?: string } | undefined)?.id ?? null,
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
  return { ok: true as const, publicId: plan.publicId, id: plan.id };
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
