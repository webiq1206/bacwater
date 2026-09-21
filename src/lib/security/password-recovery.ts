import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { newPasswordSchema } from "./password-policy";

export const RESET_LIFETIME_MS = 30 * 60 * 1000;
export const resetDigest = (token: string) => createHash("sha256").update(token).digest("hex");
export const resetIdentifier = (userId: string) => `password-reset:${userId}`;
export function recoveryOrigin(): string {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bacwater.ai");
  if (url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("Invalid recovery origin.");
  const local = ["127.0.0.1", "localhost"].includes(url.hostname);
  if (url.protocol !== "https:" && !(local && url.protocol === "http:")) throw new Error("Recovery requires HTTPS.");
  return url.origin;
}
/** Return the bearer secret only to trusted server delivery code. */
export async function createResetToken(email: string, now = new Date()) {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() }, select: { id: true, email: true, hashedPassword: true } });
  if (!user?.hashedPassword) return null;
  const origin = recoveryOrigin();
  const token = randomBytes(32).toString("hex"), identifier = resetIdentifier(user.id);
  const created = await prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${user.id} FOR UPDATE`;
    if (!(await tx.user.findUnique({ where: { id: user.id }, select: { hashedPassword: true } }))?.hashedPassword) return false;
    await tx.verificationToken.deleteMany({ where: { identifier } });
    await tx.verificationToken.create({ data: { identifier, token: resetDigest(token), expires: new Date(now.getTime() + RESET_LIFETIME_MS) } });
    return true;
  });
  return created ? { token, email: user.email, url: `${origin}/reset-password#token=${token}` } : null;
}
export async function consumeResetToken(token: string, password: string, now = new Date()): Promise<{ email: string } | null> {
  if (!/^[a-f0-9]{64}$/.test(token) || !newPasswordSchema.safeParse(password).success) return null;
  const digest = resetDigest(token);
  const record = await prisma.verificationToken.findUnique({ where: { token: digest } });
  if (!record || !record.identifier.startsWith("password-reset:") || record.expires <= now) return null;
  const hashedPassword = await bcrypt.hash(password, 12), userId = record.identifier.slice("password-reset:".length);
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${userId} FOR UPDATE`;
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user?.hashedPassword) return null;
    const consumed = await tx.verificationToken.deleteMany({ where: { identifier: record.identifier, token: digest, expires: { gt: now } } });
    if (consumed.count !== 1) return null;
    await tx.user.update({ where: { id: user.id }, data: { hashedPassword, authVersion: { increment: 1 }, emailVerified: user.emailVerified || now } });
    await tx.session.deleteMany({ where: { userId } });
    await tx.verificationToken.deleteMany({ where: { identifier: record.identifier } });
    return { email: user.email };
  });
}
