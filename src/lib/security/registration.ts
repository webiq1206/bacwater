import { z } from "zod";
export const signupSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  password: z.string().min(15).refine(value => Buffer.byteLength(value, "utf8") <= 72,
    "Use a passphrase of at least 15 characters and no more than 72 UTF-8 bytes."),
});
