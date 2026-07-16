import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * KeyTakeaways: a short, scannable "the essentials" list. Meant for the top or
 * tail of a longer read so someone skimming still leaves with the main points.
 * Keep items to a handful of tight lines, not sentences that wrap three times.
 */
export function KeyTakeaways({
  title = "Key takeaways",
  items,
  className,
}: {
  title?: string;
  items: React.ReactNode[];
  className?: string;
}) {
  return (
    <section
      className={cn("border border-border bg-surface rounded-2xl p-5 sm:p-6", className)}
      aria-label={title}
    >
      <h2 className="text-sm eyebrow" style={{ fontSize: "0.7rem" }}>
        {title}
      </h2>
      <ul className="mt-3 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-foreground/90">
            <Check className="h-4 w-4 mt-1 accent-check shrink-0" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
