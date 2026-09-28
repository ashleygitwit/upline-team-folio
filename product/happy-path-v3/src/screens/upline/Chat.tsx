import { useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "cn";
import uBadge from "@/assets/upline-u-square.svg";
import { Button } from "@/components/ui/button";
import type { Day } from "@/data";
import { matchPill, pillById, suggested, type PillId } from "@/pills";
import { AskBox, Suggestions } from "@/screens/upline/Ask";
import { Answer, type AnswerProps } from "@/screens/upline/Answers";
import type { Chat as ChatType, WalkProps } from "@/walk";

/**
 * The chat, docked along the bottom the way a messenger docks a conversation.
 * Asking anything on the homepage starts it: a tab appears at the right of a
 * footer, and the conversation pops up out of it with Stacey's questions and
 * Upline's answers, the suggested questions not yet asked, and a box to
 * reply. The tab puts it down and brings it back, and its × ends the chat,
 * so the next question starts a new one. The page underneath stays put.
 */
export function ChatDock({
  chat,
  day,
  up,
  onUp,
  onClose,
  onAsk,
  onAction,
  ...props
}: WalkProps & {
  chat: ChatType;
  day: Day;
  up: boolean;
  onUp: (up: boolean) => void;
  onClose: () => void;
  onAsk: (question: string, answer: PillId | null) => void;
  onAction: AnswerProps["onAction"];
}) {
  const panel = useRef<HTMLElement>(null);
  const tab = useRef<HTMLButtonElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const count = chat.asked.length;
  const left = suggested.filter((id) => !chat.asked.some((e) => e.answer === id));
  const ask = (id: PillId) => onAsk(pillById(id).question, id);

  // The newest question comes to the top of the panel, with its answer under
  // it. A question asked from outside the panel, or a suggestion that's now
  // gone from it, moves focus onto the conversation; typing keeps it in the box.
  useEffect(() => {
    if (!up) return;
    const last = list.current?.lastElementChild as HTMLElement | null;
    if (!last || !scroller.current) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.current.scrollTo({ top: last.offsetTop - 24, behavior: calm ? "auto" : "smooth" });
    if (!panel.current?.contains(document.activeElement)) list.current?.focus({ preventScroll: true });
  }, [up, count]);

  const putDown = () => {
    onUp(false);
    tab.current?.focus();
  };

  return (
    <>
      {up && (
        <section
          ref={panel}
          aria-labelledby="chat-title"
          onKeyDown={(e) => {
            if (e.key !== "Escape") return;
            e.stopPropagation();
            putDown();
          }}
          className="fixed right-0 bottom-(--dock-h) z-30 flex h-(--panel-h) w-140 max-w-[calc(100vw-2rem)] flex-col border border-b-0 bg-card outline-none animate-in duration-200 fade-in-0 slide-in-from-bottom-2"
        >
          <header className="flex items-start justify-between gap-4 border-b py-5 pr-4 pl-6">
            <h2 id="chat-title" className="text-xl text-balance">
              {chat.title}
            </h2>
            <Button variant="ghost" size="icon-sm" className="-mt-0.5" onClick={putDown}>
              <ChevronDown />
              <span className="sr-only">Minimize</span>
            </Button>
          </header>

          <div ref={scroller} className="relative flex-1 overflow-y-auto px-6 py-6">
            <ol ref={list} tabIndex={-1} aria-live="polite" className="flex flex-col gap-10 outline-none">
              {chat.asked.map((e) => (
                <li key={e.key}>
                  <p className="ml-auto w-fit max-w-[80%] bg-muted px-4 py-3 text-base">{e.question}</p>
                  <div className="mt-6 text-base">
                    <p className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
                      <img src={uBadge} alt="" className="size-6" />
                      Upline
                    </p>
                    <Answer id={e.answer} day={day} onAction={onAction} onAsk={ask} {...props} />
                  </div>
                </li>
              ))}
            </ol>
            {left.length > 0 && <Suggestions ids={left} className="mt-10" onAsk={ask} />}
          </div>

          <div className="border-t px-6 py-4">
            <AskBox label="Reply to Upline" onAsk={(q) => onAsk(q, matchPill(q))} />
          </div>
        </section>
      )}

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t bg-card">
        <div className="flex h-(--dock-h) justify-end">
          <div className={cn("flex h-full w-72 items-center border-l transition-colors", up && "bg-background")}>
            <button
              ref={tab}
              type="button"
              aria-expanded={up}
              aria-label={`Chat: ${chat.title}`}
              onClick={() => (up ? putDown() : onUp(true))}
              className="flex h-full min-w-0 flex-1 items-center gap-3 pr-2 pl-4 text-left font-display text-sm font-medium transition-colors hover:bg-background focus-visible:-outline-offset-2"
            >
              <img src={uBadge} alt="" className="size-6" />
              <span className="min-w-0 flex-1 truncate">{chat.title}</span>
              {up ? (
                <ChevronDown aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronUp aria-hidden className="size-4 shrink-0 text-muted-foreground" />
              )}
            </button>
            <Button variant="ghost" size="icon-sm" className="mr-2" onClick={onClose}>
              <X />
              <span className="sr-only">End this chat</span>
            </Button>
          </div>
        </div>
      </footer>
    </>
  );
}
