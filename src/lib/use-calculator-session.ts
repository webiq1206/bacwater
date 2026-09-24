"use client";
import { useCallback, useRef, useState, useSyncExternalStore, type SetStateAction } from "react";
import { readCalculatorSession, serverCalculatorSession, subscribeCalculatorSession, patchMassDraft, writeSessionTool, sessionToolValue, type MassDraft } from "./calculator-session";
export function useCalculatorSession() {
  return useSyncExternalStore(subscribeCalculatorSession, readCalculatorSession, serverCalculatorSession);
}
export function useMassDraft() { return [useCalculatorSession().mass, patchMassDraft] as const; }
export function useSessionState<T>(key: string, initial: T, shared = true) {
  const first = useRef(initial), state = useCalculatorSession();
  const [local, setLocal] = useState(initial);
  const value = sessionToolValue(state.tools[key], first.current);
  const set = useCallback((next: SetStateAction<T>) => { if (!shared) setLocal(next); else writeSessionTool(key, next, first.current); }, [key,shared]);
  return [shared ? value : local, set] as const;
}
/** Saved-plan edits use isolated React state, never overwrite the active session. */
export function useMassField<K extends keyof MassDraft>(key: K, initial: MassDraft[K], shared = true) {
  const [draft] = useMassDraft(), [local, setLocal] = useState(initial);
  const set = useCallback((value: SetStateAction<MassDraft[K]>) => {
    if (!shared) { setLocal(value); return; }
    patchMassDraft(d => ({ [key]: typeof value === "function" ? (value as (v: MassDraft[K]) => MassDraft[K])(d[key]) : value }));
  }, [shared, key]);
  return [shared ? draft[key] : local, set] as const;
}
export function useMassNumber(key: "vial" | "amount" | "volume", initial: number, shared = true) {
  const [text, setText] = useMassField(key, initial ? String(initial) : "", shared);
  const value = text === "" ? 0 : /^\+?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d{1,3})?$/i.test(text.trim()) ? Number(text) : NaN;
  const set = useCallback((next: SetStateAction<number>) => setText(old => {
    const v = typeof next === "function" ? next(old === "" ? 0 : Number(old)) : next;
    return v === 0 ? "" : String(v);
  }), [setText]);
  return [value, set, text, setText] as const;
}
