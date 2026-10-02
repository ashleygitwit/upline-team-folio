import { boardFor } from "@/board";
import { pruitt, money, optionById, options, type Day } from "@/data";
import type { Walk } from "@/walk";

export const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * What needs Jenna, by the names the Monday email heads its lists with
 * (MondayEmail.tsx), recommendations first: "10 recommendations ready to send
 * and 4 policies to bind", or nothing.
 */
function toDos(ready: number, toBind: number): string | null {
  const needs = [
    ready && count(ready, "recommendation ready to send", "recommendations ready to send"),
    toBind && count(toBind, "policy to bind", "policies to bind"),
  ].filter(Boolean);
  return needs.length ? needs.join(" and ") : null;
}

/**
 * What's going on, in one line, by day and by what the presenter has done so
 * far, counted off the board, with what needs Jenna first. Monday counts
 * what's waiting on Jenna and what's going out; Wednesday has nothing to send
 * or bind; Thursday counts what's waiting on Jenna, starting with the
 * Pruitts; Friday follows the Pruitts. Renewals running short on time are the
 * board's to show, by their countdowns, so the line doesn't count them. The
 * homepage says it under its greeting (Home.tsx), and the Monday email opens
 * on Monday's (MondayEmail.tsx). Until 2026-10-02 Thursday led with the shop
 * ("Shopping is done for Leah and Tom Pruitt and 2 others. Their
 * recommendations are ready to send."), and once the Pruitts' had gone, with
 * theirs, and the rest after (Ashley's review: to-dos first).
 */
export function lineFor(day: Day, walk: Walk): string {
  const board = boardFor(day, walk);
  const ready = board.ready.length;
  const toBind = board.sent.filter((e) => e.approved).length;
  const todo = toDos(ready, toBind);
  const skipped = walk.skipped.includes(pruitt.id);

  if (day === "mon") {
    const going = `Tomorrow at 9 AM, ${count(board.scheduled.length, "renewal email goes", "renewal emails go")} out.`;
    return todo ? `You have ${todo}. ${going}` : `Nothing to send or bind today. ${going}`;
  }

  if (day === "wed") {
    return skipped
      ? "Nothing to send or bind today. This week's renewal emails went out Tuesday."
      : "Nothing to send or bind today. This week's renewal emails went out Tuesday, and the Pruitts are being shopped.";
  }

  if (day === "thu") {
    if (skipped) return todo ? `You have ${todo}.` : "Nothing to send or bind today.";
    if (walk.recSent) {
      const sent = "Your recommendation went to Leah and Tom. We'll let you know when they answer.";
      return todo ? `You have ${todo}. ${sent}` : sent;
    }
    return ready > 1
      ? `You have ${todo}, starting with Leah and Tom Pruitt's.`
      : "Leah and Tom Pruitt's recommendation is ready to send.";
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
