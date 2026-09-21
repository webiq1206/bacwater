"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetAction, resetPasswordAction } from "@/lib/recovery-actions";
import { PASSWORD_HELP, PASSWORD_MIN_LENGTH } from "@/lib/security/password-policy";

export function RecoveryForm({ mode }: { mode: "request" | "reset" }) {
  const [token, setToken] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  useEffect(() => {
    if (mode !== "reset") return;
    const value = new URLSearchParams(location.hash.slice(1)).get("token") || "";
    if (/^[a-f0-9]{64}$/.test(value)) setToken(value);
    if (location.hash) history.replaceState(history.state, "", location.pathname);
  }, [mode]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending) return;
    const form = new FormData(event.currentTarget); if (mode === "reset") form.set("token", token);
    setPending(true); setResult(null);
    try { setResult(await (mode === "request" ? requestPasswordResetAction(form) : resetPasswordAction(form))); }
    catch { setResult({ ok: false, message: "Connection interrupted. Your entries are still here. Please retry." }); }
    finally { setPending(false); }
  }
  if (result?.ok) return <div><p role="status" className="leading-relaxed">{result.message}</p><Link href="/signin" className="mt-5 inline-flex min-h-11 items-center underline">Return to sign in</Link><p className="mt-3 text-sm"><Link className="underline" href="/contact">Contact support</Link></p></div>;
  return <form onSubmit={submit} className="space-y-5" aria-busy={pending}>
    {mode === "request" ? <div><Label htmlFor="recovery-email">Account email</Label><Input id="recovery-email" name="email" type="email" autoComplete="email" maxLength={254} required className="mt-2" /></div> : <>
      <p id="password-help" className="text-sm text-muted-foreground">{PASSWORD_HELP}</p>
      <div><Label htmlFor="new-password">New password</Label><Input id="new-password" name="password" type="password" autoComplete="new-password" minLength={PASSWORD_MIN_LENGTH} maxLength={72} aria-describedby="password-help" required className="mt-2" /></div>
      <div><Label htmlFor="confirm-password">Confirm new password</Label><Input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" minLength={PASSWORD_MIN_LENGTH} maxLength={72} required className="mt-2" /></div>
      {!token && <p role="status" className="text-sm">Open the link from your recovery email. <Link href="/forgot-password" className="underline">Request a new link</Link>.</p>}
    </>}
    <div hidden aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
    {result && <p role="alert" className="text-sm">{result.message}</p>}
    <Button type="submit" variant="brand" size="lg" className="w-full" disabled={pending || (mode === "reset" && !token)}>{pending ? "Processing..." : mode === "request" ? "Request recovery email" : "Set new password"}</Button>
    <p className="text-sm"><Link href="/signin" className="underline">Back to sign in</Link></p>
  </form>;
}
