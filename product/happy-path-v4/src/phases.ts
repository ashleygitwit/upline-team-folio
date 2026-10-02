import { boardFor, columns as steps, daysUntil, type ColumnId, type Entry } from "@/board";
import { dayDate, earlier, optionById, pruitt, thisWeek, type Day } from "@/data";
import { pools } from "@/pipeline";
import { renewalDate } from "@/tasks";
import type { Walk } from "@/walk";

/**
 * The homepage's board in four columns, one for each phase of a renewal, with
 * a status on every card saying where in the phase it is (Board.tsx). It was
 * an experiment beside the six-column board, one column for each step, from
 * 2026-10-01, behind a switch in the presenter bar, and replaced it the same
 * day.
 *
 * Every household goes where its step says (board.ts, which still works the
 * week out step by step) and keeps that step (`step`), so the walk and the
 * deadlines work as they did, and its card says what that step's card said.
 * The one thing new is a wait the six steps don't have, Closing's Awaiting
 * Response: the household said yes, and Jenna is waiting on them for what
 * binding needs (a signature, the first payment, the signed application).
 * Nothing in the walk gets there, since an approval in the walk is bound and
 * closed out straight from Ready for Review, so it's three of the invented
 * households that finished before the walk's day. (For part of 2026-10-01 it
 * meant bound and waiting on the carrier to confirm.)
 */
export type PhaseId = "initial-outreach" | "shopping-renewal" | "closing" | "completed";
export type PhaseStatus = "scheduled" | "inProgress" | "readyForReview" | "awaitingResponse";

/**
 * The four columns, all as wide as each other. (Completed was half as wide
 * for part of 2026-10-01, when its cards were names alone; they say when
 * each was completed now.) Every column opens on all its statuses
 * (Board.tsx). For part of 2026-10-01 the others each opened on one, what
 * Jenna most likely came to it for: Scheduled, and Ready for Review in
 * Shopping Renewal and Closing.
 */
export const phases: {
  id: PhaseId;
  label: string;
  mini?: boolean;
  statuses: PhaseStatus[];
  empty: string;
}[] = [
  {
    id: "initial-outreach",
    label: "Initial Outreach",
    mini: true,
    statuses: ["scheduled", "awaitingResponse"],
    empty: "Nothing scheduled or waiting.",
  },
  {
    id: "shopping-renewal",
    label: "Shopping Renewal",
    statuses: ["inProgress", "readyForReview", "awaitingResponse"],
    empty: "Nothing being shopped.",
  },
  {
    id: "closing",
    label: "Closing",
    statuses: ["readyForReview", "awaitingResponse"],
    empty: "Nothing to close.",
  },
  { id: "completed", label: "Completed", mini: true, statuses: [], empty: "Nothing finished yet." },
];

export const statusLabel: Record<PhaseStatus, string> = {
  scheduled: "Scheduled",
  inProgress: "In Progress",
  readyForReview: "Ready for Review",
  awaitingResponse: "Awaiting Response",
};

/**
 * When a scheduled renewal email goes out, as its status says it: the walk's
 * Monday emails go tomorrow, Tuesday, and from Wednesday Scheduled holds next
 * week's, which go the coming Tuesday. Both at 9 AM, as the drawer's banner
 * says ("Renewal email scheduled for Tues 9AM.").
 */
export const sendsAt = (day: Day) => (day === "mon" ? "Tomorrow, 9 AM" : "Tuesday, 9 AM");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const short = (d: Date) => `${months[d.getMonth()]} ${d.getDate()}`;
const daysBefore = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - n);

/** The Friday before the walk's week. */
const lastFriday = daysBefore(dayDate.mon, 3);

/**
 * The day a completed renewal was closed out, "Oct 9", as its Completed card
 * says it on the far right. Nothing in the walk keeps it, so it's worked out
 * to agree with the drawers: a household skipped on the day it was skipped;
 * the Pruitts on Friday; this week's other named households that finished
 * (Andy Pham, staying with Erie) on Tuesday, when they answered the renewal
 * email; the earlier weeks' named households on Monday, when Jenna clears
 * them; of Monday's sent recommendations, the two already approved on Monday
 * too (Lena Park's drawer says Monday at 4:00 PM) and the rest on Tuesday,
 * once they answered; and anyone finished before the week 13 days before the
 * renewal, as Grace Tanaka was (Oct 2, for Oct 15), and no later than the
 * Friday before it.
 */
export function completedOn(e: Entry, walk: Walk): string {
  if (walk.skipped.includes(e.id)) return short(dayDate[walk.outreachOn[e.id] ?? "mon"]);
  if (e.id === pruitt.id) return short(dayDate.fri);
  if (thisWeek.some((x) => x.id === e.id)) return short(daysBefore(dayDate.wed, 1));
  if (earlier.some((x) => x.id === e.id)) return short(dayDate.mon);
  const sent = pools.sent.findIndex((h) => h.id === e.id);
  if (sent >= 0) return short(sent < 2 ? dayDate.mon : daysBefore(dayDate.wed, 1));
  const before = daysBefore(renewalDate(e.renews), 13);
  return short(before < lastFriday ? before : lastFriday);
}

