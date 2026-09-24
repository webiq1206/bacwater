import { AFFILIATE_DISCLOSURE, RESEARCH_ONLY_NOTICE } from "@/lib/partners/affiliate";
export function AffiliateDisclosure({ paid, className, research = true }: { paid: boolean; className?: string; research?: boolean }) {
  return <p className={className} data-affiliate-disclosure>{paid ? AFFILIATE_DISCLOSURE : "External supplier link. No paid referral is active."}{research && <> {RESEARCH_ONLY_NOTICE}</>}</p>;
}
