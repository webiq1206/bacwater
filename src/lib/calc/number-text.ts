/** Decimal notation only, with software bounds unrelated to medical suitability. */
export function positiveDecimal(text:string):number|null {
 if(typeof text!=="string"||text.length>64||!/^\+?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d{1,3})?$/i.test(text.trim()))return null;
 const n=Number(text);return Number.isFinite(n)&&n>=1e-12&&n<=1e12?n:null;
}
