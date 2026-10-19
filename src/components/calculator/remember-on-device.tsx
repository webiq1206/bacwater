"use client";
import { useEffect, useState } from "react";
import { useCalculationSession } from "@/lib/session/calculation-session";
import { rememberEnabled, rememberNow, setRememberEnabled } from "@/lib/session/device-memory";
import styles from "@/components/brand/hero-calculator.module.css";

/** One checkbox: keep these numbers on this device so the next visit starts at the result. */
export function RememberOnDevice() {
  const session = useCalculationSession();
  const [on, setOn] = useState(false);
  useEffect(() => { setOn(rememberEnabled()); }, []);
  // Keep the memory current while it is switched on.
  useEffect(() => { if (on) rememberNow(); }, [on, session.productId, session.peptideSlug, session.customName, session.vialInput, session.vialUnit, session.finalVolume, session.amount, session.amountUnit, session.basis, session.timesPerWeek]);
  return <label className={styles.remember}><input type="checkbox" checked={on} onChange={e => { setOn(e.target.checked); setRememberEnabled(e.target.checked); }}/><span>Remember my numbers on this device</span></label>;
}
