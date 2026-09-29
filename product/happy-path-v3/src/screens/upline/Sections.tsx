import { AlarmClock, ArrowRight, Check, ChevronRight, EllipsisVertical } from "lucide-react";
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
import {
  pruitt,
  money,
  optionById,
  options,
  thisWeek,
  upcoming,
  type Day,
  type Earlier,
  type Household,
} from "@/data";
import { cards, fileFor } from "@/household/data";
import { statusFor } from "@/status";
import { actionNeeded, chipsFor, daysOut, snoozeLabel, snoozedTasks, snoozes, type Task } from "@/tasks";
import { going, words } from "@/today";
import type { SnoozeUntil, Walk, WalkProps } from "@/walk";

/** Where "Look them over" takes Jenna. */
export const scheduledId = "scheduled-renewals";

type SectionsProps = WalkProps & {
  day: Day;
  /** The household open in the drawer. */
  household: string | null;
  onHousehold: (id: string) => void;
  /** Opens a household's outreach review on its own. */
  onOutreach: (id: string) => void;
  /** Opens the Pruitts' shop results. */
  onResults: () => void;
};

/**
 * The homepage's two sections, under its band every day, in the Monday
 * email's order: what needs Jenna this week (approvals to bind and shops to
 * look over, soonest renewal first), and what's going out, which goes whether
 * she looks or not. Each holds only what needs her, drawn as the Monday email
 * draws it: no counts, the carrier's mark beside each household, and a renewal
 * inside a week counted down. A section with nothing in it that day isn't
 * drawn, so the page is only ever what needs her; the band's line says what's
 * going on. They sit as far apart as the band sits above them. They were
 * three sections, Closing, Shopped and Scheduled, until the 2026-09-29
 * review found the split more than it was worth.
 */
export function Sections(props: SectionsProps) {
  const { day, walk } = props;
  const needed = actionNeeded(day, walk).length > 0 || snoozedTasks(day, walk).length > 0;
  const scheduled = day === "mon" || scheduledLater(day, walk).length > 0;
  return (
    <div className="mt-(--space-section) flex flex-col gap-(--space-section) text-left">
      {needed && <ActionNeeded {...props} />}
      {scheduled && <Scheduled {...props} />}
    </div>
  );
}


/**
 * After Monday, the nudges and follow-ups going out on their own, less any
 * Jenna sent early or skipped from the household's drawer.
 */
const scheduledLater = (day: Exclude<Day, "mon">, walk: Walk) =>
  upcoming[day].filter((u) => !walk.skipped.includes(u.id) && !walk.nudges[u.nudge]);

/** A section's frame: its title above the card, as the Monday email sets it, then its list. */
function Section({
  id,
  title,
  cards,
  children,
}: {
  id: string;
  title: string;
  /** The list draws its own cards, one per row, instead of sitting in one. */
  cards?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-[calc(var(--demo-bar-h)+var(--space-tight))]">
      <h2 id={`${id}-title`} tabIndex={-1} className="text-xl">
        {title}
      </h2>
      <div className={cn("mt-4", !cards && "border bg-card text-card-foreground")}>{children}</div>
    </section>
  );
}

/**
 * A household's row. The whole row opens what's behind it. The name is plain
 * text, as in the Monday email; a client's profile is in the row's menu.
 * Earlier weeks' households have no page behind them in this prototype, so
 * their rows don't open. A row with a picture takes the design hub's template
 * card layout: the picture on the left, two fifths of the row, and the words
 * on the right, centered against it, stacked below 640.
 */
function Row({
  h,
  selected,
  onOpen,
  aside,
  picture,
  children,
}: {
  h: Pick<Household, "id" | "name">;
  selected?: boolean;
  onOpen?: () => void;
  aside?: React.ReactNode;
  picture?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li
      className={cn(
        "relative border bg-card text-card-foreground",
        picture ? "grid sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]" : "flex",
        onOpen && "hover:bg-background",
        selected && "bg-muted hover:bg-muted",
      )}
    >
      {picture}
      <div className={cn("min-w-0 flex-1 px-6 py-4 text-sm", picture && "self-center")}>
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate font-display text-lg">{h.name}</p>
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
      </div>
    </li>
  );
}

