"use client";
import styles from "./conversion-direction.module.css";
export function ConversionDirection<T extends string>({value,onChange,options,label}:{value:T;onChange:(value:T)=>void;options:readonly {value:T;label:string}[];label:string}) {
 return <div className={styles.directions} role="group" aria-label={label}>{options.map(option=><button key={option.value} type="button" aria-pressed={value===option.value} onClick={()=>onChange(option.value)}>{option.label}</button>)}</div>;
}
export const MASS_DIRECTIONS = [{value:"mg",label:"mg → mcg"},{value:"mcg",label:"mcg → mg"}] as const;
export const SCALE_DIRECTIONS = [{value:"units",label:"U-100 → mL"},{value:"ml",label:"mL → U-100"}] as const;
