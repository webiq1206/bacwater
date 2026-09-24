"use client";
import type { CSSProperties } from "react";
import { formatLabelDate, labelTypography, type LabelSize, type LabelPrintData, DEFAULT_LABEL_SIZE } from "@/lib/labels/layout";
export interface VialLabelData {
  publicId: string;
  peptideName: string;
  vialStrengthMg: number;
  /** Legacy property name; this is the recorded final liquid volume, not an instruction to add water. */
  bacWaterMl: string;
  doseReading: string;
  injectionsPerWeek?: number | null;
  /** Legacy values are deliberately not used to infer stability. */
  shelfDays: number | null;
  concentration?: string;
  defaultMixDate?: string;
}
export function VialLabel({ data, size = DEFAULT_LABEL_SIZE }: { data: LabelPrintData; size?: LabelSize }) {
  const font = labelTypography(size);
  const style = { "--label-width": `${size.width}mm`, "--label-height": `${size.height}mm`, "--label-pad": `${font.padding}mm`, "--label-title": `${font.title}pt`, "--label-body": `${font.body}pt`, "--label-date": `${font.date}pt` } as CSSProperties;
  return <div className="vial-label" style={style} data-vial-label data-expiry={data.useBy} aria-label={`Label for ${data.name}`}>
    <div className="vial-label-content"><strong className="vl-name">{data.name}</strong><div className="vl-concentration">{data.concentration}</div>
      <div className="vl-dates"><div>Mixed: <strong>{formatLabelDate(data.mixDate)}</strong></div><div>Use by: <strong>{data.useBy ? formatLabelDate(data.useBy) : "NOT SET"}</strong></div></div>
    </div>
  </div>;
}
export const LABEL_SHEET_STYLES = `
.label-composer{color:#18382d}.label-controls{display:grid;gap:18px}.label-controls h1{font-size:28px;line-height:1.2;margin:0}.label-controls p{font-size:14px;line-height:1.65;margin:0}.label-settings{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;padding:18px;border:1px solid #cbd8c1;border-radius:14px;background:#f5f8ee}.label-settings label,.label-plan-settings label{display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.5;min-width:0}.label-settings input,.label-settings select,.label-plan-settings input{width:100%;min-width:0;min-height:44px;padding:9px 11px;border:1px solid #b7c7aa;border-radius:8px;background:white;color:#18382d;font-size:16px}.label-plan-settings{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:12px}.label-plan-block{border:1px solid #cbd8c1;border-radius:14px;padding:18px}.label-plan-block h2{margin:0 0 12px;font-size:19px}.label-tools{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.label-tools button{min-height:46px;border:1px solid #a8ba97;border-radius:10px;padding:11px 17px;font-size:14px;cursor:pointer}.label-tools .label-primary{background:#18382d;color:white}.label-tools button:disabled{opacity:.5;cursor:not-allowed}.label-message{font-size:13px;line-height:1.6}.label-error{color:#8b3729}.label-sheet{display:grid;grid-template-columns:repeat(auto-fill,calc(var(--label-width) * var(--preview-scale,2)));gap:20px;justify-content:center;margin-top:20px;--preview-scale:2}.label-tile{min-width:0}.label-tile>label{display:flex;flex-direction:column;gap:5px;margin-top:12px;font-size:12px}.label-tile input{min-height:42px;width:100%;max-width:100%;padding:8px;border:1px solid #b7c7aa;border-radius:7px;background:white;font-size:15px}.vial-label{width:calc(var(--label-width) * var(--preview-scale,1));height:calc(var(--label-height) * var(--preview-scale,1));box-sizing:border-box;padding:calc(var(--label-pad) * var(--preview-scale,1));border:.15mm dashed #8a9383;background:white;color:#101810;overflow:hidden;font-family:Arial,Helvetica,sans-serif}.vial-label-content{display:flex;flex-direction:column;gap:calc(.3mm * var(--preview-scale,1));min-width:0}.vl-name{display:block;font-size:calc(var(--label-title) * var(--preview-scale,1));line-height:1.1;font-weight:700;overflow-wrap:anywhere;flex-shrink:0}.vl-concentration{font-size:calc(var(--label-body) * var(--preview-scale,1));line-height:1.12;overflow-wrap:anywhere;flex-shrink:0}.vl-dates{font-size:calc(var(--label-date) * var(--preview-scale,1));line-height:1.2;flex-shrink:0}.vl-dates strong{font-weight:600}.label-calibration{width:20mm;border-bottom:.25mm solid black;font:8pt Arial;padding-top:3mm;margin:4mm 0 0}.label-composer :is(input,select,button):focus-visible{outline:3px solid #527144;outline-offset:2px}
@media(max-width:480px){.label-settings{grid-template-columns:minmax(0,1fr)}.label-controls h1{font-size:25px}.label-plan-settings{grid-template-columns:minmax(0,1fr)}.label-tools button{flex:1}.label-sheet{grid-template-columns:repeat(auto-fit,calc(var(--label-width) * var(--preview-scale,2)))}}
@media print{
body:has(.label-composer){margin:0!important;padding:0!important;display:block!important;background:white!important}
body:has(.label-composer) header,body:has(.label-composer) footer,body:has(.label-composer) [data-age-gate],body:has(.label-composer) .bac-privacy-preferences,body:has(.label-composer) .bac-bottom-nav,body:has(.label-composer) .bac-bottom-spacer,body:has(.label-composer) .no-print{display:none!important}
body:has(.label-composer) #main > div,body:has(.label-composer) .bac-page-content > div,body:has(.label-composer) #main,body:has(.label-composer) .bac-site-frame,body:has(.label-composer) .bac-page-content{margin:0!important;padding:0!important;max-width:none!important;min-height:0!important;display:block!important}
.label-composer{position:absolute;left:0;top:0;width:100%;margin:0!important;padding:0!important}.label-sheet{--preview-scale:1!important;grid-template-columns:repeat(auto-fill,var(--label-width));gap:2mm;justify-content:start;margin:0!important}.label-tile,.vial-label{break-inside:avoid;page-break-inside:avoid}.label-tile{margin:0!important}.vial-label{border:.15mm solid #88907f}.label-sheet[data-paper=label]{display:block}.label-sheet[data-paper=label] .label-tile{break-after:page;page-break-after:always}.label-sheet[data-paper=label] .label-tile:last-child{break-after:auto;page-break-after:auto}.label-sheet[data-paper=label] .vial-label{border:0}.label-sheet[data-paper=label]~.label-calibration{display:none}
}
`;
