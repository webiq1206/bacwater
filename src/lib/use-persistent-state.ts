"use client";

// In-progress calculator fields belong to this tab, not the whole device.
// The shared store writes synchronously and handles key changes without stale effects.
export { useSessionState as usePersistentState } from "./calculator-session";
