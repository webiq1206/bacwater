"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CalcResult } from "@/lib/calc";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const REPLACE = "[[REPLACE]]";

/* ---- tiny, safe Markdown renderer (bold / italic / code / lists) ------------
   Builds React nodes directly — no dangerouslySetInnerHTML, no HTML injection.
   The assistant only emits this small subset. */
function Inline({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) nodes.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`"))
      nodes.push(
        <code key={key++} className="px-1 py-0.5 text-[0.85em] bg-muted rounded">
          {tok.slice(1, -1)}
        </code>
      );
    else nodes.push(<em key={key++}>{tok.slice(1, -1)}</em>);
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).filter((b) => b.trim());
  return (
    <div className="space-y-2 leading-relaxed">
      {blocks.map((b, i) => {
        const lines = b.split("\n").filter((l) => l.trim());
        // Heading line (# / ## …): render as a bold lead line, not literal "#".
        const heading = lines.length === 1 && lines[0].match(/^#{1,6}\s+(.*)$/);
        if (heading) {
          return (
            <p key={i} className="font-semibold text-foreground">
              <Inline text={heading[1]} />
            </p>
          );
        }
        const isList = lines.length > 0 && lines.every((l) => /^\s*([-*]|\d+\.)\s+/.test(l));
        if (isList) {
          return (
            <ul key={i} className="list-disc pl-4 space-y-1">
              {lines.map((l, j) => (
                <li key={j}>
                  <Inline text={l.replace(/^\s*([-*]|\d+\.)\s+/, "")} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            <Inline text={b.replace(/\n/g, " ")} />
          </p>
        );
      })}
    </div>
  );
}

/* Plan-aware starter questions: always the core ones, plus a warning prompt when
   the plan has warnings. All are known-safe (they pass the §9.10 guardrails). */
function suggestionsFor(plan: CalcResult): string[] {
  const base = [
    "Explain my plan in plain English.",
    "Why did it pick that BAC water amount?",
    "What does the unit reading mean on my syringe?",
  ];
  const warns = Array.isArray((plan as unknown as { warnings?: unknown[] }).warnings)
    ? (plan as unknown as { warnings: unknown[] }).warnings
    : [];
  if (warns.length > 0) base.splice(1, 0, "What does the warning on my plan mean?");
  else base.push("How many measurements does my vial give?");
  return base;
}

export function AiAssistantDrawer({ plan }: { plan: CalcResult }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const suggestions = useMemo(() => suggestionsFor(plan), [plan]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  function setLastAssistant(content: string) {
    setMessages((m) => {
      const copy = [...m];
      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === "assistant") {
          copy[i] = { ...copy[i], content };
          break;
        }
      }
      return copy;
    });
  }

  async function send(text: string) {
    if (!text.trim() || pending) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setPending(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan, messages: next }),
      });
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json") || !res.body) {
        const data = await res.json();
        setLastAssistant(data.reply || data.error || "No response.");
      } else {
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let acc = "";
        let replaced = false;
        let tail = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = dec.decode(value, { stream: true });
          if (replaced) {
            tail += chunk;
            setLastAssistant(tail);
            continue;
          }
          const combined = acc + chunk;
          const idx = combined.indexOf(REPLACE);
          if (idx >= 0) {
            replaced = true;
            tail = combined.slice(idx + REPLACE.length);
            setLastAssistant(tail);
          } else {
            acc = combined;
            setLastAssistant(acc);
          }
        }
      }
    } catch {
      setLastAssistant("The assistant is unavailable right now. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const lastIsEmptyAssistant =
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    messages[messages.length - 1].content === "";

  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 p-5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--color-accent-guide-soft)" }}
        >
          <Sparkles className="h-4 w-4" style={{ color: "var(--color-accent-guide)" }} />
        </span>
        <div className="min-w-0">
          <div className="text-sm font-medium">Ask about your plan</div>
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
            It explains the numbers in your plan and answers follow-ups. It never does the
            math itself, and it won&apos;t tell you how much to take or whether something is safe.
          </p>
        </div>
      </div>

      {!open ? (
        <div className="px-5 pb-5">
          <Button className="w-full" variant="brand" size="sm" onClick={() => setOpen(true)}>
            <Sparkles className="h-4 w-4" /> Open assistant
          </Button>
        </div>
      ) : (
        <div className="border-t border-border">
          {/* Conversation */}
          <div ref={scrollRef} className="max-h-80 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 ? (
              <div>
                <div className="text-xs text-muted-foreground">Try one of these:</div>
                <div className="mt-2 flex flex-col gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="text-left border border-border rounded-lg px-3 py-2 text-[13px] hover:bg-muted transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end">
                    <div
                      className="max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm"
                      style={{ background: "var(--color-accent-guide-soft)", color: "var(--color-foreground)" }}
                    >
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex items-start gap-2">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "var(--color-accent-guide-soft)" }}
                    >
                      <Sparkles className="h-3 w-3" style={{ color: "var(--color-accent-guide)" }} />
                    </span>
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2 text-sm text-foreground">
                      {m.content ? (
                        <Markdown text={m.content} />
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <Loader2 className="h-3 w-3 animate-spin" /> Thinking&hellip;
                        </span>
                      )}
                    </div>
                  </div>
                )
              )
            )}
          </div>

          {/* Composer */}
          <form
            className="flex items-center gap-2 border-t border-border p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your plan…"
              className="flex-1 rounded-full border border-input bg-card px-4 h-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              aria-label="Ask about your plan"
            />
            <Button
              type="submit"
              size="icon"
              variant="brand"
              className="rounded-full shrink-0"
              disabled={pending || !input.trim() || lastIsEmptyAssistant}
              aria-label="Send"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
