import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import type { Chip } from "@/tasks";

/**
 * A household's chips (`chipsFor` in tasks.ts), drawn the same wherever they
 * sit: a homepage row, the drawer's header, a board card or a table row. Life
 * quote requested is the one that asks something of Jenna, so it's the blue
 * one; Snoozed and Info updated only say what's so. Nothing when there are
 * none, so the line above keeps its place. A chip never runs wider than what
 * it sits in: on a narrow board card its label is cut short with an ellipsis,
 * and the whole label shows on hover.
 */
export function Chips({ chips, className }: { chips: Chip[]; className?: string }) {
  if (chips.length === 0) return null;
  return (
    <span className={cn("flex min-w-0 flex-wrap gap-1.5", className)}>
      {chips.map((c) => (
        <Badge key={c.id} variant={c.id === "life" ? "default" : "secondary"} title={c.label} className="max-w-full">
          <span className="truncate">{c.label}</span>
        </Badge>
      ))}
    </span>
  );
}
