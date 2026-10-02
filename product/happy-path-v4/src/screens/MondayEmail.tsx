import { Fragment, type ReactNode } from "react";
import { cn } from "cn";
import logo from "@/assets/upline-logo-white.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BandGrain } from "@/components/BandGrain";
import { CarrierMark } from "@/components/CarrierMark";
import { Stage } from "@/components/Stage";
import { Countdown } from "@/components/Status";
import { bigIncrease, pctLabel, setName } from "@/board";
import { agency } from "@/data";
import { count, lineFor } from "@/dayLine";
import { phasesFor, statusLabel, type PhaseId, type PhaseStatus, type Placed } from "@/phases";
import { initialWalk, type WalkProps } from "@/walk";

/** How many lines a list shows before it leaves the rest to Upline. */
const shown = 5;

const verb = (n: number, one: string, many: string) => (n === 1 ? one : many);

/**
 * One of the email's lists: where its households are on the board (the
 * column and the status), its name, the line under its heading saying what
 * it is, and `all` when it shows every line instead of its first five. Each
 * kind of household has one name, the one the band's line uses for it
 * (dayLine.ts): recommendations ready to send, policies to bind and renewal
 * emails, and what's waiting is named after what it's waiting on.
 */
type EmailList = {
  phase: PhaseId;
  status: PhaseStatus;
  title: string;
  about: (n: number) => string;
  all?: boolean;
};

/**
 * The email's sections, in the order the band's line counts them: what's
 * Ready for Review, which needs Jenna (recommendations to send, then
 * policies to bind), the renewal emails Upline sends on its own, then
 * everything waiting on someone else, recommendations first, then policies,
 * then renewal emails, then the shops. `tone` is how loud it is: what needs
 * Jenna is the one blue-outlined card, as Recent activity draws what needs
 * her in the drawer, with View in Upline under it; the scheduled emails are a
 * plain card; and what's waiting has no card and is set in gray, so nothing
 * waiting on a household reads as Jenna's to do.
 */
const sections: {
  id: string;
  title: string;
  tone: "action" | "plain" | "quiet";
  lists: EmailList[];
}[] = [
  {
    id: "ready",
    title: statusLabel.readyForReview,
    tone: "action",
    lists: [
      {
        phase: "shopping-renewal",
        status: "readyForReview",
        title: "Recommendations ready to send",
        about: (n) =>
          `Upline finished shopping ${count(n, "renewal", "renewals")}. Review the quotes and send your ${verb(n, "recommendation", "recommendations")}.`,
        all: true,
      },
      {
        phase: "closing",
        status: "readyForReview",
        title: "Policies to bind",
        about: (n) =>
          `${count(n, "household", "households")} said yes to your recommendation and ${verb(n, "is", "are")} ready to bind.`,
        all: true,
      },
    ],
  },
  {
    id: "scheduled",
    title: statusLabel.scheduled,
    tone: "plain",
    lists: [
      {
        phase: "initial-outreach",
        status: "scheduled",
        title: "Renewal emails",
        about: (n) =>
          `Upline sends ${count(n, "renewal email", "renewal emails")} tomorrow at 9 AM. Nothing to do unless you'd like to review one first.`,
      },
    ],
  },
  {
    id: "waiting",
    title: "Waiting on someone else",
    tone: "quiet",
    lists: [
      {
        phase: "shopping-renewal",
        status: "awaitingResponse",
        title: "Recommendations sent",
        about: (n) =>
          `${count(n, "household has", "households have")} your recommendation and ${verb(n, "hasn't", "haven't")} answered yet.`,
        all: true,
      },
      {
        phase: "closing",
        status: "awaitingResponse",
        title: "Policies waiting on the household",
        about: (n) =>
          `${count(n, "household", "households")} said yes and still ${verb(n, "needs", "need")} to send a signature, first payment or signed application before you can bind.`,
      },
      {
        phase: "initial-outreach",
        status: "awaitingResponse",
        title: "Renewal emails sent",
        about: (n) =>
          `${count(n, "household", "households")} got their renewal email and ${verb(n, "hasn't", "haven't")} answered yet.`,
      },
      {
        phase: "shopping-renewal",
        status: "inProgress",
        title: "Renewals being shopped",
        about: (n) => `Upline is getting carrier quotes for ${count(n, "renewal", "renewals")}.`,
      },
    ],
  },
];

