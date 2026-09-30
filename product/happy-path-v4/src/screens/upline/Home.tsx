import { BandGrain } from "@/components/BandGrain";
import { boardFor } from "@/board";
import { agency, pruitt, dayName, money, optionById, options, type Day } from "@/data";
import { Board, type BoardProps } from "@/screens/upline/Board";
import type { Walk } from "@/walk";

/**
 * The homepage, the same every day: the band, then the board. It has to be
 * readable before coffee, so the band only greets Jenna and says in one line
 * what needs her; everything else is on the board, which fills the rest of
 * the screen. The board replaced the Action Needed and Scheduled Emails
 * sections on 2026-09-30, and the Policyholder List went with them, since
 * the board is the whole book now.
 */
export function Home({ day, walk, ...props }: BoardProps) {
  return (
    <div className="flex h-[calc(100svh-var(--demo-bar-h)-4rem-1px)] min-h-[36rem] flex-col">
      <Hero day={day} walk={walk} />
      <div className="min-h-0 flex-1 px-4 py-5">
        <Board day={day} walk={walk} {...props} />
      </div>
    </div>
  );
}

/**
 * The band: the design hub homepage's blue under the mountain, as the Monday
 * email opens. A greeting for the day and the day's line. It never holds a
 * card or a button, so it reads the same every day. It's shorter than it was
 * over the sections, so the board gets the screen.
 */
function Hero({ day, walk }: { day: Day; walk: Walk }) {
  return (
    <div className="band-surface relative isolate shrink-0 overflow-clip">
      <BandGrain />
      <div className="shell py-8">
        <div className="mx-auto max-w-240 text-center">
          <h1 id="home-title" className="text-4xl text-balance">
            {day === "fri" ? `Happy ${dayName[day]}` : "Good morning"}, {agency.agent.first}
          </h1>
          <p aria-live="polite" className="mt-3 font-display text-lg font-medium text-balance">
            {lineFor(day, walk)}
          </p>
        </div>
      </div>
    </div>
  );
}

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * What's going on, in one line, by day and by what the presenter has done so
 * far, counted off the board. Monday counts what needs Jenna and what's going
 * out; Wednesday has nothing that needs her; Thursday and Friday follow the
 * Pruitts.
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
    return needs.length ? `You have ${needs.join(" and ")}. ${going}` : `Nothing needs you today. ${going}`;
  }

  if (day === "wed") {
    return skipped
      ? "Nothing needs you today. This week's renewal emails went out Tuesday."
      : "Nothing needs you today. This week's renewal emails went out Tuesday, and the Pruitts are being shopped.";
  }

  const others = board.ready.filter((e) => e.id !== pruitt.id).length;
  const more = others ? ` ${count(others, "more is", "more are")} ready to send.` : "";

  if (day === "thu") {
    if (skipped) return others ? `${count(others, "recommendation is", "recommendations are")} ready to send.` : "Nothing needs you today.";
    if (walk.recSent) return `Your recommendation went to Leah and Tom. We'll let you know when they answer.${more}`;
    return others
      ? `Shopping is done for Leah and Tom Pruitt and ${count(others, "other", "others")}. Their recommendations are ready to send.`
      : "Shopping has been completed for Leah and Tom Pruitt.";
  }

  if (skipped) return "Nothing needs you today.";
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
