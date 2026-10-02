import { useLayoutEffect, useRef, useState } from "react";
import { AppBar } from "@/components/AppBar";
import type { Page, Phase } from "@/household/activity";
import { HouseholdDrawer } from "@/household/HouseholdDrawer";
import { Home } from "@/screens/upline/Home";
import { pruitt, type Day } from "@/data";
import type { WalkProps } from "@/walk";

/**
 * Upline as Jenna sees it: one page, the homepage, a greeting and the board
 * of everyone renewing. The Policyholder List, from the menu on Jenna's name,
 * came out on 2026-09-30, since the board is the whole book now. A household
 * opens in a drawer over the board, and its pages (an email, a shop, its
 * results, the close-out) slide over the drawer. The walk can open with a
 * household's drawer open, and a page over it: the review stop opens the
 * Pruitts' with their email on top, Thursday's second stop with their
 * results, and Friday's with the close-out. Wednesday's second stop opens
 * theirs on the profile, with nothing over it.
 *
 * `cue` is for the demo only: on each day's first homepage, a blinking dot
 * on the Pruitts' card (DemoCue.tsx), until their drawer opens there or the
 * walk moves on (App.tsx).
 */
export function Upline({
  day,
  household: initialHousehold = null,
  page: initialPage = null,
  cue = false,
  ...props
}: WalkProps & { day: Day; household?: string | null; page?: Phase | null; cue?: boolean }) {
  // The household open in the drawer, and the page over it, if any. Closing
  // the drawer leaves the page be, so it slides away with the drawer.
  const [household, setHousehold] = useState<string | null>(initialHousehold);
  const [page, setPage] = useState<Page | null>(initialPage && { phase: initialPage });

  // What opened the drawer, so closing it gives the focus back there: the
  // card or line, or a button on it (View the full report, View profile and
  // close). A click doesn't focus a button in Safari, and the walk's review
  // stop opens the drawer with nothing clicked, so failing that it goes to
  // the household's card or line, wherever it is on the board now, or its
  // row in the list.
  const opener = useRef<HTMLElement | null>(null);
  const cued = cue && !props.walk.cuesGone.includes(day);
  const open = (id: string, phase?: Phase) => {
    const at = document.activeElement;
    opener.current = at instanceof HTMLElement && at !== document.body ? at : null;
    setHousehold(id);
    setPage(phase ? { phase } : null);
    if (cued && id === pruitt.id) props.update((w) => ({ cuesGone: [...w.cuesGone, day] }));
  };
  const returnFocus = (id: string) => {
    const card = document.querySelector<HTMLElement>(`[data-household="${id}"]`);
    (opener.current?.isConnected ? opener.current : card)?.focus();
  };

  // A drawer opens under whichever bars are on screen: the presenter's bar,
  // which always is, and Upline's own, until it scrolls away (--sheet-top in
  // index.css).
  const appBar = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!household) return;
    const root = document.documentElement;
    const demoBar = parseFloat(getComputedStyle(root).getPropertyValue("--demo-bar-h")) || 0;
    const appBarBottom = appBar.current?.getBoundingClientRect().bottom ?? 0;
    root.style.setProperty("--sheet-top", `${Math.max(demoBar, appBarBottom)}px`);
  }, [household]);

  // White under the band, as the Monday email is, so the board's gray
  // columns are the only gray on the page (Ashley's review, 2026-10-02: too
  // much gray on gray). It was gray 50 until then.
  return (
    <div className="min-h-[calc(100svh-var(--demo-bar-h))] bg-card">
      <div ref={appBar}>
        <AppBar onHome={() => setHousehold(null)} />
      </div>

      <Home day={day} household={household} onHousehold={open} cue={cued ? pruitt.id : null} {...props} />

      <HouseholdDrawer
        id={household}
        day={day}
        page={page}
        onPage={setPage}
        onClose={() => setHousehold(null)}
        returnFocus={returnFocus}
        walk={props.walk}
        update={props.update}
      />
    </div>
  );
}
