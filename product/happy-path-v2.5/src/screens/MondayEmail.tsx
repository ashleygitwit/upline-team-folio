import logo from "@/assets/upline-logo.svg";
import { Button } from "@/components/ui/button";
import { OutlookWindow } from "@/components/Outlook";
import { Stage } from "@/components/Stage";
import { agency, callahan, money, mondayNote, retention, staceyInbox } from "@/data";
import type { WalkProps } from "@/walk";

/**
 * How the week starts: an email, not a login. Upline writes to Stacey (this is
 * Upline-to-agent mail, so it carries Upline's brand) with one button that
 * opens Upline, and she reads it in Outlook. Stacey could ignore it entirely
 * and the six would still go. Its subject and opening are what her phone's
 * notification showed, so the two read as one message.
 */
export function MondayEmail({ go }: WalkProps) {
  return (
    <Stage caption="Stacey's inbox · Monday, October 12, 8:00 AM" size="window">
      <OutlookWindow
        inbox={staceyInbox}
        selected={{
          id: "upline",
          from: mondayNote.from,
          initials: "U",
          tone: 1,
          logo: true,
          subject: mondayNote.subject,
          preview: `${mondayNote.opening} ${mondayNote.body}`,
          time: mondayNote.time,
          group: "Today",
          unread: true,
        }}
        sent={mondayNote.sent}
      >
        <div className="max-w-[600px] font-sans text-foreground">
          <img src={logo} alt="Upline" className="h-6 w-auto" />
          <h1 className="mt-10 text-3xl">{mondayNote.opening}</h1>
          <p className="mt-5 text-base">{mondayNote.body}</p>
          <Button size="lg" className="mt-8" onClick={() => go("monday")}>
            Look them over
          </Button>

          <div className="mt-12 border-t pt-6 text-base">
            <p>
              The biggest one this week is Dana and Mike Callahan, up {money(callahan.now - callahan.was)} because
              Sophie got her license in August.
            </p>
            <p className="mt-3">
              So far this season, {retention.stayed} of the {retention.sent} households you've reached stayed with
              you.
            </p>
          </div>

          <p className="mt-12 border-t pt-5 text-sm text-muted-foreground">
            Upline for {agency.name}. You get this every Monday your renewals are ready.
          </p>
        </div>
      </OutlookWindow>
    </Stage>
  );
}
