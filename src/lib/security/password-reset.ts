import { createHash, randomBytes } from "node:crypto";
export const RESET_LIFETIME_MS = 30 * 60_000;
export const RESET_TOKEN_PATTERN = /^[a-f0-9]{64}$/;
export function hashResetToken(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function newResetToken(now = Date.now()) {
 const token = randomBytes(32).toString("hex");
 return { token, hash: hashResetToken(token), expires: new Date(now + RESET_LIFETIME_MS) };
}
export function passwordStamp(hash: string | null) { return createHash("sha256").update(`password-session:${hash || "oauth"}`).digest("hex"); }
