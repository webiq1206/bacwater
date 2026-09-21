import Link from "next/link";
export function ReviewedBy({ className = "", updated }: { className?: string; updated?: string }) {
  return <div className={`text-xs text-muted-foreground ${className}`}>Published by <Link href="/editorial-policy" className="underline">BACwater.ai</Link>. General reference, not a medical review. {updated ? `Content updated ${updated}.` : "Consult the cited product-specific sources."}</div>;
}
