/** Completed requests only. Unfinished forms are not stored and are not emailed. */
export const ATTACHMENT_MAX_BYTES = 2 * 1024 * 1024;

const TYPE_EXTENSIONS: Record<string, readonly string[]> = {
  "application/pdf": [".pdf"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "text/plain": [".txt"],
};

export function parseVisitorPhone(value: string): string | null {
  const phone = value.trim().replace(/\s+/g, " ");
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  if (!/^\+?[0-9][0-9().\-\s]{6,24}$/.test(phone)) return null;
  return phone;
}

/** tel: link for a number we already store or display. Rejects anything else. */
export function telHref(phone: string): string | null {
  const compact = phone.trim().replace(/[^\d+]/g, "");
  if (!/^\+?\d{7,15}$/.test(compact)) return null;
  return `tel:${compact}`;
}

export interface AttachmentInput {
  name: string;
  bytes: Uint8Array;
}

export type AttachmentCheck =
  | { ok: true; name: string; type: string }
  | { ok: false; error: string };

function sniff(bytes: Uint8Array): string | null {
  if (bytes.length >= 5 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d) return "application/pdf";
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return "image/png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return "image/webp";
  return null;
}

function looksLikeText(bytes: Uint8Array): boolean {
  if (bytes.length === 0 || bytes.includes(0)) return false;
  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    return text.trim().length > 0;
  } catch {
    return false;
  }
}

/** Optional file on the short request only. Type comes from the bytes, not the browser label. */
export function validateAttachment(file: AttachmentInput): AttachmentCheck {
  if (file.bytes.byteLength > ATTACHMENT_MAX_BYTES) {
    return { ok: false, error: "That file must be a PDF, PNG, JPG, WEBP, or TXT under 2 MB." };
  }
  const base = (file.name.split(/[/\\]/).pop() ?? "").replace(/[^\w. -]+/g, "").trim().slice(0, 80);
  const ext = base.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] ?? "";
  const sniffed = sniff(file.bytes);
  const type = sniffed ?? (ext === ".txt" && looksLikeText(file.bytes) ? "text/plain" : null);
  if (!type || !TYPE_EXTENSIONS[type]?.includes(ext)) {
    return { ok: false, error: "That file must be a PDF, PNG, JPG, WEBP, or TXT under 2 MB." };
  }
  return { ok: true, name: base, type };
}
