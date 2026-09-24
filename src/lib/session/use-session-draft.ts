"use client";
import { useCallback, useRef, useSyncExternalStore, type SetStateAction } from "react";
import { createTabStore } from "./tab-store";
const store = createTabStore(() => typeof window === "undefined" ? null : window.sessionStorage);
if (typeof window !== "undefined") {
  window.addEventListener("pageshow", event => { if (event.persisted) store.refresh(); });
}
/** SSR renders the empty/default value; the browser then restores this tab's snapshot. */
export function useSessionDraft<T>(key: string, initial: T, parse: (raw: unknown) => T, seed?: () => unknown) {
  const ref = useRef({ key, initial, parse, seed });
  if (ref.current.key !== key) ref.current = { key, initial, parse, seed };
  const get = useCallback(() => store.read(key, ref.current.initial, ref.current.parse, ref.current.seed), [key]);
  const server = useCallback(() => ref.current.initial, [key]);
  const value = useSyncExternalStore(store.subscribe, get, server);
  const set = useCallback((next: SetStateAction<T>) => {
    const updated = typeof next === "function" ? (next as (old: T) => T)(get()) : next;
    store.write(key, ref.current.parse(updated));
  }, [get, key]);
  return [value, set] as const;
}
export function useSessionValue<T extends string | number | boolean>(key: string, initial: T) {
  return useSessionDraft<T>(key, initial, raw => typeof raw === typeof initial && (typeof raw !== "number" || Number.isFinite(raw)) && (typeof raw !== "string" || raw.length <= 512) ? raw as T : initial);
}
