import { useLayoutEffect, useRef, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { HouseholdDrawer } from "@/household/HouseholdDrawer";
import { Home } from "@/screens/upline/Home";
import type { Day } from "@/data";
import type { WalkProps } from "@/walk";

/**
 * Upline as Jenna sees it: one page, the homepage, a greeting and the board
 * of everyone renewing. The Policyholder List, from the menu on Jenna's name,
 * came out on 2026-09-30, since the board is the whole book now. A household
 * opens in a drawer over the board, and the Pruitts' shop results open in a
 * modal, from their card or their drawer. The walk can open with a household
 * or an email open.
 */
export function Upline({
  day,
  household: initialHousehold = null,
  outreach: initialOutreach = null,
  ...props
}: WalkProps & { day: Day; household?: string | null; outreach?: string | null }) {
  // The household open in the drawer.
  const [household, setHousehold] = useState<string | null>(initialHousehold);
  // Whether the Pruitts' shop results are open on their own.
  const [results, setResults] = useState(false);
  // The household whose outreach review is open on its own: the walk's
  // review stop opens the Pruitts' email this way.
  const [outreach, setOutreach] = useState<string | null>(initialOutreach);

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

  return (
    <div className="min-h-[calc(100svh-var(--demo-bar-h))] bg-background">
      <div ref={appBar}>
        <AppBar onHome={() => setHousehold(null)} />
      </div>

      <Home
        day={day}
        household={household}
        onHousehold={setHousehold}
        onResults={() => setResults(true)}
        {...props}
      />

      <HouseholdDrawer
        id={household}
        day={day}
        onClose={() => setHousehold(null)}
        onOpenQuestionnaire={() => props.go("questionnaire")}
        resultsOpen={results}
        onResultsOpen={setResults}
        outreachOpen={outreach}
        onOutreachOpen={setOutreach}
        walk={props.walk}
        update={props.update}
      />
    </div>
  );
}
