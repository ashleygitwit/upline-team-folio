import { useLayoutEffect, useState } from "react";
import { AlarmClock, ArrowRight, FoldHorizontal, UnfoldHorizontal } from "lucide-react";
import { cn } from "cn";
import { Countdown, PhaseStatusLine, Requests, StatusLine } from "@/components/Status";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  accentFor,
  bigIncrease,
  boardFor,
  columns,
  pctLabel,
  setName,
  timed,
  type Accent,
  type ColumnId,
  type Entry,
} from "@/board";
import { earlier, options, pruitt, thisWeek, type Day } from "@/data";
import type { Phase } from "@/household/activity";
import { cards, fileFor } from "@/household/data";
import { firstCards } from "@/household/firstCards";
import { RowTip } from "@/lib/rowTip";
import { phases, phasesFor, statusLabel, type Placed, type PhaseStatus } from "@/phases";
import { shopSentence } from "@/pipeline";
import { statusFor } from "@/status";
import { isSnoozed, requestsFor, snoozeLabel } from "@/tasks";
import type { WalkProps } from "@/walk";

export type BoardProps = WalkProps & {
  day: Day;
  /** The household open in the drawer. */
  household: string | null;
  /** Opens a household's drawer, with one of its pages over it if `phase` says which. */
  onHousehold: (id: string, phase?: Phase) => void;
};

/**
 * The toolbar's filter: a name to search for. Needs me, which kept only what
 * needs Jenna, sat beside it until 2026-10-01, when it came off as not
 * important.
 */
export type BoardFilters = { query: string };

const notInPrototype = "This household isn't built out for the prototype.";

/**
 * The homepage's board, which replaced Action Needed and Scheduled Emails on
 * 2026-09-30 (Amanda's sketch): every renewal in the pipeline, in six
 * columns, one screen tall under the header (Home.tsx). Each column scrolls
 * inside itself once the page has scrolled the board fully into view
 * (useDocked), and any column folds to a strip and stays folded for the
 * walk. The headers share one row, so the first card in every column starts
 * on the same line however the names wrap. The four mini columns are a line a
 * household; Recommendation Ready and Sent are short cards. Every name is set
 * the same way, a line's as a card's. A left accent marks what needs a look,
 * by each column's own deadlines (accentFor in board.ts). Statuses are words,
 * not boxes, so the only filled rectangles on the board are buttons. Every
 * line and card opens the household's profile drawer, the one way in; the
 * invented households
 * (pipeline.ts) have no drawer and say so when pointed at. The toolbar's
 * search narrows every column at once, and a column's count then says how
 * many of its whole it's showing.
 *
 * Each column has a floor: a mini column is wide enough for a couple's name
 * beside its change, and a full column for "Recommendation" at the
 * column-heading size beside the fold control. All six fit from about 1410
 * wide; narrower, the board scrolls sideways inside itself, with Completed
 * the column past the edge, and folding any one column brings it back.
 *
 * The presenter bar's 4 columns switch draws the four-column experiment
 * instead (phases.ts): Initial Outreach, Shopping Renewal, Closing and
 * Completed, each card with its status. A household keeps its step on the
 * six-column board, which is what its accent and its card's sentence go by,
 * wherever it's drawn. Each column's statuses are filters under its name,
 * and picking one narrows that column alone to it; like search, they're the
 * page's own, so they start clear at every stop. Its columns don't fold
 * (since 2026-10-01), so a column folded on the six-column board is open
 * here.
 */
