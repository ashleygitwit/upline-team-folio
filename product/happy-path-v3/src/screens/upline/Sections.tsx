import { Check, ChevronRight } from "lucide-react";
import { cn } from "cn";
import { CarrierMark } from "@/components/CarrierMark";
import { PersonLink } from "@/components/PersonLink";
import { RenewalMeta } from "@/components/RenewalMeta";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { callahan, earlier, initials, mondayNeeds, money, thisWeek, upcoming, type Day, type Household } from "@/data";
import { statusFor } from "@/status";
import { going } from "@/today";
import type { WalkProps } from "@/walk";

/** Where "Look them over" takes Stacey. */
export const scheduledId = "scheduled-renewals";

type SectionsProps = WalkProps & {
  day: Day;
  /** The household whose email is open in the sheet. */
  message: string | null;
  onMessage: (id: string) => void;
  onProfile: () => void;
  onResults: () => void;
};

/**
 * The homepage's three sections, in the Monday email's order, most pressing
 * first: what needs closing, what's been shopped and needs a look, and what's
 * going out, which goes whether Stacey looks or not. Each holds only what
 * needs her, drawn as the Monday email draws it: no counts and no status
 * chips, the carrier's mark beside each household, and a renewal inside a week
 * counted down. On a day a section has nothing, it says so, and what's coming
 * instead.
 */
export function Sections(props: SectionsProps) {
  return (
    <div className="mt-(--space-section) flex flex-col gap-(--space-block) text-left">
      <Closing {...props} />
      <Shopped {...props} />
      <Scheduled {...props} />
    </div>
  );
}

/** A section's frame: its title, then its list or a line saying it's empty. */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-[calc(var(--demo-bar-h)+var(--space-tight))] border bg-card"
    >
      <h2 id={`${id}-title`} tabIndex={-1} className="border-b px-6 py-5 text-xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-6 py-5 text-base text-muted-foreground">{children}</p>;
}

