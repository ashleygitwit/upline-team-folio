import type { ReactNode } from "react";
import logo from "@/assets/upline-logo.svg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stage } from "@/components/Stage";
import { agency, callahan, mondayNeeds, money, retention, thisWeek, type Earlier } from "@/data";
import { badgeVariant } from "@/status";
import { words } from "@/today";
import type { WalkProps } from "@/walk";

/**
 * How the week starts: an email, not a login. Upline writes to Stacey (this is
 * Upline-to-agent mail, so it carries Upline's brand) with everything that
 * needs her this week, one card each, in the order it's due to be dealt with:
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

      <div className="px-8 pt-10 pb-12">
        <img src={logo} alt="Upline" className="h-6 w-auto" />
        <h1 className="mt-10 text-3xl">Good morning, Stacey. Here's what needs your attention this week.</h1>

        <Group title="Closing" count={closing.length}>
          {closing.map((e) => (
            <Todo key={e.id} e={e} label="Approved" />
          ))}
        </Group>

        <Group title="Shopped and ready for review" count={shopped.length}>
          {shopped.map((e) => (
            <Todo key={e.id} e={e} label="Ready for you" />
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
                  <li key={h.id} className="flex justify-between gap-4 py-2">
                    <span>{h.name}</span>
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

/** One stage of the week: the homepage section's name, its count, and its cards. */
function Group({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-3 text-xl">
        {title}
        {count !== undefined && count > 0 && <Badge>{count}</Badge>}
      </h2>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </section>
  );
}

/** One thing Stacey has to do, with the label the homepage gives it. */
function Todo({ e, label }: { e: Earlier; label: string }) {
  return (
    <Card size="sm">
      <CardContent className="gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-lg">{e.name}</p>
          <Badge variant={badgeVariant(label)}>{label}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {e.lines} · Renews {e.renews}
        </p>
        <p className="text-base">{e.monday!.detail}</p>
      </CardContent>
    </Card>
  );
}
