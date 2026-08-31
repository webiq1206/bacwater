"use client";

import { useEffect } from "react";

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}

export interface QueueKeyHandlers {
  /** j / ArrowDown */
  onNext?: () => void;
  /** k / ArrowUp */
  onPrev?: () => void;
  /** Cmd/Ctrl + Enter. Fires even while a field has focus. */
  onPrimary?: () => void;
  /** Cmd/Ctrl + S. Fires even while a field has focus. */
  onSave?: () => void;
  /** s (only when not typing) */
  onSkip?: () => void;
  /** Escape */
  onEscape?: () => void;
  enabled?: boolean;
}

/**
 * Keyboard model shared by every processing workspace, so muscle memory
 * transfers between the contact, content, plan, and user queues.
 *
 * Bare letters are ignored while a field has focus (otherwise typing "j" in a
 * body textarea would jump records); the modifier chords are not, because
 * "save what I just typed" has to work from inside the field.
 */
export function useQueueKeys({
  onNext,
  onPrev,
  onPrimary,
  onSave,
  onSkip,
  onEscape,
  enabled = true,
}: QueueKeyHandlers) {
  useEffect(() => {
    if (!enabled) return;
    function handler(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "Enter" && onPrimary) {
        e.preventDefault();
        onPrimary();
        return;
      }
      if (mod && e.key.toLowerCase() === "s" && onSave) {
        e.preventDefault();
        onSave();
        return;
      }
      if (e.key === "Escape" && onEscape) {
        onEscape();
        return;
      }
      if (mod || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      switch (e.key) {
        case "j":
        case "ArrowDown":
          if (onNext) {
            e.preventDefault();
            onNext();
          }
          break;
        case "k":
        case "ArrowUp":
          if (onPrev) {
            e.preventDefault();
            onPrev();
          }
          break;
        case "s":
          if (onSkip) {
            e.preventDefault();
            onSkip();
          }
          break;
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, onNext, onPrev, onPrimary, onSave, onSkip, onEscape]);
}
