import { ImageResponse } from "next/og";
export const runtime="nodejs";
export const size={width:192,height:192};
export const contentType="image/png";
export default function Icon(){return new ImageResponse(<div style={{display:"flex",width:"100%",height:"100%",alignItems:"center",justifyContent:"center",background:"#f7f8f2"}}><svg width="168" height="168" viewBox="0 0 48 48"><rect x="1" y="1" width="46" height="46" rx="14" fill="#18382d"/><path d="M24 9c-4 6-11 13-11 19a11 11 0 0 0 22 0c0-6-7-13-11-19Z" fill="#dfedb3"/><path d="M19 26h10M19 31h6" stroke="#18382d" strokeWidth="2.2" strokeLinecap="round"/></svg></div>,size);}
