/** Simple unit converters used by standalone tools. */
export const mgToMcg = (mg: number) => mg * 1000;
export const mcgToMg = (mcg: number) => mcg / 1000;
export const mlToU100 = (ml: number) => ml * 100;
export const u100ToMl = (u: number) => u / 100;
export const iuToMl = (iu: number, iuPerMl: number) =>
  iuPerMl > 0 ? iu / iuPerMl : 0;
