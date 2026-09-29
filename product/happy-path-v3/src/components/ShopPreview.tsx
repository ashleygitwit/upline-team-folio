import { cn } from "cn";
import { CarrierMark } from "@/components/CarrierMark";
import { money } from "@/data";

/**
 * A preview of what a shop came back with, for the picture on a Shopped row:
 * the results page's Your pick list in miniature, each carrier that quoted
 * with its mark and annual price, and the pick selected. It sits on the
 * design hub's card picture panel, as the hub's template cards set theirs:
 * full bleed to the row's left, top and bottom, never shorter than 16:9.
 * Drawn in code, as the hub draws its card scenes, so the numbers are the
 * household's own. Decorative: the row's words say what came back.
 */
export function ShopPreview({
  quotes,
  pick,
  className,
}: {
  quotes: { carrier: string; price: number }[];
  /** The carrier picked, by name. */
  pick: string;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("flex aspect-video size-full items-center bg-muted p-5", className)}>
      <ul className="flex w-full flex-col gap-1.5">
        {quotes.map((q) => {
          const picked = q.carrier === pick;
          return (
            <li
              key={q.carrier}
              className={cn(
                "flex items-center gap-2 border bg-card px-2.5 py-1 text-xs",
                picked && "border-primary",
              )}
            >
              <span
                className={cn(
                  "grid size-3 shrink-0 place-items-center rounded-full border border-input",
                  picked && "border-primary bg-primary",
                )}
              >
                {picked && <span className="size-1 rounded-full bg-primary-foreground" />}
              </span>
              <CarrierMark carrier={q.carrier} className="size-4" />
              <span className="min-w-0 flex-1 truncate">{q.carrier}</span>
              <span className={cn("tabular-nums", picked && "font-medium")}>{money(q.price)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
