import { ArrowRight, Check, ChevronsLeft, ChevronsRight, EllipsisVertical } from "lucide-react";
import { cn } from "cn";
import { CarrierMark } from "@/components/CarrierMark";
import { Chips } from "@/components/Chips";
import { RenewalMeta } from "@/components/RenewalMeta";
import { ShopPreview } from "@/components/ShopPreview";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { boardFor, columns, type ColumnId, type Entry } from "@/board";
import { earlier, money, optionById, options, pruitt, thisWeek, type Day } from "@/data";
import { cards, fileFor } from "@/household/data";
import { statusFor } from "@/status";
import { chipsFor, daysOut, isSnoozed, needsAction, snoozeLabel, snoozes } from "@/tasks";
import type { SnoozeUntil, WalkProps } from "@/walk";

export type BoardProps = WalkProps & {
  day: Day;
  /** The household open in the drawer. */
  household: string | null;
  onHousehold: (id: string) => void;
  /** Opens a household's outreach email on its own. */
  onOutreach: (id: string) => void;
  /** Opens the Pruitts' shop results. */
  onResults: () => void;
};

const notInPrototype = "Their file isn't in this prototype.";

/**
 * The homepage's board, which replaced Action Needed and Scheduled Emails on
 * 2026-09-30 (Amanda's sketch): every renewal in the pipeline, in six
 * columns, filling the screen under the band. Each column scrolls inside
 * itself, so all six are always in view. The three mini columns are a line
 * a household, drawn as the Scheduled Emails rows were; the three full
 * columns are the Action Needed cards, stacked to fit. Completed can be
 * folded to a strip, and stays folded for the rest of the walk. The named
 * households open as they always have; the invented ones (pipeline.ts) have
 * no file and say so when pointed at.
 */
