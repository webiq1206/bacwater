/** A small, testable tab-scoped store. Nothing is sent to a server or another tab. */
export interface DraftStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export const SESSION_PREFIX = "bacwater.session.v2.";
export function createTabStore(getStorage: () => DraftStorage | null) {
  const cache = new Map<string, unknown>();
  const listeners = new Set<() => void>();
  function read<T>(key: string, initial: T, parse: (raw: unknown) => T, seed?: () => unknown): T {
    if (cache.has(key)) return cache.get(key) as T;
    let value = initial;
    try {
      const raw = getStorage()?.getItem(SESSION_PREFIX + key);
      if (raw && raw.length <= 32000) value = parse(JSON.parse(raw));
      else if (!raw && seed) { const old = seed(); if (old) value = parse(old); }
    } catch { /* A blocked browser store must not break the calculator. */ }
    cache.set(key, value);
    return value;
  }
  function write<T>(key: string, value: T) {
    cache.set(key, value);
    // Synchronous write: clicking a Link immediately after typing cannot lose the last key.
    try { getStorage()?.setItem(SESSION_PREFIX + key, JSON.stringify(value)); } catch {}
    for (const listener of listeners) listener();
  }
  return { read, write, subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    refresh() { cache.clear(); for (const listener of listeners) listener(); } };
}
