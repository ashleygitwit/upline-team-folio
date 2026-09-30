import { useState } from "react";
import { boardFor, needsMe } from "@/board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { agency, pruitt, dayName, money, optionById, options, type Day } from "@/data";
import { Board, type BoardProps } from "@/screens/upline/Board";
import type { Walk } from "@/walk";

/**
 * The homepage, the same every day: a greeting, the day's line, the toolbar,
 * then the board, which fills the rest of the screen. The header is set as
 * the v3 Policyholder List's was, left-aligned on the page's edge with the
 * room above it that page had (its 40px, the Home link and 40px more), and
 * the toolbar and board follow at that page's gaps. The blue band that sat
 * here came off on 2026-09-30, after the board replaced the Action Needed and
 * Scheduled Emails sections (the Policyholder List went with them, since the
 * board is the whole book now). The toolbar's search and Needs me are the
 * page's own, so they start clear at every stop.
 */
export function Home({ day, walk, ...props }: BoardProps) {
  const [query, setQuery] = useState("");
  const [needsOnly, setNeedsOnly] = useState(false);
  const needs = needsMe(boardFor(day, walk), day, walk).length;

  return (
    <div className="flex h-[calc(100svh-var(--demo-bar-h)-4rem-1px)] min-h-[36rem] flex-col">
      <div className="shell max-w-none shrink-0 pt-25">
        <h1 id="home-title" className="text-4xl">
          {day === "fri" ? `Happy ${dayName[day]}` : "Good morning"}, {agency.agent.first}
        </h1>
        <p aria-live="polite" className="mt-2 font-display text-lg text-muted-foreground">
          {lineFor(day, walk)}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          {/* Drawn as the Policyholder List's stage buttons were: on is the
              blue outline, so it doesn't compete with a primary action. */}
          <Button
            variant="outline"
            aria-pressed={needsOnly}
            onClick={() => setNeedsOnly((on) => !on)}
            className="aria-pressed:border-primary aria-pressed:text-primary aria-pressed:hover:text-primary"
          >
            Needs me
            <span className="font-mono text-xs font-normal text-muted-foreground">{needs}</span>
          </Button>
          <Input
            type="search"
            aria-label="Search by name"
            placeholder="Search by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72"
          />
        </div>
      </div>

      <div className="shell max-w-none min-h-0 flex-1 pt-4 pb-6">
        <Board day={day} walk={walk} query={query} needsOnly={needsOnly} {...props} />
      </div>
    </div>
  );
}

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * What's going on, in one line, by day and by what the presenter has done so
 * far, counted off the board. Monday counts what's waiting on Jenna and
 * what's going out; Wednesday has nothing to send or bind; Thursday and
 * Friday follow the Pruitts. Renewals running short on time are the board's
 * to show, with their accents and Needs me, so the line doesn't count them.
 */
function lineFor(day: Day, walk: Walk): string {
  const board = boardFor(day, walk);
  const ready = board.ready.length;
  const toBind = board.sent.filter((e) => e.approved).length;
  const skipped = walk.skipped.includes(pruitt.id);

  if (day === "mon") {
    const needs = [
      ready && count(ready, "recommendation ready to send", "recommendations ready to send"),
      toBind && count(toBind, "policy to bind", "policies to bind"),
    ].filter(Boolean);
    const going = `Tomorrow at 9 AM, ${count(board.scheduled.length, "renewal email goes", "renewal emails go")} out.`;
    return needs.length ? `You have ${needs.join(" and ")}. ${going}` : `Nothing to send or bind today. ${going}`;
  }

  if (day === "wed") {
    return skipped
      ? "Nothing to send or bind today. This week's renewal emails went out Tuesday."
      : "Nothing to send or bind today. This week's renewal emails went out Tuesday, and the Pruitts are being shopped.";
  }

  const others = board.ready.filter((e) => e.id !== pruitt.id).length;
  const more = others ? ` ${count(others, "more is", "more are")} ready to send.` : "";

  if (day === "thu") {
    if (skipped) {
      return others
        ? `${count(others, "recommendation is", "recommendations are")} ready to send.`
        : "Nothing to send or bind today.";
    }
    if (walk.recSent) return `Your recommendation went to Leah and Tom. We'll let you know when they answer.${more}`;
    return others
      ? `Shopping is done for Leah and Tom Pruitt and ${count(others, "other", "others")}. Their recommendations are ready to send.`
      : "Shopping has been completed for Leah and Tom Pruitt.";
  }

  if (skipped) return "Nothing to send or bind today.";
  const pick = optionById(walk.pick);
  const erie = options.find((o) => o.current)!;
  if (walk.bound) {
    return pick.current
      ? `Done. The Pruitts are set. Erie renews on ${pruitt.renewsLong}.`
      : `Done. The Pruitts are set. ${pick.carrier} takes over on ${pruitt.renewsLong}, with ${money(erie.price - pick.price)} back for Leah and Tom.`;
  }
  return pick.current
    ? "Leah and Tom are staying with Erie. There's nothing to bind, so close it out from their card below."
    : `Leah and Tom said yes to ${pick.carrier}. Bind it in the ${pick.carrier} portal before ${pruitt.renewsLong}, then close it out from their card below.`;
}
