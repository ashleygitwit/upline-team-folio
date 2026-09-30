import type { ReactNode } from "react";
import logo from "@/assets/upline-logo-white.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BandGrain } from "@/components/BandGrain";
import { CarrierMark } from "@/components/CarrierMark";
import { Chips } from "@/components/Chips";
import { RenewalMeta } from "@/components/RenewalMeta";
import { Stage } from "@/components/Stage";
import { mondayScheduled } from "@/board";
import { agency, mondayNeeds, money, type Earlier } from "@/data";
import type { WalkProps } from "@/walk";

/**
 * How the week starts: an email, not a login. Upline writes to Jenna (this is
 * Upline-to-agent mail, so it carries Upline's brand, and opens on the design
 * hub homepage's band) with everything that needs her this week, one card
 * each, soonest renewal first: approvals to bind and shops whose results are
 * back, in one card under Action Needed. The week's renewal emails come last
 * and quietest, since they go out Tuesday whether she looks at them or not:
 * all 48, as the homepage board's Scheduled column lists them, biggest
 * increase first (they were the named six until 2026-09-30).
 */
export function MondayEmail({ go }: WalkProps) {
  const needed = mondayNeeds();
  const scheduled = mondayScheduled();

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
          <TodoCard items={needed} cta="View in Upline" onCta={() => go("card-monday-upline")} />
        </Group>

        <Group title="Scheduled Emails">
          <Card size="sm">
            <CardContent className="gap-4">
              <p className="text-base">
                Tomorrow at 9:00 AM, {scheduled.length} renewals go out, drafted in your voice and sent from your
                inbox. You don't need to do anything.
              </p>
              <ul className="divide-y border-y text-sm">
                {scheduled.map((h) => (
                  <li key={h.id} className="flex items-center justify-between gap-4 py-2">
                    <span className="flex items-center gap-2">
                      <CarrierMark carrier={h.carrier} />
                      <span className="sr-only">{h.carrier}, </span>
                      {h.name}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {h.increase > 0 ? `+${money(h.increase)}` : "No change"}
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

/** One stage of the week: the homepage section's name, then its cards. */
function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl">{title}</h2>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  );
}

/**
 * One stage's to-dos in one card, a rule between each, and the stage's one
 * button across the foot of the card. The Scheduled card has no button, since
 * nothing there needs Jenna.
 */
function TodoCard({ items, cta, onCta }: { items: Earlier[]; cta: string; onCta: () => void }) {
  return (
    <Card size="sm">
      <CardContent className="gap-4">
        <ul className="divide-y">
          {items.map((e) => (
            <Todo key={e.id} e={e} />
          ))}
        </ul>
        <Button size="lg" className="w-full" onClick={onCta}>
          {cta}
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * One thing Jenna has to do: who, their lines and carrier, when it renews, and
 * what's needed. An approval waiting to be bound carries a Ready to close
 * chip, so the two kinds of to-do in the one card read apart at a glance.
 */
function Todo({ e }: { e: Earlier }) {
  const [lines, carrier] = e.lines.split(" · ");
  return (
    <li className="flex flex-col gap-2 py-4 first:pt-0">
      <p className="font-display text-lg">{e.name}</p>
      <RenewalMeta lines={lines} carrier={carrier} renews={e.renews} day="mon" />
      {e.monday!.section === "closing" && <Chips chips={[{ id: "closing", label: "Ready to close" }]} />}
      <p className="text-base">{e.monday!.detail}</p>
    </li>
  );
}
