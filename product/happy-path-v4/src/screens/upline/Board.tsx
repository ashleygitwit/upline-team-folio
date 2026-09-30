import { ArrowRight, Check, FoldHorizontal, UnfoldHorizontal } from "lucide-react";
import { cn } from "cn";
import { Chips } from "@/components/Chips";
import { RenewalMeta } from "@/components/RenewalMeta";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  accentFor,
  bigIncrease,
  boardFor,
  columns,
  pctLabel,
  setName,
  type Accent,
  type ColumnId,
  type Entry,
} from "@/board";
import { earlier, money, options, pruitt, thisWeek, type Day } from "@/data";
import { cards, fileFor } from "@/household/data";
import { shopSentence } from "@/pipeline";
import { statusFor } from "@/status";
import { chipsFor, isSnoozed, snoozeLabel, type Chip } from "@/tasks";
import type { WalkProps } from "@/walk";

export type BoardProps = WalkProps & {
  day: Day;
  /** The household open in the drawer. */
  household: string | null;
  onHousehold: (id: string) => void;
  /** Opens the Pruitts' shop results. */
  onResults: () => void;
};

/** The toolbar's two filters: a name to search for, and whether to keep only what needs Jenna. */
export type BoardFilters = { query: string; needsOnly: boolean };

const notInPrototype = "This household isn't built out for the prototype.";
const readyToClose: Chip = { id: "closing", label: "Ready to close" };

/**
 * The homepage's board, which replaced Action Needed and Scheduled Emails on
 * 2026-09-30 (Amanda's sketch): every renewal in the pipeline, in six
 * columns, filling the screen under the header. Each column scrolls inside
 * itself, and any column folds to a strip and stays folded for the walk. The
 * headers share one row, so the first card in every column starts on the
 * same line however the names wrap. The three mini columns are a line a
 * household; the three full columns are short cards. A left accent marks what
 * needs a look (accentFor in board.ts). Every line and card opens the
 * household's profile drawer, the one way in; the invented households
 * (pipeline.ts) have no drawer and say so when pointed at. The toolbar's
 * search and Needs me narrow every column at once, and a column's count then
 * says how many of its whole it's showing.
 *
 * Each column has a floor: a mini column is wide enough for a couple's name
 * beside its change, and a full column for "Recommendation" at the
 * column-heading size beside the fold control. All six fit from about 1420
 * wide; narrower, the board scrolls sideways inside itself, with Completed
 * the column past the edge, and folding any one column brings it back.
 */
export function Board({ query, needsOnly, ...props }: BoardProps & BoardFilters) {
  const { day, walk, update } = props;
  const board = boardFor(day, walk);
  const q = query.trim().toLowerCase();
  const filtering = !!q || needsOnly;
  const shownIn = (col: ColumnId) =>
    board[col].filter(
      (e) => (!q || e.name.toLowerCase().includes(q)) && (!needsOnly || accentFor(e, col, day, walk)),
    );
  const isFolded = (col: ColumnId) => walk.folded.includes(col);
  const setFolded = (col: ColumnId, fold: boolean) =>
    update((w) => ({ folded: fold ? [...w.folded, col] : w.folded.filter((c) => c !== col) }));
  const template = columns
    .map((c) => (isFolded(c.id) ? "3rem" : c.mini ? "minmax(13rem, 1fr)" : "minmax(13.75rem, 1fr)"))
    .join(" ");

  return (
    <div data-board className="h-full overflow-x-auto">
      <div
        className="grid h-full min-h-0 gap-x-2"
        style={{ gridTemplateColumns: template, gridTemplateRows: "auto minmax(0, 1fr)" }}
      >
        {columns.map((c) => {
          const shown = shownIn(c.id);
          return isFolded(c.id) ? (
            <Folded key={c.id} label={c.label} n={shown.length} onUnfold={() => setFolded(c.id, false)} />
          ) : (
            <Column
              key={c.id}
              id={c.id}
              label={c.label}
              mini={c.mini}
              entries={shown}
              count={filtering ? `${shown.length} of ${board[c.id].length}` : `${shown.length}`}
              empty={q ? "No one here matches." : needsOnly ? "Nothing needs you here." : empty[c.id]}
              onFold={() => setFolded(c.id, true)}
              {...props}
            />
          );
        })}
      </div>
    </div>
  );
}

