import type { MassUnit } from "@/lib/calc/mass-text";
export type MassEntry={unit:MassUnit;text:string};
export const EMPTY_MASS_ENTRY:MassEntry={unit:"mg",text:""};
export function readMassEntry(r:unknown):MassEntry {const v=r&&typeof r==="object"?r as Record<string,unknown>:{};return {unit:v.unit==="mcg"?"mcg":"mg",text:typeof v.text==="string"?v.text.slice(0,64):""};}
export type VolumeEntry={direction:"ml"|"units";text:string};
export const EMPTY_VOLUME_ENTRY:VolumeEntry={direction:"units",text:""};
export function readVolumeEntry(r:unknown):VolumeEntry {const v=r&&typeof r==="object"?r as Record<string,unknown>:{};return {direction:v.direction==="ml"?"ml":"units",text:typeof v.text==="string"?v.text.slice(0,64):""};}
