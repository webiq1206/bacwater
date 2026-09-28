"use client";
import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { publicToolShareUrl } from '@/lib/growth/sharing';
import { trackUsage } from '@/lib/analytics';
import { toast } from '@/components/ui/toaster';

export function ShareToolButton({ path, compact = false }: { path: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const url = publicToolShareUrl(path);
  if (!url) return null;
  async function share() {
    if (!url) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Free calculation tools | BACwater.ai', text: 'Check the math with your own numbers. Free, no account needed.', url });
        trackUsage('calculator_shared');
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackUsage('calculator_shared');
      toast({ title: 'Calculator link copied', description: 'Your entered values and private notes are not included.' });
    } catch {
      toast({ title: 'Copy this calculator link', description: url });
    }
  }
  return <button type="button" onClick={share} aria-label={copied ? 'Calculator link copied' : 'Share this calculator without your values'} title="Share the calculator, not your values" className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg text-sm ${compact ? 'px-2' : 'border border-border px-4'}`}>
    {copied ? <Check size={18} aria-hidden="true"/> : <Share2 size={18} aria-hidden="true"/>}
    {!compact && (copied ? 'Link copied' : 'Share calculator')}
  </button>;
}
