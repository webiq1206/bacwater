"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Inbox,
  Loader2,
  Mail,
  RotateCcw,
  Send,
  SkipForward,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import {
  WorkspaceShell,
  PaneLabel,
  QueueRow,
  KeyHint,
  FieldRow,
} from "@/components/workspace/workspace-shell";
import { useQueueKeys } from "@/components/workspace/use-queue-keys";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { formatDate } from "@/lib/utils";
import {
  classifyContactMessage,
  templateFor,
  REPLY_TEMPLATES,
  TOPIC_LABELS,
} from "@/lib/contact-triage";
import {
  deleteContactMessage,
  replyToContact,
  saveContactNotes,
  setContactHandled,
} from "@/lib/admin-actions";

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  handled: boolean;
  handledAt: string | null;
  handledByEmail: string | null;
  internalNotes: string | null;
  repliedAt: string | null;
  replySubject: string | null;
  replyBody: string | null;
  createdAt: string;
}

export interface SenderContext {
  /** Messages this address has sent before, newest first, excluding the open one. */
  priorMessages: number;
  hasAccount: boolean;
  accountCreatedAt: string | null;
  planCount: number;
}

type Filter = "open" | "all";

export function ContactWorkspace({
  messages,
  senders,
}: {
  messages: ContactRecord[];
  senders: Record<string, SenderContext>;
}) {
  const [rows, setRows] = useState(messages);
  const [filter, setFilter] = useState<Filter>("open");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Reply draft + notes are keyed by message id so moving through the queue
  // and coming back does not lose typing.
  const [drafts, setDrafts] = useState<
    Record<string, { subject: string; body: string; notes: string }>
  >({});

  const queue = useMemo(
    () => (filter === "open" ? rows.filter((r) => !r.handled) : rows),
    [rows, filter]
  );

  // Selection follows the queue: when the current message drops out (handled
  // while filtered to open) or nothing is picked yet, fall through to whatever
  // now sits at the top. On mobile `hasSelection` still gates the swap, so this
  // only ever pre-fills the desktop centre pane.
  const current = queue.find((r) => r.id === selectedId) ?? queue[0] ?? null;
  const index = current ? queue.findIndex((r) => r.id === current.id) : -1;

  const select = useCallback((id: string | null) => setSelectedId(id), []);

  const move = useCallback(
    (delta: number) => {
      if (queue.length === 0) return;
      // With nothing picked yet, the first press lands on the first row rather
      // than stepping past it.
      if (!selectedId || index < 0) {
        select(queue[0].id);
        return;
      }
      const next = Math.min(queue.length - 1, Math.max(0, index + delta));
      select(queue[next].id);
    },
    [index, queue, select, selectedId]
  );

  const triage = useMemo(
    () =>
      current
        ? classifyContactMessage({ subject: current.subject, message: current.message })
        : null,
    [current]
  );

  // A previously saved draft wins over the suggestion, so a half-written reply
  // survives a reload. Otherwise the classifier pre-answers both fields.
  const draft = current
    ? drafts[current.id] ?? {
        subject:
          current.replySubject ||
          templateFor(triage?.topic ?? "general").subject(current.subject),
        body:
          current.replyBody ||
          templateFor(triage?.topic ?? "general").body(current.name),
        notes: current.internalNotes ?? "",
      }
    : null;

  function patchDraft(patch: Partial<{ subject: string; body: string; notes: string }>) {
    if (!current || !draft) return;
    setDrafts((d) => ({ ...d, [current.id]: { ...draft, ...patch } }));
  }

  function applyTemplate(topicId: string) {
    if (!current) return;
    const t = REPLY_TEMPLATES.find((x) => x.id === topicId);
    if (!t) return;
    patchDraft({ subject: t.subject(current.subject), body: t.body(current.name) });
  }

  /** Advance to the next unfinished item after acting on the current one. */
  function advance() {
    const remaining = queue.filter((r) => r.id !== current?.id);
    select(remaining[Math.min(index, remaining.length - 1)]?.id ?? null);
  }

  function markHandled(handled: boolean, thenAdvance = true) {
    if (!current) return;
    const id = current.id;
    startTransition(async () => {
      const res = await setContactHandled(id, handled);
      setRows((rs) =>
        rs.map((r) =>
          r.id === id
            ? { ...r, handled: res.handled, handledAt: res.handled ? new Date().toISOString() : null }
            : r
        )
      );
      toast({ title: handled ? "Marked handled" : "Reopened", variant: "success" });
      if (handled && thenAdvance && filter === "open") advance();
    });
  }

  function sendReply() {
    if (!current || !draft) return;
    const id = current.id;
    startTransition(async () => {
      const res = await replyToContact(id, draft.subject, draft.body);
      if (res.ok) {
        setRows((rs) =>
          rs.map((r) =>
            r.id === id
              ? { ...r, handled: true, handledAt: new Date().toISOString(), repliedAt: new Date().toISOString() }
              : r
          )
        );
        toast({ title: "Reply sent", description: current.email, variant: "success" });
        if (filter === "open") advance();
      } else {
        toast({ title: "Not sent", description: res.error, variant: "destructive" });
      }
    });
  }

  function saveNotes() {
    if (!current || !draft) return;
    const id = current.id;
    startTransition(async () => {
      await saveContactNotes(id, draft.notes);
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, internalNotes: draft.notes } : r)));
      toast({ title: "Notes saved", variant: "success" });
    });
  }

  function removeMessage() {
    if (!current) return;
    if (!window.confirm(`Delete the message from ${current.email}? This cannot be undone.`))
      return;
    const id = current.id;
    startTransition(async () => {
      await deleteContactMessage(id);
      setRows((rs) => rs.filter((r) => r.id !== id));
      toast({ title: "Message deleted", variant: "success" });
      advance();
    });
  }

  useQueueKeys({
    onNext: () => move(1),
    onPrev: () => move(-1),
    onPrimary: () => markHandled(true),
    onSave: saveNotes,
    onSkip: () => move(1),
    onEscape: () => select(null),
    enabled: !pending,
  });

  const openCount = rows.filter((r) => !r.handled).length;
  const sender = current ? senders[current.email.toLowerCase()] : undefined;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Contact triage</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Read, answer, and close every message without leaving this screen.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5">
          {(["open", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filter === f ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f} {f === "open" ? `(${openCount})` : `(${rows.length})`}
            </button>
          ))}
        </div>
      </div>

      <WorkspaceShell
        hasSelection={Boolean(selectedId)}
        onBack={() => select(null)}
        header={
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {queue.length === 0
                  ? "Queue empty"
                  : `Message ${index + 1} of ${queue.length}`}
              </span>
              {current ? (
                <span className="truncate rounded-full border border-border px-2.5 py-0.5 text-xs">
                  {current.name} · {formatDate(current.createdAt)}
                </span>
              ) : null}
            </div>
            <div className="flex shrink-0 gap-1.5">
              <KeyHint keys="J / K" label="move" />
              <KeyHint keys="⌘↵" label="handle + next" />
            </div>
          </div>
        }
        queue={
          <>
            <PaneLabel>Queue</PaneLabel>
            {queue.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                <Inbox className="mx-auto mb-2 h-5 w-5" />
                {filter === "open" ? "Nothing waiting. Inbox zero." : "No messages yet."}
              </div>
            ) : (
              <div className="pb-3">
                {queue.map((m, i) => (
                  <QueueRow
                    key={m.id}
                    index={i}
                    active={current?.id === m.id}
                    onSelect={() => select(m.id)}
                    title={m.name}
                    meta={m.subject || m.message.slice(0, 60)}
                    muted={m.handled}
                    trailing={
                      m.handled ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <span className="block h-1.5 w-1.5 rounded-full bg-brand" />
                      )
                    }
                  />
                ))}
              </div>
            )}
          </>
        }
        aside={
          current && draft ? (
            <div className="pb-4">
              <PaneLabel>Sender</PaneLabel>
              <div className="border-y border-border">
                <FieldRow label="Email">
                  <a href={`mailto:${current.email}`} className="hover:underline">
                    {current.email}
                  </a>
                </FieldRow>
                <FieldRow label="Account">
                  {sender?.hasAccount ? (
                    <span className="inline-flex items-center gap-1">
                      <UserIcon className="h-3.5 w-3.5" /> Registered
                    </span>
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </FieldRow>
                <FieldRow label="Saved plans">{sender?.planCount ?? 0}</FieldRow>
                <FieldRow label="Prior messages" attention={(sender?.priorMessages ?? 0) > 0}>
                  {sender?.priorMessages ?? 0}
                </FieldRow>
              </div>

              <PaneLabel>Reply</PaneLabel>
              <div className="px-4">
                <div className="flex flex-wrap gap-1.5">
                  {REPLY_TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => applyTemplate(t.id)}
                      title={t.description}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        triage?.topic === t.id
                          ? "border-brand bg-brand/10 text-foreground"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {triage?.topic === t.id && !triage.isFallback ? "↵ " : ""}
                      {t.label}
                    </button>
                  ))}
                </div>
                {triage && !triage.isFallback ? (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Suggested from this message&apos;s wording. Edit before sending.
                  </p>
                ) : null}

                <label className="mt-3 block text-xs text-muted-foreground">Subject</label>
                <Input
                  value={draft.subject}
                  onChange={(e) => patchDraft({ subject: e.target.value })}
                  className="mt-1 h-10"
                />
                <label className="mt-3 block text-xs text-muted-foreground">Body</label>
                <Textarea
                  value={draft.body}
                  onChange={(e) => patchDraft({ body: e.target.value })}
                  rows={12}
                  className="mt-1 text-sm"
                />
                <Button
                  onClick={sendReply}
                  disabled={pending}
                  variant="brand"
                  className="mt-3 w-full"
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send reply &amp; close
                </Button>
                {current.repliedAt ? (
                  <p className="mt-2 text-[11px] text-emerald-700">
                    Replied {formatDate(current.repliedAt)}.
                  </p>
                ) : null}
              </div>

              <PaneLabel>Internal note</PaneLabel>
              <div className="px-4">
                <Textarea
                  value={draft.notes}
                  onChange={(e) => patchDraft({ notes: e.target.value })}
                  rows={3}
                  placeholder="Only visible here."
                  className="text-sm"
                />
                <Button
                  onClick={saveNotes}
                  disabled={pending}
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                >
                  Save note <span className="ml-1 font-mono text-[10px]">⌘S</span>
                </Button>
              </div>
            </div>
          ) : null
        }
        actionBar={
          current ? (
            <div className="flex flex-wrap items-center gap-2">
              {current.handled ? (
                <Button onClick={() => markHandled(false, false)} disabled={pending} variant="outline">
                  <RotateCcw className="h-4 w-4" /> Reopen
                </Button>
              ) : (
                <Button onClick={() => markHandled(true)} disabled={pending} variant="brand">
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Handle &amp; next
                  <span className="ml-1 font-mono text-[10px] opacity-70">⌘↵</span>
                </Button>
              )}
              <Button onClick={() => move(1)} disabled={pending} variant="outline">
                <SkipForward className="h-4 w-4" /> Skip
              </Button>
              <Button asChild variant="outline">
                <a href={`mailto:${current.email}?subject=${encodeURIComponent(draft?.subject ?? "")}`}>
                  <Mail className="h-4 w-4" /> Open in mail app
                </a>
              </Button>
              <Button
                onClick={removeMessage}
                disabled={pending}
                variant="ghost"
                className="ml-auto text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          ) : null
        }
      >
        {current ? (
          <article className="p-5 sm:p-6">
            {triage && triage.flags.length > 0 ? (
              <div className="mb-5 space-y-2">
                {triage.flags.map((f) => (
                  <div
                    key={f.id}
                    className={`flex gap-2.5 rounded-xl border p-3 text-sm ${
                      f.severity === "blocker"
                        ? "border-amber-300 bg-amber-50 text-amber-900"
                        : "border-border bg-muted/40"
                    }`}
                  >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <div className="font-medium">{f.label}</div>
                      <p className="mt-0.5 text-xs leading-relaxed opacity-90">{f.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={current.handled ? "success" : "outline"}>
                {current.handled ? "handled" : "open"}
              </Badge>
              {triage && !triage.isFallback ? (
                <Badge variant="brand">{TOPIC_LABELS[triage.topic]}</Badge>
              ) : null}
              {current.repliedAt ? <Badge variant="success">replied</Badge> : null}
            </div>

            <h2 className="mt-3 font-serif text-2xl font-medium tracking-tight">
              {current.subject || "(no subject)"}
            </h2>
            <div className="mt-1 text-sm text-muted-foreground">
              {current.name} &lt;{current.email}&gt; · {formatDate(current.createdAt, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
            {current.handledAt ? (
              <div className="mt-1 text-xs text-emerald-700">
                Closed {formatDate(current.handledAt)}
                {current.handledByEmail ? ` by ${current.handledByEmail}` : ""}
              </div>
            ) : null}

            <div className="mt-5 whitespace-pre-line text-base leading-relaxed text-foreground/90">
              {current.message}
            </div>
          </article>
        ) : (
          <div className="flex h-full min-h-[16rem] items-center justify-center p-8 text-center text-sm text-muted-foreground">
            {queue.length === 0
              ? "Nothing to triage."
              : "Pick a message from the queue, or press J to start."}
          </div>
        )}
      </WorkspaceShell>
    </div>
  );
}
