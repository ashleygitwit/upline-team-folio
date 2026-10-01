import { useState } from "react";
import { AlarmClock } from "lucide-react";
import { cn } from "cn";
import { Countdown, PhaseStatusLine, Requests, StatusLine } from "@/components/Status";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { accentFor, bigIncrease, pctLabel, setName, timed, type Accent, type ColumnId, type Entry } from "@/board";
import { earlier, options, pruitt, thisWeek, type Day } from "@/data";
import type { Phase } from "@/household/activity";
import { cards, fileFor } from "@/household/data";
import { firstCards } from "@/household/firstCards";
import { RowTip } from "@/lib/rowTip";
import { completedOn, phases, phasesFor, statusLabel, type PhaseId, type PhaseStatus, type Placed } from "@/phases";
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

const notInPrototype = "This household isn't built out for the prototype.";

/**
 * The homepage's board, which replaced Action Needed and Scheduled Emails on
 * 2026-09-30: every renewal in the pipeline, in four columns, one for each
 * phase of a renewal (phases.ts): Initial Outreach, Shopping Renewal, Closing
 * and Completed, with a status on every card saying where in the phase it is.
 * Until 2026-10-01 it was six columns, one for each step (Amanda's sketch,
 * 2026-09-30), and the four were an experiment beside them; each household
 * still keeps its step (board.ts), which is what its countdown and its card's
 * sentence go by. Every name is set the same way. Statuses are words, not
 * boxes, so the only filled rectangles on the board are buttons. Every card
 * opens the household's profile drawer, the one way in; the invented
 * households (pipeline.ts) have no drawer and say so when pointed at.
 *
 * Each column's statuses are filters under its name, and picking one narrows
 * that column alone to it. A column opens on its `opensOn` status (phases.ts),
 * what Jenna most likely came for, as long as anyone has it that day; once
 * she picks, her pick holds. They're the page's own, so every stop opens on
 * the defaults again. The toolbar's Needs me and search, which narrowed every
 * column at once, came off on 2026-10-01, Needs me as not important and
 * search for now.
 *
 * The board is drawn as v3's Policyholder List board was: the columns side by
 * side, 12px apart, each as long as its cards, with the page scrolling. A
 * column is wide enough for a couple's name beside its countdown and change;
 * narrower than all four, the board scrolls sideways inside itself.
 */
export function Board(props: BoardProps) {
  const { day, walk } = props;
  const placed = phasesFor(day, walk);
  // The status Jenna picked in each column, or null for all of them; a column
  // she hasn't touched has none here, and opens on its default.
  const [picked, setPicked] = useState<Partial<Record<PhaseId, PhaseStatus | null>>>({});
  const onlyIn = (id: PhaseId, opensOn?: PhaseStatus) => {
    const pick = picked[id];
    if (pick !== undefined) return pick ?? undefined;
    return placed[id].some((i) => i.status === opensOn) ? opensOn : undefined;
  };

  return (
    <div data-board className="overflow-x-auto">
      <div
        className="grid gap-x-3"
        style={{
          gridTemplateColumns: phases.map((c) => (c.mini ? "minmax(13rem, 1fr)" : "minmax(13.75rem, 1fr)")).join(" "),
          gridTemplateRows: "auto auto",
        }}
      >
        {phases.map((c) => {
          const items = placed[c.id];
          const only = onlyIn(c.id, c.opensOn);
          const shown = only ? items.filter((i) => i.status === only) : items;
          return (
            <Column
              key={c.id}
              id={c.id}
              label={c.label}
              mini={c.mini}
              items={shown}
              statuses={c.statuses.map((status) => ({
                status,
                n: items.filter((i) => i.status === status).length,
              }))}
              only={only}
              onOnly={(status) => setPicked((o) => ({ ...o, [c.id]: status ?? null }))}
              count={`${shown.length}`}
              empty={only ? `Nothing here is ${statusLabel[only]}.` : c.empty}
              {...props}
            />
          );
        })}
      </div>
    </div>
  );
}