/** What an earlier week's shop came back with, from Ashley's household data, for its row's picture. */
function shopFor(id: string) {
  const rec = fileFor(cards.find((c) => c.id === id)!).rec!;
  return { quotes: rec.options.map((o) => ({ carrier: o.name, price: o.price })), pick: rec.pick };
}


/**
 * An earlier week's household: its lines, carrier and renewal, then what's
 * needed, with a menu at the top right. Only on Monday. A shopped row opens
 * on a preview of what the shop came back with and ends its note with a link
 * to the full report; a closing row ends in View profile, since the work of
 * closing (binding in the portal, the call, the paperwork) happens outside
 * Upline, and the drawer is where she closes it out.
 */
function EarlierRow({
  e,
  selected,
  onProfile,
  onSnooze,
  walk,
  closing,
}: {
  e: Earlier;
  selected: boolean;
  onProfile: () => void;
  onSnooze: (until: SnoozeUntil) => void;
  walk: Walk;
  closing?: Pick<WalkProps, "walk" | "update">;
}) {
  const [lines, carrier] = e.lines.split(" · ");
  const shopped = e.monday!.section === "shopped";
  return (
    <Row
      h={e}
      selected={selected}
      aside={<RowMenu name={e.name} onProfile={onProfile} snooze={{ daysOut: daysOut(e.id, "mon"), onSnooze }} />}
      picture={shopped && <ShopPreview {...shopFor(e.id)} />}
    >
      <RenewalMeta lines={lines} carrier={carrier} renews={e.renews} day="mon" />
      <Chips chips={chipsFor(e.id, "mon", walk)} className="mt-2" />
      <span className="mt-2 block">
        {e.monday!.detail}
        {shopped && (
          <>
            {" "}
            <NotInPrototype tip="Only the Pruitts have results in this prototype.">
              <button
                type="button"
                aria-disabled
                className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
              >
                View the full report
                <ArrowRight aria-hidden className="size-3.5" />
              </button>
            </NotInPrototype>
          </>
        )}
      </span>
      {closing && (
        <CloseOut
          saved={closing.walk.closed[e.id]}
          onProfile={onProfile}
          onUndo={() => closing.update((w) => ({ closed: without(w.closed, e.id) }))}
        />
      )}
    </Row>
  );
}

/**
 * A row's menu, at its top right: where a client's profile now lives, since
 * the name isn't a link, with their renewal history, a way to report an
 * error and, on an Action Needed row, Snooze, which puts the task off until
 * tomorrow, next week or five days before the renewal (that last one isn't
 * offered once the renewal is inside five days). View Profile opens the
 * household's drawer, v2.5's; the renewal history and the report form aren't
 * built yet, so those close the menu and go nowhere. It sits above a row that
 * opens as a whole, whose button covers it.
 */
function RowMenu({
  name,
  onProfile,
  snooze,
}: {
  name: string;
  onProfile: () => void;
  snooze?: { daysOut: number; onSnooze: (until: SnoozeUntil) => void };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`More for ${name}`}
          className="relative z-10 -my-1.5 -mr-2 shrink-0 self-start text-muted-foreground"
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={onProfile}>View Profile</DropdownMenuItem>
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
        <DropdownMenuItem>View Renewal History</DropdownMenuItem>
        <DropdownMenuItem>Report an Error</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Something drawn as it will be that doesn't do anything in this prototype, and says so. */
function NotInPrototype({ tip, children }: { tip: string; children: React.ReactElement }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{tip}</TooltipContent>
    </Tooltip>
  );
}

const without = <T,>(record: Record<string, T>, id: string) => {
  const { [id]: _, ...rest } = record;
  return rest;
};

/**
 * The foot of a closing row. Until it's closed, View profile opens the
 * drawer, whose banner leads to Close out: the row doesn't ask for a memo
 * because closing is a morning's work in the carrier's portal and on the
 * phone, not a field on the homepage (the 2026-09-29 review). Once closed out
 * the row says so, with the note she wrote, and Undo reopens it. `saved` is
 * that note once closed, and undefined until then.
 */
