import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { Retention } from "@/screens/home/Retention";
import { NeedsYou } from "@/screens/home/NeedsYou";
import { Week } from "@/screens/home/Week";
import { OutreachSheet } from "@/screens/sheets/OutreachSheet";
import { RecommendationSheet } from "@/screens/sheets/RecommendationSheet";
import { EveryoneSheet } from "@/screens/sheets/EveryoneSheet";
import { WhoLeftSheet } from "@/screens/sheets/WhoLeftSheet";
import type { Day } from "@/data";
import type { WalkProps } from "@/walk";

export type Opened =
  | { kind: "outreach"; id: string }
  | { kind: "rec" }
  | { kind: "everyone" }
  | { kind: "left" }
  | null;

/**
 * The one page. Top to bottom: how the agency is doing, the one thing that
 * needs Stacey (only when something does), and this week's renewals.
 * Everything else slides in over it and closes back to it.
 */
export function Home({ day, openOn = null, ...props }: WalkProps & { day: Day; openOn?: Opened }) {
  const [opened, setOpened] = useState<Opened>(openOn);
  const close = () => setOpened(null);

  return (
    <div className="bg-background">
      <AppBar />
      <div className="shell flex flex-col gap-(--space-section) pt-16 pb-(--space-section)">
        <Retention day={day} onSeeWhoLeft={() => setOpened({ kind: "left" })} />
        {(day === "thu" || day === "fri") && (
          <NeedsYou day={day} onReview={() => setOpened({ kind: "rec" })} {...props} />
        )}
        <Week
          day={day}
          onOpen={(id) =>
            // Once the Callahans' results are in, their row opens the
            // recommendation, since that's where they are now.
            setOpened(id === "callahan" && (day === "thu" || day === "fri") ? { kind: "rec" } : { kind: "outreach", id })
          }
          onSeeEveryone={() => setOpened({ kind: "everyone" })}
          {...props}
        />
      </div>

      <OutreachSheet
        id={opened?.kind === "outreach" ? opened.id : null}
        day={day}
        onClose={close}
        {...props}
      />
      <RecommendationSheet open={opened?.kind === "rec"} day={day} onClose={close} {...props} />
      <EveryoneSheet open={opened?.kind === "everyone"} day={day} onClose={close} {...props} />
      <WhoLeftSheet open={opened?.kind === "left"} onClose={close} {...props} />
    </div>
  );
}