/**
 * One column, a panel as v3's Policyholder List board drew its columns: gray
 * 100 at 45% with a hairline round it, as long as its cards. Its name is at
 * the column-heading size, 20px in the display face, rather than v3's 14px
 * semibold. The header and the list are the panel's two halves, laid on the
 * board's two rows (the section itself is `display: contents`), so every
 * header is as tall as the tallest and the first cards line up, while each
 * list stops at its last card. Every household is a card, 8px apart, with a
 * card's 12px padding; a snoozed task sinks to the foot of a card column. The
 * list is positioned, so the cards' screen-reader labels (absolutely
 * positioned) stay inside it rather than stretching the page. (For part of
 * 2026-10-01 the columns were ruled apart by hairlines instead, a screen
 * tall, each scrolling inside itself.)
 *
 * The column's statuses sit under its name as filters, each with its count,
 * drawn as v3's stage filters and the toolbar's Needs me (until it came off)
 * were: an outline button, on as the blue outline, one size down to sit in a
 * column. Picking one narrows the column to that status; picking it again
 * shows them all. One is on at a time, and a status with no one in it drops
 * out, unless it's the one on, as v3's stages did. Their counts are the
 * column's, so a column with them has no count of its own beside its name;
 * Completed, which has none, keeps its count.
 */
