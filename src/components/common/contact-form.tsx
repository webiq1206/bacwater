"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { submitContactAction } from "@/lib/contact-actions";

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div className="text-center py-8">
        <div className="text-xl font-semibold">Thanks — message received.</div>
        <p className="mt-2 text-sm text-muted-foreground">We&apos;ll get back to you shortly.</p>
      </div>
    );
  }
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        const fd = new FormData(e.currentTarget);
        const res = await submitContactAction(fd);
        setPending(false);
        if (res.ok) setSent(true);
        else toast({ title: "Could not send", description: res.error, variant: "destructive" });
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required className="mt-2" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-2" />
      </div>
      <div>
        <Label htmlFor="subject">Subject (optional)</Label>
        <Input id="subject" name="subject" className="mt-2" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={6} required />
      </div>
      <Button type="submit" variant="brand" size="lg" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Send message
      </Button>
    </form>
  );
}
