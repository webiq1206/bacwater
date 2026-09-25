"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { signupSchema } from "@/lib/security/registration";
import { takeActionBudget } from "@/lib/security/action-budget";

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Enter a name, valid email and a passphrase of at least 15 characters (maximum 72 UTF-8 bytes)." };
  }
  const { name, email, password } = parsed.data;
  if (!await takeActionBudget("signup", email)) return { ok: false, error: "Account creation is temporarily limited. Keep your details here and try again later." };
  try {
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return { ok: false, error: "An account with that email already exists." };
  }
  const hashed = await bcrypt.hash(password, 10);
  // An unverified registration email never grants administrator privileges.
  const role = "user";
  await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      hashedPassword: hashed,
      role,
    },
  });
  } catch {
    return { ok: false, error: "We could not finish creating this account. Your details are still here. Try signing in if you already submitted them, or retry later." };
  }
  try {
  await signIn("credentials", {
    email: email.toLowerCase(),
    password,
    redirect: false,
  });
  } catch { return { ok: false, error: "Your account was created, but sign-in did not finish. Sign in with the same email and password." }; }
  return { ok: true };
}

export async function signinAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { ok: false, error: "Enter your email and password." };
  try {
    await signIn("credentials", { email, password, redirect: false });
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not sign in. Check your email and password. If you have tried repeatedly, wait 15 minutes and try again." };
  }
}
