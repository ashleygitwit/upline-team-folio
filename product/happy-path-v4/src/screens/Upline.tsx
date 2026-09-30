import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { HouseholdDrawer } from "@/household/HouseholdDrawer";
import { Home } from "@/screens/upline/Home";
import { Policyholders } from "@/screens/upline/Policyholders";
import type { Day } from "@/data";
import type { WalkProps } from "@/walk";

export type Page = "home" | "policyholders";

/**
 * Upline as Jenna sees it. Two pages: the homepage (a greeting, today's one
 * thing, and the sections that hold what needs her, most pressing first) and
 * the list of everyone renewing, from the menu on Jenna's name. A household
 * opens in a drawer over whichever page she's on, and the Pruitts' shop
 * results open in a modal, from their card or their drawer. The walk can
 * open on any page, with a household open.
 */
export function Upline({
  day,
  page: initialPage = "home",
  household: initialHousehold = null,
  outreach: initialOutreach = null,
  ...props
}: WalkProps & { day: Day; page?: Page; household?: string | null; outreach?: string | null }) {
  const [page, setPage] = useState<Page>(initialPage);
  // The household open in the drawer.
  const [household, setHousehold] = useState<string | null>(initialHousehold);
  // Whether the Pruitts' shop results are open on their own.
  const [results, setResults] = useState(false);
  // The household whose outreach review is open on its own, from a Scheduled row.
  const [outreach, setOutreach] = useState<string | null>(initialOutreach);

  // A new page starts at the top, the way navigating would.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

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

  const open = (to: Page) => {
    setHousehold(null);
    setPage(to);
  };

  return (
    <div className="min-h-[calc(100svh-var(--demo-bar-h))] bg-background">
      <div ref={appBar}>
        <AppBar onHome={() => open("home")} onPolicyholders={() => open("policyholders")} />
      </div>

      {page === "home" && (
        <Home
          day={day}
          household={household}
          onHousehold={setHousehold}
          onOutreach={setOutreach}
          onResults={() => setResults(true)}
          onPolicyholders={() => open("policyholders")}
          {...props}
        />
      )}
      {page === "policyholders" && (
        <Policyholders
          day={day}
          household={household}
          onHome={() => open("home")}
          onHousehold={setHousehold}
          {...props}
        />
      )}

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