/** Every invented household, by id, for a first card (firstCards.ts), which no longer carries its own. */
const invented = new Map(Object.values(pools).flatMap((pool) => pool.map((h) => [h.id, h] as const)));

/**
 * What a completed renewal ended up costing, as its Completed row says it
 * under the name: the new carrier's price when it moved, and the renewal's
 * when it stayed, renewed as it was without an answer, or was skipped. The
 * Pruitts' is Jenna's pick in the walk; an earlier week's that moved has its
 * price on file (`bound` in data.ts).
 */
export function endCost(e: Entry, walk: Walk): number {
  if (walk.skipped.includes(e.id)) return e.now;
  if (e.id === pruitt.id) return optionById(walk.pick).price;
  const bound = earlier.find((x) => x.id === e.id)?.bound;
  if (bound) return bound;
  const h = e.invented?.h ?? invented.get(e.id);
  if (!h) return e.now;
  const detail = e.invented?.detail ?? e.detail ?? "";
  return detail.startsWith("Bound with") || detail.startsWith("Staying") ? h.shop.price : e.now;
}

/** A household on the board: its entry, its step (board.ts), and its status. */
export type Placed = { e: Entry; step: ColumnId; status?: PhaseStatus };

/**
 * Where a step lands. A sent recommendation is still Shopping Renewal's,
 * waiting on a yes; once they've said it, the household is Closing's, ready
 * for Jenna to bind it and close it out.
 */
function phaseOf(e: Entry, step: ColumnId): { phase: PhaseId; status?: PhaseStatus } {
  switch (step) {
    case "scheduled":
      return { phase: "initial-outreach", status: "scheduled" };
    case "awaiting":
      return { phase: "initial-outreach", status: "awaitingResponse" };
    case "shopping":
      return { phase: "shopping-renewal", status: "inProgress" };
    case "ready":
      return { phase: "shopping-renewal", status: "readyForReview" };
    case "sent":
      return e.approved
        ? { phase: "closing", status: "readyForReview" }
        : { phase: "shopping-renewal", status: "awaitingResponse" };
    case "completed":
      return { phase: "completed" };
  }
}

/** How many of Completed's invented households are still waiting on the policyholder, in Closing. */
const waitingOnPolicyholder = 3;

/** What binding still needs from the household, a different one on each of Closing's waiting cards. */
const stillNeeds = ["signature", "first payment", "signed application"];

/**
 * Every column's households on the walk's day, soonest renewal first whatever
 * the status, so a card running short on time rises to the top. Closing's
 * three waiting on the policyholder are the invented households in
 * Completed that switched carriers (not ones that stayed or renewed as is)
 * with the latest renewals, ahead of a renewal still to come, and no two with
 * the same new carrier, so the column doesn't read as one card three times
 * (Monday's three latest all went to Erie). Each says what they approved and
 * what binding is waiting on from them. They keep Completed's step, so they
 * never count down and the Monday email leaves them be.
 */
export function phasesFor(day: Day, walk: Walk): Record<PhaseId, Placed[]> {
  const board = boardFor(day, walk);
  const placed: Record<PhaseId, Placed[]> = {
    "initial-outreach": [],
    "shopping-renewal": [],
    closing: [],
    completed: [],
  };
  for (const { id: step } of steps) {
    for (const e of board[step]) {
      const { phase, status } = phaseOf(e, step);
      placed[phase].push({ e, step, status });
    }
  }

  const bound = placed.completed.filter(
    ({ e }) => e.invented?.detail?.startsWith("Bound with") && daysUntil(e.renews, day) > 0,
  );
  const waiting: Placed[] = [];
  for (const p of bound.reverse()) {
    const carrier = p.e.invented!.h.shop.pick;
    if (waiting.some((w) => w.e.invented!.h.shop.pick === carrier)) continue;
    waiting.push(p);
    if (waiting.length === waitingOnPolicyholder) break;
  }
  waiting.forEach((p, i) => {
    const { h } = p.e.invented!;
    placed.completed.splice(placed.completed.indexOf(p), 1);
    const detail = `${h.first} approved ${h.shop.pick}. Waiting on ${h.first}'s ${stillNeeds[i]} to bind it.`;
    placed.closing.push({
      e: { ...p.e, invented: { h, detail } },
      step: "completed",
      status: "awaitingResponse",
    });
  });

  const soonest = (a: Placed, b: Placed) => renewalDate(a.e.renews).getTime() - renewalDate(b.e.renews).getTime();
  for (const list of Object.values(placed)) list.sort(soonest);
  return placed;
}

/**
 * Where a household is on the four-column board, as its drawer's header says
 * it under the name (PlaceLine in components/Status.tsx): the column, and the
 * status in it, or none for Completed.
 */
export function placeOf(id: string, day: Day, walk: Walk): { phase: string; status?: PhaseStatus } | null {
  const placed = phasesFor(day, walk);
  for (const p of phases) {
    const found = placed[p.id].find(({ e }) => e.id === id);
    if (found) return { phase: p.label, status: found.status };
  }
  return null;
}
