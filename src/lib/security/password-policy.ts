import { z } from "zod";
// Keep legacy sign-in compatible; apply this policy to newly set passwords.
export const PASSWORD_MIN_LENGTH = 15;
export const PASSWORD_HELP = "Use at least 15 characters. A long passphrase works well. Maximum 72 UTF-8 bytes.";
export const newPasswordSchema = z.string().min(PASSWORD_MIN_LENGTH).max(72)
  .refine(value => [...value].length >= PASSWORD_MIN_LENGTH, "Use at least 15 characters.")
  .refine(value => new TextEncoder().encode(value).length <= 72, "Password exceeds 72 UTF-8 bytes.");
