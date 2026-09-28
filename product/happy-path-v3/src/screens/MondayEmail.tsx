import logo from "@/assets/upline-logo.svg";
import { Button } from "@/components/ui/button";
import { Stage } from "@/components/Stage";
import { agency, callahan, money, retention, thisWeek } from "@/data";
import type { WalkProps } from "@/walk";

/**
 * How the week starts: an email, not a login. Upline writes to Stacey (this is
 * Upline-to-agent mail, so it carries Upline's brand) with one button that
 * opens Upline. Stacey could ignore it entirely and the six would still go.
 * Its headline says what the homepage's brief says, so the two read as one
 * message.
 */
export function MondayEmail({ go }: WalkProps) {
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
          Your {n} renewals are ready for Tuesday
        </p>
      </div>

      <div className="px-8 pt-10 pb-12">
        <img src={logo} alt="Upline" className="h-6 w-auto" />
        <h1 className="mt-10 text-3xl">Good morning, Stacey. Your six renewals go out tomorrow at 9:00 AM.</h1>
        <p className="mt-5 text-base">
          Each one is drafted in your voice and sends from your inbox. You don't need to do anything. If you'd like
          to look them over first, they're waiting for you.
        </p>
        <Button size="lg" className="mt-8" onClick={() => go("monday")}>
          Look them over
        </Button>

        <div className="mt-12 border-t pt-6 text-base">
          <p>
            The biggest one this week is Dana and Mike Callahan, up {money(callahan.now - callahan.was)} because Sophie
            got her license in August.
          </p>
          <p className="mt-3">
            So far this season, {retention.stayed} of the {retention.sent} households you've reached stayed with you.
          </p>
        </div>
      </div>

      <p className="border-t px-8 py-5 text-sm text-muted-foreground">
        Upline for {agency.name}. You get this every Monday your renewals are ready.
      </p>
    </Stage>
  );
}
