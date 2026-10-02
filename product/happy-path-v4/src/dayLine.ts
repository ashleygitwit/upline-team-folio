import { boardFor } from "@/board";
import { pruitt, money, optionById, options, type Day } from "@/data";
import type { Walk } from "@/walk";

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * What's going on, in one line, by day and by what the presenter has done so
 * far, counted off the board. Monday counts what's waiting on Jenna and
 * what's going out; Wednesday has nothing to send or bind; Thursday and
 * Friday follow the Pruitts. Renewals running short on time are the board's
 * to show, with their accents, so the line doesn't count them. The homepage
 * says it under its greeting (Home.tsx), and the Monday email opens on
 * Monday's (MondayEmail.tsx).
 */
export function lineFor(day: Day, walk: Walk): string {
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