function CloseOut({ saved, onProfile, onUndo }: { saved: string | undefined; onProfile: () => void; onUndo: () => void }) {
  if (saved !== undefined) {
    return (
      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        <Check aria-hidden className="size-4 text-primary" />
        <span className="font-medium">Closed</span>
        {saved && <span className="text-muted-foreground">· {saved}</span>}
        <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={onUndo}>
          Undo
        </Button>
      </p>
    );
  }
  return (
    <Button variant="secondary" className="relative z-10 mt-3" onClick={onProfile}>
      View profile
    </Button>
  );
}

/**
 * What's going out, drawn as the Monday email draws it: a sentence, then one
 * line per household with its carrier's mark, its name and the change. On
 * Monday that's the six, and a line opens that household's outreach review
 * straight away, not its drawer: reviewing the email is what the line is for
 * (the 2026-09-29 review), and the drawer is a menu away. Later in the week
 * it's the nudges and follow-ups Upline sends on its own, each with why it's
 * going.
 */
function Scheduled({ day, walk, onOutreach }: SectionsProps) {
  const title = "Scheduled Emails";

  if (day !== "mon") {
    return (
      <Section id={scheduledId} title={title}>
        <div className="flex flex-col gap-4 px-6 py-5">
          <p className="text-base">Nudges and follow-ups go out from your inbox on their own. Nothing here needs you.</p>
          <ul className="divide-y border-t text-sm">
            {scheduledLater(day, walk).map((u) => {
              const h = thisWeek.find((x) => x.id === u.id)!;
              return <ScheduledRow key={u.id} h={h} aside={`${u.what} · Goes ${u.when}`} detail={u.why} />;
            })}
          </ul>
        </div>
      </Section>
    );
  }

  const n = going(walk);
  return (
    <Section id={scheduledId} title={title}>
      <div className="flex flex-col gap-4 px-6 py-5">
        <p className="text-base">
          {words[n]} {n === 1 ? "renewal goes" : "renewals go"} out tomorrow at 9:00 AM, drafted in your voice and sent
          from your inbox. You don't need to do anything.
        </p>
        <ul className="divide-y border-t text-sm">
          {thisWeek.map((h) => {
            const skipped = walk.skipped.includes(h.id);
            const approved = !skipped && walk.approved.includes(h.id);
            const increase = h.now - h.was;
            return (
              <ScheduledRow
                key={h.id}
                h={h}
                onOpen={() => onOutreach(h.id)}
                aside={
                  <>
                    {skipped ? "Skipped" : increase > 0 ? `+${money(increase)}` : "No change"}
                    {approved && <Check className="size-4 text-primary" aria-label="Looks good" />}
                  </>
                }
              />
            );
          })}
        </ul>
      </div>
    </Section>
  );
}

/**
 * One household on the Scheduled list: the carrier's mark, the name and, on
 * the right, the change or when a nudge goes. A line with `onOpen` opens that
 * household's drawer, and ends in a chevron to say so; the whole line is its
 * button.
 */
function ScheduledRow({
  h,
  selected,
  onOpen,
  aside,
  detail,
}: {
  h: Household;
  selected?: boolean;
  onOpen?: () => void;
  aside: React.ReactNode;
  detail?: string;
}) {
  return (
    <li className={cn("relative py-2", onOpen && "hover:bg-background", selected && "bg-muted hover:bg-muted")}>
      <div className="flex items-center justify-between gap-4">
        <span className="flex min-w-0 items-center gap-2">
          <CarrierMark carrier={h.carrier} />
          <span className="sr-only">{h.carrier}, </span>
          <span className="truncate">{h.name}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2 text-muted-foreground tabular-nums">
          {aside}
          {onOpen && <ChevronRight aria-hidden className="size-4" />}
        </span>
      </div>
      {detail && <p className="mt-1 ml-7 text-muted-foreground">{detail}</p>}
      {onOpen && (
        <button type="button" aria-pressed={selected} onClick={onOpen} className="absolute inset-0">
          <span className="sr-only">Open {h.name}</span>
        </button>
      )}
    </li>
  );
}