export function Board({ query, ...props }: BoardProps & BoardFilters) {
  const { day, walk, update } = props;
  const board = walk.fourColumns ? phaseColumns(day, walk) : stepColumns(day, walk);
  const docked = useDocked();
  const q = query.trim().toLowerCase();
  const [onlyStatus, setOnlyStatus] = useState<Partial<Record<string, PhaseStatus>>>({});
  const matchingIn = (col: BoardColumn) =>
    col.items.filter(({ e }) => !q || e.name.toLowerCase().includes(q));
  // The four-column board's columns are ruled apart by hairlines rather than
  // set on gray panels, and don't fold.
  const ruled = walk.fourColumns;
  const isFolded = (col: string) => !ruled && walk.folded.includes(col);
  const setFolded = (col: string, fold: boolean) =>
    update((w) => ({ folded: fold ? [...w.folded, col] : w.folded.filter((c) => c !== col) }));
  const template = board
    .map((c) =>
      isFolded(c.id)
        ? "3rem"
        : c.narrow
          ? "minmax(6.5rem, 0.5fr)"
          : c.mini
            ? "minmax(13rem, 1fr)"
            : "minmax(13.75rem, 1fr)",
    )
    .join(" ");

  return (
    <div data-board className="h-full overflow-x-auto">
      <div
        className={cn("grid h-full min-h-0", !ruled && "gap-x-2")}
        style={{ gridTemplateColumns: template, gridTemplateRows: "auto minmax(0, 1fr)" }}
      >
        {board.map((c) => {
          // Search first, which the status filters count, then
          // the column's own status filter, if one is picked.
          const matching = matchingIn(c);
          const only = onlyStatus[c.id];
          const shown = only ? matching.filter((i) => i.status === only) : matching;
          const filtering = !!q || !!only;
          return isFolded(c.id) ? (
            <Folded
              key={c.id}
              label={c.label}
              n={shown.length}
              ruled={ruled}
              onUnfold={() => setFolded(c.id, false)}
            />
          ) : (
            <Column
              key={c.id}
              id={c.id}
              label={c.label}
              mini={c.mini}
              ruled={ruled}
              items={shown}
              statuses={c.statuses?.map((status) => ({
                status,
                n: matching.filter((i) => i.status === status).length,
              }))}
              only={only}
              onOnly={(status) => setOnlyStatus((o) => ({ ...o, [c.id]: status }))}
              count={filtering ? `${shown.length} of ${c.items.length}` : `${shown.length}`}
              empty={
                q
                  ? "No one here matches."
                  : only
                    ? `Nothing here is ${statusLabel[only]}.`
                    : c.empty
              }
              docked={docked}
              onFold={ruled ? undefined : () => setFolded(c.id, true)}
              {...props}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * A column as the board draws it: its households, each with its step on the
 * six-column board, and on the four-column board its status, and the
 * statuses it can hold, which its header counts.
 */
type BoardColumn = {
  id: string;
  label: string;
  mini?: boolean;
  /** Half as wide as the others: the four-column board's Completed, which is names alone. */
  narrow?: boolean;
  items: Placed[];
  statuses?: PhaseStatus[];
  empty: string;
};

/** The six columns, one for each step. */
function stepColumns(day: Day, walk: BoardProps["walk"]): BoardColumn[] {
  const board = boardFor(day, walk);
  return columns.map((c) => ({ ...c, items: board[c.id].map((e) => ({ e, step: c.id })), empty: empty[c.id] }));
}

/** The four-column experiment, one for each phase (phases.ts). */
function phaseColumns(day: Day, walk: BoardProps["walk"]): BoardColumn[] {
  const placed = phasesFor(day, walk);
  return phases.map((p) => ({ ...p, items: placed[p.id] }));
}

/**
 * Whether the page has scrolled as far as it goes, which is where the board
 * sits whole on screen. Until then the columns don't scroll, so a scroll over
 * one moves the page instead: the page goes first, then the columns. Without
 * it, a scroll with the pointer over a column, which is most of the screen,
 * moved only that column, and the page seemed stuck. A page that fits the
 * window is docked from the start.
 */
function useDocked() {
  const [docked, setDocked] = useState(true);
  useLayoutEffect(() => {
    const page = document.scrollingElement ?? document.documentElement;
    const check = () => setDocked(page.scrollTop >= page.scrollHeight - page.clientHeight - 1);
    check();
    const resized = new ResizeObserver(check);
    resized.observe(document.body);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      resized.disconnect();
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);
  return docked;
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
 * inside it rather than stretching the page. It scrolls only once the board
 * is docked, and keeps its scrollbar's room either way, so a scrollbar that
 * takes room (Windows, or a Mac set to always show them) doesn't shift the
 * cards when it docks.
 *
 * On the four-column board, the column's statuses sit under its name as
 * filters, each with its count, drawn as v3's stage filters and the
 * toolbar's Needs me (until it came off) were: an outline button, on as the
 * blue outline, one size down to sit in a column. Picking one narrows the
 * column to that status, and its count then says how many of its whole it's
 * showing; picking it again shows them all. One is on at a time. They count
 * what search leaves, and a status with no one in it drops out, unless it's
 * the one on, as v3's stages did.
 *
 * The four-column board's columns are `ruled`, drawn closer to the brand's
 * own surfaces: no gray panel, a gray 200 hairline between columns, as the
 * cards carry, and a 16px gutter either side of it, with the first column's
 * edge on the page's, under the greeting. The rules hang from the hairline under
 * the toolbar and run to the foot of the page (Home.tsx), so the header
 * keeps 16px off it and the list 16px off the foot. Every column insets its
 * households the same, so a mini column's list sits where the cards do, and
 * a line is as roomy as a card (12px all round, a card's padding).
 */
function Column({
  id,
  label,
  mini,
  ruled,
  items,
  statuses,
  only,
  onOnly,
  count,
  empty,
  docked,
  onFold,
  ...props
}: BoardProps & {
  id: string;
  label: string;
  mini?: boolean;
  ruled: boolean;
  items: Placed[];
  statuses?: { status: PhaseStatus; n: number }[];
  /** The status the column is narrowed to, if one is picked. */
  only?: PhaseStatus;
  onOnly: (status: PhaseStatus | undefined) => void;
  count: string;
  empty: string;
  docked: boolean;
  /** Folds the column to a strip; the four-column board's don't fold. */
  onFold?: () => void;
}) {
  const filters = statuses?.filter(({ status, n }) => n > 0 || status === only) ?? [];
  const { day, walk } = props;
  const sorted = mini
    ? items
    : [...items].sort((a, b) => Number(snoozedEntry(a.e, day, walk)) - Number(snoozedEntry(b.e, day, walk)));

  return (
    <section
      aria-labelledby={`col-${id}`}
      className={cn(
        "row-span-2 grid min-h-0 min-w-0 grid-rows-subgrid",
        ruled ? "border-l px-4 first:border-l-0 first:pl-0 last:pr-0" : "bg-muted",
      )}
    >
      <div className={ruled ? "pt-4 pb-3" : "px-3 pt-3 pb-2"}>
        <div className="flex items-start gap-2">
          <h2 id={`col-${id}`} className="min-w-0 flex-1 text-xl">
            {label} <Count>{count}</Count>
          </h2>
          {onFold && (
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Fold ${label}`}
              className="-my-0.5 -mr-1.5 shrink-0 text-muted-foreground"
              onClick={onFold}
            >
              <FoldHorizontal />
            </Button>
          )}
        </div>
        {filters.length > 0 && (
          <div role="group" aria-label={`Filter ${label} by status`} className="mt-2 flex flex-wrap gap-2">
            {filters.map(({ status, n }) => (
              <Button
                key={status}
                variant="outline"
                size="sm"
                aria-pressed={only === status}
                onClick={() => onOnly(only === status ? undefined : status)}
                className="aria-pressed:border-primary aria-pressed:text-primary aria-pressed:hover:text-primary"
              >
                {statusLabel[status]}
                <span className="font-mono text-xs font-normal text-muted-foreground">{n}</span>
              </Button>
            ))}
          </div>
        )}
      </div>

      <div
        className={cn(
          "relative min-h-0 [scrollbar-gutter:stable]",
          ruled ? "pb-4" : "pb-3",
          docked ? "overflow-y-auto" : "overflow-y-hidden",
          !mini && !ruled && "px-3",
        )}
      >
        {items.length === 0 ? (
          <p className={cn("text-sm", !ruled && "px-3")}>{empty}</p>
        ) : mini ? (
          <ul className={cn("divide-y border bg-card", !ruled && "py-1")}>
            {sorted.map(({ e, step, status }) => (
              <MiniRow
                key={e.id}
                e={e}
                col={step}
                roomy={ruled}
                status={status}
                accent={accentFor(e, step, day, walk)}
                {...props}
              />
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-2 *:shrink-0">
            {sorted.map(({ e, step, status }) =>
              e.invented ? (
                <InventedCard key={e.id} e={e} status={status} accent={accentFor(e, step, day, walk)} day={day} />
              ) : (
                <NamedCard
                  key={e.id}
                  e={e}
                  col={step}
                  status={status}
                  accent={accentFor(e, step, day, walk)}
                  {...props}
                />
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

/**
 * A folded column: a strip with its count and its name on end. The whole strip
 * unfolds it. On the four-column board it's ruled off as the columns are,
 * with no panel.
 */
function Folded({ label, n, ruled, onUnfold }: { label: string; n: number; ruled: boolean; onUnfold: () => void }) {
  return (
    <section
      aria-label={label}
      className={cn("row-span-2 min-h-0", ruled ? "border-l first:border-l-0" : "bg-muted")}
    >
      <button
        type="button"
        onClick={onUnfold}
        aria-label={`Unfold ${label}, ${n}`}
        className={cn("group flex h-full w-full flex-col items-center gap-3", ruled ? "pt-4" : "pt-3")}
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

/**
 * The accent as a card's left border, replacing its hairline (the hub's
 * card-accent). The countdown or request beside it says what it means.
 */
const accentBorder: Record<Accent, string> = {
  urgent: "border-l-3 border-l-destructive",
  soon: "border-l-3 border-l-warning",
  requested: "border-l-3 border-l-primary",
};

/**
 * The accent on a line in a mini column: a bar drawn over the list's left
 * hairline, so it replaces the line rather than sitting beside it, as the
 * card's does.
 */
const accentBar: Record<Accent, string> = {
  urgent: "before:bg-destructive",
  soon: "before:bg-warning",
  requested: "before:bg-primary",
};
const bar = "before:absolute before:-top-px before:bottom-0 before:-left-px before:w-[3px]";

/**
 * The renewal's change in percent, in the mono face; over 10% in the text
 * color rather than gray, so a big jump is a glance away while red stays for
 * time (bigIncrease in board.ts).
 */
function Pct({ pct }: { pct: number }) {
  return (
    <span
      className={cn("shrink-0 font-mono text-sm", bigIncrease(pct) ? "text-foreground" : "text-muted-foreground")}
    >
      {pctLabel(pct)}
    </span>
  );
}

/**
 * A household's name, as a card's heading and a mini line set it alike: the
 * headings' display face at 500, at the line's 14px. Until 2026-10-01 a mini
 * line's name was the body face at 400, so the same household read two ways.
 */
const nameStyle = "min-w-0 flex-1 font-display text-sm font-medium [overflow-wrap:break-word]";

/**
 * The way into a household's drawer from its line or card: a button laid
 * over the whole of it, named for the household, so what's on the line or
 * card reads as text and the click lands anywhere on it. Anything with a
 * button of its own sits above it. Its focus ring is drawn inside the edge,
 * so the column's scroll area doesn't clip it. It carries the household's
 * id, so closing the drawer can give the focus back to it (Upline.tsx).
 */
function OpenOverlay({
  id,
  name,
  selected,
  onOpen,
}: {
  id: string;
  name: string;
  selected: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      data-household={id}
      aria-pressed={selected}
      onClick={onOpen}
      className="absolute inset-0 focus-visible:-outline-offset-2"
    >
      <span className="sr-only">Open {name}</span>
    </button>
  );
}

/**
 * Something drawn that has no drawer behind it, and says so when pointed at
 * or focused, except while the pointer is on its countdown, which shows its
 * date instead (RowTip in lib/rowTip.ts).
 */
function NotBuilt({ className, children }: { className: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [onCountdown, setOnCountdown] = useState(false);
  return (
    <li>
      <RowTip.Provider value={setOnCountdown}>
        <Tooltip open={open && !onCountdown} onOpenChange={setOpen}>
          <TooltipTrigger asChild>
            <div tabIndex={0} className={cn(className, "focus-visible:-outline-offset-2")}>
              {children}
            </div>
          </TooltipTrigger>
          <TooltipContent>{notInPrototype}</TooltipContent>
        </Tooltip>
      </RowTip.Provider>
    </li>
  );
}

/* ------------------------------------------------------------------ *
 * Mini columns
 * ------------------------------------------------------------------ */

/**
 * One household in a mini column: the name, set as a card's is, and the
 * change in percent, at 14px, so a column of 55 reads as a list of names. A
 * red or yellow line also counts down between the two ("8 days", by a clock,
 * in the accent's color, with the date on hover), short so it fits the line;
 * the clock says it's the time left to the renewal. A Completed line is only
 * the name, since the change and the countdown are done with once a renewal
 * is closed. Under the name, a named household's requests follow, and Life
 * quote requested or Info updated among them explains a blue bar; a snoozed
 * one says so. A long name wraps rather than being cut short, so nothing
 * depends on a tooltip. The whole line opens the household's drawer, where
 * the renewal email is a click away; an invented line doesn't open, and says
 * so. On the four-column board, its status comes first under the name.
 */
function MiniRow({
  e,
  col,
  roomy,
  status,
  accent,
  ...props
}: BoardProps & { e: Entry; col: ColumnId; roomy: boolean; status?: PhaseStatus; accent: Accent | null }) {
  const { day, walk, household, onHousehold } = props;
  const selected = household === e.id;
  const open = () => onHousehold(e.id);
  // A card's padding on the four-column board (`roomy`), and a tighter line on the six.
  const frame = cn("relative text-sm", roomy ? "p-3" : "px-3 py-2", accent && [bar, accentBar[accent]]);
  const snoozed = !e.invented && isSnoozed(e.id, day, walk);

  const line = (
    <>
      <div className="flex items-start gap-2">
        <span className={nameStyle}>{setName(e.name)}</span>
        {timed(accent) && (
          <Countdown renews={e.renews} day={day} tone={accent} short onOpen={e.invented ? undefined : open} />
        )}
        {col !== "completed" && <Pct pct={e.pct} />}
      </div>
      {status && <PhaseStatusLine status={status} className="mt-1" />}
      {!e.invented && <Requests requests={requestsFor(e.id, day, walk)} className="mt-1" />}
      {snoozed && (
        <StatusLine icon={AlarmClock} className="mt-1">
          Snoozed {snoozeLabel(walk.snoozed[e.id].until)}.
        </StatusLine>
      )}
    </>
  );

  if (e.invented) return <NotBuilt className={frame}>{line}</NotBuilt>;

  return (
    <li className={cn(frame, "hover:bg-background", selected && "bg-muted hover:bg-muted")}>
      {line}
      <OpenOverlay id={e.id} name={e.name} selected={selected} onOpen={open} />
    </li>
  );
}

/* ------------------------------------------------------------------ *
 * Full columns
 * ------------------------------------------------------------------ */

/**
 * A card in Recommendation Ready or Sent, the two the same: the name with the
 * change in percent beside it (as a mini line has it), then its status, a
 * line each, close under the name: the countdown once it's red or yellow ("8
 * days", by a clock, in the accent's color, so the bar down the edge says
 * what it means) or that it's snoozed, then what the household asked for,
 * which explains a blue bar. Then one sentence, what the shop found or who
 * it's waiting on, and the action if there is one. The countdown sits under
 * the name rather than beside it, as a line's does, since a card is too
 * narrow for both without wrapping the name. Everything is 14px, the kit's
 * row size. What's renewing, the carrier and last year's price to this
 * year's came off on 2026-10-01; the drawer's header has all three. `foot`
 * sits above the card's drawer button, for anything that's a button of its
 * own. The accent replaces the card's left hairline; while its drawer is
 * open, the rest of the edge turns blue.
 */
function Card({
  name,
  pct,
  status,
  detail,
  foot,
}: {
  name: string;
  pct: number;
  status?: React.ReactNode;
  detail?: React.ReactNode;
  foot?: React.ReactNode;
}) {
  return (
    <div className="p-3 text-sm">
      <div className="flex items-start gap-2">
        <h3 className={nameStyle}>{setName(name)}</h3>
        <Pct pct={pct} />
      </div>
      {status && <div className="mt-1 flex flex-col items-start gap-1">{status}</div>}
      {detail && <p className="mt-2">{detail}</p>}
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

/**
 * A card for an invented household: its status on the four-column board,
 * its countdown once it's red or yellow, what its column says about it, and
 * no drawer behind it.
 */
function InventedCard({
  e,
  status,
  accent,
  day,
}: {
  e: Entry;
  status?: PhaseStatus;
  accent: Accent | null;
  day: Day;
}) {
  const when = timed(accent) && <Countdown renews={e.renews} day={day} tone={accent} short />;
  return (
    <NotBuilt className={cardFrame(accent)}>
      <Card
        name={e.name}
        pct={e.pct}
        status={
          (status || when) && (
            <>
              {status && <PhaseStatusLine status={status} />}
              {when}
            </>
          )
        }
        detail={e.invented!.detail}
      />
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
 *   also has View the full report, which opens their drawer with their shop
 *   results over it.
 * - Recommendation Sent: who it's waiting on, or, once they've said yes,
 *   what they approved and View profile and close. (A Ready to close chip
 *   said it a third time until 2026-10-01.)
 *
 * Completed is a mini column (MiniRow), so a household closed out in the walk
 * leaves its note and Undo on the drawer's Close out page (phases.tsx); they
 * were on its Completed card until 2026-10-01.
 *
 * A first card (firstCards.ts) says what the board gives it (board.ts), with
 * the same View profile and close once it's approved.
 *
 * A task snoozed from the drawer's banner sinks to the foot of its column,
 * loses its accent and its action, and says so under its name, in the
 * countdown's place, with Undo.
 *
 * On the four-column board, `col` is still the household's step on the six
 * columns, so the card says what that step's card says, and its status
 * comes first under the name.
 */
function NamedCard({
  e,
  col,
  status: phase,
  accent,
  ...props
}: BoardProps & { e: Entry; col: ColumnId; status?: PhaseStatus; accent: Accent | null }) {
  const { day, walk, update, household, onHousehold } = props;
  const h = thisWeek.find((x) => x.id === e.id);
  const ew = earlier.find((x) => x.id === e.id);
  const snoozed = isSnoozed(e.id, day, walk);
  const selected = household === e.id;
  const profile = () => onHousehold(e.id);

  let detail: React.ReactNode = null;
  let foot: React.ReactNode = null;

  if (firstCards[e.id]) {
    detail = e.detail;
    if (e.approved) foot = <CloseOut onProfile={profile} />;
  } else if (col === "ready") {
    if (e.id === pruitt.id) {
      // What the shop found, whatever Jenna picks in the results.
      detail = shopSentence(
        options.map((o) => ({ carrier: o.carrier, price: o.price })),
        pruitt.carrier,
        options.find((o) => o.id === "ao")!.carrier,
      );
      foot = (
        <Button
          variant="link"
          className="mt-2 h-auto p-0 font-sans text-sm"
          onClick={() => onHousehold(e.id, "results")}
        >
          View the full report
          <ArrowRight data-icon="inline-end" />
        </Button>
      );
    } else if (ew?.monday) {
      detail = earlierShop(e.id);
    }
  } else if (col === "sent") {
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

  if (snoozed) foot = null;

  const when = snoozed ? (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <StatusLine icon={AlarmClock}>Snoozed {snoozeLabel(walk.snoozed[e.id].until)}.</StatusLine>
      <Button
        variant="link"
        className="relative z-10 h-auto p-0 font-sans text-sm"
        onClick={() => update((w) => ({ snoozed: without(w.snoozed, e.id) }))}
      >
        Undo
      </Button>
    </p>
  ) : (
    timed(accent) && <Countdown renews={e.renews} day={day} tone={accent} short onOpen={profile} />
  );
  const requests = requestsFor(e.id, day, walk);
  const status = (phase || when || requests.length > 0) && (
    <>
      {phase && <PhaseStatusLine status={phase} />}
      {when}
      <Requests requests={requests} />
    </>
  );

  return (
    <li className={cn(cardFrame(accent, selected), "hover:bg-background")}>
      <OpenOverlay id={e.id} name={e.name} selected={selected} onOpen={profile} />
      <Card name={e.name} pct={e.pct} status={status} detail={detail} foot={foot} />
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

const without = <T,>(record: Record<string, T>, id: string) => {
  const { [id]: _, ...rest } = record;
  return rest;
};
