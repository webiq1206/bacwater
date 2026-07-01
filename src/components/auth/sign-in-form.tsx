"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signinAction } from "@/lib/auth-actions";
import { toast } from "@/components/ui/toaster";

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    const res = await signinAction(form);
    setPending(false);
    if (res.ok) {
      const next = params.get("next") || "/plans";
      router.push(next);
      router.refresh();
    } else {
      toast({ title: "Sign in failed", description: res.error, variant: "destructive" });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
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
