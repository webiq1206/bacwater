/** Decimal notation only, with software bounds unrelated to medical suitability. */
export function positiveDecimal(text:string):number|null {
 if(typeof text!=="string"||text.length>64||!/^\+?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d{1,3})?$/i.test(text.trim()))return null;
 const n=Number(text);return Number.isFinite(n)&&n>=1e-12&&n<=1e12?n:null;
}

/** Explain the failing field without replacing a valid result with stale math. */
export function decimalError(text: string, label: string, required = false): string {
 if (!text.trim()) return required ? `Enter ${label.toLowerCase()}.` : "";
 if (/^-/.test(text.trim()) || Number(text) === 0) return `${label} must be greater than zero.`;
 if (!/^\+?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d{1,3})?$/i.test(text.trim())) return `${label}: use a number with a decimal point, without commas or unit words.`;
 if (positiveDecimal(text) === null) return `${label} is outside the supported range (0.000000000001 to 1,000,000,000,000).`;
 return "";
}
