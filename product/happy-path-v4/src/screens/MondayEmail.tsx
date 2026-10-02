import type { ReactNode } from "react";
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
import { phases, phasesFor, statusLabel, type PhaseId, type PhaseStatus, type Placed } from "@/phases";
import { initialWalk, type WalkProps } from "@/walk";

/** How many lines a list shows before it leaves the rest to Upline. */
const shown = 5;

const verb = (n: number, one: string, many: string) => (n === 1 ? one : many);

/**
 * The email's sections, the board's columns in reverse without Completed, and
 * the lists in each in the email's own order, each with the line under its
 * heading saying what it is, and `all` when it shows every line instead of
 * its first five. Shopping Renewal's In Progress comes last, under Awaiting
 * Response.
 */
const sections: {
  id: PhaseId;
  lists: { status: PhaseStatus; about: (n: number) => string; all?: boolean }[];
}[] = [
  {
    id: "closing",
    lists: [
      {
        status: "readyForReview",
        about: (n) =>
          `${count(n, "household", "households")} said yes to your recommendation and ${verb(n, "is", "are")} ready to bind.`,
        all: true,
      },
      {
        status: "awaitingResponse",
        about: (n) =>
          `${count(n, "household", "households")} said yes and still ${verb(n, "needs", "need")} to send a signature, first payment or signed application before you can bind.`,
      },
    ],
  },
  {
    id: "shopping-renewal",
    lists: [
      {
        status: "readyForReview",
        about: (n) =>
          `Upline finished shopping ${count(n, "renewal", "renewals")}. Review the quotes and send your ${verb(n, "recommendation", "recommendations")}.`,
        all: true,
      },
      {
        status: "awaitingResponse",
        about: (n) =>
          `${count(n, "household has", "households have")} your recommendation and ${verb(n, "hasn't", "haven't")} answered yet.`,
        all: true,
      },
      {
        status: "inProgress",
        about: (n) => `Upline is getting carrier quotes for ${count(n, "renewal", "renewals")}.`,
      },
    ],
  },
  {
    id: "initial-outreach",
    lists: [
      {
        status: "scheduled",
        about: (n) =>
          `Upline has ${count(n, "automated renewal email", "automated renewal emails")} scheduled to send tomorrow at 9 AM.`,
      },
      {
        status: "awaitingResponse",
        about: (n) =>
          `${count(n, "household", "households")} got their renewal email and ${verb(n, "hasn't", "haven't")} answered yet.`,
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
 * line (dayLine.ts). Then a section for each of the board's columns but
 * Completed (phases.ts), last first, Closing, Shopping Renewal and Initial
 * Outreach, with the column's count, and inside each a list for each status
 * (`sections`), soonest renewal first as the board runs them. A list says
 * what it is under its heading, then shows its first five and, when there
 * are more, a link under it to see them all ("View all Scheduled"); Ready
 * for Review and Shopping Renewal's Awaiting Response show them all. Each line is a board line with the carrier's mark in front: the name,
 * when it renews (a countdown in red under two weeks out and the date after,
 * without a tooltip, since this is an email) and the change. Until 2026-10-01
 * the email had the homepage's sections from before the board, Action Needed
 * and Scheduled Emails, with every line in full. Until 2026-10-02 it had all
 * four columns in the board's order, Completed last, each status in the order
 * its menu has them, every list stopping at five, and no line under the
 * headings, and a list's link said View all on Upline.
 */
export function MondayEmail({ go }: WalkProps) {
  const day = "mon";
  const placed = phasesFor(day, initialWalk);
  const toUpline = () => go("card-monday-upline");

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
          const items = placed[s.id];
          if (items.length === 0) return null;
          return (
            <Group key={s.id} title={phases.find((p) => p.id === s.id)!.label} count={items.length}>
              <Card size="sm">
                <CardContent className="gap-6">
                  {s.lists.map((l) => {
                    const lines = items.filter((i) => i.status === l.status);
                    return (
                      <Lines
                        key={l.status}
                        id={`${s.id}-${l.status}`}
                        title={statusLabel[l.status]}
                        about={l.about(lines.length)}
                        items={lines}
                        all={l.all ?? false}
                        onViewAll={toUpline}
                      />
                    );
                  })}
                </CardContent>
              </Card>
            </Group>
          );
        })}

        <Button size="lg" className="mt-10 w-full" onClick={toUpline}>
          View in Upline
        </Button>
      </div>

      <p className="border-t px-8 py-5 text-sm text-muted-foreground">
        Upline for {agency.name}. You get this every Monday morning.
      </p>
    </Stage>
  );
}

/** One section of the email: the board column's name and count, then its card. */
function Group({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl">
        {title} <span className="font-mono text-sm font-normal text-muted-foreground">{count}</span>
      </h2>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  );
}

/**
 * One list in a column's card: the status as its heading, with its count as
 * the column's has it, in the mono face in gray (it was an eyebrow,
 * "SCHEDULED · 48", until 2026-10-01), a line in gray saying what the list
 * is, as Recent Activity sets a detail under its heading, then its lines:
 * every one when `all`, otherwise the first five and, past five, a link to
 * Upline that names the list ("View all In Progress").
 */
function Lines({
  id,
  title,
  about,
  items,
  all,
  onViewAll,
}: {
  id: string;
  title: string;
  about: string;
  items: Placed[];
  all: boolean;
  onViewAll: () => void;
}) {
  if (items.length === 0) return null;
  const heading = `email-${id}`;
  const cut = !all && items.length > shown;
  return (
    <section aria-labelledby={heading} aria-describedby={`${heading}-about`}>
      <h3 id={heading} className="font-display text-base font-medium">
        {title} <span className="font-mono text-sm font-normal text-muted-foreground">{items.length}</span>
      </h3>
      <p id={`${heading}-about`} className="mt-1 text-sm text-muted-foreground">
        {about}
      </p>
      <ul className="mt-3 divide-y border-y text-sm">
        {(cut ? items.slice(0, shown) : items).map((p) => (
          <Line key={p.e.id} {...p} />
        ))}
      </ul>
      {cut && (
        <Button variant="link" className="mt-2 h-auto p-0 font-sans text-sm" onClick={onViewAll}>
          View all {title}
        </Button>
      )}
    </section>
  );
}

/** A household's line: the carrier's mark and the name, then when it renews and the change in percent. */
function Line({ e }: Placed) {
  return (
    <li className="flex items-center justify-between gap-4 py-2">
      <span className="flex min-w-0 items-start gap-2">
        <CarrierMark carrier={e.carrier} />
        <span className="sr-only">{e.carrier}, </span>
        <span className="min-w-0">{setName(e.name)}</span>
      </span>
      <span className="flex shrink-0 items-center gap-3">
        <Countdown renews={e.renews} day="mon" tip={false} />
        <span className={cn("font-mono", bigIncrease(e.pct) ? "text-foreground" : "text-muted-foreground")}>
          {pctLabel(e.pct)}
        </span>
      </span>
    </li>
  );
}