function Column({
  id,
  label,
  mini,
  items,
  statuses,
  only,
  onOnly,
  count,
  empty,
  ...props
}: BoardProps & {
  id: PhaseId;
  label: string;
  mini?: boolean;
  items: Placed[];
  statuses: { status: PhaseStatus; n: number }[];
  /** The status the column is narrowed to, if one is picked. */
  only?: PhaseStatus;
  onOnly: (status: PhaseStatus | undefined) => void;
  count: string;
  empty: string;
}) {
  const filters = statuses.filter(({ status, n }) => n > 0 || status === only);
  const { day, walk } = props;
  const sorted = mini
    ? items
    : [...items].sort((a, b) => Number(snoozedEntry(a.e, day, walk)) - Number(snoozedEntry(b.e, day, walk)));

  return (
    <section aria-labelledby={`col-${id}`} className="contents">
      <div className="row-start-1 min-w-0 border border-b-0 bg-muted/45 px-2.5 pt-3 pb-2.5">
        <h2 id={`col-${id}`} className="text-xl">
          {label}
          {filters.length === 0 && (
            <>
              {" "}
              <Count>{count}</Count>
            </>
          )}
        </h2>
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

      <div className="relative row-start-2 min-h-60 min-w-0 self-start border border-t-0 bg-muted/45 px-2.5 pb-3.5">
        {items.length === 0 ? (
          <p className="text-sm">{empty}</p>
        ) : (
          <ul className="flex flex-col gap-2 *:shrink-0">
            {sorted.map(({ e, step, status }) =>
              mini ? (
                <MiniCard
                  key={e.id}
                  e={e}
                  col={step}
                  status={status}
                  accent={accentFor(e, step, day, walk)}
                  {...props}
                />
              ) : e.invented ? (
                <InventedCard
                  key={e.id}
                  e={e}
                  col={step}
                  status={status!}
                  accent={accentFor(e, step, day, walk)}
                  day={day}
                />
              ) : (
                <NamedCard
                  key={e.id}
                  e={e}
                  col={step}
                  status={status!}
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

/** A column's count, in the mono face on a white chip, beside its name: Completed's, which has no status filters. */
function Count({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative -top-0.5 inline-block bg-card px-1.5 align-middle font-mono text-xs font-normal whitespace-nowrap">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Figures
 * ------------------------------------------------------------------ */

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
 * When a renewal was completed, "Oct 9", where a card has its change, on a
 * Completed card (completedOn in phases.ts): set as the
 * change is, in the mono face in gray, since the change and the countdown
 * are done with once a renewal is closed.
 */
function Completed({ on }: { on: string }) {
  return (
    <span className="shrink-0 font-mono text-sm text-muted-foreground">
      <span className="sr-only">Completed </span>
      {on}
    </span>
  );
}

/**
 * A household's name, as every card sets it: the headings' display face at
 * 500, at the card's 14px.
 */
const nameStyle = "min-w-0 flex-1 font-display text-sm font-medium [overflow-wrap:break-word]";

/**
 * The way into a household's drawer from its card: a button laid over the
 * whole of it, named for the household, so what's on the card reads as text
 * and the click lands anywhere on it. Anything with a button of its own sits
 * above it. Its focus ring is drawn inside the edge. It carries the
 * household's id, so closing the drawer can give the focus back to it
 * (Upline.tsx).
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
 * Initial Outreach and Completed
 * ------------------------------------------------------------------ */

/**
 * A household in Initial Outreach or Completed, the short card: the name, set
 * as every card's is, and the change in percent, at 14px; a renewal running
 * short on time also counts down between the two ("8 days", by a clock, red
 * 700 when it's urgent, with the date on hover). A Completed card has the day
 * it was completed where the change would be, since the change and the
 * countdown are done with once a renewal is closed. Under the name, its
 * status (Initial Outreach's), then a named household's requests and whether
 * it's snoozed. A long name wraps rather than being cut short, so nothing
 * depends on a tooltip. The whole card opens the household's drawer, where
 * the renewal email is a click away; an invented household's doesn't open,
 * and says so. (These were one-line lists in a white box, the mini columns,
 * until 2026-10-01.)
 */
function MiniCard({
  e,
  col,
  status,
  accent,
  ...props
}: BoardProps & { e: Entry; col: ColumnId; status?: PhaseStatus; accent: Accent | null }) {
  const { day, walk, household, onHousehold } = props;
  const selected = household === e.id;
  const open = () => onHousehold(e.id);
  const frame = cn(cardFrame(!e.invented && selected), "p-3 text-sm");
  const snoozed = !e.invented && isSnoozed(e.id, day, walk);

  const body = (
    <>
      <div className="flex items-start gap-2">
        <span className={nameStyle}>{setName(e.name)}</span>
        {timed(accent) && (
          <Countdown renews={e.renews} day={day} tone={accent} short onOpen={e.invented ? undefined : open} />
        )}
        {col === "completed" ? <Completed on={completedOn(e, walk)} /> : <Pct pct={e.pct} />}
      </div>
      {status && <PhaseStatusLine status={status} day={day} className="mt-1" />}
      {!e.invented && <Requests requests={requestsFor(e.id, day, walk)} className="mt-1" />}
      {snoozed && (
        <StatusLine icon={AlarmClock} className="mt-1">
          Snoozed {snoozeLabel(walk.snoozed[e.id].until)}.
        </StatusLine>
      )}
    </>
  );

  if (e.invented) return <NotBuilt className={frame}>{body}</NotBuilt>;

  return (
    <li className={cn(frame, "hover:bg-background")}>
      {body}
      <OpenOverlay id={e.id} name={e.name} selected={selected} onOpen={open} />
    </li>
  );
}

/* ------------------------------------------------------------------ *
 * Full columns
 * ------------------------------------------------------------------ */

/**
 * A card in Shopping Renewal or Closing, the two the same: the name, then the
 * countdown once the renewal is running short ("8 days", by a clock, red 700
 * when it's urgent) and the change in percent, the same top line as an
 * Initial Outreach card's. Under the name, whether it's snoozed, with Undo,
 * and what the household asked for. Then one sentence, what the shop found
 * or who it's waiting on, and the action if there is one. At the foot, under
 * a rule that runs edge to edge of the card, its status. Everything is 14px,
 * the kit's row size. What's renewing, the carrier and last year's price to
 * this year's came off on 2026-10-01; the drawer's header has all three.
 * `foot` sits above the card's drawer button, for anything that's a button of
 * its own.
 */
function Card({
  name,
  pct,
  when,
  status,
  detail,
  foot,
  phase,
}: {
  name: string;
  pct: number;
  /** The countdown, beside the change. */
  when?: React.ReactNode;
  status?: React.ReactNode;
  detail?: React.ReactNode;
  foot?: React.ReactNode;
  /** The card's status, at its foot. */
  phase: React.ReactNode;
}) {
  return (
    <div className="p-3 text-sm">
      <div className="flex items-start gap-2">
        <h3 className={nameStyle}>{setName(name)}</h3>
        {when}
        <Pct pct={pct} />
      </div>
      {status && <div className="mt-1 flex flex-col items-start gap-1">{status}</div>}
      {detail && <p className="mt-2">{detail}</p>}
      {foot && <div className="relative z-10">{foot}</div>}
      <div className="-mx-3 mt-3 border-t px-3 pt-3">{phase}</div>
    </div>
  );
}

/**
 * A card's frame: its hairline, all blue while its drawer is open. There's no
 * accent down its left edge (it came off on 2026-10-01): the countdown's
 * color and the request lines say what it said.
 */
const cardFrame = (selected = false) =>
  cn("relative block border bg-card text-card-foreground", selected && "border-primary");

/**
 * A card for an invented household: its countdown when it's running short,
 * what its column says about it, the button a named household's card would
 * carry, which goes nowhere (the card's tooltip says why), its status, and
 * no drawer behind it.
 */
function InventedCard({
  e,
  col,
  status,
  accent,
  day,
}: {
  e: Entry;
  col: ColumnId;
  status: PhaseStatus;
  accent: Accent | null;
  day: Day;
}) {
  const foot = col === "ready" ? <ReviewResults /> : col === "sent" && e.approved && <CloseOut />;
  return (
    <NotBuilt className={cardFrame()}>
      <Card
        name={e.name}
        pct={e.pct}
        when={timed(accent) && <Countdown renews={e.renews} day={day} tone={accent} short />}
        detail={e.invented!.detail}
        foot={foot}
        phase={<PhaseStatusLine status={status} day={day} />}
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
 * A named household's card in Shopping Renewal or Closing, which follows the
 * walk. The whole card opens the household's drawer. `col` is its step
 * (board.ts), which says what's on it:
 *
 * - Ready for Review in Shopping Renewal (the ready step): what the shop
 *   found, in one sentence, and Review Shopping Results, which opens the
 *   drawer with the results over it.
 * - Awaiting Response in Shopping Renewal (sent, not approved): who it's
 *   waiting on.
 * - Ready for Review in Closing (sent and approved): what they approved and
 *   View profile and close.
 *
 * A household closed out in the walk leaves its note and Undo on the
 * drawer's Close out page (phases.tsx). A first card (firstCards.ts) says
 * what the board gives it (board.ts), with the same buttons.
 *
 * A task snoozed from the drawer's banner sinks to the foot of its column,
 * loses its countdown and its action, and says so under its name, with Undo.
 */
function NamedCard({
  e,
  col,
  status: phase,
  accent,
  ...props
}: BoardProps & { e: Entry; col: ColumnId; status: PhaseStatus; accent: Accent | null }) {
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

  // A recommendation to send has Review Shopping Results, which opens the
  // drawer with the results over it. (The Pruitts' card had View the full
  // report, a link, until 2026-10-01.)
  if (col === "ready") foot = <ReviewResults onOpen={() => onHousehold(e.id, "results")} />;

  if (snoozed) foot = null;

  const snoozeLine = snoozed && (
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
  );
  const countdown = !snoozed && timed(accent) && (
    <Countdown renews={e.renews} day={day} tone={accent} short onOpen={profile} />
  );
  const requests = requestsFor(e.id, day, walk);
  const status = (snoozeLine || requests.length > 0) && (
    <>
      {snoozeLine}
      <Requests requests={requests} />
    </>
  );

  return (
    <li className={cn(cardFrame(selected), "hover:bg-background")}>
      <OpenOverlay id={e.id} name={e.name} selected={selected} onOpen={profile} />
      <Card
        name={e.name}
        pct={e.pct}
        when={countdown}
        status={status}
        detail={detail}
        foot={foot}
        phase={<PhaseStatusLine status={phase} day={day} />}
      />
    </li>
  );
}

/**
 * The foot of an approved card: View profile and close opens the drawer,
 * whose banner leads to Close out. The card doesn't ask for a memo, because
 * closing is a morning's work in the carrier's portal and on the phone, not
 * a field on the homepage (the 2026-09-29 review). Without `onProfile` it's
 * an invented household's, which has no drawer (CardButton).
 */
function CloseOut({ onProfile }: { onProfile?: () => void }) {
  return <CardButton onClick={onProfile}>View profile and close</CardButton>;
}

/**
 * The foot of a recommendation to send: Review
 * Shopping Results opens the drawer with the shop's results over it. Without
 * `onOpen` it's an invented household's (CardButton).
 */
function ReviewResults({ onOpen }: { onOpen?: () => void }) {
  return <CardButton onClick={onOpen}>Review Shopping Results</CardButton>;
}

/**
 * A card's button. Without `onClick` it's on an invented household's card,
 * which has no drawer: drawn the same, so every card in a column reads alike,
 * but it does nothing, stays out of the tab order (the card itself takes the
 * focus) and leaves the card's tooltip to say the household isn't built out.
 */
function CardButton({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return onClick ? (
    <Button className="mt-3" onClick={onClick}>
      {children}
    </Button>
  ) : (
    <Button className="mt-3" tabIndex={-1} aria-disabled>
      {children}
    </Button>
  );
}

const without = <T,>(record: Record<string, T>, id: string) => {
  const { [id]: _, ...rest } = record;
  return rest;
};
