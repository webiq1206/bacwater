/**
 * Public contact facts already configured for the site.
 * Call is rendered only when this returns a number. Nothing here invents one.
 */
export function publicPhone(source = process.env.NEXT_PUBLIC_PUBLIC_PHONE): string | null {
  const value = (source ?? "").trim();
  const digits = value.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  if (!/^\+?[0-9][0-9().\-\s]{6,24}$/.test(value)) return null;
  return value;
}

export const PUBLIC_SUPPORT_EMAIL = "hello@bacwater.ai";
