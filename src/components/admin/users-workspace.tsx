"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  Loader2,
  Mail,
  MessageCircle,
  Search,
  Shield,
  ShieldOff,
  Users as UsersIcon,
} from "lucide-react";
import {
  WorkspaceShell,
  PaneLabel,
  QueueRow,
  FieldRow,
  KeyHint,
} from "@/components/workspace/workspace-shell";
import { useQueueKeys } from "@/components/workspace/use-queue-keys";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";
import { formatDose } from "@/lib/calc/format";
import { setUserRole } from "@/lib/admin-actions";

export interface UserPlanSummary {
  publicId: string;
  name: string | null;
  peptideName: string | null;
  vialStrengthMg: number;
  doseMcg: number;
  archived: boolean;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  planCount: number;
  archivedPlanCount: number;
  /** Contact messages sent from this address. */
  messageCount: number;
  openMessageCount: number;
  plans: UserPlanSummary[];
}

export function UsersWorkspace({
  users,
  initialEmail,
}: {
  users: UserRecord[];
  /** Preselect by email — how the plans workspace links into this one. */
  initialEmail?: string;
}) {
  const [rows, setRows] = useState(users);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    users.find((u) => u.email.toLowerCase() === initialEmail?.toLowerCase())?.id ?? null
  );
  const [pending, startTransition] = useTransition();

  const queue = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (u) => u.email.toLowerCase().includes(q) || (u.name ?? "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  const index = queue.findIndex((u) => u.id === selectedId);
  const current = index >= 0 ? queue[index] : null;

  const move = useCallback(
    (delta: number) => {
      if (queue.length === 0) return;
      // With nothing picked yet, the first press lands on the first row rather
      // than stepping past it.
      if (index < 0) {
        setSelectedId(queue[0].id);
        return;
      }
      const next = Math.min(queue.length - 1, Math.max(0, index + delta));
      setSelectedId(queue[next].id);
    },
    [index, queue]
  );

  function toggleRole() {
    if (!current) return;
    const next = current.role === "admin" ? "user" : "admin";
    if (
      next === "user" &&
      !window.confirm(`Remove admin from ${current.email}? They lose access to this panel.`)
    )
      return;
    const id = current.id;
    startTransition(async () => {
      await setUserRole(id, next);
      setRows((rs) => rs.map((u) => (u.id === id ? { ...u, role: next } : u)));
      toast({ title: `${current.email} is now ${next}`, variant: "success" });
    });
  }

  useQueueKeys({
    onNext: () => move(1),
    onPrev: () => move(-1),
    onEscape: () => setSelectedId(null),
    enabled: !pending,
  });

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Users</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Account, plans, and messages side by side.
          </p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Email or name"
            className="h-9 w-60 pl-8 text-sm"
          />
        </div>
      </div>

      <WorkspaceShell
        hasSelection={Boolean(selectedId)}
        onBack={() => setSelectedId(null)}
        backLabel="Back to users"
        header={
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              {queue.length === 0
                ? "No users"
                : `User ${Math.max(index, 0) + 1} of ${queue.length}`}
            </span>
            <KeyHint keys="J / K" label="move" />
          </div>
        }
        queue={
          <>
            <PaneLabel>Accounts</PaneLabel>
            {queue.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                <UsersIcon className="mx-auto mb-2 h-5 w-5" />
                No users match.
              </div>
            ) : (
              <div className="pb-3">
                {queue.map((u, i) => (
                  <QueueRow
                    key={u.id}
                    index={i}
                    active={selectedId === u.id}
                    onSelect={() => setSelectedId(u.id)}
                    title={u.email}
                    meta={`${u.planCount} plan${u.planCount === 1 ? "" : "s"} · joined ${formatDate(u.createdAt)}`}
                    trailing={
                      u.role === "admin" ? (
                        <Shield className="h-3.5 w-3.5 text-foreground" />
                      ) : null
                    }
                  />
                ))}
              </div>
            )}
          </>
        }
        aside={
          current ? (
            <div className="pb-4">
              <PaneLabel>Account</PaneLabel>
              <div className="border-y border-border">
                <FieldRow label="Role">
                  <Badge variant={current.role === "admin" ? "brand" : "outline"}>
                    {current.role}
                  </Badge>
                </FieldRow>
                <FieldRow label="Joined">{formatDate(current.createdAt)}</FieldRow>
                <FieldRow label="Plans">{current.planCount}</FieldRow>
                <FieldRow label="Archived">{current.archivedPlanCount}</FieldRow>
                <FieldRow label="Messages" attention={current.openMessageCount > 0}>
                  {current.messageCount}
                  {current.openMessageCount > 0 ? ` (${current.openMessageCount} open)` : ""}
                </FieldRow>
              </div>
              <div className="flex flex-col gap-2 px-4 pt-3">
                <Button asChild variant="outline" size="sm">
                  <a href={`mailto:${current.email}`}>
                    <Mail className="h-4 w-4" /> Email
                  </a>
                </Button>
                {current.messageCount > 0 ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href="/admin/contact">
                      <MessageCircle className="h-4 w-4" /> Their messages
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null
        }
        actionBar={
          current ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => move(1)} disabled={pending} variant="brand">
                Next user <span className="ml-1 font-mono text-[10px] opacity-70">J</span>
              </Button>
              <Button onClick={toggleRole} disabled={pending} variant="outline">
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : current.role === "admin" ? (
                  <ShieldOff className="h-4 w-4" />
                ) : (
                  <Shield className="h-4 w-4" />
                )}
                {current.role === "admin" ? "Revoke admin" : "Make admin"}
              </Button>
            </div>
          ) : null
        }
      >
        {current ? (
          <div className="p-5 sm:p-6">
            <h2 className="font-serif text-2xl font-medium tracking-tight">
              {current.name || current.email}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{current.email}</p>

            <h3 className="mt-6 text-sm font-semibold">
              Saved plans ({current.plans.length})
            </h3>
            {current.plans.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No saved plans on this account.
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-border rounded-xl border border-border">
                {current.plans.map((p) => (
                  <li key={p.publicId} className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/plans?id=${p.publicId}`}
                        className="truncate text-sm font-medium hover:underline"
                      >
                        {p.name || p.peptideName || "Untitled plan"}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {p.vialStrengthMg} mg · {formatDose(p.doseMcg)} ·{" "}
                        {formatDate(p.createdAt)}
                      </div>
                    </div>
                    {p.archived ? <Badge variant="outline">archived</Badge> : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="flex h-full min-h-[16rem] items-center justify-center p-8 text-center text-sm text-muted-foreground">
            Pick a user, or press J to start.
          </div>
        )}
      </WorkspaceShell>
    </div>
  );
}
