import { ArrowRight } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import type { Activity, Item, Opens } from "@/household/activity";
import { SectionHead } from "@/household/parts";

type OnOpen = (opens: Opens, from: HTMLElement) => void;

/**
 * A household's Recent activity: what's coming up, then what has happened,
 * newest first, on one rail with the time on the left. Most lines are a line
 * of text, with a link where there's a page behind them. What needs Jenna,
 * or an email she can review before it goes out on its own, is a card with a
 * button, and its dot is the blue one, so it's the first thing the eye finds.
 * It opens first in the drawer (HouseholdSheet.tsx).
 */
export function RecentActivity({ activity, onOpen }: { activity: Activity; onOpen: OnOpen }) {
  const { upNext, past } = activity;
  if (upNext.length === 0 && past.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Nothing has happened yet.</p>;
  }
  return (
    <div className="@container flex flex-col gap-8">
      {upNext.length > 0 && <Group title="Up next" items={upNext} next onOpen={onOpen} />}
      {past.length > 0 && <Group title="What has happened" items={past} onOpen={onOpen} />}
    </div>
  );
}

function Group({ title, items, next, onOpen }: { title: string; items: Item[]; next?: boolean; onOpen: OnOpen }) {
  return (
    <section>
      {/* The heading's 4px and a line's own 8px over its words make the
          12px a heading keeps from what follows. */}
      <SectionHead className="mb-1">{title}</SectionHead>
      <ol>
        {items.map((it, i) => (
          <Line key={`${it.when}-${it.label}`} item={it} next={next} first={i === 0} last={i === items.length - 1} onOpen={onOpen} />
        ))}
      </ol>
    </section>
  );
}

/**
 * One line: its time, its dot on the rail, and what happened. The rail runs
 * between the first dot and the last. A line to come has an open dot; one
 * that's happened has a gray one; a card has the blue one, so it sits lower
 * on the rail, level with the card's heading, with the time beside it. The
 * card keeps 24px of padding, as the drawer's cards do, with its button 24px
 * under its words.
 * The time has a column of its own once the drawer is 28rem wide; narrower
 * (a phone), it sits over what happened, level with the dot, so the card
 * keeps the width.
 */
function Line({
  item,
  next,
  first,
  last,
  onOpen,
}: {
  item: Item;
  next?: boolean;
  first: boolean;
  last: boolean;
  onOpen: OnOpen;
}) {
  const { when, label, detail, opens, big } = item;
  return (
    <li className="grid grid-cols-[0.75rem_1fr] gap-x-3 @md:grid-cols-[5.75rem_0.75rem_1fr]">
      <time
        className={cn(
          "col-start-2 row-start-1 pt-2 text-sm text-muted-foreground @md:col-start-1",
          big && "@md:pt-9",
        )}
      >
        {when}
      </time>
      <span
        aria-hidden
        className="relative col-start-1 row-span-2 row-start-1 flex justify-center @md:col-start-2 @md:row-span-1"
      >
        <span
          className={cn(
            "absolute w-px bg-border",
            first ? cn("top-4", big && "@md:top-11") : "top-0",
            last ? cn("h-4", big && "@md:h-11") : "bottom-0",
          )}
        />
        <span
          className={cn(
            "relative mt-3 size-2.5",
            big ? "bg-primary ring-4 ring-blue-100 @md:mt-10.5" : next ? "border-2 border-primary bg-background" : "bg-muted-foreground",
          )}
        />
      </span>
      {big ? (
        <div className="col-start-2 row-start-2 pt-2 pb-2 @md:col-start-3 @md:row-start-1">
          <div className="border border-primary bg-card p-6">
            <p className="font-display text-lg">{label}</p>
            {detail && <p className="mt-2 text-sm text-muted-foreground">{detail}</p>}
            {opens && (
              <Button className="mt-6" onClick={(e) => onOpen(opens, e.currentTarget)}>
                {opens.action}
                <ArrowRight data-icon="inline-end" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="col-start-2 row-start-2 flex items-start justify-between gap-3 pb-2 @md:col-start-3 @md:row-start-1 @md:pt-2">
          <div className="min-w-0">
            <p className="text-sm font-medium">{label}</p>
            {detail && <p className="mt-1 text-sm text-muted-foreground">{detail}</p>}
          </div>
          {opens && (
            <button
              type="button"
              aria-label={`${opens.action}: ${label}`}
              onClick={(e) => onOpen(opens, e.currentTarget)}
              className="group flex shrink-0 items-center gap-1 text-sm font-medium text-primary pointer-coarse:-my-3 pointer-coarse:min-h-11"
            >
              <span className="underline-offset-4 group-hover:underline">{opens.action}</span>
              <ArrowRight aria-hidden className="size-3.5" />
            </button>
          )}
        </div>
      )}
    </li>
  );
}
