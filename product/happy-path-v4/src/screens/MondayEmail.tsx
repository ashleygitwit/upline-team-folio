import type { ReactNode } from "react";
import { cn } from "cn";
import logo from "@/assets/upline-logo-white.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BandGrain } from "@/components/BandGrain";
import { CarrierMark } from "@/components/CarrierMark";
import { Chips } from "@/components/Chips";
import { Stage } from "@/components/Stage";
import {
  accentFor,
  bigIncrease,
  boardFor,
  needsMe,
  pctLabel,
  renewalChip,
  setName,
  timed,
  type Accent,
  type ColumnId,
  type Entry,
} from "@/board";
import { agency } from "@/data";
import { initialWalk, type WalkProps } from "@/walk";

/**
 * How the week starts: an email, not a login. Upline writes to Jenna (this is
 * Upline-to-agent mail, so it carries Upline's brand, and opens on the design
 * hub homepage's band) with everything on the board that needs her this
 * week. It's the board at 8:00 AM Monday, before she's touched it, so it
 * reads the same whatever the presenter does later.
 *
 * Action Needed is what the board's Needs me keeps, in three groups: approvals
 * to bind (Ready to close), recommendations to send, and renewals inside ten
 * days that are still open. A household that's only on Needs me for a blue
 * accent (a life quote or a change requested) isn't listed, since those have
 * no flow of their own yet. Each line is a mini line from the board, with its
 * accent and its renewal chip in the accent's color instead of the change,
 * since what matters here is how long is left. It was the earlier weeks' four
 * until 2026-09-30.
 *
 * Scheduled Emails comes last and quietest, since they go out Tuesday whether
 * she looks at them or not: the board's Scheduled column, all 48, biggest
 * increase first, with the change in percent as the board shows it.
 */
export function MondayEmail({ go }: WalkProps) {
  const day = "mon";
  const board = boardFor(day, initialWalk);
  const needs = needsMe(board, day, initialWalk);
  const toClose = needs.filter(({ e }) => e.approved);
  const toSend = needs.filter(({ col }) => col === "ready");
  const soon = needs.filter(
    ({ e, col }) => !e.approved && col !== "ready" && timed(accentFor(e, col, day, initialWalk)),
  );
  const byRenewal = (a: { e: Entry }, b: { e: Entry }) =>
    Date.parse(`${a.e.renews} 2026`) - Date.parse(`${b.e.renews} 2026`);

  const summary = [
    toSend.length && count(toSend.length, "recommendation ready to send", "recommendations ready to send"),
    toClose.length && count(toClose.length, "policy to bind", "policies to bind"),
  ].filter(Boolean);

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
          <h1 className="text-4xl">Good morning, Jenna</h1>
          <p className="mt-3 font-display text-lg">Here's what needs your attention this week.</p>
        </div>
      </header>

      <div className="px-8 pb-12">
        <Group title="Action Needed">
          <Card size="sm">
            <CardContent className="gap-6">
              <p className="text-base">
                You have {summary.join(" and ")}.
                {soon.length > 0 &&
                  ` Another ${count(soon.length, "renewal is", "renewals are")} inside 10 days and still open.`}
              </p>
              <Todos title="Ready to close" items={[...toClose].sort(byRenewal)} />
              <Todos title="Recommendations ready to send" items={[...toSend].sort(byRenewal)} />
              <Todos title="Renewing soon" items={[...soon].sort(byRenewal)} />
              <Button size="lg" className="w-full" onClick={() => go("card-monday-upline")}>
                View in Upline
              </Button>
            </CardContent>
          </Card>
        </Group>

        <Group title="Scheduled Emails">
          <Card size="sm">
            <CardContent className="gap-4">
              <p className="text-base">
                Tomorrow at 9:00 AM, {board.scheduled.length} renewals go out, drafted in your voice and sent from
                your inbox. You don't need to do anything.
              </p>
              <ul className="divide-y border-y text-sm">
                {board.scheduled.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-4 py-2">
                    <span className="flex items-center gap-2">
                      <CarrierMark carrier={e.carrier} />
                      <span className="sr-only">{e.carrier}, </span>
                      {e.name}
                    </span>
                    <span
                      className={cn(
                        "font-mono",
                        bigIncrease(e.pct) ? "text-destructive-strong" : "text-muted-foreground",
                      )}
                    >
                      {pctLabel(e.pct)}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Group>
      </div>

      <p className="border-t px-8 py-5 text-sm text-muted-foreground">
        Upline for {agency.name}. You get this every Monday morning.
      </p>
    </Stage>
  );
}

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** One section of the email: the homepage's name for it, then its card. */
function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl">{title}</h2>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  );
}

/** The accent down a line's left edge, as the board draws it (red at 700, as its chip is). */
const accentBar: Record<Accent, string> = {
  urgent: "before:bg-destructive-strong",
  soon: "before:bg-warning",
  requested: "before:bg-primary",
};

/**
 * One group of Action Needed: its name as the eyebrow, with its count, then
 * a line a household, soonest renewal first: the accent, the carrier's mark,
 * the name, and its renewal chip, in the accent's color.
 */
function Todos({ title, items }: { title: string; items: { e: Entry; col: ColumnId }[] }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h3 className="eyebrow text-muted-foreground">
        {title} · {items.length}
      </h3>
      <ul className="mt-2 divide-y border-y text-sm">
        {items.map(({ e, col }) => {
          const accent = accentFor(e, col, "mon", initialWalk);
          return (
            <li
              key={e.id}
              className={cn(
                "relative flex items-center justify-between gap-4 py-2 pl-3",
                accent && "before:absolute before:inset-y-0 before:left-0 before:w-[3px]",
                accent && accentBar[accent],
              )}
            >
              <span className="flex min-w-0 items-start gap-2">
                <CarrierMark carrier={e.carrier} />
                <span className="sr-only">{e.carrier}, </span>
                <span className="min-w-0">{setName(e.name)}</span>
              </span>
              <Chips chips={[renewalChip(e, "mon", accent)]} className="shrink-0" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
