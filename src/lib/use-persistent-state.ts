"use client";

import { useEffect, useState } from "react";

/**
 * A useState that mirrors its value to localStorage per device. A calculator
 * therefore starts blank for a first-time visitor (the `initial` value) but
 * remembers whatever a returning visitor last typed. Nothing is ever
 * pre-populated with example data.
 *
 * To avoid a hydration mismatch, the server and first client paint always
 * render `initial`; the saved value is loaded in an effect after mount. Saving
 * is gated on `loaded` so the first pass never clobbers stored data with the
 * blank initial value.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore unavailable or malformed storage */
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota or unavailable storage */
    }
  }, [key, value, loaded]);

  return [value, setValue] as const;
}
