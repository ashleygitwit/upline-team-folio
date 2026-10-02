import { agency, dayName } from "@/data";
import { lineFor } from "@/dayLine";
import { Board, type BoardProps } from "@/screens/upline/Board";

/**
 * The homepage, the same every day: a greeting, the day's line, then the
 * board. The header is set as the v3 Policyholder List's was, left-aligned
 * with the room above it that page had (its 40px, the Home link and 40px
 * more), and the board follows at that page's gaps. The blue band that sat
 * here came off on 2026-09-30, after the board replaced the Action Needed and Scheduled Emails sections (the
 * Policyholder List went with them, since the board is the whole book now).
 * The toolbar between them, Needs me and a name search, came off on
 * 2026-10-01.
 *
 * The header and the board take v3's Policyholder List width too, at most
 * 1280, centered, so a wide window leaves room either side (Upline's bar
 * follows, so the mark keeps their edge). The board is 1000px tall, each
 * column scrolling inside itself when it holds more than fits (Board.tsx).
 * Until 2026-10-01 it was one screen tall, at most 800px, with each column
 * scrolling inside itself once the page had scrolled it whole into view, and
 * for part of that day it had no height of its own, running the page on for
 * the length of its longest column.
 */
export function Home({ day, walk, ...props }: BoardProps) {
  return (
    <>
      {/* The toolbar under the line (Needs me and search) came off on
          2026-10-01, so the board follows the line at the 32px the toolbar
          did. */}
      <div className="shell max-w-7xl pt-25 pb-4">
        <h1 id="home-title" className="text-4xl">
          {day === "fri" ? `Happy ${dayName[day]}` : "Good morning"}, {agency.agent.first}
        </h1>
        <p aria-live="polite" className="mt-2 font-display text-lg text-muted-foreground">
          {lineFor(day, walk)}
        </p>
      </div>

      <div className="shell max-w-7xl pt-4 pb-6">
        <Board day={day} walk={walk} {...props} />
      </div>
    </>
  );
}
