import {cn} from "@/lib/utils";
export interface GlanceItem{label:string;value:React.ReactNode;sub?:React.ReactNode}
export function AtAGlance({items,columns=4,className}:{items:GlanceItem[];columns?:2|3|4;className?:string}){
 const cols=columns===2?'grid-cols-1 min-[380px]:grid-cols-2':columns===3?'grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3':'grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-4';
 return <dl className={cn('grid gap-px rounded-xl border border-border bg-border',cols,className)}>{items.map((item,i)=><div key={i} className="min-w-0 bg-card px-4 py-3.5 [overflow-wrap:anywhere]"><dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</dt><dd className="mt-1 text-base tabular-nums leading-snug">{item.value}{item.sub&&<span className="mt-0.5 block text-xs text-muted-foreground">{item.sub}</span>}</dd></div>)}</dl>;
}