function Face({ name }: { name: string }) {
  return (
    <Avatar size="lg">
      <AvatarFallback>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}

/**
 * A household's row. The whole row opens what's behind it, and the name on
 * top of it goes to the client's profile instead. Earlier weeks' households
 * have no page behind them in this prototype, so their rows don't open. A
 * `carrier` puts that carrier's mark beside the name, as the Monday email's
 * Scheduled list does.
 */
function Row({
  h,
  carrier,
  selected,
  onOpen,
  onProfile,
  aside,
  children,
}: {
  h: Pick<Household, "id" | "name">;
  carrier?: string;
  selected?: boolean;
  onOpen?: () => void;
  onProfile: () => void;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className={cn("relative flex gap-3 px-6 py-4", onOpen && "hover:bg-background", selected && "bg-muted hover:bg-muted")}>
      <Face name={h.name} />
      <div className="min-w-0 flex-1 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2">
            {carrier && <CarrierMark carrier={carrier} />}
            {carrier && <span className="sr-only">{carrier}, </span>}
            <PersonLink h={h} onProfile={onProfile} className="relative z-10 truncate" />
          </span>
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

/** Earlier weeks' households that need Stacey, which is only on Monday. */
const fromEarlier = (day: Day, section: "shopped" | "closing") => (day === "mon" ? mondayNeeds(section) : []);

/** An earlier week's household: its lines, carrier and renewal, then what's needed. Only on Monday. */
function EarlierRow({ e, onProfile }: { e: (typeof earlier)[number]; onProfile: () => void }) {
  const [lines, carrier] = e.lines.split(" · ");
  return (
    <Row h={e} onProfile={onProfile}>
      <RenewalMeta lines={lines} carrier={carrier} renews={e.renews} day="mon" />
      <span className="mt-2 block">{e.monday!.detail}</span>
    </Row>
  );
}

/**
 * What's going out. On Monday that's the six, each with the start of its
 * email, and one button to say they all look good; a row opens the email in
 * the sheet. Later in the week it's the nudges and follow-ups Upline sends
 * on its own.
 */
function Scheduled({ day, walk, update, message, onMessage, onProfile }: SectionsProps) {
  const title = "Scheduled Renewal Emails";

  if (day !== "mon") {
    const list = upcoming[day].filter((u) => !walk.skipped.includes(u.id));
    return (
      <Section id={scheduledId} title={title}>
        {list.length === 0 ? (
          <Empty>Nothing is scheduled.</Empty>
        ) : (
          <>
            <p className="border-b bg-background px-6 py-5 text-sm">
              Nudges and follow-ups go out from your inbox on their own. Nothing here needs you.
            </p>
            <ul className="divide-y">
              {list.map((u) => {
                const h = thisWeek.find((x) => x.id === u.id)!;
                return (
                  <Row key={u.id} h={h} carrier={h.carrier} onProfile={onProfile}>
                    <p>
                      {u.what} · Goes {u.when}
                    </p>
                    <p className="mt-1 text-muted-foreground">{u.why}</p>
                  </Row>
                );
              })}
            </ul>
          </>
        )}
      </Section>
    );
  }

  const n = going(walk);
  return (
    <Section id={scheduledId} title={title}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b bg-background px-6 py-5">
        <p className="max-w-[44ch] text-sm">
          {walk.approvedAll
            ? "Nice. They send tomorrow at 9 AM, and you can still open any of them before then."
            : "Each one is drafted in your voice and sends from your inbox tomorrow at 9 AM. Look over any you like, or let them go."}
        </p>
        {walk.approvedAll ? (
          <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={() => update({ approvedAll: false })}>
            Undo
          </Button>
        ) : (
          <Button onClick={() => update({ approvedAll: true })} disabled={n === 0}>
            All {n} look good
          </Button>
        )}
      </div>
      <ul className="divide-y">
        {thisWeek.map((h) => {
          const skipped = walk.skipped.includes(h.id);
          const approved = !skipped && (walk.approvedAll || walk.approved.includes(h.id));
          const increase = h.now - h.was;
          return (
            <Row
              key={h.id}
              h={h}
              carrier={h.carrier}
              selected={message === h.id}
              onOpen={() => onMessage(h.id)}
              onProfile={onProfile}
              aside={
                <span className="flex shrink-0 items-center gap-2 text-muted-foreground tabular-nums">
                  {increase > 0 ? `+${money(increase)}` : "No change"}
                  {approved && <Check className="size-4 text-primary" aria-label="Looks good" />}
                </span>
              }
            >
              {skipped ? (
                <span className="text-muted-foreground">Skipped. You're handling this one yourself.</span>
              ) : (
                <span className="line-clamp-2 text-muted-foreground">
                  {(walk.drafts[h.id] ?? h.email).split(/\n\n+/).slice(0, 3).join(" ")}
                </span>
              )}
            </Row>
          );
        })}
      </ul>
    </Section>
  );
}

/**
 * Shops whose results are back and waiting on Stacey. On Monday that's
 * Elena Vasquez and Raymond Foss from earlier weeks, as on Ashley's v2
 * board. In this walk's week it's the Callahans on Thursday morning, until
 * the recommendation goes to Dana; their row goes to the results.
 */
function Shopped({ day, walk, onProfile, onResults }: SectionsProps) {
  const h = callahan;
  const skipped = walk.skipped.includes(h.id);
  const ready = day === "thu" && !walk.recSent && !skipped;
  const status = ready ? statusFor(h, day, walk) : null;
  const others = fromEarlier(day, "shopped");

  const empty = {
    mon: "Nothing to review.",
    wed: skipped ? "Nothing to review yet." : "Nothing to review yet. The Callahans are being shopped, back Thursday.",
    thu: walk.recSent
      ? "Nothing to review. Your recommendation went to Dana this morning."
      : "Nothing to review yet. Pat and Ellen Brennan are being shopped, back Friday afternoon.",
    fri: "Nothing to review yet. Pat and Ellen Brennan's results are back this afternoon.",
  }[day];

  return (
    <Section id="shopped" title="Shopped and ready for review">
      {status || others.length > 0 ? (
        <ul className="divide-y">
          {status && (
            <Row h={h} onOpen={onResults} onProfile={onProfile} aside={opens}>
              <RenewalMeta lines={h.lines} carrier={h.carrier} renews={h.renews} day={day} />
              <span className="mt-2 block">{status.detail}</span>
            </Row>
          )}
          {others.map((e) => (
            <EarlierRow key={e.id} e={e} onProfile={onProfile} />
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
 * from earlier weeks, as on Ashley's v2 board. In this walk's week it's the
 * Callahans on Friday, until she marks it done; their row goes to their
 * profile.
 */
function Closing({ day, walk, onProfile }: SectionsProps) {
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
    <Section id="closing" title="Closing">
      {status || others.length > 0 ? (
        <ul className="divide-y">
          {status && (
            <Row h={h} onOpen={onProfile} onProfile={onProfile} aside={opens}>
              <RenewalMeta lines={h.lines} carrier={h.carrier} renews={h.renews} day={day} />
              <span className="mt-2 block">{status.detail}</span>
            </Row>
          )}
          {others.map((e) => (
            <EarlierRow key={e.id} e={e} onProfile={onProfile} />
          ))}
        </ul>
      ) : (
        <Empty>{empty}</Empty>
      )}
    </Section>
  );
}
