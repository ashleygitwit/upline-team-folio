import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { agency, dayName, type Day } from "@/data";
import { matchPill, pillById, pills, type PillId } from "@/pills";
import { AskBox, Suggestions } from "@/screens/upline/Ask";
import type { AnswerProps } from "@/screens/upline/Answers";
import { todayFor } from "@/today";
import type { WalkProps } from "@/walk";

/**
 * The homepage, and the start of every new chat: a greeting, one sentence on
 * what's going on, and a box to ask anything. It has to be readable before
 * coffee, so nothing else is on the page until Stacey asks for it. How she's
 * doing, who left and where everyone stands are each one question away, and
 * the questions are written out underneath so she doesn't have to think of
 * them. Asking opens a chat, the way Claude does.
 */
export function Home({
  day,
  walk,
  update,
  onAsk,
  onAction,
}: WalkProps & {
  day: Day;
  onAsk: (question: string, answer: PillId | null) => void;
  onAction: AnswerProps["onAction"];
}) {
  const today = todayFor(day, walk);

  return (
    <div className="h-full overflow-y-auto">
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

          <AskBox label="Ask me anything" className="mt-10" onAsk={(q) => onAsk(q, matchPill(q))} />
          <Suggestions
            ids={pills.map((p) => p.id)}
            className="mt-5 justify-center"
            onAsk={(id) => onAsk(pillById(id).question, id)}
          />
        </div>
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
