import { Check, ChevronRight } from "lucide-react";
import { cn } from "cn";
import { PersonLink } from "@/components/PersonLink";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { callahan, initials, money, thisWeek, upcoming, type Day, type Household } from "@/data";
import { badgeVariant, statusFor } from "@/status";
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
 * The homepage's three sections, in the order a renewal moves through them:
 * what's going out, what's been shopped and needs a look, and what needs
 * closing. Each holds only what needs Stacey, so most days most of them say
 * there's nothing to do, and what's coming instead.
 */
export function Sections(props: SectionsProps) {
  return (
    <div className="mt-(--space-section) flex flex-col gap-(--space-block) text-left">
      <Scheduled {...props} />
      <Shopped {...props} />
      <Closing {...props} />
    </div>
  );
}

/** A section's frame: its title and count, then its list or a line saying it's empty. */
function Section({
  id,
  title,
  count,
  children,
}: {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-[calc(var(--demo-bar-h)+var(--space-tight))] border bg-card"
    >
      <h2 id={`${id}-title`} tabIndex={-1} className="flex items-center gap-3 border-b px-6 py-5 text-xl">
        {title}
        {count > 0 && <Badge>{count}</Badge>}
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
 * top of it goes to the client's profile instead.
 */
function Row({
  h,
  selected,
  onOpen,
  onProfile,
  aside,
  children,
}: {
  h: Household;
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
        <div className="flex items-baseline justify-between gap-3">
          <PersonLink h={h} onProfile={onProfile} className="relative z-10 truncate" />
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
      <Section id={scheduledId} title={title} count={list.length}>
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
                  <Row key={u.id} h={h} onProfile={onProfile}>
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
    <Section id={scheduledId} title={title} count={n}>
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
 * Shops whose results are back and waiting on Stacey. In this walk that's
 * the Callahans on Thursday morning, until the recommendation goes to Dana;
 * the row goes to the results.
 */
function Shopped({ day, walk, onProfile, onResults }: SectionsProps) {
  const h = callahan;
  const skipped = walk.skipped.includes(h.id);
  const ready = day === "thu" && !walk.recSent && !skipped;
  const status = ready ? statusFor(h, day, walk) : null;

  const empty = {
    mon: "Nothing to review yet. Priya Patel's and Kevin Brooks's shops come back Tuesday.",
    wed: skipped ? "Nothing to review yet." : "Nothing to review yet. The Callahans are being shopped, back Thursday.",
    thu: walk.recSent
      ? "Nothing to review. Your recommendation went to Dana this morning."
      : "Nothing to review yet. Pat and Ellen Brennan are being shopped, back Friday afternoon.",
    fri: "Nothing to review yet. Pat and Ellen Brennan's results are back this afternoon.",
  }[day];

  return (
    <Section id="shopped" title="Shopped and ready for review" count={ready ? 1 : 0}>
      {status ? (
        <ul>
          <Row h={h} onOpen={onResults} onProfile={onProfile} aside={opens}>
            <Badge variant={badgeVariant(status.label)}>{status.label}</Badge>
            <span className="mt-2 block">{status.detail}</span>
          </Row>
        </ul>
      ) : (
        <Empty>{empty}</Empty>
      )}
    </Section>
  );
}

/**
 * Approvals Stacey has to bind. In this walk that's the Callahans on Friday,
 * until she marks it done; the row goes to their profile.
 */
function Closing({ day, walk, onProfile }: SectionsProps) {
  const h = callahan;
  const skipped = walk.skipped.includes(h.id);
  const approved = day === "fri" && !walk.bound && !skipped;
  const status = approved ? statusFor(h, day, walk) : null;

  const empty =
    day === "fri" && walk.bound
      ? "Nothing left to close. The Callahans are done."
      : day === "thu" && walk.recSent
        ? "Nothing to close yet. We'll let you know when Dana answers."
        : "Nothing to close yet.";

  return (
    <Section id="closing" title="Closing" count={approved ? 1 : 0}>
      {status ? (
        <ul>
          <Row h={h} onOpen={onProfile} onProfile={onProfile} aside={opens}>
            <Badge variant={badgeVariant(status.label)}>{status.label}</Badge>
            <span className="mt-2 block">{status.detail}</span>
          </Row>
        </ul>
      ) : (
        <Empty>{empty}</Empty>
      )}
    </Section>
  );
}
