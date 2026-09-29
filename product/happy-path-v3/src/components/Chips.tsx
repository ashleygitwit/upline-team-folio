import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import type { Chip } from "@/tasks";

/**
 * A household's chips (`chipsFor` in tasks.ts), drawn the same wherever they
 * sit: a homepage row, the drawer's header, a board card or a table row. Life
 * quote requested is the one that asks something of Jenna, so it's the blue
 * one; Snoozed and Info updated only say what's so. Nothing when there are
 * none, so the line above keeps its place.
 */
export function Chips({ chips, className }: { chips: Chip[]; className?: string }) {
  if (chips.length === 0) return null;
  return (
    <span className={cn("flex flex-wrap gap-1.5", className)}>
      {chips.map((c) => (
        <Badge key={c.id} variant={c.id === "life" ? "default" : "secondary"}>
          {c.label}
        </Badge>
      ))}
    </span>
  );
}
