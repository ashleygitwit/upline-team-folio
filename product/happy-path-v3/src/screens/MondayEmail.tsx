import type { ReactNode } from "react";
import logo from "@/assets/upline-logo-white.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BandGrain } from "@/components/BandGrain";
import { CarrierMark } from "@/components/CarrierMark";
import { Stage } from "@/components/Stage";
import { agency, callahan, mondayNeeds, money, retention, thisWeek, type Earlier } from "@/data";
import { words } from "@/today";
import type { WalkProps } from "@/walk";

/**
 * How the week starts: an email, not a login. Upline writes to Stacey (this is
 * Upline-to-agent mail, so it carries Upline's brand, and opens on the design
 * hub homepage's band) with everything that needs her this week, one card
 * each, in the order it's due to be dealt with:
 * approvals to bind, then shops whose results are back. The six renewal
 * emails come last and quietest, since they go out Tuesday whether she looks
 * at them or not.
 */
export function MondayEmail({ go }: WalkProps) {
  const closing = mondayNeeds("closing");
  const shopped = mondayNeeds("shopped");
  const n = thisWeek.length;

  return (
    <Stage caption="Stacey's inbox · Monday, October 12, 8:00 AM" size="email">
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
          <h1 className="text-4xl">Good morning, Stacey</h1>
          <p className="mt-3 font-display text-lg">Here's what needs your attention this week.</p>
        </div>
      </header>

      <div className="px-8 pb-12">
        <Group title="Closing">
          {closing.map((e) => (
            <Todo key={e.id} e={e} />
          ))}
        </Group>

        <Group title="Shopped and ready for review">
          {shopped.map((e) => (
            <Todo key={e.id} e={e} />
          ))}
        </Group>

        <Button size="lg" className="mt-8" onClick={() => go("monday")}>
          Open Upline
        </Button>

        <Group title="Scheduled Renewal Emails">
          <Card size="sm">
            <CardContent>
              <p className="text-base">
                {words[n]} renewals go out tomorrow at 9:00 AM, drafted in your voice and sent from your inbox. You
                don't need to do anything. The biggest is Dana and Mike Callahan, up {money(callahan.now - callahan.was)}{" "}
                because Sophie got her license in August.
              </p>
              <ul className="divide-y border-y text-sm">
                {thisWeek.map((h) => (
                  <li key={h.id} className="flex items-center justify-between gap-4 py-2">
                    <span className="flex items-center gap-2">
                      <CarrierMark carrier={h.carrier} />
                      <span className="sr-only">{h.carrier}, </span>
                      {h.name}
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {h.now > h.was ? `+${money(h.now - h.was)}` : "No change"}
                    </span>
                  </li>
                ))}
              </ul>
              <Button variant="link" className="h-auto self-start p-0 font-sans text-sm" onClick={() => go("monday")}>
                Look them over
              </Button>
            </CardContent>
          </Card>
        </Group>

        <p className="mt-10 border-t pt-6 text-base">
          So far this season, {retention.stayed} of the {retention.sent} households you've reached stayed with you.
        </p>
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

/** The email goes out Monday, October 12, 8:00 AM. */
const sent = new Date(2026, 9, 12);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Inside a week, how long is left says more than the date does. `renews` is "Oct 16". */
function renewsIn(renews: string) {
  const [mon, day] = renews.split(" ");
  const days = Math.round((new Date(2026, months.indexOf(mon), Number(day)).getTime() - sent.getTime()) / 86_400_000);
  if (days >= 7) return `Renews ${renews}`;
  return days === 1 ? "Renews tomorrow" : `Renews in ${days} days`;
}

/** One thing Stacey has to do: who, their lines and carrier, when it renews, and what's needed. */
function Todo({ e }: { e: Earlier }) {
  const [line, carrier] = e.lines.split(" · ");
  return (
    <Card size="sm">
      <CardContent className="gap-2">
        <p className="font-display text-lg">{e.name}</p>
        <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
          {line}
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5">
            <CarrierMark carrier={carrier} />
            {carrier}
          </span>
          <span aria-hidden>·</span>
          {renewsIn(e.renews)}
        </p>
        <p className="text-base">{e.monday!.detail}</p>
      </CardContent>
    </Card>
  );
}
