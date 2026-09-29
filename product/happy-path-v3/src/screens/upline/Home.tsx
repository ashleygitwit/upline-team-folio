import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { agency, dayName, type Day } from "@/data";
import { matchPill, pillById, suggested, type PillId } from "@/pills";
import { AskBox, Suggestions } from "@/screens/upline/Ask";
import type { AnswerProps } from "@/screens/upline/Answers";
import { Sections } from "@/screens/upline/Sections";
import { todayFor } from "@/today";
import type { WalkProps } from "@/walk";

/**
 * The homepage: a greeting and a box to ask anything, with three questions
 * written out inside it so Stacey doesn't have to think of them. Asking docks
 * a chat along the bottom. It has to be readable before coffee, so under that
 * sit only the three sections, most pressing first, each holding just what
 * needs her. From Wednesday a sentence on the day, and its one button, sit
 * between the greeting and the box. Monday has no box, only the greeting and
 * "Let's wrap up some to-dos.", so the to-dos come straight after.
 */
export function Home({
  day,
  walk,
  update,
  onAsk,
  onAction,
  ...props
}: WalkProps & {
  day: Day;
  message: string | null;
  onAsk: (question: string, answer: PillId | null) => void;
  onAction: AnswerProps["onAction"];
  onMessage: (id: string) => void;
  onProfile: () => void;
  onResults: () => void;
}) {
  const today = todayFor(day, walk);
  // Monday is just the greeting and one line: everything that needs Stacey is
  // right below in the sections, so a brief, a link or the ask box would only
  // stand between her and them.
  const monday = day === "mon";
  const brief = !monday;

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
          {monday && (
            <p className="mx-auto mt-6 max-w-[60ch] font-display text-lg font-normal text-balance text-muted-foreground">
              Let's wrap up some to-dos.
            </p>
          )}
          {brief && (
            <p className="mx-auto mt-6 max-w-[60ch] font-display text-lg font-normal text-balance text-muted-foreground">
              {today.lead} {today.sub}
            </p>
          )}
          {brief &&
            today.action &&
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

        {!monday && (
          <AskBox label="Ask me anything" className="mt-10" onAsk={(q) => onAsk(q, matchPill(q))}>
            <Suggestions ids={suggested} size="sm" onAsk={(id) => onAsk(pillById(id).question, id)} />
          </AskBox>
        )}

        <Sections day={day} walk={walk} update={update} {...props} />
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
