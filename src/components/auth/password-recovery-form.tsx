"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { requestPasswordReset, resetPassword } from "@/lib/password-actions";
export function PasswordRecoveryForm({ reset = false }: { reset?: boolean }) {
 const [token, setToken] = useState(""), [pending, setPending] = useState(false), [error, setError] = useState(""), [done, setDone] = useState(false), [message, setMessage] = useState(""), [show, setShow] = useState(false);
 const tokenRead = useRef(false);
 useEffect(() => { if (reset && !tokenRead.current) { tokenRead.current = true; setToken(new URLSearchParams(location.hash.slice(1)).get("token") || ""); history.replaceState(history.state, "", location.pathname); } }, [reset]);
 if (done) return <div role="status"><p className="leading-relaxed">{reset ? "Your password has been changed. Sign in again on each device." : message}</p><Link href="/signin" className="mt-4 inline-flex min-h-11 items-center underline">Back to sign in</Link></div>;
 return <form className="space-y-4" aria-busy={pending} onSubmit={async e => {
  e.preventDefault(); if (pending) return; setPending(true); setError("");
  const form = new FormData(e.currentTarget); form.set("token", token);
  try { const result = reset ? await resetPassword(form) : await requestPasswordReset(form); if (result.ok) { setDone(true); if ("message" in result && typeof result.message === "string") setMessage(result.message); } else setError(result.error); }
  catch { setError("Connection interrupted. Please try again."); } finally { setPending(false); }
 }}>
 {reset ? <><label className="block text-sm font-medium">New passphrase<Input name="password" type={show ? "text" : "password"} autoComplete="new-password" minLength={15} maxLength={72} required className="mt-2" aria-describedby="reset-help"/></label><p id="reset-help" className="text-sm">Use at least 15 characters. Password managers and paste are welcome.</p><label className="block text-sm font-medium">Confirm passphrase<Input name="confirmation" type={show ? "text" : "password"} autoComplete="new-password" minLength={15} maxLength={72} required className="mt-2"/></label><button type="button" className="min-h-11 text-sm underline" aria-pressed={show} onClick={() => setShow(!show)}>{show ? "Hide passphrases" : "Show passphrases"}</button></> : <label className="block text-sm font-medium">Account email<Input name="email" type="email" autoComplete="email" maxLength={254} required className="mt-2"/></label>}
 {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
 <Button type="submit" variant="brand" size="lg" disabled={pending} className="w-full">{pending ? "Please wait…" : reset ? "Set new password" : "Send reset link"}</Button>
 {reset && <Link href="/forgot-password" className="block min-h-11 py-3 text-sm underline">Request a new reset link</Link>}
 <p className="text-sm"><Link href="/contact" className="underline">Need account help?</Link></p></form>;
}
