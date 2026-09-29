"use client";
import Link from "next/link";
import { useRef } from "react";
import { CircleHelp } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import styles from "./unit-help.module.css";
export function UnitHelp(){const title=useRef<HTMLHeadingElement>(null);return <Dialog><DialogTrigger asChild><button type="button" className={styles.trigger}><CircleHelp size={16} aria-hidden="true"/>What do these units mean?</button></DialogTrigger><DialogContent className={styles.dialog} onOpenAutoFocus={event=>{event.preventDefault();title.current?.focus({preventScroll:true});}}>
 <div className={styles.heading}><DialogTitle ref={title} tabIndex={-1}>Units, explained simply</DialogTitle><DialogDescription>mg and mcg measure mass. mL measures liquid volume. U-100 identifies a specific syringe scale.</DialogDescription></div>
 <div className={styles.body} tabIndex={0} role="region" aria-label="Unit definitions and examples"><dl>
  <div><dt>mg: milligrams</dt><dd>The mass of a substance. <strong>1 mg = 1,000 mcg.</strong> For example, 0.5 mg and 500 mcg are the same amount.</dd></div>
  <div><dt>mcg: micrograms</dt><dd>A smaller mass unit. <strong>1 mcg = 0.001 mg.</strong> Divide mcg by 1,000 to get mg. Some labels use µg, which also means micrograms.</dd></div>
  <div><dt>mL: milliliters</dt><dd>The volume of liquid. <strong>1 mL = 1,000 microliters.</strong> Volume alone does not tell you how much compound the liquid contains.</dd></div>
  <div><dt>U-100: 100 scale units per mL</dt><dd>On a U-100 scale, <strong>100 units = 1 mL</strong>, so 25 units = 0.25 mL. This relationship applies only to that scale. Check the actual device's scale, capacity and markings.</dd></div>
  <div><dt>mg/mL or mcg/mL: concentration</dt><dd>The mass in each mL of liquid. <strong>1 mg/mL = 1,000 mcg/mL.</strong> To convert mass into a volume, you need the concentration.</dd></div>
 </dl><p className={styles.note}>U-100 scale units are not the same as a product's IU (International Units). There is no universal IU-to-mg conversion. These examples explain arithmetic and do not select an amount or a device to use.</p><Link className={styles.link} href="/learn/glossary">Read the full unit glossary</Link></div>
 </DialogContent></Dialog>;}
