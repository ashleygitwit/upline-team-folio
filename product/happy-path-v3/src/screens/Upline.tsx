import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "cn";
import { AppBar } from "@/components/AppBar";
import { HouseholdDrawer } from "@/household/HouseholdDrawer";
import { ChatDock } from "@/screens/upline/Chat";
import { Home } from "@/screens/upline/Home";
import { Policyholders } from "@/screens/upline/Policyholders";
import { scheduledId } from "@/screens/upline/Sections";
import type { Day } from "@/data";
import { pillById, type PillId } from "@/pills";
import type { Today } from "@/today";
import type { WalkProps } from "@/walk";

export type Page = "home" | "policyholders";

/**
 * Upline as Stacey sees it. Two pages: the homepage (a greeting, today's one
 * thing, and the sections that hold what needs her, most pressing first) and
 * the list of everyone renewing, from the menu on Stacey's name. A household
 * opens in a drawer over whichever page she's on, and the Callahans' shop
 * results open in a modal, from their card, their drawer or the chat. Once
 * she asks anything the chat docks along the bottom of every page. The walk
 * can open on any page, with a household open.
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
  // Whether the Callahans' shop results are open on their own.
  const [results, setResults] = useState(false);
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

  const newChatId = () => Math.max(0, ...walk.chats.map((c) => c.id)) + 1;

  // A question goes into today's chat, or starts it, and brings the panel up.
  // A chat opened with nothing asked yet takes its first question as its title.
  const ask = (question: string, answer: PillId | null) => {
    if (chat) {
      update((w) => ({
        chats: w.chats.map((c) =>
          c.id === chat.id
            ? {
                ...c,
                title: c.asked.length ? c.title : question,
                asked: [...c.asked, { key: c.asked.length + 1, question, answer }],
              }
            : c,
        ),
      }));
    } else {
      const id = newChatId();
      update((w) => ({ chats: [...w.chats, { id, day, title: question, asked: [{ key: 1, question, answer }] }] }));
    }
    setChatUp(true);
  };

  // Brings up today's chat without a question: the one there is, or a new one
  // with nothing asked yet, which offers the suggested questions and a box.
  const openChat = () => {
    if (!chat) {
      const id = newChatId();
      update((w) => ({ chats: [...w.chats, { id, day, title: "Ask us anything", asked: [] }] }));
    }
    setChatUp(true);
  };

  const endChat = () => {
    update((w) => ({ chats: w.chats.filter((c) => c.day !== day) }));
    setChatUp(false);
  };

  const act = (to: NonNullable<Today["action"]>["to"]) => {
    if (to === "done") update({ bound: true });
    else if (to === "results") {
      setChatUp(false);
      setResults(true);
    }
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
        <AppBar onHome={() => open("home")} onPolicyholders={() => open("policyholders")} />
      </div>

      {page === "home" && (
        <Home
          day={day}
          household={household}
          onAsk={ask}
          onChat={openChat}
          onAction={act}
          onHousehold={setHousehold}
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
        walk={props.walk}
        update={props.update}
      />

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
