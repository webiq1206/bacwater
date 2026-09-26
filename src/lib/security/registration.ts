import { z } from "zod";
export const signupSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  password: z.string().min(15, "Use a passphrase with at least 15 characters.").refine(value => Buffer.byteLength(value, "utf8") <= 72,
    "This passphrase is too long. Shorten it slightly; accented letters and emoji count toward the length limit."),
});
