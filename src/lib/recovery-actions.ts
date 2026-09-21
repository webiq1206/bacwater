"use server";
import { setTimeout as delay } from "node:timers/promises";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { createResetToken, consumeResetToken, resetDigest } from "@/lib/security/password-recovery";
import { newPasswordSchema, PASSWORD_HELP } from "@/lib/security/password-policy";
import { enforceLimit, requestIdentity } from "@/lib/security/rate-limit";

const received = "Request received. If this address has a password account, follow the recovery email. Check spam, or contact support if it does not arrive.";
export async function requestPasswordResetAction(form: FormData) {
  const started = Date.now();
  const parsed = z.string().trim().email().max(254).safeParse(form.get("email"));
  if (!parsed.success || form.get("website")) return { ok: false, message: "Enter a valid email address." };
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return { ok: false, message: "Email recovery is not available right now. Use your existing sign-in method or contact support. Do not send your password." };
  try {
    const email = parsed.data.toLowerCase();
    await enforceLimit("recovery-device", await requestIdentity(), 10, 15 * 60 * 1000);
    await enforceLimit("recovery-email", email, 3, 15 * 60 * 1000);
    await enforceLimit("recovery-total", "site", 60, 60 * 60 * 1000);
    const reset = await createResetToken(email);
    if (reset) {
      let accepted = false;
      try {
        const result = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: process.env.EMAIL_FROM, to: reset.email, subject: "Reset your BACwater.ai password", text: `You requested a password reset. Open this link within 30 minutes:\n\n${reset.url}\n\nThis link works once. If you did not request it, you can ignore this message. Your password has not changed. Never share this link or your password.` });
        accepted = Boolean(result.data?.id) && !result.error;
      } finally {
        if (!accepted) await prisma.verificationToken.deleteMany({ where: { token: resetDigest(reset.token) } });
      }
      console.info("[account-recovery]", accepted ? "provider-accepted" : "provider-not-accepted");
    }
  } catch { console.info("[account-recovery] request-not-completed"); }
  // Same public text and minimum floor; not a claim of constant-time provider delivery.
  await delay(Math.max(0, 1500 - (Date.now() - started)));
  return { ok: true, message: received };
}
export async function resetPasswordAction(form: FormData) {
  const password = newPasswordSchema.safeParse(form.get("password"));
  if (!password.success) return { ok: false, message: PASSWORD_HELP };
  if (password.data !== form.get("confirmPassword")) return { ok: false, message: "The passwords do not match." };
  try {
    await enforceLimit("reset-device", await requestIdentity(), 10, 15 * 60 * 1000);
    const result = await consumeResetToken(String(form.get("token") || ""), password.data);
    if (!result) return { ok: false, message: "This link is invalid, expired or already used. Request a new recovery email." };
    if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
      try {
        const sent = await new Resend(process.env.RESEND_API_KEY).emails.send({ from: process.env.EMAIL_FROM, to: result.email, subject: "Your BACwater.ai password changed", text: "Your BACwater.ai password has been changed. Previous signed-in sessions are no longer valid. If this was not you, visit bacwater.ai/contact. Never send your password." });
        console.info("[account-recovery]", sent.data?.id && !sent.error ? "notice-accepted" : "notice-not-accepted");
      } catch { console.info("[account-recovery] notice-not-accepted"); }
    }
    return { ok: true, message: "Your password has been updated. Sign in again with your new password. Previous sessions have been signed out." };
  } catch { return { ok: false, message: "The reset could not complete. Retry later or request a new recovery link." }; }
}
