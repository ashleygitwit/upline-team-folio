import { boardFor, columns as steps, daysUntil, type ColumnId, type Entry } from "@/board";
import type { Day } from "@/data";
import { renewalDate } from "@/tasks";
import type { Walk } from "@/walk";

/**
 * An experiment, from 2026-10-01: the homepage's board in four columns, one
 * for each phase of a renewal, with a status on every card saying where in
 * the phase it is, in place of a column for every step (board.ts). The
 * presenter bar's 4 columns switch turns it on (`fourColumns` in walk.ts);
 * off, the default, the board is the six columns.
 *
 * Every household goes where its step on the six-column board says, and keeps
 * that step (`step`), so the walk, the deadlines and Needs me work as they do
 * there, and its card says what that step's card says. The one thing new is
 * a wait the six columns don't have, Closing's Awaiting Response: bound, and
 * waiting on the carrier to confirm. Nothing in the walk gets there, since
 * closing out still goes straight to Completed, so it's three of the
 * invented households bound before the walk's day.
 *
 * To take the experiment out, delete this file and what imports it.
 */
export type PhaseId = "initial-outreach" | "shopping-renewal" | "closing" | "completed";
export type PhaseStatus = "scheduled" | "inProgress" | "readyForReview" | "awaitingResponse";

/**
 * The four columns. Completed is `narrow`, half as wide as the others, since
 * its lines are names alone.
 */
export const phases: {
  id: PhaseId;
  label: string;
  mini?: boolean;
  narrow?: boolean;
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
  { id: "closing", label: "Closing", statuses: ["readyForReview", "awaitingResponse"], empty: "Nothing to close." },
  { id: "completed", label: "Completed", mini: true, narrow: true, statuses: [], empty: "Nothing finished yet." },
];

export const statusLabel: Record<PhaseStatus, string> = {
  scheduled: "Scheduled",
  inProgress: "In Progress",
  readyForReview: "Ready for Review",
  awaitingResponse: "Awaiting Response",
};

/** A household on the four-column board: its entry, its step on the six-column board, and its status. */
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

/** How many of Completed's invented households are still waiting on the carrier to confirm. */
const waitingOnCarrier = 3;

/**
 * Every column's households on the walk's day, soonest renewal first whatever
 * the status, so a red or yellow card rises to the top. Closing's three
 * waiting on the carrier are the invented households in Completed that
 * switched carriers (not ones that stayed or renewed as is) with the latest
 * renewals, bound recently, ahead of a renewal still to come, and no two with
 * the same new carrier, so the column doesn't read as one card three times
 * (Monday's three latest all went to Erie). They keep Completed's step, so
 * they never flag and Needs me leaves them be.
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
    if (waiting.length === waitingOnCarrier) break;
  }
  for (const p of waiting) {
    const { h } = p.e.invented!;
    placed.completed.splice(placed.completed.indexOf(p), 1);
    placed.closing.push({
      e: { ...p.e, invented: { h, detail: `Bound with ${h.shop.pick}. Waiting on ${h.shop.pick} to confirm.` } },
      step: "completed",
      status: "awaitingResponse",
    });
  }

  const soonest = (a: Placed, b: Placed) => renewalDate(a.e.renews).getTime() - renewalDate(b.e.renews).getTime();
  for (const list of Object.values(placed)) list.sort(soonest);
  return placed;
}

/**
 * Where a household is on the four-column board, as its drawer says it over
 * its name: "Initial Outreach · Scheduled", or "Completed".
 */
export function phaseLabel(id: string, day: Day, walk: Walk): string | null {
  const placed = phasesFor(day, walk);
  for (const p of phases) {
    const found = placed[p.id].find(({ e }) => e.id === id);
    if (found) return found.status ? `${p.label} · ${statusLabel[found.status]}` : p.label;
  }
  return null;
}