export function Board(props: BoardProps) {
  const { day, walk, update } = props;
  const board = boardFor(day, walk);
  const hidden = walk.completedHidden;
  // The mini columns take a little more of the width than the full ones, so a
  // name fits on its line beside its increase and menu.
  const template = columns
    .map((c) => (c.mini ? "minmax(13rem, 1.1fr)" : c.id === "completed" && hidden ? "3rem" : "minmax(13rem, 1fr)"))
    .join(" ");

  return (
    <div data-board className="h-full overflow-x-auto">
      <div className="grid h-full min-h-0 gap-2" style={{ gridTemplateColumns: template }}>
        {columns.map((c) =>
          c.id === "completed" && hidden ? (
            <Folded key={c.id} label={c.label} n={board[c.id].length} onShow={() => update({ completedHidden: false })} />
          ) : (
            <Column key={c.id} id={c.id} label={c.label} mini={c.mini} entries={board[c.id]} {...props} />
          ),
        )}
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
 * One column: its name and count, then its households. A mini column is one
 * white card of lines that hugs what's in it and scrolls once it's taller
 * than the column; a full column is a stack of cards on the column's gray.
 * Recommendation Ready's count is blue while anything is in it, since that's
 * the column that needs Jenna. A snoozed task sinks to the foot of its
 * column. Each scroller is positioned, so the lines' screen-reader labels
 * (absolutely positioned) stay inside it rather than stretching the page.
 */
function Column({
  id,
  label,
  mini,
  entries,
  ...props
}: BoardProps & { id: ColumnId; label: string; mini?: boolean; entries: Entry[] }) {
  const { day, walk, update } = props;
  const sorted = mini
    ? entries
    : [...entries].sort((a, b) => Number(isSnoozed(a.id, day, walk)) - Number(isSnoozed(b.id, day, walk)));

  return (
    <section aria-labelledby={`col-${id}`} className="flex min-h-0 min-w-0 flex-col border bg-muted/45">
      <header className="flex min-h-11 items-center gap-1.5 px-2.5 pt-2.5 pb-2">
        <h2 id={`col-${id}`} className="min-w-0 font-sans text-sm leading-tight font-semibold">
          {label}
        </h2>
        <Count n={entries.length} strong={id === "ready" && entries.length > 0} />
        {id === "completed" && (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Hide Completed"
            className="-my-1 -mr-1.5 ml-auto text-muted-foreground"
            onClick={() => update({ completedHidden: true })}
          >
            <ChevronsRight />
          </Button>
        )}
      </header>

      {entries.length === 0 ? (
        <p className="px-2.5 text-sm text-muted-foreground">{empty[id]}</p>
      ) : mini ? (
        <div className="relative mx-1.5 mb-1.5 min-h-0 overflow-y-auto border bg-card">
          <ul className="divide-y">
            {sorted.map((e) => (
              <MiniRow key={e.id} e={e} col={id} {...props} />
            ))}
          </ul>
        </div>
      ) : (
        <ul className="relative flex min-h-0 flex-col gap-2 overflow-y-auto px-1.5 pb-1.5 *:shrink-0">
          {sorted.map((e) =>
            e.invented ? <InventedCard key={e.id} e={e} col={id} day={day} /> : <NamedCard key={e.id} e={e} col={id} {...props} />,
          )}
        </ul>
      )}
    </section>
  );
}

function Count({ n, strong }: { n: number; strong?: boolean }) {
  return (
    <span
      className={cn(
        "min-w-[1.4rem] shrink-0 px-1.5 py-px text-center font-mono text-xs",
        strong ? "bg-primary text-primary-foreground" : "bg-card",
      )}
    >
      {n}
    </span>
  );
}

/** Completed, folded to a strip: its count and its name on end, and the whole strip unfolds it. */
function Folded({ label, n, onShow }: { label: string; n: number; onShow: () => void }) {
  return (
    <section aria-label={label} className="min-h-0 border bg-muted/45">
      <button
        type="button"
        onClick={onShow}
        aria-label={`Show ${label}, ${n}`}
        className="flex h-full w-full flex-col items-center gap-3 pt-3 text-sm hover:bg-muted"
      >
        <ChevronsLeft aria-hidden className="size-4 text-muted-foreground" />
        <Count n={n} />
        <span className="font-semibold [writing-mode:vertical-rl]">{label}</span>
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Mini columns
 * ------------------------------------------------------------------ */

/**
 * One household in a mini column, as the Scheduled Emails rows drew it: the
 * carrier's mark, the name, the increase, and the menu with the profile and
 * the email. On Monday a Scheduled line opens that household's email on its
 * own, since reviewing it is what the line is for (the 2026-09-29 review),
 * and carries the check once Send now marks it as looking good; any other
 * line opens the drawer. An invented line doesn't open, and says so.
 */
function MiniRow({ e, col, ...props }: BoardProps & { e: Entry; col: ColumnId }) {
  const { day, walk, household, onHousehold, onOutreach } = props;
  const reviewing = day === "mon" && col === "scheduled";
  const looksGood = reviewing && walk.approved.includes(e.id);
  const selected = household === e.id;

  const line = (
    <div className="flex items-center gap-1.5">
      <CarrierMark carrier={e.carrier} className="size-4" />
      <span className="sr-only">{e.carrier}, </span>
      <span className="min-w-0 flex-1 truncate" title={e.name}>
        {e.name}
      </span>
      <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground tabular-nums">
        {looksGood && <Check className="size-3.5 text-primary" aria-label="Looks good" />}
        {e.increase > 0 ? `+${money(e.increase)}` : "No change"}
      </span>
      {e.invented ? (
        <span className="grid size-6 shrink-0 place-items-center text-muted-foreground/50" aria-hidden>
          <EllipsisVertical className="size-3.5" />
        </span>
      ) : (
        <RowMenu
          name={e.name}
          onProfile={() => onHousehold(e.id)}
          onEmail={() => onOutreach(e.id)}
          size="icon-xs"
          className="-my-1 -mr-1 self-center"
        />
      )}
    </div>
  );

  if (e.invented) {
    return (
      <li>
        <Tooltip>
          <TooltipTrigger asChild>
            <div tabIndex={0} className="py-1.5 pr-2 pl-2.5 text-[13px]">
              {line}
            </div>
          </TooltipTrigger>
          <TooltipContent>{notInPrototype}</TooltipContent>
        </Tooltip>
      </li>
    );
  }

  return (
    <li className={cn("relative py-1.5 pr-2 pl-2.5 text-[13px] hover:bg-background", selected && "bg-muted hover:bg-muted")}>
      {line}
      <Chips chips={chipsFor(e.id, day, walk)} className="mt-1 ml-5.5" />
      <button
        type="button"
        aria-pressed={selected}
        onClick={reviewing ? () => onOutreach(e.id) : () => onHousehold(e.id)}
        className="absolute inset-0"
      >
        <span className="sr-only">
          {reviewing ? "Review the email to" : "Open"} {e.name}
        </span>
      </button>
    </li>
  );
}

/* ------------------------------------------------------------------ *
 * Full columns
 * ------------------------------------------------------------------ */

/**
 * A card in a full column: the Action Needed card, stacked to fit, with the
 * picture over the words. A blue strip across the top says it's approved and
 * waiting to be bound, as the drawer's blue banner says something needs
 * Jenna. `onOpen` makes the whole card its button; `foot` sits under it,
 * above that button, for anything that's a button of its own; `tip` makes it
 * a card that doesn't open, and says why.
 */
function FullCard({
  name,
  strip,
  picture,
  aside,
  onOpen,
  selected,
  muted,
  tip,
  foot,
  children,
}: {
  name: string;
  strip?: string;
  picture?: React.ReactNode;
  aside?: React.ReactNode;
  onOpen?: () => void;
  selected?: boolean;
  muted?: boolean;
  tip?: string;
  foot?: React.ReactNode;
  children: React.ReactNode;
}) {
  const frame = cn(
    "relative block border bg-card text-card-foreground",
    onOpen && "transition-colors hover:border-primary",
    selected && "border-primary",
    muted && "opacity-60",
  );
  const inner = (
    <>
      {strip && <p className="bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground">{strip}</p>}
      {picture && <div>{picture}</div>}
      <div className="px-3.5 pt-3 pb-3.5 text-sm">
        <div className="flex items-start justify-between gap-2">
          <p className="min-w-0 font-display text-base leading-snug">{name}</p>
          {aside}
        </div>
        {onOpen ? (
          <button
            type="button"
            aria-pressed={selected}
            onClick={onOpen}
            className="mt-1 block w-full text-left after:absolute after:inset-0"
          >
            {children}
          </button>
        ) : (
          <div className="mt-1">{children}</div>
        )}
        {foot && <div className="relative z-10">{foot}</div>}
      </div>
    </>
  );

  if (tip) {
    return (
      <li>
        <Tooltip>
          <TooltipTrigger asChild>
            <div tabIndex={0} className={frame}>
              {inner}
            </div>
          </TooltipTrigger>
          <TooltipContent>{tip}</TooltipContent>
        </Tooltip>
      </li>
    );
  }
  return <li className={frame}>{inner}</li>;
}

/** A card for an invented household: what its column says about it, and no file behind it. */
function InventedCard({ e, col, day }: { e: Entry; col: ColumnId; day: Day }) {
  const h = e.invented!.h;
  return (
    <FullCard
      name={e.name}
      tip={notInPrototype}
      strip={e.approved ? `Approved · bind by ${e.renews}` : undefined}
      picture={col === "ready" && <ShopPreview quotes={h.shop.quotes} pick={h.shop.pick} className="p-3" />}
    >
      <RenewalMeta lines={e.lines} carrier={e.carrier} renews={e.renews} day={day} />
      {e.invented!.detail && <span className="mt-2 block">{e.invented!.detail}</span>}
    </FullCard>
  );
}

/** What an earlier week's shop came back with, from Ashley's household data, for its card's picture. */
function shopFor(id: string) {
  const rec = fileFor(cards.find((c) => c.id === id)!).rec!;
  return { quotes: rec.options.map((o) => ({ carrier: o.name, price: o.price })), pick: rec.pick };
}

const firstOf = (name: string) => name.split(" ")[0];

/**
 * A named household's card, which follows the walk. Every one opens the
 * household's drawer, except the Pruitts' results on Thursday, which open
 * their shop results, as their Action Needed card did. What's on it:
 *
 * - Recommendation Ready: the shop's preview and what it found.
 * - Recommendation Sent: who it's waiting on, or, once they've said yes, the
 *   blue strip, what they approved, and View profile and close, since the
 *   drawer is where it's closed out.
 * - Completed: how it ended, and, for anything Jenna closed out in the walk,
 *   her note and Undo.
 *
 * A task on today's list can be snoozed from the menu; it sinks to the foot
 * of its column, faded, with Undo.
 */
function NamedCard({ e, col, ...props }: BoardProps & { e: Entry; col: ColumnId }) {
  const { day, walk, update, household, onHousehold, onResults } = props;
  const h = thisWeek.find((x) => x.id === e.id);
  const ew = earlier.find((x) => x.id === e.id);
  const snoozed = isSnoozed(e.id, day, walk);
  const profile = () => onHousehold(e.id);

  const menu = (
    <RowMenu
      name={e.name}
      onProfile={profile}
      snooze={
        needsAction(e.id, day, walk) && !snoozed
          ? {
              daysOut: daysOut(e.id, day),
              onSnooze: (until: SnoozeUntil) => update((w) => ({ snoozed: { ...w.snoozed, [e.id]: { until, day } } })),
            }
          : undefined
      }
    />
  );

  let picture: React.ReactNode = null;
  let detail: React.ReactNode = null;
  let foot: React.ReactNode = null;
  let strip: string | undefined;
  let onOpen = profile;

  if (col === "ready") {
    if (e.id === pruitt.id) {
      const pick = options.find((o) => o.id === "ao")!;
      const erie = options.find((o) => o.current)!;
      picture = <ShopPreview quotes={options} pick={optionById(walk.pick).carrier} className="p-3" />;
      onOpen = onResults;
      detail = (
        <>
          {pick.carrier} came in at {money(pick.price)} for the same coverage, {money(erie.price - pick.price)} less than{" "}
          {erie.carrier}'s renewal.{" "}
          <span className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline">
            View the full report
            <ArrowRight aria-hidden className="size-3.5" />
          </span>
        </>
      );
    } else if (ew?.monday) {
      picture = <ShopPreview {...shopFor(e.id)} className="p-3" />;
      detail = ew.monday.detail;
    }
  }

  if (col === "sent") {
    if (e.approved) {
      const staying = e.id === pruitt.id && optionById(walk.pick).current;
      strip = staying ? `Approved · close out by ${e.renews}` : `Approved · bind by ${e.renews}`;
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
      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground">
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

  return (
    <FullCard
      name={e.name}
      strip={snoozed ? undefined : strip}
      picture={picture}
      aside={menu}
      onOpen={onOpen}
      selected={household === e.id}
      muted={snoozed}
      foot={foot}
    >
      <RenewalMeta lines={e.lines} carrier={e.carrier} renews={e.renews} day={day} />
      <Chips chips={chipsFor(e.id, day, walk)} className="mt-2" />
      {detail && <span className="mt-2 block">{detail}</span>}
    </FullCard>
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

/**
 * A household's menu: View Profile opens its drawer; View Email, on a mini
 * line, opens the renewal email on its own; Snooze, on a task, puts it off
 * until tomorrow, next week or five days before the renewal (that last one
 * isn't offered once the renewal is inside five days); Report an Error isn't
 * built yet, so it closes the menu and goes nowhere. It sits above a card or
 * line that opens as a whole.
 */
function RowMenu({
  name,
  onProfile,
  onEmail,
  snooze,
  size = "icon-sm",
  className,
}: {
  name: string;
  onProfile: () => void;
  onEmail?: () => void;
  snooze?: { daysOut: number; onSnooze: (until: SnoozeUntil) => void };
  size?: "icon-sm" | "icon-xs";
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={size}
          aria-label={`More for ${name}`}
          className={cn("relative z-10 -my-1.5 -mr-2 shrink-0 self-start text-muted-foreground", className)}
        >
          <EllipsisVertical className={size === "icon-xs" ? "size-3.5" : undefined} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={onProfile}>View Profile</DropdownMenuItem>
        {onEmail && <DropdownMenuItem onSelect={onEmail}>View Email</DropdownMenuItem>}
        {snooze && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Snooze</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-60">
              {snoozes.map((s) => (
                <DropdownMenuItem
                  key={s.until}
                  disabled={s.until === "beforeRenewal" && snooze.daysOut <= 5}
                  onSelect={() => snooze.onSnooze(s.until)}
                >
                  {s.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
        <DropdownMenuItem>Report an Error</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const without = <T,>(record: Record<string, T>, id: string) => {
  const { [id]: _, ...rest } = record;
  return rest;
};
