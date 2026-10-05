"use client";

import { useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import styles from "./brand-select.module.css";

/** One shared, keyboard-accessible menu for calculator choices, including portals. */
export function BrandSelect({ id, label, value, onChange, options, describedBy }: {
  id?: string; label: string; value: string; onChange: (value: string) => void;
  options: readonly { value: string; label: string }[]; describedBy?: string;
}) {
  const hidden = useRef<HTMLElement[]>([]);
  function restore() { for (const element of hidden.current) element.inert = false; hidden.current = []; }
  function isolate(node: HTMLDivElement | null) {
    restore();
    if (!node) return;
    // Radix traps focus and hides siblings from assistive technology. Inert also
    // prevents the hidden page controls from receiving browser keyboard focus.
    for (const child of Array.from(document.body.children)) {
      if (child instanceof HTMLElement && !child.contains(node) && !child.hasAttribute("data-radix-focus-guard") && !child.inert) {
        child.inert = true; hidden.current.push(child);
      }
    }
  }
  return <Select value={value} onValueChange={onChange}>
    <SelectTrigger id={id} aria-label={label} aria-describedby={describedBy} className={styles.trigger}><SelectValue/></SelectTrigger>
    <SelectContent ref={isolate} onCloseAutoFocus={restore} className={styles.menu} sideOffset={4} collisionPadding={12} position="popper">
      {options.map(option => <SelectItem className={styles.option} key={option.value} value={option.value}>{option.label}</SelectItem>)}
    </SelectContent>
  </Select>;
}
