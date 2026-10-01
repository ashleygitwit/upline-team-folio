import { boardFor } from "@/board";
import { agency, pruitt, dayName, money, optionById, options, type Day } from "@/data";
import { Board, type BoardProps } from "@/screens/upline/Board";
import type { Walk } from "@/walk";

/**
 * The homepage, the same every day: a greeting, the day's line, then the
 * board. The header is set as the v3 Policyholder List's was, left-aligned
 * with the room above it that page had (its 40px, the Home link and 40px
 * more), and the board follows at that page's gaps. The blue band that sat
 * here came off on 2026-09-30, after the board replaced the Action Needed and Scheduled Emails sections (the
 * Policyholder List went with them, since the board is the whole book now).
 * The toolbar between them, Needs me and a name search, came off on
 * 2026-10-01.
 *
 * The header and the board take v3's Policyholder List width too, at most
 * 1280, centered, so a wide window leaves room either side (Upline's bar
 * follows, so the mark keeps their edge). The board has no height of its
 * own, as v3's had none: it's as long as its longest column, and the page
 * scrolls. Until 2026-10-01 it was one screen tall, at most 800px, with each
 * column scrolling inside itself once the page had scrolled it whole into
 * view.
 */
export function Home({ day, walk, ...props }: BoardProps) {
  return (
    <>
      {/* The toolbar under the line (Needs me and search) came off on
          2026-10-01, so the board follows the line at the 32px the toolbar
          did. */}
      <div className="shell max-w-7xl pt-25 pb-4">
        <h1 id="home-title" className="text-4xl">
          {day === "fri" ? `Happy ${dayName[day]}` : "Good morning"}, {agency.agent.first}
        </h1>
        <p aria-live="polite" className="mt-2 font-display text-lg text-muted-foreground">
          {lineFor(day, walk)}
        </p>
      </div>

      <div className="shell max-w-7xl pt-4 pb-6">
        <Board day={day} walk={walk} {...props} />
      </div>
    </>
  );
}

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * What's going on, in one line, by day and by what the presenter has done so
 * far, counted off the board. Monday counts what's waiting on Jenna and
 * what's going out; Wednesday has nothing to send or bind; Thursday and
 * Friday follow the Pruitts. Renewals running short on time are the board's
 * to show, with their accents, so the line doesn't count them.
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
