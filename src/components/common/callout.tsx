import { Info, Lightbulb, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "note" | "tip" | "warning";

const ICONS: Record<Variant, typeof Info> = {
  note: Info,
  tip: Lightbulb,
  warning: AlertTriangle,
};

/**
 * Callout: a bordered aside in one of three registers.
 *   note    quiet context or clarification (sage)
 *   tip     a helpful move the reader can make (green)
 *   warning something that can go wrong (amber)
 *
 * One structure, one accent variable, so callouts stay visually consistent no
 * matter where they appear. Optional `title` prints a bold lead line above the
 * body.
 */
export function Callout({
  variant = "note",
  title,
  icon = true,
  children,
  className,
}: {
  variant?: Variant;
  title?: string;
  icon?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = ICONS[variant];
  return (
    <div className={cn("callout", `callout--${variant}`, className)} role="note">
      <div className="flex items-start gap-2.5">
        {icon ? (
          <Icon className="callout__icon h-4 w-4 mt-0.5 shrink-0" aria-hidden />
        ) : null}
        <div className="min-w-0 text-[15px] leading-relaxed text-foreground/90">
          {title ? (
            <div className="font-medium text-foreground mb-1">{title}</div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
