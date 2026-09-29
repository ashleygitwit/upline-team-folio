import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";
import { BandGrain } from "@/components/BandGrain";
import { Button } from "@/components/ui/button";
import { agency, callahan, dayName, mondayNeeds, type Day } from "@/data";
import { matchPill, pillById, suggested, type PillId } from "@/pills";
import { AskBox, Suggestions } from "@/screens/upline/Ask";
import type { AnswerProps } from "@/screens/upline/Answers";
import { Closing, Scheduled, Sections, Shopped } from "@/screens/upline/Sections";
import { todayFor, words } from "@/today";
import type { WalkProps } from "@/walk";

type HomeProps = WalkProps & {
  day: Day;
  household: string | null;
  onAsk: (question: string, answer: PillId | null) => void;
  /** Brings up the chat without a question. */
  onChat: () => void;
  onAction: AnswerProps["onAction"];
  onHousehold: (id: string) => void;
  /** Opens the Callahans' shop results. */
  onResults: () => void;
  onPolicyholders: () => void;
};

/**
 * The homepage: a greeting and a box to ask anything, with three questions
 * written out inside it so Stacey doesn't have to think of them. Asking docks
 * a chat along the bottom. It has to be readable before coffee, so under that
 * sit only the three sections, most pressing first, each holding just what
 * needs her. On Friday a sentence on the day, and its one button, sit between
 * the greeting and the box. Monday, Wednesday and Thursday open on a band
 * instead, as the Monday email does, with the greeting and the day's first
 * thing, so what's first is part of the greeting.
 */
export function Home(props: HomeProps) {
  if (props.day === "mon") return <Monday {...props} />;
  if (props.day === "wed") return <Wednesday {...props} />;
  if (props.day === "thu") return <Thursday {...props} />;
  return <Weekday {...props} />;
}

/**
 * The band Monday, Wednesday and Thursday open on: "Good morning", as the
 * Monday email greets Stacey, then what's under it: Monday's and Thursday's
 * first section, its title centered over its card, and Wednesday's line on
 * the day with the ask box under it. Monday's and Thursday's is the blue band
 * under the mountain, as the email's is; Wednesday's is the design hub's gray
 * band under the ridge, the quieter of the two for a day that needs nothing.
 */
function Hero({ ground, children }: { ground: "blue" | "gray"; children: ReactNode }) {
  const blue = ground === "blue";
  return (
    <div className={cn(blue ? "band-surface" : "band-gray", "relative isolate overflow-clip")}>
      <BandGrain texture={blue ? "mountain" : "ridge"} />
      <div className="shell py-(--space-section)">
        <div className="mx-auto max-w-180">
          <h1 id="home-title" className="text-center text-5xl text-balance">
            Good morning, {agency.agent.first}
          </h1>
          <div className="mt-(--space-block)">{children}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * Monday: Closing on the band, titled with how many renewals close this week,
 * then the other two sections on the page. A brief or the ask box would only
 * stand between Stacey and them, so the way to ask comes after, as one link
 * under Closing that brings up the chat.
 */
function Monday({ day, onChat, ...props }: HomeProps) {
  const n = mondayNeeds("closing").length;
  return (
    <>
      <Hero ground="blue">
        <Closing
          day={day}
          centered
          title={`You have ${words[n].toLowerCase()} ${n === 1 ? "renewal" : "renewals"} closing this week.`}
          {...props}
        />
        <AskLink onChat={onChat} />
      </Hero>
      <div className="shell pb-(--space-section)">
        <div className="mx-auto max-w-180">
          <Sections day={day} closing={false} {...props} />
        </div>
      </div>
    </>
  );
}

/**
 * Thursday: the Callahans' shop on the band, as Monday sets Closing there,
 * titled with what happened, and the same link under it to ask. Their row is
 * Elena's and Raymond's from Monday, and it opens the results in a modal. Once the
 * recommendation has gone to Dana, or if Stacey skipped the Callahans, the
 * band says so in place of the card. Below the band, only what goes out on
 * its own: there's nothing to close on Thursday, so Closing isn't drawn, and
 * Shopped is in the band.
 */
function Thursday({ day, walk, onChat, ...props }: HomeProps) {
  const skipped = walk.skipped.includes(callahan.id);
  return (
    <>
      <Hero ground="blue">
        {skipped || walk.recSent ? (
          <p className="text-center font-display text-xl font-medium text-balance">
            {skipped
              ? "Nothing needs you today."
              : "Your recommendation went to Dana and Mike. We'll let you know when they answer."}
          </p>
        ) : (
          <Shopped
            day={day}
            walk={walk}
            centered
            title="Shopping has been completed for Dana and Mike Callahan."
            {...props}
          />
        )}
        <AskLink onChat={onChat} />
      </Hero>
      <div className="shell pb-(--space-section)">
        <div className="mx-auto mt-(--space-section) max-w-180">
          <Scheduled day={day} walk={walk} {...props} />
        </div>
      </div>
    </>
  );
}

/**
 * The way to ask on a blue band, under what's first: one link that brings up
 * the chat. It's white and underlined, the band's link, since the kit's blue
 * link would vanish on the blue.
 */
function AskLink({ onChat }: { onChat: () => void }) {
  return (
    <div className="mt-(--space-tight) flex justify-center">
      <Button variant="link" className="h-auto p-0 font-sans text-sm text-primary-foreground underline" onClick={onChat}>
        Looking for something? Ask us anything.
      </Button>
    </div>
  );
}

/**
 * Wednesday: the day's line on the gray band, set as Monday's title under the
 * greeting is, and the ask box under it, as Thursday and Friday have it, with
 * one link under the box to the Policyholder List, for a day with nothing to
 * act on; then what goes out on its own below the band. Nothing to close and
 * nothing back from a shop, so those sections aren't drawn. The link is the
 * kit's blue, underlined as Monday's band link is, since the gray band keeps
 * the page's colors.
 */
function Wednesday({ day, walk, onAsk, onPolicyholders, ...props }: HomeProps) {
  return (
    <>
      <Hero ground="gray">
        <p className="text-center font-display text-xl font-medium text-balance">{todayFor(day, walk).lead}</p>
        <AskBox label="Ask me anything" className="mt-10" onAsk={(q) => onAsk(q, matchPill(q))}>
          <Suggestions ids={suggested} size="sm" onAsk={(id) => onAsk(pillById(id).question, id)} />
        </AskBox>
        <div className="mt-(--space-tight) flex justify-center">
          <Button variant="link" className="h-auto p-0 font-sans text-sm underline" onClick={onPolicyholders}>
            Want to review progress on your full book? View your Policyholder List.
          </Button>
        </div>
      </Hero>
      <div className="shell pb-(--space-section)">
        <div className="mx-auto mt-(--space-section) max-w-180">
          <Scheduled day={day} walk={walk} {...props} />
        </div>
      </div>
    </>
  );
}

function Weekday({ day, walk, update, onAsk, onAction, ...props }: HomeProps) {
  const today = todayFor(day, walk);

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

        <AskBox label="Ask me anything" className="mt-10" onAsk={(q) => onAsk(q, matchPill(q))}>
          <Suggestions ids={suggested} size="sm" onAsk={(id) => onAsk(pillById(id).question, id)} />
        </AskBox>

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
