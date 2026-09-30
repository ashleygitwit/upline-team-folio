import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import type { Chip } from "@/tasks";

/**
 * A chip with a tone takes its accent's color, filled, so it says what the
 * bar down the card's edge means: red 700 with white (6.67:1), orange 500
 * with the foreground (5.8:1; white on it is 2.52:1), and the blue with white.
 * Red 500 carries text at neither (3.77:1 and 3.87:1), so red steps down to
 * 700, and the bar with it.
 */
const tones: Record<NonNullable<Chip["tone"]>, string> = {
  urgent: "bg-destructive-strong text-white",
  soon: "bg-warning text-foreground",
  needs: "",
};

/**
 * A household's chips (`chipsFor` in tasks.ts), drawn the same wherever they
 * sit: a board card or line, the drawer's header, or a line in the Monday
 * email. Life quote requested is the one that asks something of Jenna, so
 * it's blue; Snoozed, Info updated and Ready to close only say what's so, in
 * gray; the renewal chip takes its accent's color, or gray without one.
 * Nothing when there are none, so the line above keeps its place. A chip
 * never runs wider than what it sits in: on a narrow card its label is cut
 * short with an ellipsis, and the whole label shows on hover.
 */
export function Chips({ chips, className }: { chips: Chip[]; className?: string }) {
  if (chips.length === 0) return null;
  return (
    <span className={cn("flex min-w-0 flex-wrap gap-1.5", className)}>
      {chips.map((c) => (
        <Badge
          key={c.id}
          variant={c.id === "life" || c.tone ? "default" : "secondary"}
          title={c.label}
          className={cn("max-w-full", c.tone && tones[c.tone])}
        >
          <span className="truncate">{c.label}</span>
        </Badge>
      ))}
    </span>
  );
}