/**
 * How the week starts: an email, not a login. Upline writes to Jenna (this is
 * Upline-to-agent mail, so it carries Upline's brand, and opens on the design
 * hub homepage's band) with the homepage as it stands at 8:00 AM Monday,
 * before she's touched it, so it reads the same whatever the presenter does
 * later.
 *
 * The band says what the homepage's header does, the greeting and Monday's
 * line (dayLine.ts). Then three sections (`sections`), in the line's order:
 * Ready for Review, what needs Jenna, in a blue-outlined card with View in
 * Upline under it; Scheduled, the renewal emails going out tomorrow; and
 * Waiting on someone else, in gray with no card. Each has its count and a
 * list for each kind of household in it, soonest renewal first as the board
 * runs them. A list says what it is under its heading, then shows its first
 * five and, when there are more, a link under it to see them all ("View all
 * renewal emails"); what needs Jenna and the recommendations sent show them
 * all. Each line is a board line with the carrier's mark in front: the name,
 * when it renews (a countdown in red under two weeks out and the date after,
 * without a tooltip, since this is an email) and the change.
 *
 * Until 2026-10-01 the email had the homepage's sections from before the
 * board, Action Needed and Scheduled Emails, with every line in full. Until
 * 2026-10-02 it had all four columns in the board's order, Completed last,
 * each status in the order its menu has them, every list stopping at five,
 * and no line under the headings, and a list's link said View all on Upline.
 * Later that day it ran the columns last first, Closing, Shopping Renewal and
 * Initial Outreach, every list headed by its board status, so "4 policies to
 * bind" in the line was "Ready for Review" below it, a list waiting on
 * households looked like the lists that need Jenna, and View in Upline was
 * at the foot. Ashley's review that day asked for one order and one name for
 * each kind throughout, and for what needs Jenna to stand out at the top.
 */
export function MondayEmail({ go }: WalkProps) {
  const day = "mon";
  const placed = phasesFor(day, initialWalk);
  const toUpline = () => go("card-monday-upline");
  const linesOf = (l: EmailList) => placed[l.phase].filter((p) => p.status === l.status);

  return (
    <Stage caption="Jenna's inbox · Monday, October 12, 8:00 AM" size="email">
      <div className="border-b px-8 py-5 text-sm">
        <p>
          <span className="inline-block w-16 text-muted-foreground">From</span>Upline
        </p>
        <p className="mt-1">
          <span className="inline-block w-16 text-muted-foreground">To</span>
          {agency.agent.name}
        </p>
        <p className="mt-1">
          <span className="inline-block w-16 text-muted-foreground">Subject</span>
          What needs your attention this week
        </p>
      </div>

      <header className="band-surface relative isolate flex flex-col gap-13 overflow-clip px-8 pt-8 pb-10">
        <BandGrain />
        <img src={logo} alt="Upline" className="h-6 w-auto self-start" />
        <div>
          <h1 className="text-4xl">Good morning, {agency.agent.first}</h1>
          <p className="mt-3 font-display text-lg">{lineFor(day, initialWalk)}</p>
        </div>
      </header>

      <div className="px-8 pb-12">
        {sections.map((s) => {
          const total = s.lists.reduce((n, l) => n + linesOf(l).length, 0);
          const quiet = s.tone === "quiet";
          const lists = s.lists.map((l) => {
            const lines = linesOf(l);
            return (
              <Lines
                key={`${l.phase}-${l.status}`}
                id={`${l.phase}-${l.status}`}
                title={l.title}
                about={l.about(lines.length)}
                items={lines}
                all={l.all ?? false}
                quiet={quiet}
                onViewAll={toUpline}
              />
            );
          });
          return (
            <Fragment key={s.id}>
              {total > 0 && (
                <Group title={s.title} count={total} quiet={quiet}>
                  {quiet ? (
                    <div className="flex flex-col gap-6">{lists}</div>
                  ) : (
                    <Card size="sm" className={cn(s.tone === "action" && "border-primary")}>
                      <CardContent className="gap-6">{lists}</CardContent>
                    </Card>
                  )}
                </Group>
              )}
              {s.tone === "action" && (
                <Button size="lg" className="mt-6 w-full" onClick={toUpline}>
                  View in Upline
                </Button>
              )}
            </Fragment>
          );
        })}
      </div>

      <p className="border-t px-8 py-5 text-sm text-muted-foreground">
        Upline for {agency.name}. You get this every Monday morning.
      </p>
    </Stage>
  );
}

