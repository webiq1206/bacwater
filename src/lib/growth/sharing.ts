/** Public tool links must never carry a visitor's inputs, notes or plan IDs. */
export function publicToolShareUrl(path: string): string | null {
  const clean = path.split(/[?#]/, 1)[0];
  if (!['/', '/tools', '/share-tools', '/peptide-calculator', '/plan', '/plan/new', '/tools/bac-water', '/tools/mg-to-mcg', '/tools/syringe-units', '/tools/dose', '/tools/reverse-bac', '/tools/supplies', '/tools/vial-labels'].includes(clean)
    && !/^\/calculate\/(?:product\/)?[a-z0-9-]+$/.test(clean)) return null;
  const url = new URL(clean === '/plan/new' ? '/peptide-calculator' : clean, 'https://bacwater.ai');
  url.searchParams.set('utm_source', 'shared');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', 'free_calculators');
  return url.href;
}

/** Only fixed categories reach analytics, never raw referrers or arbitrary UTM text. */
export function growthArrivalEvent(search: string, referrer = "") {
  const source = new URLSearchParams(search).get('utm_source');
  switch (source) {
    case 'shared': return 'arrival_shared' as const;
    case 'embed': return 'arrival_embed' as const;
    case 'pinterest': return 'arrival_pinterest' as const;
    case 'youtube': return 'arrival_youtube' as const;
    case 'chatgpt.com': return 'arrival_ai_search' as const;
  }
  // Only the service category leaves the browser. Never send a referrer URL,
  // query, product name or visitor-supplied campaign text to analytics.
  try {
    const url = new URL(referrer);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    const host = url.hostname.toLowerCase().replace(/^www\./, '');
    if (['google.com', 'google.co.uk', 'google.ca', 'google.com.au'].includes(host)) return 'arrival_google' as const;
    if (host === 'bing.com') return 'arrival_bing' as const;
    if (['chatgpt.com', 'chat.openai.com', 'perplexity.ai', 'copilot.microsoft.com', 'gemini.google.com', 'claude.ai'].includes(host)) return 'arrival_ai_search' as const;
  } catch { /* Missing or malformed referrers stay unattributed. */ }
  return null;
}
