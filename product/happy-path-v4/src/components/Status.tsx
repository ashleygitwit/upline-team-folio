import { useContext, type ReactNode } from "react";
import { Clock, Eye, HandHeart, Hourglass, MailClock, PencilLine, Search, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Day } from "@/data";
import { RowTip } from "@/lib/rowTip";
import { sendsAt, statusLabel, type PhaseStatus } from "@/phases";
import { countdown, renewalDay, type Request } from "@/tasks";

/**
 * A household's status in words, as a line with an icon, wherever it's said:
 * a board line or card, the drawer's header, the Monday email. These were
 * chips until 2026-10-01: 26px filled squares, between the kit's 24px and
 * 32px buttons, and the gray ones in the quiet button's own fill, so a row of
 * them read as things to press. Now only an action gets a box.
 */

/** The countdown's color beside a red or yellow accent. */
const tones = {
  urgent: "text-destructive-strong",
  soon: "text-foreground",
} as const;

/**
 * How long until a household renews: a clock and the count, "8 days"
 * (`short`) on the board's cards and lines, where the clock says what it's
 * counting, or "Renews in 8 days" in the Monday email. It takes the color of
 * the accent beside it: red 700, the red that carries text on white, for
 * red; the text color for yellow, since no yellow carries text on white and
 * the bar beside it says yellow; gray with no accent. The date is on hover.
 * A tooltip has no way in by touch or keyboard, so the drawer's header says
 * the date too, and the Monday email, being an email, goes without
 * (`tip={false}`).
 *
 * A board line or card is one big button underneath (OpenOverlay in
 * Board.tsx), so the count sits over it to be hovered, and `onOpen` makes a
 * click on it open the drawer, as a click anywhere else on the card does.
 */
export function Countdown({
  renews,
  day,
  tone,
  short = false,
  tip = true,
  onOpen,
  className,
}: {
  renews: string;
  day: Day;
  tone?: "urgent" | "soon";
  short?: boolean;
  tip?: boolean;
  onOpen?: () => void;
  className?: string;
}) {
  const setOver = useContext(RowTip);
  const count = (
    <span
      onClick={onOpen}
      onPointerEnter={tip ? () => setOver(true) : undefined}
      onPointerLeave={tip ? () => setOver(false) : undefined}
      className={cn(
        "relative z-10 inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap",
        tone ? tones[tone] : "text-muted-foreground",
        className,
      )}
    >
      <Clock aria-hidden className="size-3.5 shrink-0" />
      {countdown(renews, day, short)}
    </span>
  );
  if (!tip) return count;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{count}</TooltipTrigger>
      <TooltipContent>{renewalDay(renews, day)}</TooltipContent>
    </Tooltip>
  );
}

/**
 * A gray line of what's so about a household, after its icon: what it asked
 * for, or that it's snoozed. The icon sits in a box one line tall, so when the
 * words wrap on a narrow card it stays level with the first line.
 */
export function StatusLine({ icon: Icon, children, className }: { icon: LucideIcon; children: ReactNode; className?: string }) {
  return (
    <span className={cn("flex items-start gap-1.5 text-muted-foreground", className)}>
      <span className="flex h-lh shrink-0 items-center">
        <Icon aria-hidden className="size-3.5" />
      </span>
      <span>{children}</span>
    </span>
  );
}

const phaseIcons: Record<PhaseStatus, LucideIcon> = {
  scheduled: MailClock,
  awaitingResponse: Hourglass,
  inProgress: Search,
  readyForReview: Eye,
};

/**
 * Where a card is in its column on the board (phases.ts), in words after an
 * icon: Scheduled by the envelope with a clock at its corner, which already
 * means an email set to go out; Awaiting
 * Response by an hourglass, for a wait on someone else, since the clock
 * means the countdown and nothing else; In Progress by a magnifying glass,
 * for Upline out shopping; and Ready for Review by an eye. Ready for Review
 * is the one that needs Jenna, so it's in the text color and the rest are
 * gray, as a big change is set apart from a small one. Scheduled also says
 * when the email goes ("Scheduled · Tomorrow, 9 AM").
 */
export function PhaseStatusLine({ status, day, className }: { status: PhaseStatus; day: Day; className?: string }) {
  return (
    <StatusLine icon={phaseIcons[status]} className={cn(status === "readyForReview" && "text-foreground", className)}>
      {statusLabel[status]}
      {status === "scheduled" && ` · ${sendsAt(day)}`}
    </StatusLine>
  );
}

const requestIcons: Record<Request["id"], LucideIcon> = { life: HandHeart, info: PencilLine };

/**
 * What a household asked for on top of the renewal (requestsFor in
 * tasks.ts), a line each: Life quote requested by a hand holding a heart,
 * and Info updated by the pencil that marks what changed in the drawer's
 * Details. Either is what a blue accent means. Nothing when there's nothing,
 * so the line above keeps its place.
 */
export function Requests({ requests, className }: { requests: Request[]; className?: string }) {
  if (requests.length === 0) return null;
  return (
    <span className={cn("flex flex-col gap-1", className)}>
      {requests.map((r) => (
        <StatusLine key={r.id} icon={requestIcons[r.id]}>
          {r.label}
        </StatusLine>
      ))}
    </span>
  );
}
