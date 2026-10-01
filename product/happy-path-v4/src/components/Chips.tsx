import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import type { Chip } from "@/tasks";

/**
 * A chip with a tone takes its accent's color, filled, so it says what the
 * bar down the card's edge means: red 500 or yellow 500, both with slate 800
 * type (4.69:1 and 12.26:1). White on red 500 is 3.77:1 and the foreground on
 * it 3.87:1, under the 4.5:1 that 12px type needs, so neither carries it.
 */
const tones: Record<NonNullable<Chip["tone"]>, string> = {
  urgent: "bg-destructive text-status-foreground",
  soon: "bg-warning text-status-foreground",
};

/**
 * A household's chips (`chipsFor` in tasks.ts), drawn the same wherever they
 * sit: a board card or line, the drawer's header, or a line in the Monday
 * email. Only the renewal chip takes a color, its red or yellow accent's, so
 * it says what the bar means; the rest (Snoozed, Life quote requested, Info
 * updated, Ready to close) are the secondary gray, and only say what's so.
 * Nothing when there are none, so the line above keeps its place. A chip never runs wider than what it sits
 * in: on a narrow card its label is cut short with an ellipsis, and the whole
 * label shows on hover.
 */
export function Chips({ chips, className }: { chips: Chip[]; className?: string }) {
  if (chips.length === 0) return null;
  return (
    <span className={cn("flex min-w-0 flex-wrap gap-1.5", className)}>
      {chips.map((c) => (
        <Badge
          key={c.id}
          variant={c.tone ? "default" : "secondary"}
          title={c.label}
          className={cn("max-w-full", c.tone && tones[c.tone])}
        >
          <span className="truncate">{c.label}</span>
        </Badge>
      ))}
    </span>
  );
}
