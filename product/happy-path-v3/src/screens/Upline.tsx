import { useEffect, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { Dock, type Panel } from "@/screens/upline/Dock";
import { Chat } from "@/screens/upline/Chat";
import { ChatList } from "@/screens/upline/ChatList";
import { Home } from "@/screens/upline/Home";
import { Profile } from "@/screens/upline/Profile";
import { Results } from "@/screens/upline/Results";
import type { Day } from "@/data";
import { pillById, type PillId } from "@/pills";
import type { Today } from "@/today";
import type { WalkProps } from "@/walk";

export type Page = "home" | "profile" | "results";

/**
 * Upline as Stacey sees it. Three pages: the homepage (a greeting, today's
 * one thing, and a box to ask anything, with Stacey's chats listed down the
 * left), a client's profile, and the results of a shop. Under all of them
 * sits the dock, with what's scheduled and what just happened. The walk can
 * open on any page, with either panel up.
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
  // The chat on screen. `null` is the greeting, where a new chat starts.
  const [chatId, setChatId] = useState<number | null>(null);
  const { walk, update } = props;
  const chat = walk.chats.find((c) => c.id === chatId) ?? null;

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

  const home = () => {
    setChatId(null);
    open("home");
  };

  // A question goes into the chat on screen, as long as it's today's. From
  // the greeting, or an earlier day's chat, it starts a new one.
  const ask = (question: string, answer: PillId | null, into = chatId) => {
    const target = walk.chats.find((c) => c.id === into && c.day === day);
    if (target) {
      update((w) => ({
        chats: w.chats.map((c) =>
          c.id === target.id ? { ...c, asked: [...c.asked, { key: c.asked.length + 1, question, answer }] } : c,
        ),
      }));
      return;
    }
    const id = Math.max(0, ...walk.chats.map((c) => c.id)) + 1;
    update((w) => ({ chats: [...w.chats, { id, day, title: question, asked: [{ key: 1, question, answer }] }] }));
    setChatId(id);
  };

  const act = (to: NonNullable<Today["action"]>["to"]) => {
    if (to === "done") update({ bound: true });
    else if (to === "results") open("results");
    else {
      setMessage(null);
      setPanel(to);
    }
  };

  return (
    <div className="min-h-[calc(100svh-var(--demo-bar-h))] bg-background pb-(--dock-h)">
      <AppBar onHome={home} />

      {page === "home" && (
        <div className="flex h-(--home-h) min-h-[28rem]">
          <ChatList
            day={day}
            chats={walk.chats}
            open={chatId}
            onOpen={setChatId}
            onNew={() => setChatId(null)}
          />
          <div className="min-w-0 flex-1">
            {chat ? (
              <Chat chat={chat} day={day} onAsk={ask} onAction={act} onNew={() => setChatId(null)} {...props} />
            ) : (
              <Home day={day} onAsk={(q, a) => ask(q, a, null)} onAction={act} {...props} />
            )}
          </div>
        </div>
      )}
      {page === "profile" && (
        <Profile
          day={day}
          onHome={home}
          onResults={() => open("results")}
          onEdit={() => {
            setPanel("scheduled");
            setMessage("callahan");
          }}
          {...props}
        />
      )}
      {page === "results" && (
        <Results day={day} onProfile={() => open("profile")} onSent={home} {...props} />
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
