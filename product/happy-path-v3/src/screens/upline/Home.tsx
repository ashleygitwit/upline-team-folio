import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import uBadge from "@/assets/upline-u-square.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { agency, dayName, type Day } from "@/data";
import { matchPill, pillById, pills, type PillId } from "@/pills";
import { Answer, type AnswerProps } from "@/screens/upline/Answers";
import { todayFor } from "@/today";
import type { WalkProps } from "@/walk";

/** One question and what it's answered with. `null` has no answer written. */
export type Exchange = { key: number; question: string; answer: PillId | null };

/**
 * The homepage: a greeting, one sentence on what's going on, and a box to
 * ask anything. It has to be readable before coffee, so nothing else is on
 * the page until Stacey asks for it. How she's doing, who left and where
 * everyone stands are each one question away, and the questions are written
 * out underneath so she doesn't have to think of them.
 */
export function Home({
  day,
  walk,
  update,
  go,
  asked,
  onAsk,
  onStartOver,
  onAction,
}: WalkProps & {
  day: Day;
  asked: Exchange[];
  onAsk: (question: string, answer: PillId | null) => void;
  onStartOver: () => void;
  onAction: AnswerProps["onAction"];
}) {
  const [text, setText] = useState("");
  const latest = useRef<HTMLLIElement>(null);
  const today = todayFor(day, walk);
  const left = pills.filter((p) => !asked.some((e) => e.answer === p.id));
  const last = asked.at(-1)?.key;

  // A new question comes to the top of the window, with its answer under it.
  useEffect(() => {
    if (last === undefined) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    latest.current?.scrollIntoView({ block: "start", behavior: calm ? "auto" : "smooth" });
  }, [last]);

  const ask = (id: PillId) => onAsk(pillById(id).question, id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const question = text.trim();
    if (!question) return;
    onAsk(question, matchPill(question));
    setText("");
  };

  return (
    <div className="shell pt-(--space-section) pb-(--space-section)">
      <div className="mx-auto max-w-180">
        <section aria-labelledby="home-title" className="text-center" aria-live={day === "fri" ? "polite" : undefined}>
          <h1 id="home-title" className="text-5xl text-balance">
            Happy {dayName[day]}, {agency.agent.first}
          </h1>
          {today.celebrate && (
            <div className="mt-8 flex justify-center">
              <Celebration />
            </div>
          )}
          <p className="mx-auto mt-6 max-w-[60ch] font-display text-lg font-normal text-balance text-muted-foreground">
            {today.lead} {today.sub}
          </p>
          {today.action &&
            (today.action.primary ? (
              <Button size="lg" className="mt-7" onClick={() => onAction(today.action!.to)}>
                {today.action.label}
              </Button>
            ) : (
              <Button
                variant="link"
                className="mt-5 h-auto p-0 font-sans text-sm"
                onClick={() => onAction(today.action!.to)}
              >
                {today.action.label}
                <ArrowRight data-icon="inline-end" />
              </Button>
            ))}
          {today.celebrate && (
            <Button
              variant="link"
              className="mt-5 h-auto p-0 font-sans text-sm"
              onClick={() => update({ bound: false })}
            >
              Undo
            </Button>
          )}
        </section>

        {asked.length > 0 && (
          <ol aria-label="Conversation" aria-live="polite" className="mt-(--space-section) flex flex-col gap-10">
            {asked.map((e) => (
              <li key={e.key} ref={e.key === last ? latest : undefined} className="scroll-mt-[calc(var(--demo-bar-h)+2rem)]">
                <p className="ml-auto w-fit max-w-[80%] bg-muted px-4 py-3 text-base">{e.question}</p>
                <div className="mt-6 text-base">
                  <p className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
                    <img src={uBadge} alt="" className="size-6" />
                    Upline
                  </p>
                  <Answer
                    id={e.answer}
                    day={day}
                    walk={walk}
                    update={update}
                    go={go}
                    onAction={onAction}
                    onAsk={ask}
                  />
                </div>
              </li>
            ))}
          </ol>
        )}

        <form onSubmit={submit} className="mt-10 flex">
          <Input
            aria-label="Ask me anything"
            placeholder="Ask me anything"
            className="h-13 border-r-0 px-4"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" size="lg" className="w-13 px-0" disabled={!text.trim()}>
            <ArrowUp />
            <span className="sr-only">Ask</span>
          </Button>
        </form>

        <ul aria-label="Suggested questions" className="mt-5 flex flex-wrap justify-center gap-2">
          {left.map((p) => (
            <li key={p.id}>
              <Button variant="outline" className="bg-card font-sans font-normal" onClick={() => ask(p.id)}>
                {p.question}
              </Button>
            </li>
          ))}
          {asked.length > 0 && (
            <li>
              <Button variant="ghost" className="font-sans font-normal" onClick={onStartOver}>
                Start over
              </Button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

/** A check that pops in and draws itself. Reduced motion shows it still. */
function Celebration() {
  return (
    <span aria-hidden className="celebrate-pop grid size-14 shrink-0 place-items-center bg-primary text-primary-foreground">
      <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path className="celebrate-draw" d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="square" />
      </svg>
    </span>
  );
}
