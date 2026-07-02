/**
 * Load a Google font as TrueType data for next/og (satori). Requesting a text
 * subset with the default fetch user-agent makes Google Fonts return a
 * truetype/opentype `src`, which is the format satori can embed. Returns null
 * on any failure so callers can fall back to a system font gracefully.
 */
export async function loadGoogleFont(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(
      text
    )}`;
    const css = await (await fetch(url)).text();
    const src = css.match(
      /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/
    );
    if (!src) return null;
    const res = await fetch(src[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}
