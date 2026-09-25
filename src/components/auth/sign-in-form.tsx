"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signinAction } from "@/lib/auth-actions";


export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
    const res = await signinAction(form);
    setPending(false);
    if (res.ok) {
      const candidate = params.get("next") || "/plans";
      const next = /^\/(?![\/\\])/.test(candidate) && !/[\r\n]/.test(candidate) ? candidate : "/plans";
      router.push(next);
      router.refresh();
    } else {
      setError(res.error || "Could not sign in. Please retry.");
    }
    } catch { setError("Connection interrupted. Your entries are still here. Please retry."); }
    finally { setPending(false); }
  }

  return (
    <form onSubmit={submit} className="space-y-4" aria-busy={pending}>
      {error && <p role="alert" className="rounded-lg border border-destructive p-3 text-sm text-destructive">{error}</p>}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required className="mt-2" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required className="mt-2" />
      </div>
      <Button type="submit" variant="brand" size="lg" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Sign in
      </Button>
    </form>
  );
}
