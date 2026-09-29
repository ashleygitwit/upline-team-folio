import { useState } from "react";
import { ArrowRight, Check, ChevronRight, EllipsisVertical } from "lucide-react";
import { cn } from "cn";
import { CarrierMark } from "@/components/CarrierMark";
import { RenewalMeta } from "@/components/RenewalMeta";
import { ShopPreview } from "@/components/ShopPreview";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  callahan,
  earlier,
  mondayNeeds,
  money,
  optionById,
  options,
  thisWeek,
  upcoming,
  type Day,
  type Household,
} from "@/data";
import { cards, fileFor } from "@/household/data";
import { statusFor } from "@/status";
import { going, words } from "@/today";
import type { WalkProps } from "@/walk";

/** Where "Look them over" takes Stacey. */
export const scheduledId = "scheduled-renewals";

type SectionsProps = WalkProps & {
  day: Day;
  /** The household open in the drawer. */
  household: string | null;
  onHousehold: (id: string) => void;
  /** Opens the Callahans' shop results. */
  onResults: () => void;
};

/**
 * The homepage's three sections, in the Monday email's order, most pressing
 * first: what needs closing, what's been shopped and needs a look, and what's
 * going out, which goes whether Stacey looks or not. Each holds only what
 * needs her, drawn as the Monday email draws it: no counts and no status
 * chips, the carrier's mark beside each household, and a renewal inside a week
 * counted down. On a day a section has nothing, it says so, and what's coming
 * instead. On Monday the homepage sets Closing in its band, under the
 * greeting, so `closing={false}` leaves it out here, and Shopped and
 * Scheduled sit as far apart as the band sits above them.
 */
export function Sections({ closing = true, ...props }: SectionsProps & { closing?: boolean }) {
  return (
    <div
      className={cn(
        "mt-(--space-section) flex flex-col text-left",
        closing ? "gap-(--space-block)" : "gap-(--space-section)",
      )}
    >
      {closing && <Closing {...props} />}
      <Shopped {...props} />
      <Scheduled {...props} />
    </div>
  );
}

/**
 * A section's frame: its title above the card, as the Monday email sets it,
 * then its list or a line saying it's empty. A centered title sits under the
 * greeting on Monday's band.
 */
