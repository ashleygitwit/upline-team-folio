import { useState } from "react";
import { cn } from "cn";
import { BandGrain } from "@/components/BandGrain";
import { agency, dayName, type Day } from "@/data";
import { lineFor } from "@/dayLine";
import { isFiltered, narrow, noFilters, type Filters } from "@/filters";
import { phasesFor } from "@/phases";
import { Board, type BoardProps } from "@/screens/upline/Board";
import { List } from "@/screens/upline/List";
import { Toolbar, type View } from "@/screens/upline/Toolbar";
import type { Walk } from "@/walk";

/**
 * The homepage, the same every day: the band, then the toolbar, then the
 * board or the list. The band is v3's homepage band, back on 2026-10-01
 * (it came off on 2026-09-30, after the board replaced the Action Needed and
 * Scheduled Emails sections, and the greeting and the line sat on the page's
 * own ground, left-aligned, until it came back). The toolbar is v2.5's
 * Filters and v3's search and Board or List (Toolbar.tsx); what it's set to
 * is the page's own, so every stop opens on the whole board.
 *
 * The toolbar and the board take v3's Policyholder List width, at most 1280,
 * centered, so a wide window leaves room either side (Upline's bar follows,
 * so the mark keeps their edge). With the board showing, the two are exactly
 * the window's height under the presenter bar, 32px in from its top and its
 * foot, and nothing comes after them, so the page scrolls until the space
 * over the toolbar meets the top of the window and stops there, with the
 * board filling the rest and each column scrolling inside itself when it
 * holds more than fits (Board.tsx). A window under 576px holds them at 576.
 * The list runs the page's length instead (List.tsx). `data-fit-window`
 * lets the capture script hold the board at a 900px window's height, since
 * it grows the window to fit the page (scripts/capture.mjs). Until
 * 2026-10-01 the board was one screen tall, at most 800px, with each column
 * scrolling inside itself once the page had scrolled it whole into view;
 * for part of that day it had no height of its own, running the page on for
 * the length of its longest column, and then it was 1000px tall whatever
 * the window.
 */
export function Home({ day, walk, ...props }: BoardProps) {
  const [view, setView] = useState<View>("board");
  const [filters, setFilters] = useState<Filters>(noFilters);
  const [query, setQuery] = useState("");
  const placed = narrow(phasesFor(day, walk), filters, query, day);
  const filtered = isFiltered(filters) || query.trim() !== "";

  return (
    <>
      <Hero day={day} walk={walk} />

      <div
        data-fit-window={view === "board" || undefined}
        className={cn(
          "shell flex max-w-7xl flex-col py-8",
          view === "board"
            ? "h-[calc(100svh-var(--demo-bar-h))] min-h-144"
            : "min-h-[calc(100svh-var(--demo-bar-h))]",
        )}
      >
        <Toolbar
          filters={filters}
          onFilters={setFilters}
          query={query}
          onQuery={setQuery}
          view={view}
          onView={setView}
        />
        <div className="mt-4 min-h-0 flex-1">
          {view === "board" ? (
            <Board day={day} walk={walk} placed={placed} filtered={filtered} {...props} />
          ) : (
            <List day={day} walk={walk} placed={placed} filtered={filtered} {...props} />
          )}
        </div>
      </div>
    </>
  );
}

/**
 * The band, as v3's homepage drew it: the design hub homepage's blue under
 * the mountain, as the Monday email opens, with the greeting and the day's
 * line centered on it in white. v3's link to the Policyholder List under
 * the line isn't here, since the board is the whole book now. It never holds
 * a card or a button, so it reads the same every day.
 */
function Hero({ day, walk }: { day: Day; walk: Walk }) {
  return (
    <div className="band-surface relative isolate overflow-clip">
      <BandGrain />
      <div className="shell py-(--space-section)">
        <div className="mx-auto max-w-180 text-center">
          <h1 id="home-title" className="text-5xl text-balance">
            {greeting(day)}
          </h1>
          <p aria-live="polite" className="mt-(--space-block) font-display text-xl font-medium text-balance">
            {lineFor(day, walk)}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * The band's headline, by day: Monday's and Thursday's good morning, so the
 * line under it, which leads with what needs Jenna, does the talking;
 * Wednesday's break, since the emails went Tuesday and nothing needs Jenna;
 * and Friday's. Wednesday and Thursday were "Good morning, Jenna" until
 * 2026-10-01, and Thursday was "Let's wrap up the week" until 2026-10-02,
 * when Ashley preferred the earlier, more action-oriented version.
 */
function greeting(day: Day) {
  if (day === "wed") return "Take a well-deserved break";
  return `${day === "fri" ? `Happy ${dayName[day]}` : "Good morning"}, ${agency.agent.first}`;
}
