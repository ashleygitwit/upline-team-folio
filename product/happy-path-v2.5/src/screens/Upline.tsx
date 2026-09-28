import { useEffect, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { Banner } from "@/screens/upline/Banner";
import { Overview } from "@/screens/upline/Overview";
import { Renewals } from "@/screens/upline/Renewals";
import { OutreachSheet } from "@/screens/sheets/OutreachSheet";
import { RecommendationSheet } from "@/screens/sheets/RecommendationSheet";
import { EveryoneSheet } from "@/screens/sheets/EveryoneSheet";
import { WhoLeftSheet } from "@/screens/sheets/WhoLeftSheet";
import type { Day } from "@/data";
import type { WalkProps } from "@/walk";

export type Page = "overview" | "renewals";

export type Opened =
  | { kind: "outreach"; id: string }
  | { kind: "rec" }
  | { kind: "everyone" }
  | { kind: "left" }
  | null;

/**
 * Upline as Stacey sees it. Two pages: the overview (today's one thing on a
 * banner, then how Stacey is doing) and this week's renewals, one click from the
 * banner. Everything else slides in over them and closes back.
 */
export function Upline({
  day,
  page: initialPage = "overview",
  openOn = null,
  ...props
}: WalkProps & { day: Day; page?: Page; openOn?: Opened }) {
  const [page, setPage] = useState<Page>(initialPage);
  const [opened, setOpened] = useState<Opened>(openOn);
  const close = () => setOpened(null);

  // A new page starts at the top, the way navigating would.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  // Once the Callahans' results are in, their row opens the recommendation,
  // since that's where they are now.
  const openRow = (id: string) =>
    setOpened(id === "callahan" && (day === "thu" || day === "fri") ? { kind: "rec" } : { kind: "outreach", id });

  return (
    <div className="bg-background">
      <AppBar onHome={() => setPage("overview")} />
      {page === "overview" ? (
        <>
          <Banner
            day={day}
            onRenewals={() => setPage("renewals")}
            onReview={() => setOpened({ kind: "rec" })}
            {...props}
          />
          <Overview onSeeWhoLeft={() => setOpened({ kind: "left" })} />
        </>
      ) : (
        <Renewals
          day={day}
          onBack={() => setPage("overview")}
          onOpen={openRow}
          onSeeEveryone={() => setOpened({ kind: "everyone" })}
          {...props}
        />
      )}

      <OutreachSheet id={opened?.kind === "outreach" ? opened.id : null} day={day} onClose={close} {...props} />
      <RecommendationSheet open={opened?.kind === "rec"} day={day} onClose={close} {...props} />
      <EveryoneSheet open={opened?.kind === "everyone"} day={day} onClose={close} {...props} />
      <WhoLeftSheet open={opened?.kind === "left"} onClose={close} {...props} />
    </div>
  );
}
