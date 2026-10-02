import type { ReactNode } from "react";
import { cn } from "cn";
import logo from "@/assets/upline-logo-white.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BandGrain } from "@/components/BandGrain";
import { CarrierMark } from "@/components/CarrierMark";
import { Stage } from "@/components/Stage";
import { Countdown } from "@/components/Status";
import { accentFor, bigIncrease, pctLabel, setName, timed } from "@/board";
import { agency } from "@/data";
import { lineFor } from "@/dayLine";
import { completedOn, phases, phasesFor, statusLabel, type Placed } from "@/phases";
import { initialWalk, type WalkProps } from "@/walk";

/** How many lines a list shows before it leaves the rest to Upline. */
const shown = 5;

/**
 * How the week starts: an email, not a login. Upline writes to Jenna (this is
 * Upline-to-agent mail, so it carries Upline's brand, and opens on the design
 * hub homepage's band) with the homepage as it stands at 8:00 AM Monday,
 * before she's touched it, so it reads the same whatever the presenter does
 * later.
 *
 * The band says what the homepage's header does, the greeting and Monday's
 * line (dayLine.ts). Then the board, a section for each of its four
 * columns (phases.ts) in its order, with the column's count, and inside each
 * a list for each status in the order its menu has them, soonest renewal
 * first as the board runs them. A list shows its first five and, when there
 * are more, a View all on Upline link under it. Each line is a board line
 * with the carrier's mark in front: the name, the countdown when it's running
 * short (in the accent's color, without a tooltip, since this is an email),
 * and the change, or the day it was completed. Until 2026-10-01 the email had
 * the homepage's sections from before the board, Action Needed and Scheduled
 * Emails, with every line in full.
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
        {phases.map((p) => {
          const items = placed[p.id];
          if (items.length === 0) return null;
          const lists =
            p.statuses.length === 0
              ? [{ id: p.id, title: undefined, items }]
              : p.statuses.map((s) => ({
                  id: `${p.id}-${s}`,
                  title: statusLabel[s],
                  items: items.filter((i) => i.status === s),
                }));
          return (
            <Group key={p.id} title={p.label} count={items.length}>
              <Card size="sm">
                <CardContent className="gap-6">
                  {lists.map((l) => (
                    <Lines
                      key={l.id}
                      id={l.id}
                      title={l.title}
                      items={l.items}
                      completed={p.id === "completed"}
                      onViewAll={toUpline}
                    />
                  ))}
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
 * One list in a column's card: the status as the eyebrow, with its count
 * (Completed has no statuses, so its one list goes without), then its first
 * five lines and, past five, View all on Upline.
 */
function Lines({
  id,
  title,
  items,
  completed,
  onViewAll,
}: {
  id: string;
  title?: string;
  items: Placed[];
  completed: boolean;
  onViewAll: () => void;
}) {
  if (items.length === 0) return null;
  const heading = `email-${id}`;
  return (
    <section aria-labelledby={title && heading}>
      {title && (
        <h3 id={heading} className="eyebrow mb-2 text-muted-foreground">
          {title} · {items.length}
        </h3>
      )}
      <ul className="divide-y border-y text-sm">
        {items.slice(0, shown).map((p) => (
          <Line key={p.e.id} {...p} completed={completed} />
        ))}
      </ul>
      {items.length > shown && (
        <Button
          variant="link"
          className="mt-2 h-auto p-0 font-sans text-sm"
          aria-describedby={title && heading}
          onClick={onViewAll}
        >
          View all on Upline
        </Button>
      )}
    </section>
  );
}

/**
 * A household's line: the carrier's mark and the name, then what the board's
 * line has on the right, the countdown when it's running short and the change
 * in percent, or for Completed the day it was completed.
 */
function Line({ e, step, completed }: Placed & { completed: boolean }) {
  const accent = accentFor(e, step, "mon", initialWalk);
  return (
    <li className="flex items-center justify-between gap-4 py-2">
      <span className="flex min-w-0 items-start gap-2">
        <CarrierMark carrier={e.carrier} />
        <span className="sr-only">{e.carrier}, </span>
        <span className="min-w-0">{setName(e.name)}</span>
      </span>
      <span className="flex shrink-0 items-center gap-3">
        {timed(accent) && <Countdown renews={e.renews} day="mon" tone={accent} short tip={false} />}
        {completed ? (
          <span className="font-mono text-muted-foreground">
            <span className="sr-only">Completed </span>
            {completedOn(e, initialWalk)}
          </span>
        ) : (
          <span className={cn("font-mono", bigIncrease(e.pct) ? "text-foreground" : "text-muted-foreground")}>
            {pctLabel(e.pct)}
          </span>
        )}
      </span>
    </li>
  );
}
