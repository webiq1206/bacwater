"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { setUserRole } from "@/lib/admin-actions";
import { toast } from "@/components/ui/toaster";

export function UserRoleSwitcher({ userId, role }: { userId: string; role: "user" | "admin" }) {
  const [current, setCurrent] = useState(role);
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex items-center gap-2">
      <Badge variant={current === "admin" ? "brand" : "outline"}>{current}</Badge>
      <button
        type="button"
        disabled={pending}
        className="text-xs text-brand hover:underline"
        onClick={() => {
          const next = current === "admin" ? "user" : "admin";
          startTransition(async () => {
            await setUserRole(userId, next);
            setCurrent(next);
            toast({ title: `Role set to ${next}`, variant: "success" });
          });
        }}
      >
        Switch
      </button>
    </div>
  );
}
