"use client";

import { useRef, useState } from "react";
import { Loader2, MessageCircle, Phone, Send } from "lucide-react";
import { useResearchAssistant } from "@/components/search/research-assistant-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactAction } from "@/lib/contact-actions";
import { telHref } from "@/lib/contact-request";
import { publicPhone } from "@/lib/site-contact";
import { trackUsage } from "@/lib/analytics";
import styles from "./lead-request.module.css";

export function LeadRequest({ variant = "home" }: { variant?: "home" | "contact" }) {
  const { openAssistant } = useResearchAssistant();
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const requestId = useRef("");
  const locked = useRef(false);
  const phone = publicPhone();
  const callHref = phone ? telHref(phone) : null;

  return (
    <section className={variant === "home" ? styles.band : undefined} data-lead-request aria-labelledby={variant === "home" ? "lead-request-title" : undefined} aria-label={variant === "contact" ? "Send a request" : undefined}>
      <div className={variant === "home" ? styles.inner : styles.stack}>
        {variant === "home" ? (
          <>
            <p id="lead-request-title" className={styles.title}>Ask in one step</p>
            <p className={styles.lede}>Send your name, phone, email, and a note. The step by step calculator is below.</p>
          </>
        ) : null}
        <div className={styles.actions}>
          {phone && callHref ? (
            <Button asChild variant="brand" size="lg">
              <a href={callHref}>
                <Phone aria-hidden="true" />
                Call
              </a>
            </Button>
          ) : null}
          <Button type="button" variant={phone ? "outline" : "brand"} size="lg" onClick={(event) => openAssistant(event.currentTarget)}>
            <MessageCircle aria-hidden="true" />
            Chat
          </Button>
        </div>
        {sent ? (
          <div role="status" className="py-6">
            {variant === "home" ? <p className="text-xl font-semibold">We received your request.</p> : <h2 className="text-xl font-semibold">We received your request.</h2>}
            <p className="mt-2 text-sm">The BACwater.ai support team can now review it. If we reply, we will use the email address you provided.</p>
            <p className="mt-3 break-all text-sm">Your reference: {reference}</p>
          </div>
        ) : (
          <form
            className={styles.form}
            data-clarity-mask="true"
            aria-busy={pending}
            onSubmit={async (event) => {
              event.preventDefault();
              if (locked.current) return;
              locked.current = true;
              setPending(true);
              setError("");
              const body = new FormData(event.currentTarget);
              requestId.current ||= crypto.randomUUID();
              body.set("requestId", requestId.current);
              try {
                const result = await submitContactAction(body);
                if (result.ok) {
                  setReference(result.reference);
                  setSent(true);
                  trackUsage("contact_saved");
                } else setError(result.error);
              } catch {
                setError("Connection interrupted. Your text is still here; please retry.");
              } finally {
                locked.current = false;
                setPending(false);
              }
            }}
          >
            <div className={styles.fields}>
              <div className={styles.field}>
                <Label htmlFor="request-name">Name</Label>
                <Input id="request-name" name="name" autoComplete="name" required maxLength={120} className="mt-1 h-11" />
              </div>
              <div className={styles.field}>
                <Label htmlFor="request-phone">Phone</Label>
                <Input id="request-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" required maxLength={40} className="mt-1 h-11" />
              </div>
              <div className={`${styles.field} ${styles.wide}`}>
                <Label htmlFor="request-email">Email</Label>
                <Input id="request-email" name="email" type="email" autoComplete="email" required maxLength={254} className="mt-1 h-11" />
              </div>
              <div className={`${styles.field} ${styles.wide}`}>
                <Label htmlFor="request-note">Note</Label>
                <Textarea id="request-note" name="message" required maxLength={4000} rows={2} className="mt-1" aria-describedby="request-help" />
                <p id="request-help" className={styles.help}>Do not include health records, passwords, or payment information.</p>
              </div>
              <div className={`${styles.field} ${styles.wide}`}>
                <Label htmlFor="request-file">Attach a file (optional)</Label>
                <input id="request-file" name="attachment" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,application/pdf,image/png,image/jpeg,image/webp,text/plain" className={`${styles.file} mt-1`} />
                <p className={styles.help}>PDF, PNG, JPG, WEBP, or TXT, up to 2 MB.</p>
              </div>
            </div>
            <div hidden aria-hidden="true">
              <label>Leave blank<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>
            {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" variant="brand" size="lg" disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {pending ? "Sending request" : "Send request"}
            </Button>
          </form>
        )}
        {variant === "home" ? (
          <p className={styles.secondary}><a href="#quick-calculator">Use the step by step calculator</a></p>
        ) : null}
      </div>
    </section>
  );
}
