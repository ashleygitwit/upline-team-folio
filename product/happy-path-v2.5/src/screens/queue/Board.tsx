import { useRef, useState, type ReactNode } from "react";
import { Flag } from "lucide-react";
import { cn } from "cn";
import type { Card, Column } from "@/data";
import { columns, priceLine } from "@/screens/queue/columns";
import { CardGlyph, Change } from "@/screens/queue/parts";

/** The household the walk follows carries a tint of accent 01, so the presenter can find it. At 30% the captions on it still clear 4.5:1. */
const target = "bg-blue-100/30";

/**
 * Ashley's board: four columns, one card per household, and Send on the two
 * columns that send. The columns shrink with the page until a card no longer
 * fits on one line per row, then the board stacks (the `stacked` variant in
 * index.css).
 */
export function Board({
  cards,
  onOpen,
  action,
}: {
  cards: Card[];
  onOpen: (c: Card) => void;
  action: (col: Column, cards: Card[]) => ReactNode;
}) {
  return (
    <div className="@container/board">
      <div className="grid grid-cols-4 items-start gap-3 stacked:flex stacked:flex-col stacked:gap-4.5">
        {columns.map((col) => {
          const inCol = cards.filter((c) => c.col === col.id);
          return (
            <section
              key={col.id}
              aria-label={col.title}
              className="min-h-[280px] min-w-0 border bg-muted/45 px-2.5 pt-3 pb-3.5 stacked:min-h-0 stacked:w-full stacked:border-0 stacked:bg-transparent stacked:p-0"
            >
              <div className="mb-2.5 flex min-h-7 items-center justify-between gap-2 stacked:mb-2">
                <h3 className="flex min-w-0 items-center gap-2 font-sans text-sm font-semibold">
                  {col.title}
                  <span className="min-w-[1.4rem] bg-card px-1.5 py-px text-center font-mono text-xs font-normal">
                    {inCol.length}
                  </span>
                </h3>
                {action(col.id, inCol)}
              </div>
              <ColumnCards cards={inCol} onOpen={onOpen} />
            </section>
          );
        })}
      </div>
    </div>
  );
}

/** Stacked, a column is a row of cards you swipe through, with dots to say where you are. */
function ColumnCards({ cards, onOpen }: { cards: Card[]; onOpen: (c: Card) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);

  const onScroll = () => {
    const el = ref.current;
    const first = el?.children[0] as HTMLElement | undefined;
    if (!el || !first) return;
    const step = first.offsetWidth + 10;
    if (step) setAt(Math.max(0, Math.min(cards.length - 1, Math.round(el.scrollLeft / step))));
  };

  return (
    <>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex flex-col gap-2 stacked:snap-x stacked:snap-mandatory stacked:flex-row stacked:items-stretch stacked:gap-2.5 stacked:overflow-x-auto stacked:px-0.5 stacked:pt-0.5 stacked:pb-2.5 stacked:[scrollbar-width:none]"
      >
        {cards.map((c) => (
          <KanbanCard key={c.id} card={c} onOpen={onOpen} />
        ))}
      </div>
      {cards.length > 1 && (
        <div aria-hidden className="-mt-0.5 hidden justify-center gap-1.5 stacked:flex">
          {cards.map((c, i) => (
            <span key={c.id} className={cn("h-1.5 bg-muted-foreground/30", i === at ? "w-3.5 bg-muted-foreground" : "w-1.5")} />
          ))}
        </div>
      )}
    </>
  );
}

function KanbanCard({ card, onOpen }: { card: Card; onOpen: (c: Card) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(card)}
      className={cn(
        "relative block w-full min-w-0 overflow-hidden border bg-card text-left transition-colors hover:border-primary",
        card.target && target,
        // 82% of the phone, as in v2, but no wider than a card reads well when the stacked board is wider than a phone.
        "stacked:shrink-0 stacked:grow-0 stacked:basis-[min(82%,20rem)] stacked:snap-start",
      )}
    >
      {card.col === "binding" && (
        <span className="inline-flex items-center gap-1.5 bg-destructive/10 py-1.5 pr-3.5 pl-3 text-[10px] font-semibold tracking-wider text-foreground uppercase">
          <Flag className="size-3 text-destructive" aria-hidden />
          Action needed
        </span>
      )}
      <span className="block px-3.5 pt-3 pb-2.5">
        <span className="flex items-center gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center bg-muted">
            <CardGlyph card={card} className="size-4" />
          </span>
          <span className="text-sm leading-tight font-medium">{card.name}</span>
        </span>
        <span className="mt-1.5 ml-9.5 block text-sm text-muted-foreground">
          {priceLine(card)} <Change pct={card.jumpPct} className="ml-1.5" />
        </span>
      </span>
      <span className="flex items-center justify-between gap-2 border-t px-3.5 pt-2 pb-2.5 text-xs text-muted-foreground">
        <span className="min-w-0">{card.carrier}</span>
        <span className="whitespace-nowrap">Renews {card.renewal}</span>
      </span>
    </button>
  );
}

/** The same households as rows, grouped by column. */
export function ListView({
  cards,
  onOpen,
  action,
}: {
  cards: Card[];
  onOpen: (c: Card) => void;
  action: (col: Column, cards: Card[]) => ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5.5">
      {columns.map((col) => {
        const inCol = cards.filter((c) => c.col === col.id);
        if (!inCol.length) return null;
        return (
          <section key={col.id} aria-label={col.title}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="font-sans text-sm font-semibold">
                {col.title} · {inCol.length}
              </h3>
              {action(col.id, inCol)}
            </div>
            <div className="border-t">
              {inCol.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onOpen(c)}
                  className={cn(
                    "grid w-full grid-cols-[minmax(220px,1.8fr)_minmax(160px,1.2fr)_110px] items-center gap-3 border border-t-0 border-transparent border-b-border bg-card p-3 text-left hover:border-primary",
                    c.target && target,
                  )}
                >
                  <span>
                    <span className="block text-sm font-medium">{c.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {priceLine(c)} ({c.jumpPct === 0 ? "0%" : `${c.jumpPct > 0 ? "↑" : "↓"}${Math.abs(c.jumpPct)}%`})
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">{c.carrier}</span>
                  <span className="text-sm text-muted-foreground">Renews {c.renewal}</span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
