"use client";
import { createElement, useState } from 'react';
import Script from 'next/script';
import { MASS_EMBED_CODE } from '@/lib/growth/mass-widget';
import { trackUsage } from '@/lib/analytics';
export function EmbedPreview() {
  const [message, setMessage] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(MASS_EMBED_CODE); setMessage('Embed code copied. Paste it into a custom HTML block on your website.'); trackUsage('embed_code_copied'); }
    catch { setMessage('Select and copy the code in the field below.'); }
  }
  return <div className="space-y-5">
    {createElement('bacwater-mass-converter', {}, <a href="/tools/mg-to-mcg">Open the free mg to mcg converter</a>)}
    <Script src="/embed/mass-converter.js" strategy="afterInteractive"/>
    <label htmlFor="embed-code" className="block font-medium">Add the converter to your website</label>
    <textarea id="embed-code" readOnly value={MASS_EMBED_CODE} rows={5} className="w-full rounded-xl border border-border bg-white p-4 font-mono text-xs" onFocus={e => e.currentTarget.select()}/>
    <button type="button" onClick={copy} className="min-h-11 rounded-lg bg-foreground px-5 py-3 text-background">Copy embed code</button>
    <p role="status" className="text-sm">{message}</p>
    <p className="text-sm leading-relaxed">Paste the code into a custom HTML block that allows scripts. It resizes to the available width. If your platform removes scripts, link to the <a className="underline" href="/tools/mg-to-mcg">full converter</a> instead. Sites with a Content Security Policy may need their developer to allow this script and its component styles.</p>
  </div>;
}