function Section({
  id,
  title,
  centered,
  children,
}: {
  id: string;
  title: string;
  centered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-[calc(var(--demo-bar-h)+var(--space-tight))]">
      <h2 id={`${id}-title`} tabIndex={-1} className={cn("text-xl", centered && "text-center text-balance")}>
        {title}
      </h2>
      <div className="mt-4 border bg-card text-card-foreground">{children}</div>
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-6 py-5 text-base text-muted-foreground">{children}</p>;
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
        "relative",
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

const opens = <ChevronRight aria-hidden className="size-4 shrink-0 self-center text-muted-foreground" />;

/** What an earlier week's shop came back with, from Ashley's household data, for its row's picture. */
function shopFor(id: string) {
  const rec = fileFor(cards.find((c) => c.id === id)!).rec!;
  return { quotes: rec.options.map((o) => ({ carrier: o.name, price: o.price })), pick: rec.pick };
}

/** Earlier weeks' households that need Stacey, which is only on Monday. */
const fromEarlier = (day: Day, section: "shopped" | "closing") => (day === "mon" ? mondayNeeds(section) : []);

/**
 * An earlier week's household: its lines, carrier and renewal, then what's
 * needed, with a menu at the top right. Only on Monday. Shopped's rows open
 * on a preview of what the shop came back with and end their note with a link
 * to the full report; Closing's rows end in a memo and Mark as Closed.
 */
function EarlierRow({
  e,
  selected,
  onProfile,
  closing,
}: {
  e: (typeof earlier)[number];
  selected: boolean;
  onProfile: () => void;
  closing?: Pick<WalkProps, "walk" | "update">;
}) {
  const [lines, carrier] = e.lines.split(" · ");
  const shopped = e.monday!.section === "shopped";
  return (
    <Row
      h={e}
      selected={selected}
      aside={<RowMenu name={e.name} onProfile={onProfile} />}
      picture={shopped && <ShopPreview {...shopFor(e.id)} />}
    >
      <RenewalMeta lines={lines} carrier={carrier} renews={e.renews} day="mon" />
      <span className="mt-2 block">
        {e.monday!.detail}
        {shopped && (
          <>
            {" "}
            <NotInPrototype tip="Only the Callahans have results in this prototype.">
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
      {closing && <CloseOut e={e} {...closing} />}
    </Row>
  );
}

/**
 * A row's menu, at its top right: where a client's profile now lives, since
 * the name isn't a link, with their renewal history and a way to report an
 * error. View Profile opens the household's drawer, v2.5's; the renewal history
 * and the report form aren't built yet, so those close the menu and go
 * nowhere. It sits above a row that opens as a whole, whose button covers it.
 */
function RowMenu({ name, onProfile }: { name: string; onProfile: () => void }) {
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

/**
 * Closing an approval out: an optional memo and Mark as Closed, side by side
 * and flush, the way a field and its button sit. Once it's closed the row says
 * so, with the memo, and Undo puts the field back.
 */
function CloseOut({ e, walk, update }: { e: (typeof earlier)[number] } & Pick<WalkProps, "walk" | "update">) {
  const [memo, setMemo] = useState("");
  const saved = walk.closed[e.id];

  if (saved !== undefined) {
    return (
      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        <Check aria-hidden className="size-4 text-primary" />
        <span className="font-medium">Closed</span>
        {saved && <span className="text-muted-foreground">· {saved}</span>}
        <Button
          variant="link"
          className="h-auto p-0 font-sans text-sm"
          onClick={() => {
            setMemo(saved);
            update((w) => {
              const { [e.id]: _, ...rest } = w.closed;
              return { closed: rest };
            });
          }}
        >
          Undo
        </Button>
      </p>
    );
  }

  return (
    <form
      className="mt-3 flex"
      onSubmit={(ev) => {
        ev.preventDefault();
        update((w) => ({ closed: { ...w.closed, [e.id]: memo.trim() } }));
      }}
    >
      <Input
        aria-label={`Memo for ${e.name}`}
        placeholder="Add a memo"
        value={memo}
        onChange={(ev) => setMemo(ev.target.value)}
        className="min-w-0 flex-1 border-r-0 bg-background"
      />
      <Button type="submit">Mark as Closed</Button>
    </form>
  );
}

/**
 * What's going out, drawn as the Monday email draws it: a sentence, then one
 * line per household with its carrier's mark, its name and the change. On
 * Monday that's the six, and a line opens that household's drawer on its
 * outreach email. Later in the week it's the nudges and follow-ups Upline
 * sends on its own, each with why it's going.
 */
export function Scheduled({ day, walk, household, onHousehold }: SectionsProps) {
  const title = "Scheduled Renewal Emails";

  if (day !== "mon") {
    const list = upcoming[day].filter((u) => !walk.skipped.includes(u.id));
    return (
      <Section id={scheduledId} title={title}>
        {list.length === 0 ? (
          <Empty>Nothing is scheduled.</Empty>
        ) : (
          <div className="flex flex-col gap-4 px-6 py-5">
            <p className="text-base">Nudges and follow-ups go out from your inbox on their own. Nothing here needs you.</p>
            <ul className="divide-y border-t text-sm">
              {list.map((u) => {
                const h = thisWeek.find((x) => x.id === u.id)!;
                return (
                  <ScheduledRow
                    key={u.id}
                    h={h}
                    aside={`${u.what} · Goes ${u.when}`}
                    detail={u.why}
                  />
                );
              })}
            </ul>
          </div>
        )}
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
                selected={household === h.id}
                onOpen={() => onHousehold(h.id)}
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
 * Shops whose results are back and waiting on Stacey. On Monday that's
 * Elena Vasquez and Raymond Foss from earlier weeks, as on Ashley's v2
 * board. In this walk's week it's the Callahans on Thursday morning, until
 * the recommendation goes to Dana, drawn as Elena's and Raymond's rows are:
 * the shop's preview, the menu, and the result ending in View the full
 * report. The whole row opens the results in a modal, so the report link is
 * part of the row's button rather than a button of its own, and the menu's
 * View Profile opens their drawer, as Elena's does hers. On Thursday the homepage
 * sets this section in its band, under the greeting, with a centered title,
 * as Monday sets Closing.
 */
export function Shopped({
  day,
  walk,
  household,
  onHousehold,
  onResults,
  title = "Shopped and ready for review",
  centered,
}: SectionsProps & { title?: string; centered?: boolean }) {
  const h = callahan;
  const skipped = walk.skipped.includes(h.id);
  const ready = day === "thu" && !walk.recSent && !skipped;
  const others = fromEarlier(day, "shopped");
  const pick = options.find((o) => o.id === "ao")!;
  const erie = options.find((o) => o.current)!;

  const empty = {
    mon: "Nothing to review.",
    wed: skipped ? "Nothing to review yet." : "Nothing to review yet. The Callahans are being shopped, back Thursday.",
    thu: walk.recSent
      ? "Nothing to review. Your recommendation went to Dana this morning."
      : "Nothing to review yet. Pat and Ellen Brennan are being shopped, back Friday afternoon.",
    fri: "Nothing to review yet. Pat and Ellen Brennan's results are back this afternoon.",
  }[day];

  return (
    <Section id="shopped" title={title} centered={centered}>
      {ready || others.length > 0 ? (
        <ul className="divide-y">
          {ready && (
            <Row
              h={h}
              onOpen={onResults}
              aside={<RowMenu name={h.name} onProfile={() => onHousehold(h.id)} />}
              picture={<ShopPreview quotes={options} pick={optionById(walk.pick).carrier} />}
            >
              <RenewalMeta lines={h.lines} carrier={h.carrier} renews={h.renews} day={day} />
              <span className="mt-2 block">
                {pick.carrier} came in at {money(pick.price)} for the same coverage, {money(erie.price - pick.price)}{" "}
                less than {erie.carrier}'s renewal.{" "}
                <span className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline">
                  View the full report
                  <ArrowRight aria-hidden className="size-3.5" />
                </span>
              </span>
            </Row>
          )}
          {others.map((e) => (
            <EarlierRow key={e.id} e={e} selected={household === e.id} onProfile={() => onHousehold(e.id)} />
          ))}
        </ul>
      ) : (
        <Empty>{empty}</Empty>
      )}
    </Section>
  );
}

/**
 * Approvals Stacey has to bind. On Monday that's Anika Desai and Linda Hart
 * from earlier weeks, as on Ashley's v2 board, under a title that says how
 * many. In this walk's week it's the Callahans on Friday, until she marks it
 * done; their row opens their drawer.
 */
export function Closing({
  day,
  walk,
  update,
  household,
  onHousehold,
  title = "Closing",
  centered,
}: SectionsProps & { title?: string; centered?: boolean }) {
  const h = callahan;
  const skipped = walk.skipped.includes(h.id);
  const approved = day === "fri" && !walk.bound && !skipped;
  const status = approved ? statusFor(h, day, walk) : null;
  const others = fromEarlier(day, "closing");

  const empty =
    day === "fri" && walk.bound
      ? "Nothing left to close. The Callahans are done."
      : day === "thu" && walk.recSent
        ? "Nothing to close yet. We'll let you know when Dana answers."
        : "Nothing to close yet.";

  return (
    <Section id="closing" title={title} centered={centered}>
      {status || others.length > 0 ? (
        <ul className="divide-y">
          {status && (
            <Row h={h} selected={household === h.id} onOpen={() => onHousehold(h.id)} aside={opens}>
              <RenewalMeta lines={h.lines} carrier={h.carrier} renews={h.renews} day={day} />
              <span className="mt-2 block">{status.detail}</span>
            </Row>
          )}
          {others.map((e) => (
            <EarlierRow
              key={e.id}
              e={e}
              selected={household === e.id}
              onProfile={() => onHousehold(e.id)}
              closing={{ walk, update }}
            />
          ))}
        </ul>
      ) : (
        <Empty>{empty}</Empty>
      )}
    </Section>
  );
}
