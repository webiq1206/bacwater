import { cn } from "@/lib/utils";

/**
 * AnswerBox: a page or section's TL;DR / direct answer, formatted so a reader
 * (or an AI answer engine) gets the one-line takeaway before the detail. Use it
 * once near the top of a page, or to lead a long section.
 *
 * The optional `label` prints a small uppercase tag ("Short answer" by default)
 * so the block reads as the answer, not just another paragraph.
 */
export function AnswerBox({
  label = "Short answer",
  children,
  className,
}: {
  label?: string | null;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("answer-box", className)}>
      {label ? (
        <div className="eyebrow mb-1.5" style={{ fontSize: "0.65rem" }}>
          {label}
        </div>
      ) : null}
      <div className="text-[15px] leading-relaxed text-foreground/90">
        {children}
      </div>
    </div>
  );
}
