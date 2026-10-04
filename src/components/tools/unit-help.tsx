"use client";
import Link from "next/link";
import { useRef } from "react";
import { CircleHelp } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import styles from "./unit-help.module.css";
export function UnitHelp({compact=false}:{compact?:boolean}={}){const title=useRef<HTMLHeadingElement>(null);return <Dialog><DialogTrigger asChild><button type="button" className={`${styles.trigger} ${compact?styles.compact:""}`} aria-label="What do these units mean?"><CircleHelp size={16} aria-hidden="true"/>{compact?"Units":"What do these units mean?"}</button></DialogTrigger><DialogContent className={styles.dialog} onOpenAutoFocus={event=>{event.preventDefault();title.current?.focus({preventScroll:true});}}>
 <div className={styles.heading}><DialogTitle ref={title} tabIndex={-1}>Units, explained simply</DialogTitle><DialogDescription>Copy the number and the unit from your label. The unit tells us what the number means.</DialogDescription></div>
 <div className={styles.body} tabIndex={0} role="region" aria-label="Unit definitions and examples"><dl>
  <div><dt>mg: milligrams</dt><dd>A unit of mass: how much material there is. <strong>1 mg = 1,000 mcg.</strong> For example, 0.5 mg and 500 mcg are the same amount.</dd></div>
  <div><dt>mcg: micrograms</dt><dd>A smaller mass unit. <strong>1 mcg = 0.001 mg.</strong> Divide mcg by 1,000 to get mg. Some labels use µg, which also means micrograms.</dd></div>
  <div><dt>mL: milliliters</dt><dd>How much space the liquid takes up. This is called volume. The mL number alone does not tell you how much material is in that liquid.</dd></div>
  <div><dt>U-100: a scale for liquid volume</dt><dd>On a scale marked U-100, <strong>100 units = 1 mL</strong>, so 25 units = 0.25 mL. This rule is only for U-100. Check the real device's label, marks and how much it holds.</dd></div>
  <div><dt>mg/mL or mcg/mL: amount in each mL</dt><dd>This is called concentration. <strong>5 mg/mL means each 1 mL holds 5 mg.</strong> To change an amount in mg or mcg into mL, you need this number. It does not tell you what amount to use.</dd></div>
 </dl><p className={styles.note}>U-100 scale units are not the same as a product's IU (International Units). There is no universal IU-to-mg conversion. These examples explain arithmetic and do not select an amount or a device to use.</p><Link className={styles.link} href="/learn/glossary">Read the full unit glossary</Link></div>
 <div className={styles.footer}><DialogClose asChild><button type="button" className={styles.done}>Got it, go back</button></DialogClose></div>
 </DialogContent></Dialog>;}
