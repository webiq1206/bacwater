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

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    const res = await signupAction(form);
    setPending(false);
    if (res.ok) {
      toast({ title: "Welcome to BACWater.ai", variant: "success" });
      router.push("/plans");
      router.refresh();
    } else {
      toast({ title: "Could not create account", description: res.error, variant: "destructive" });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="name">Your name</Label>
        <Input id="name" name="name" required className="mt-2" autoComplete="name" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required className="mt-2" autoComplete="email" />
      </div>
      <div>
        <Label htmlFor="password">Password (6+ characters)</Label>
        <Input id="password" name="password" type="password" required minLength={6} className="mt-2" autoComplete="new-password" />
      </div>
      <Button type="submit" variant="brand" size="lg" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Create account
      </Button>
    </form>
  );
}
