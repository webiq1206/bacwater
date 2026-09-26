"use client";
import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitContactAction } from "@/lib/contact-actions";
import { trackUsage } from "@/lib/analytics";
export function ContactForm() {
  const [pending, setPending] = useState(false), [sent, setSent] = useState(false), [error, setError] = useState(""), [reference, setReference] = useState("");
  const requestId = useRef(""); const locked = useRef(false);
  if (sent) return <div role="status" className="py-8"><h2 className="text-xl font-semibold">We received your message.</h2><p className="mt-2 text-sm">The BACwater.ai support team can now review it. If we reply, we will use the email address you provided.</p><p className="mt-3 break-all text-sm">Your reference: {reference}</p></div>;
  return <form className="space-y-4" aria-busy={pending} onSubmit={async (e) => {
    e.preventDefault(); if (locked.current) return;
    locked.current = true; setPending(true); setError("");
    const fd = new FormData(e.currentTarget);
    requestId.current ||= crypto.randomUUID(); fd.set("requestId", requestId.current);
    try { const result = await submitContactAction(fd); if (result.ok) { setReference(result.reference); setSent(true); trackUsage("contact_saved"); } else setError(result.error); }
    catch { setError("Connection interrupted. Your text is still here; please retry."); }
    finally { locked.current = false; setPending(false); }
  }}>
    <div><Label htmlFor="contact-name">Name</Label><Input id="contact-name" name="name" autoComplete="name" required maxLength={120} className="mt-2" /></div>
    <div><Label htmlFor="contact-email">Email</Label><Input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} className="mt-2" /></div>
    <div><Label htmlFor="contact-subject">Subject (optional)</Label><Input id="contact-subject" name="subject" maxLength={200} className="mt-2" /></div>
    <div><Label htmlFor="contact-message">Message</Label><Textarea id="contact-message" name="message" rows={6} required maxLength={4000} aria-describedby="contact-help" /><p id="contact-help" className="mt-2 text-xs text-muted-foreground">Do not include health records, passwords or payment information.</p></div>
    <div hidden aria-hidden="true"><label>Leave blank<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    <Button type="submit" variant="brand" size="lg" disabled={pending}>{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{pending ? "Saving message" : "Send message"}</Button>
  </form>;
}
