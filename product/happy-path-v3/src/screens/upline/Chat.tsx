import { useEffect, useRef } from "react";
import uBadge from "@/assets/upline-u-square.svg";
import { Button } from "@/components/ui/button";
import { dayLabel, dayName, type Day } from "@/data";
import { matchPill, pillById, pills, type PillId } from "@/pills";
import { AskBox, Suggestions } from "@/screens/upline/Ask";
import { Answer, type AnswerProps } from "@/screens/upline/Answers";
import type { Chat as ChatType, WalkProps } from "@/walk";

/**
 * One conversation, the way Claude shows one: Stacey's questions and
 * Upline's answers, newest at the bottom, with the questions not yet asked
 * under the last answer and a box to reply at the foot. A chat from an
 * earlier day opens as it was, with no box, since what it says was true then.
 */
export function Chat({
  chat,
  day,
  onAsk,
  onAction,
  onNew,
  ...props
}: WalkProps & {
  chat: ChatType;
  day: Day;
  onAsk: (question: string, answer: PillId | null) => void;
  onAction: AnswerProps["onAction"];
  onNew: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const shown = useRef(chat.id);
  const readOnly = chat.day !== day;
  const count = chat.asked.length;
  const left = pills.filter((p) => !chat.asked.some((e) => e.answer === p.id)).map((p) => p.id);
  const ask = (id: PillId) => onAsk(pillById(id).question, id);

  // The newest question comes to the top of the pane, with its answer under
  // it. Opening a different chat jumps there; a new answer glides.
  useEffect(() => {
    const last = list.current?.lastElementChild as HTMLElement | null;
    if (!last || !scroller.current) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glide = shown.current === chat.id && !calm;
    shown.current = chat.id;
    scroller.current.scrollTo({ top: last.offsetTop - 40, behavior: glide ? "smooth" : "auto" });

    // A pill that was just asked is gone from the page, and focus with it,
    // so it lands on the conversation. Typing keeps focus in the box.
    if (document.activeElement === document.body) list.current?.focus({ preventScroll: true });
  }, [chat.id, count]);

  return (
    <div className="flex h-full flex-col">
      <div ref={scroller} className="relative flex-1 overflow-y-auto">
        <div className="shell pt-10 pb-10">
          <div className="mx-auto max-w-180">
            <p className="eyebrow text-muted-foreground">{dayLabel[chat.day]}</p>
            <ol
              ref={list}
              tabIndex={-1}
              aria-label={chat.title}
              aria-live="polite"
              className="mt-6 flex flex-col gap-10 outline-none"
            >
              {chat.asked.map((e) => (
                <li key={e.key}>
                  <p className="ml-auto w-fit max-w-[80%] bg-muted px-4 py-3 text-base">{e.question}</p>
                  <div className="mt-6 text-base">
                    <p className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
                      <img src={uBadge} alt="" className="size-6" />
                      Upline
                    </p>
                    <Answer id={e.answer} day={chat.day} readOnly={readOnly} onAction={onAction} onAsk={ask} {...props} />
                  </div>
                </li>
              ))}
            </ol>
            {!readOnly && left.length > 0 && <Suggestions ids={left} className="mt-10" onAsk={ask} />}
          </div>
        </div>
      </div>

      <div className="shell pt-4 pb-6">
        <div className="mx-auto max-w-180">
          {readOnly ? (
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-sm text-muted-foreground">
              This chat is from {dayName[chat.day]}, so it shows things as they were then.
              <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={onNew}>
                Start a new chat
              </Button>
            </p>
          ) : (
            <AskBox label="Reply to Upline" onAsk={(q) => onAsk(q, matchPill(q))} />
          )}
        </div>
      </div>
    </div>
  );
}
