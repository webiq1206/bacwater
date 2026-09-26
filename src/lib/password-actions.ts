"use server";
import { after } from "next/server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { takeActionBudget } from "@/lib/security/action-budget";
import { signupSchema } from "@/lib/security/registration";
import { hashResetToken, newResetToken, RESET_TOKEN_PATTERN } from "@/lib/security/password-reset";
const neutral = { ok: true as const, message: "If this email has a password-based account, a reset link will arrive shortly. Check your spam folder. The link expires in 30 minutes." };
export async function requestPasswordReset(form: FormData) {
 const email = z.string().trim().email().max(254).safeParse(form.get("email"));
 if (!email.success) return { ok: false as const, error: "Enter a valid email address." };
 if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) return { ok: false as const, error: "Password recovery is temporarily unavailable. Please contact website support." };
 const address = email.data.toLowerCase();
 if (!await takeActionBudget("password-request", address)) return neutral;
 // All account lookup and delivery occur after the same public response.
 after(async () => {
  let savedHash: string | undefined;
  try {
   const user = await prisma.user.findUnique({ where: { email: address }, select: { id: true, hashedPassword: true } });
   if (!user?.hashedPassword) return;
   const reset = newResetToken(); savedHash = reset.hash;
   await prisma.verificationToken.deleteMany({ where: { identifier: { startsWith: "password-reset:" }, expires: { lt: new Date() } } });
   await prisma.verificationToken.create({ data: { identifier: `password-reset:${user.id}`, token: reset.hash, expires: reset.expires } });
   // Fixed trusted origin; fragments keep the token out of access logs and referrers.
   const url = `https://bacwater.ai/reset-password#token=${reset.token}`;
   const sent = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: process.env.RESEND_FROM!, to: address, subject: "Reset your BACwater.ai password", text: `A password reset was requested for your BACwater.ai account. Open this link within 30 minutes:\n\n${url}\n\nIf you did not request this, ignore this email. Your password has not changed.` });
   if (sent.error) throw new Error("Reset email failed");
  } catch {
   if (savedHash) await prisma.verificationToken.deleteMany({ where: { token: savedHash } }).catch(() => {});
   console.error("Password recovery delivery failed; check provider configuration.");
  }
 });
 return neutral;
}
export async function resetPassword(form: FormData) {
 const token = String(form.get("token") || "");
 const invalid = { ok: false as const, error: "This reset link is invalid or has expired. Request a new link." };
 if (!RESET_TOKEN_PATTERN.test(token)) return invalid;
 const password = signupSchema.shape.password.safeParse(form.get("password"));
 if (!password.success) return { ok: false as const, error: password.error.issues[0].message };
 if (password.data !== form.get("confirmation")) return { ok: false as const, error: "The passphrases do not match." };
 const hash = hashResetToken(token);
 if (!await takeActionBudget("password-reset", hash)) return { ok: false as const, error: "Too many attempts. Please wait 15 minutes before retrying." };
 try {
  const record = await prisma.verificationToken.findUnique({ where: { token: hash } });
  if (!record || !record.identifier.startsWith("password-reset:") || record.expires <= new Date()) return invalid;
  const userId = record.identifier.slice("password-reset:".length);
  const hashedPassword = await bcrypt.hash(password.data, 12);
  await prisma.$transaction(async tx => {
   // Atomic consume prevents concurrent reuse; any failure rolls back the password change.
   const consumed = await tx.verificationToken.deleteMany({ where: { token: hash, identifier: record.identifier, expires: { gt: new Date() } } });
   if (consumed.count !== 1) throw new Error("Expired or used token");
   await tx.user.update({ where: { id: userId }, data: { hashedPassword } });
   await tx.verificationToken.deleteMany({ where: { identifier: record.identifier } });
   await tx.session.deleteMany({ where: { userId } });
   const marker = `password-session:${userId}`;
   await tx.verificationToken.upsert({ where: { token: marker }, create: { identifier: marker, token: marker, expires: new Date(Date.now() + 31 * 86400_000) }, update: { expires: new Date(Date.now() + 31 * 86400_000) } });
  });
  return { ok: true as const };
 } catch { return invalid; }
}
