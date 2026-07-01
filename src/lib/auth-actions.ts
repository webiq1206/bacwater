"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth";

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const signupSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Please provide a valid name, email, and password (6+ chars)." };
  }
  const { name, email, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return { ok: false, error: "An account with that email already exists." };
  }
  const hashed = await bcrypt.hash(password, 10);
  const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "user";
  await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      hashedPassword: hashed,
      role,
    },
  });
  await signIn("credentials", {
    email: email.toLowerCase(),
    password,
    redirect: false,
  });
  return { ok: true };
}

export async function signinAction(formData: FormData) {
  const email = String(formData.get("email") || "").toLowerCase();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { ok: false, error: "Enter your email and password." };
  try {
    await signIn("credentials", { email, password, redirect: false });
    return { ok: true };
  } catch {
    return { ok: false, error: "Incorrect email or password." };
  }
}
