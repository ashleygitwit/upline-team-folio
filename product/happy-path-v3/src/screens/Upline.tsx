import { useEffect, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { Dock, type Panel } from "@/screens/upline/Dock";
import { Home, type Exchange } from "@/screens/upline/Home";
import { Profile } from "@/screens/upline/Profile";
import { Results } from "@/screens/upline/Results";
import type { Day } from "@/data";
import { pillById, type PillId } from "@/pills";
import type { Today } from "@/today";
import type { WalkProps } from "@/walk";

export type Page = "home" | "profile" | "results";

/**
 * Upline as Stacey sees it. Three pages: the homepage (a greeting, today's
 * one thing, and a box to ask anything), a client's profile, and the results
 * of a shop. Under all of them sits the dock, with what's scheduled and what
 * just happened. The walk can open on any page, with either panel up.
 */
export function Upline({
  day,
  page: initialPage = "home",
  panel: initialPanel = null,
  message: initialMessage = null,
  ...props
}: WalkProps & { day: Day; page?: Page; panel?: Panel | null; message?: string | null }) {
  const [page, setPage] = useState<Page>(initialPage);
  const [panel, setPanel] = useState<Panel | null>(initialPanel);
  const [message, setMessage] = useState<string | null>(initialMessage);
  const [asked, setAsked] = useState<Exchange[]>([]);

  // A new page starts at the top, the way navigating would.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  // Going somewhere puts the panels away, so the page isn't opened behind one.
  const open = (to: Page) => {
    setMessage(null);
    setPanel(null);
    setPage(to);
  };

  const ask = (question: string, answer: PillId | null) =>
    setAsked((a) => [...a, { key: (a.at(-1)?.key ?? 0) + 1, question, answer }]);

  const act = (to: NonNullable<Today["action"]>["to"]) => {
    if (to === "done") props.update({ bound: true });
    else if (to === "results") open("results");
    else {
      setMessage(null);
      setPanel(to);
    }
  };

  return (
    <div className="min-h-[calc(100svh-var(--demo-bar-h))] bg-background pb-(--dock-h)">
      <AppBar onHome={() => open("home")} />

      {page === "home" && (
        <Home day={day} asked={asked} onAsk={ask} onStartOver={() => setAsked([])} onAction={act} {...props} />
      )}
      {page === "profile" && (
        <Profile
          day={day}
          onHome={() => open("home")}
          onResults={() => open("results")}
          onEdit={() => {
            setPanel("scheduled");
            setMessage("callahan");
          }}
          {...props}
        />
      )}
      {page === "results" && (
        <Results day={day} onProfile={() => open("profile")} onSent={() => open("home")} {...props} />
      )}

      <Dock
        day={day}
        panel={panel}
        message={message}
        onPanel={setPanel}
        onMessage={setMessage}
        onProfile={() => open("profile")}
        onResults={() => open("results")}
        onEveryone={() => {
          open("home");
          ask(pillById("everyone").question, "everyone");
        }}
        {...props}
      />
    </div>
  );
}