/**
 * One section of the email: its name and count, then its lists. A quiet one,
 * what's waiting on someone else, has its name in gray (until 2026-10-02 each
 * section was a board column, all set alike).
 */
function Group({
  title,
  count,
  quiet,
  children,
}: {
  title: string;
  count: number;
  quiet: boolean;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className={cn("text-xl", quiet && "text-muted-foreground")}>
        {title} <span className="font-mono text-sm font-normal text-muted-foreground">{count}</span>
      </h2>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  );
}

/**
 * One list in a section: its name as its heading, with its count, in the
 * mono face in gray (it was an eyebrow, "SCHEDULED · 48", until 2026-10-01,
 * and the board status, "Ready for Review", until 2026-10-02), a line in gray
 * saying what the list is, as Recent Activity sets a detail under its
 * heading, then its lines: every one when `all`, otherwise the first five
 * and, past five, a link to Upline that names the list ("View all renewal
 * emails"). In a quiet section, the heading and the lines are in gray too.
 */
function Lines({
  id,
  title,
  about,
  items,
  all,
  quiet,
  onViewAll,
}: {
  id: string;
  title: string;
  about: string;
  items: Placed[];
  all: boolean;
  quiet: boolean;
  onViewAll: () => void;
}) {
  if (items.length === 0) return null;
  const heading = `email-${id}`;
  const cut = !all && items.length > shown;
  return (
    <section aria-labelledby={heading} aria-describedby={`${heading}-about`}>
      <h3 id={heading} className={cn("font-display text-base font-medium", quiet && "text-muted-foreground")}>
        {title} <span className="font-mono text-sm font-normal text-muted-foreground">{items.length}</span>
      </h3>
      <p id={`${heading}-about`} className="mt-1 text-sm text-muted-foreground">
        {about}
      </p>
      <ul className={cn("mt-3 divide-y border-y text-sm", quiet && "text-muted-foreground")}>
        {(cut ? items.slice(0, shown) : items).map((p) => (
          <Line key={p.e.id} {...p} quiet={quiet} />
        ))}
      </ul>
      {cut && (
        <Button variant="link" className="mt-2 h-auto p-0 font-sans text-sm" onClick={onViewAll}>
          View all {title.toLowerCase()}
        </Button>
      )}
    </section>
  );
}

/**
 * A household's line: the carrier's mark and the name, then when it renews
 * and the change in percent, a big change in the text color unless the line
 * is `quiet`, waiting on someone else.
 */
function Line({ e, quiet }: Placed & { quiet: boolean }) {
  return (
    <li className="flex items-center justify-between gap-4 py-2">
      <span className="flex min-w-0 items-start gap-2">
        <CarrierMark carrier={e.carrier} />
        <span className="sr-only">{e.carrier}, </span>
        <span className="min-w-0">{setName(e.name)}</span>
      </span>
      <span className="flex shrink-0 items-center gap-3">
        <Countdown renews={e.renews} day="mon" tip={false} />
        <span className={cn("font-mono", bigIncrease(e.pct) && !quiet ? "text-foreground" : "text-muted-foreground")}>
          {pctLabel(e.pct)}
        </span>
      </span>
    </li>
  );
}