/**
 * What needs Jenna this week, soonest renewal first. On Monday that's the
 * earlier weeks' four, as on Ashley's v2 board: Sofia Marin and Walter Kemp
 * shopped, Diane Mercer and Rhea Iyer approved and waiting to be bound. In
 * this walk's week it's the Pruitts: their shop on Thursday morning, until the
 * recommendation goes to Leah, and their approval on Friday. A shopped row is
 * the shop's preview, the menu, and the result ending in View the full report;
 * the whole row opens the results in a modal, so the report link is part of
 * the row's button rather than a button of its own. A closing row is the menu,
 * what they approved, and View profile; once closed out from the drawer it
 * says so, and Undo reopens it. Every menu's View Profile opens the drawer,
 * and its Snooze takes the row off the list and puts it in a quiet line at
 * the foot, with Undo, so what's put off stays in sight. Each task is its own
 * card, 16 apart, rather than a row in one shared card.
 */
function ActionNeeded({ day, walk, update, household, onHousehold, onResults }: SectionsProps) {
  const h = pruitt;
  const pick = options.find((o) => o.id === "ao")!;
  const erie = options.find((o) => o.current)!;
  const snooze = (id: string) => (until: SnoozeUntil) =>
    update((w) => ({ snoozed: { ...w.snoozed, [id]: { until, day } } }));
  const unsnooze = (id: string) => update((w) => ({ snoozed: without(w.snoozed, id) }));
  const snoozed = snoozedTasks(day, walk);
  const menu = (id: string) => (
    <RowMenu name={h.name} onProfile={() => onHousehold(id)} snooze={{ daysOut: daysOut(id, day), onSnooze: snooze(id) }} />
  );

  return (
    <Section id="action-needed" title="Action Needed" cards>
      <ul className="flex flex-col gap-4">
        {actionNeeded(day, walk).map((t) =>
          t.earlier ? (
            <EarlierRow
              key={t.id}
              e={t.earlier}
              selected={household === t.id}
              onProfile={() => onHousehold(t.id)}
              onSnooze={snooze(t.id)}
              walk={walk}
              closing={t.kind === "closing" ? { walk, update } : undefined}
            />
          ) : t.kind === "shopped" ? (
            <Row
              key="pruitt-shopped"
              h={h}
              onOpen={onResults}
              aside={menu(h.id)}
              picture={<ShopPreview quotes={options} pick={optionById(walk.pick).carrier} />}
            >
              <RenewalMeta lines={h.lines} carrier={h.carrier} renews={h.renews} day={day} />
              <Chips chips={chipsFor(h.id, day, walk)} className="mt-2" />
              <span className="mt-2 block">
                {pick.carrier} came in at {money(pick.price)} for the same coverage, {money(erie.price - pick.price)}{" "}
                less than {erie.carrier}'s renewal.{" "}
                <span className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline">
                  View the full report
                  <ArrowRight aria-hidden className="size-3.5" />
                </span>
              </span>
            </Row>
          ) : (
            <Row key="pruitt-closing" h={h} selected={household === h.id} aside={menu(h.id)}>
              <RenewalMeta lines={h.lines} carrier={h.carrier} renews={h.renews} day={day} />
              <Chips chips={chipsFor(h.id, day, walk)} className="mt-2" />
              {/* What they approved, said as it was before she closed it. */}
              <span className="mt-2 block">{statusFor(h, "fri", { ...walk, bound: false }).detail}</span>
              <CloseOut
                saved={walk.bound ? (walk.closed[h.id] ?? "") : undefined}
                onProfile={() => onHousehold(h.id)}
                onUndo={() => update((w) => ({ bound: false, closed: without(w.closed, h.id) }))}
              />
            </Row>
          ),
        )}
        {snoozed.length > 0 && (
          <li className="border bg-card px-6 py-4 text-sm text-card-foreground">
            <p className="flex items-center gap-1.5 font-medium text-muted-foreground">
              <AlarmClock aria-hidden className="size-4" />
              Snoozed
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {snoozed.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-medium">{nameOf(t)}</span>
                  <span className="text-muted-foreground">· {snoozeLabel(walk.snoozed[t.id].until)}</span>
                  <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={() => unsnooze(t.id)}>
                    Undo
                  </Button>
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </Section>
  );
}

const nameOf = (t: Task) => t.earlier?.name ?? pruitt.name;
