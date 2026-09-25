"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signupAction } from "@/lib/auth-actions";
import { toast } from "@/components/ui/toaster";

export function SignUpForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
    const res = await signupAction(form);
    setPending(false);
    if (res.ok) {
      toast({ title: "Welcome to BACwater.ai", variant: "success" });
      router.push("/plans");
      router.refresh();
    } else {
      setError(res.error || "Could not create account. Please retry.");
    }
    } catch { setError("Please retry, or sign in if the account was already created."); }
    finally { setPending(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-4" aria-busy={pending}>
      {error && <p role="alert" className="rounded-lg border border-destructive p-3 text-sm text-destructive">{error}</p>}
      <div>
        <Label htmlFor="name">Your name</Label>
        <Input id="name" name="name" maxLength={120} required className="mt-2" autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" maxLength={254} required className="mt-2" autoComplete="email" />
      </div>
      <div>
        <Label htmlFor="password">Passphrase (15+ characters)</Label>
        <Input id="password" name="password" type="password" required minLength={15} maxLength={72} aria-describedby="password-help" className="mt-2" autoComplete="new-password" />
        <p id="password-help" className="mt-2 text-sm text-muted-foreground">Use a unique passphrase. Password managers and paste are supported. Maximum 72 UTF-8 bytes; accented characters and emoji can use more than one byte.</p>
      </div>
      <Button type="submit" variant="brand" size="lg" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Create account
      </Button>
    </form>
  );
}
