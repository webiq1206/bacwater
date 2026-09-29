import { convertMassText, type MassUnit } from "./mass-text";
import { editableDecimal, switchMassDirection } from "./conversion-direction";
export interface MassFieldDraft {unit:MassUnit;text:string;canonical:string}
export function syncMassField(draft:MassFieldDraft,value:string,canonicalUnit:MassUnit):MassFieldDraft {
 if(draft.canonical===value)return draft;
 const converted=convertMassText(value,canonicalUnit);
 const text=converted.kind==="value"?editableDecimal(converted[draft.unit]):value;
 return text===null?{unit:canonicalUnit,text:value,canonical:value}:{...draft,text,canonical:value};
}
export function editMassField(draft:MassFieldDraft,text:string,canonicalUnit:MassUnit):MassFieldDraft {
 const converted=convertMassText(text,draft.unit);
 // Invalid text must remain invalid in the engine, never fall back to an old amount.
 const canonical=converted.kind==="value"?editableDecimal(converted[canonicalUnit])??"invalid":text;
 return {...draft,text,canonical};
}
export function switchMassField(draft:MassFieldDraft,unit:MassUnit):MassFieldDraft|null {
 const next=switchMassDirection(draft,unit);
 return next?{...draft,...next}:null;
}
