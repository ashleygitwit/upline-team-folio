import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "cn";
import { AppBar } from "@/components/AppBar";
import { HouseholdDrawer } from "@/household/HouseholdDrawer";
import { ChatDock } from "@/screens/upline/Chat";
import { Home } from "@/screens/upline/Home";
import { Profile } from "@/screens/upline/Profile";
import { Results } from "@/screens/upline/Results";
import { scheduledId } from "@/screens/upline/Sections";
import type { Day } from "@/data";
import { pillById, type PillId } from "@/pills";
import type { Today } from "@/today";
import type { WalkProps } from "@/walk";

export type Page = "home" | "profile" | "results";

/**
 * Upline as Stacey sees it. Three pages: the homepage (a greeting, today's
 * one thing, a box to ask anything, and the three sections, most pressing
 * first), a client's profile, and the results of a shop. A household's
 * email opens in a sheet over whichever page she's on, and once she asks
 * anything the chat docks along the bottom of every page. The walk can open
 * on any page, with an email open.
 */
export function Upline({
  day,
  page: initialPage = "home",
  household: initialHousehold = null,
  ...props
}: WalkProps & { day: Day; page?: Page; household?: string | null }) {
  const [page, setPage] = useState<Page>(initialPage);
  // The household open in the drawer.
  const [household, setHousehold] = useState<string | null>(initialHousehold);
  // Whether the chat's panel is up, or put down to its tab.
  const [chatUp, setChatUp] = useState(false);
  // Bumped to take Stacey down to Scheduled Renewal Emails.
  const [jump, setJump] = useState(0);
  const { walk, update } = props;
  const chat = walk.chats.find((c) => c.day === day) ?? null;

  // A new page starts at the top, the way navigating would.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  useEffect(() => {
    if (!jump) return;
    const section = document.getElementById(scheduledId);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section?.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    section?.querySelector("h2")?.focus({ preventScroll: true });
  }, [jump]);

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

  // A question goes into today's chat, or starts it, and brings the panel up.
  const ask = (question: string, answer: PillId | null) => {
    if (chat) {
      update((w) => ({
        chats: w.chats.map((c) =>
          c.id === chat.id ? { ...c, asked: [...c.asked, { key: c.asked.length + 1, question, answer }] } : c,
        ),
      }));
    } else {
      const id = Math.max(0, ...walk.chats.map((c) => c.id)) + 1;
      update((w) => ({ chats: [...w.chats, { id, day, title: question, asked: [{ key: 1, question, answer }] }] }));
    }
    setChatUp(true);
  };

  const endChat = () => {
    update((w) => ({ chats: w.chats.filter((c) => c.day !== day) }));
    setChatUp(false);
  };

  const act = (to: NonNullable<Today["action"]>["to"]) => {
    if (to === "done") update({ bound: true });
    else if (to === "results") open("results");
    else if (to === "everyone") ask(pillById("everyone").question, "everyone");
    else {
      setChatUp(false);
      open("home");
      setJump((j) => j + 1);
    }
  };

  return (
    <div className={cn("min-h-[calc(100svh-var(--demo-bar-h))] bg-background", chat && "pb-(--dock-h)")}>
      <div ref={appBar}>
        <AppBar onHome={() => open("home")} />
      </div>

      {page === "home" && (
        <Home
          day={day}
          household={household}
          onAsk={ask}
          onAction={act}
          onHousehold={setHousehold}
          onProfile={() => open("profile")}
          onResults={() => open("results")}
          {...props}
        />
      )}
      {page === "profile" && (
        <Profile
          day={day}
          onHome={() => open("home")}
          onResults={() => open("results")}
          onEdit={() => setHousehold("callahan")}
          {...props}
        />
      )}
      {page === "results" && (
        <Results day={day} onProfile={() => open("profile")} onSent={() => open("home")} {...props} />
      )}

      <HouseholdDrawer id={household} onClose={() => setHousehold(null)} walk={props.walk} update={props.update} />

      {chat && (
        <ChatDock
          chat={chat}
          day={day}
          up={chatUp}
          onUp={setChatUp}
          onClose={endChat}
          onAsk={ask}
          onAction={act}
          {...props}
        />
      )}
    </div>
  );
}