const empty: Record<ColumnId, string> = {
  scheduled: "Nothing scheduled.",
  awaiting: "No one to hear back from.",
  shopping: "Nothing being shopped.",
  ready: "All caught up. Nothing to send.",
  sent: "Nothing out.",
  completed: "Nothing finished yet.",
};

/**
 * One column: the hub's quiet panel (gray 100, no border), its name at the
 * column-heading size with its count, and its households. The header and the
 * body sit on the board's two shared rows, so a name that wraps to two lines
 * pushes every column's first card down together. A mini column is one white
 * list of lines running the panel's width, so each name starts under the
 * heading's first letter; a full column is a stack of cards inset as far as
 * the heading. A snoozed task sinks to the foot of its column. The body is
 * positioned, so the lines' screen-reader labels (absolutely positioned) stay
 * inside it rather than stretching the page.
 */
function Column({
  id,
  label,
  mini,
  entries,
  count,
  empty,
  onFold,
  ...props
}: BoardProps & {
  id: ColumnId;
  label: string;
  mini?: boolean;
  entries: Entry[];
  count: string;
  empty: string;
  onFold: () => void;
}) {
  const { day, walk } = props;
  const sorted = mini
    ? entries
    : [...entries].sort((a, b) => Number(snoozedEntry(a, day, walk)) - Number(snoozedEntry(b, day, walk)));

  return (
    <section aria-labelledby={`col-${id}`} className="row-span-2 grid min-h-0 min-w-0 grid-rows-subgrid bg-muted">
      <div className="flex items-start gap-2 px-3 pt-3 pb-2">
        <h2 id={`col-${id}`} className="min-w-0 flex-1 text-xl">
          {label} <Count>{count}</Count>
        </h2>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Fold ${label}`}
          className="-my-0.5 -mr-1.5 shrink-0 text-muted-foreground"
          onClick={onFold}
        >
          <FoldHorizontal />
        </Button>
      </div>

      <div className={cn("relative min-h-0 overflow-y-auto pb-3", !mini && "px-3")}>
        {entries.length === 0 ? (
          <p className="px-3 text-sm">{empty}</p>
        ) : mini ? (
          <ul className="divide-y border bg-card py-1">
            {sorted.map((e) => (
              <MiniRow key={e.id} e={e} accent={accentFor(e, id, day, walk)} {...props} />
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-2 *:shrink-0">
            {sorted.map((e) =>
              e.invented ? (
                <InventedCard key={e.id} e={e} accent={accentFor(e, id, day, walk)} day={day} />
              ) : (
                <NamedCard key={e.id} e={e} col={id} accent={accentFor(e, id, day, walk)} {...props} />
              ),
            )}
          </ul>
        )}
      </div>
    </section>
  );
}

const snoozedEntry = (e: Entry, day: Day, walk: BoardProps["walk"]) => !e.invented && isSnoozed(e.id, day, walk);

/** A column's count, in the mono face on a white chip, beside its name. */
function Count({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative -top-0.5 inline-block bg-card px-1.5 align-middle font-mono text-xs font-normal whitespace-nowrap">
      {children}
    </span>
  );
}

/** A folded column: a strip with its count and its name on end. The whole strip unfolds it. */
function Folded({ label, n, onUnfold }: { label: string; n: number; onUnfold: () => void }) {
  return (
    <section aria-label={label} className="row-span-2 min-h-0 bg-muted">
      <button
        type="button"
        onClick={onUnfold}
        aria-label={`Unfold ${label}, ${n}`}
        className="group flex h-full w-full flex-col items-center gap-3 pt-3"
      >
        <UnfoldHorizontal aria-hidden className="size-4 text-muted-foreground group-hover:text-primary" />
        <Count>{n}</Count>
        <span className="font-display text-xl font-medium [writing-mode:vertical-rl] group-hover:text-primary">
          {label}
        </span>
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Accents and figures
 * ------------------------------------------------------------------ */

/** The accent as a card's left border, replacing its hairline (the hub's card-accent). */
const accentBorder: Record<Accent, string> = {
  urgent: "border-l-3 border-l-destructive",
  soon: "border-l-3 border-l-warning",
  needs: "border-l-3 border-l-primary",
};

/**
 * The accent on a line in a mini column: a bar drawn over the list's left
 * hairline, so it replaces the line rather than sitting beside it, as the
 * card's does.
 */
const accentBar: Record<Accent, string> = {
  urgent: "before:bg-destructive",
  soon: "before:bg-warning",
  needs: "before:bg-primary",
};
const bar = "before:absolute before:-top-px before:bottom-0 before:-left-px before:w-[3px]";

/** The renewal's change in percent, in the mono face; red over 10%, so a big jump is a glance away. */
function Pct({ pct }: { pct: number }) {
  return (
    <span
      className={cn(
        "shrink-0 font-mono text-sm",
        bigIncrease(pct) ? "text-destructive-strong" : "text-muted-foreground",
      )}
    >
      {pctLabel(pct)}
    </span>
  );
}

/** Last year's premium to this year's, in the mono face. */
function Price({ e }: { e: Entry }) {
  return (
    <span className="mt-1 block font-mono text-sm">
      {e.was === e.now ? money(e.now) : `${money(e.was)} → ${money(e.now)}`}
    </span>
  );
}

/**
 * The way into a household's drawer from its line or card: a button laid
 * over the whole of it, named for the household, so what's on the line or
 * card reads as text and the click lands anywhere on it. Anything with a
 * button of its own sits above it. Its focus ring is drawn inside the edge,
 * so the column's scroll area doesn't clip it.
 */
function OpenOverlay({ name, selected, onOpen }: { name: string; selected: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onOpen}
      className="absolute inset-0 focus-visible:-outline-offset-2"
    >
      <span className="sr-only">Open {name}</span>
    </button>
  );
}

/** Something drawn that has no drawer behind it, and says so when pointed at or focused. */
function NotBuilt({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>
          <div tabIndex={0} className={cn(className, "focus-visible:-outline-offset-2")}>
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>{notInPrototype}</TooltipContent>
      </Tooltip>
    </li>
  );
}

/* ------------------------------------------------------------------ *
 * Mini columns
 * ------------------------------------------------------------------ */

/**
 * One household in a mini column: the name and the change in percent, at
 * 14px, and nothing else, so a column of 55 reads as a list of names. A long
 * name wraps rather than being cut short, so nothing depends on a tooltip.
 * The whole line opens the household's drawer, where the renewal email is a
 * click away; an invented line doesn't open, and says so.
 */
function MiniRow({ e, accent, ...props }: BoardProps & { e: Entry; accent: Accent | null }) {
  const { day, walk, household, onHousehold } = props;
  const selected = household === e.id;
  const frame = cn("relative px-3 py-2 text-sm", accent && [bar, accentBar[accent]]);

  const line = (
    <div className="flex items-start gap-2">
      <span className="min-w-0 flex-1 [overflow-wrap:break-word]">{setName(e.name)}</span>
      <Pct pct={e.pct} />
    </div>
  );

  if (e.invented) return <NotBuilt className={frame}>{line}</NotBuilt>;

  return (
    <li className={cn(frame, "hover:bg-background", selected && "bg-muted hover:bg-muted")}>
      {line}
      <Chips chips={chipsFor(e.id, day, walk)} className="mt-1.5" />
      <OpenOverlay name={e.name} selected={selected} onOpen={() => onHousehold(e.id)} />
    </li>
  );
}

/* ------------------------------------------------------------------ *
 * Full columns
 * ------------------------------------------------------------------ */

/**
 * A card in a full column: the name with the change in percent beside it (as
 * a mini line has it), then what it is and when it renews, last year's price
 * to this year's, any chips, one sentence, and the action if there is one.
 * Everything is 14px, the kit's row size, with the name set apart by the
 * display face and weight. `onOpen` lays the drawer's button over the whole
 * card; `foot` sits above that button, for anything that's a button of its
 * own. The accent replaces the card's left hairline; while its drawer is
 * open, the rest of the edge turns blue.
 */
function Card({
  name,
  pct,
  foot,
  children,
}: {
  name: string;
  pct: number;
  foot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-3 text-sm">
      <div className="flex items-start gap-2">
        <h3 className="min-w-0 flex-1 text-sm [overflow-wrap:break-word]">{setName(name)}</h3>
        <Pct pct={pct} />
      </div>
      <div className="mt-1">{children}</div>
      {foot && <div className="relative z-10">{foot}</div>}
    </div>
  );
}

const cardFrame = (accent: Accent | null, selected = false) =>
  cn(
    "relative block border bg-card text-card-foreground",
    accent ? accentBorder[accent] : selected && "border-l-primary",
    selected && "border-y-primary border-r-primary",
  );

/** A card for an invented household: what its column says about it, and no drawer behind it. */
function InventedCard({ e, accent, day }: { e: Entry; accent: Accent | null; day: Day }) {
  return (
    <NotBuilt className={cardFrame(accent)}>
      <Card name={e.name} pct={e.pct}>
        <RenewalMeta lines={e.lines} carrier={e.carrier} renews={e.renews} day={day} />
        <Price e={e} />
        {e.approved && <Chips chips={[readyToClose]} className="mt-2" />}
        {e.invented!.detail && <span className="mt-2 block">{e.invented!.detail}</span>}
      </Card>
    </NotBuilt>
  );
}

/** What an earlier week's shop found, from Ashley's household data, in the card's one sentence. */
function earlierShop(id: string) {
  const card = cards.find((c) => c.id === id)!;
  const rec = fileFor(card).rec!;
  return shopSentence(
    rec.options.map((o) => ({ carrier: o.name, price: o.price })),
    card.carrier,
    rec.pick,
  );
}

const firstOf = (name: string) => name.split(" ")[0];

/**
 * A named household's card, which follows the walk. The whole card opens the
 * household's drawer. What's on it:
 *
 * - Recommendation Ready: what the shop found, in one sentence. The Pruitts'
 *   also has View the full report, which opens their shop results on their
 *   own, as their Action Needed card did.
 * - Recommendation Sent: who it's waiting on, or, once they've said yes,
 *   Ready to close, what they approved, and View profile and close.
 * - Completed: how it ended, and, for anything Jenna closed out in the walk,
 *   her note and Undo.
 *
 * A task snoozed from the drawer's banner sinks to the foot of its column,
 * loses its accent, and says so, with Undo.
 */
function NamedCard({ e, col, accent, ...props }: BoardProps & { e: Entry; col: ColumnId; accent: Accent | null }) {
  const { day, walk, update, household, onHousehold, onResults } = props;
  const h = thisWeek.find((x) => x.id === e.id);
  const ew = earlier.find((x) => x.id === e.id);
  const snoozed = isSnoozed(e.id, day, walk);
  const selected = household === e.id;
  const profile = () => onHousehold(e.id);

  let detail: React.ReactNode = null;
  let foot: React.ReactNode = null;

  if (col === "ready") {
    if (e.id === pruitt.id) {
      // What the shop found, whatever Jenna picks in the results.
      detail = shopSentence(
        options.map((o) => ({ carrier: o.carrier, price: o.price })),
        pruitt.carrier,
        options.find((o) => o.id === "ao")!.carrier,
      );
      foot = (
        <Button variant="link" className="mt-2 h-auto p-0 font-sans text-sm" onClick={onResults}>
          View the full report
          <ArrowRight data-icon="inline-end" />
        </Button>
      );
    } else if (ew?.monday) {
      detail = earlierShop(e.id);
    }
  }

  if (col === "sent") {
    if (e.approved) {
      detail = h ? statusFor(h, "fri", { ...walk, bound: false }).detail : ew?.monday?.detail;
      foot = <CloseOut onProfile={profile} />;
    } else if (h && day !== "mon") {
      detail = statusFor(h, day, walk).detail;
    } else if (day === "mon") {
      detail = `Recommendation sent today. Waiting on ${firstOf(e.name)}.`;
    } else {
      detail = `Recommendation sent ${e.id === "marin" ? "Monday" : "Tuesday"}. Waiting on ${firstOf(e.name)}.`;
    }
  }

  if (col === "completed") {
    const note = walk.closed[e.id];
    if (h?.id === pruitt.id && walk.bound && note !== undefined) {
      detail = statusFor(h, "fri", walk).detail;
      foot = <Closed note={note} onUndo={() => update((w) => ({ bound: false, closed: without(w.closed, e.id) }))} />;
    } else if (h && walk.skipped.includes(h.id)) {
      detail = "Skipped. You're handling this one yourself this time.";
    } else if (h) {
      detail = statusFor(h, day === "mon" ? "wed" : day, walk).detail;
    } else if (day === "mon" && note !== undefined) {
      detail = ew?.monday?.detail;
      foot = <Closed note={note} onUndo={() => update((w) => ({ closed: without(w.closed, e.id) }))} />;
    } else if (ew) {
      detail = `${ew.later}.`;
    }
  }

  if (snoozed) {
    foot = (
      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        Snoozed {snoozeLabel(walk.snoozed[e.id].until)}.
        <Button
          variant="link"
          className="h-auto p-0 font-sans text-sm"
          onClick={() => update((w) => ({ snoozed: without(w.snoozed, e.id) }))}
        >
          Undo
        </Button>
      </p>
    );
  }

  const chips = [...(e.approved && !snoozed ? [readyToClose] : []), ...chipsFor(e.id, day, walk)];

  return (
    <li className={cn(cardFrame(accent, selected), "hover:bg-background")}>
      <OpenOverlay name={e.name} selected={selected} onOpen={profile} />
      <Card name={e.name} pct={e.pct} foot={foot}>
        <RenewalMeta lines={e.lines} carrier={e.carrier} renews={e.renews} day={day} />
        <Price e={e} />
        <Chips chips={chips} className="mt-2" />
        {detail && <span className="mt-2 block">{detail}</span>}
      </Card>
    </li>
  );
}

/**
 * The foot of an approved card: View profile and close opens the drawer,
 * whose banner leads to Close out. The card doesn't ask for a memo, because
 * closing is a morning's work in the carrier's portal and on the phone, not
 * a field on the homepage (the 2026-09-29 review).
 */
function CloseOut({ onProfile }: { onProfile: () => void }) {
  return (
    <Button className="mt-3" onClick={onProfile}>
      View profile and close
    </Button>
  );
}

/** Once it's closed out: that it's closed, the note Jenna wrote, and Undo, which reopens it. */
function Closed({ note, onUndo }: { note: string; onUndo: () => void }) {
  return (
    <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
      <Check aria-hidden className="size-4 text-primary" />
      <span className="font-medium">Closed</span>
      {note && <span className="text-muted-foreground">· {note}</span>}
      <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={onUndo}>
        Undo
      </Button>
    </p>
  );
}

const without = <T,>(record: Record<string, T>, id: string) => {
  const { [id]: _, ...rest } = record;
  return rest;
};
