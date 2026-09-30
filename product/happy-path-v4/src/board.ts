import { dayDate, earlier, thisWeek, type Day } from "@/data";
import { cards } from "@/household/data";
import { pickLine, pools, shopLine, type Invented } from "@/pipeline";
import { statusFor } from "@/status";
import type { Walk } from "@/walk";

/**
 * The homepage's board: where every renewal stands on the walk's day, in six
 * columns (Amanda's sketch, 2026-09-30). The first three are mini, one line a
 * household, since nothing in them needs Jenna: the emails go on their own,
 * the answers come in on their own, and Upline shops on its own. The last
 * three are full cards: Recommendation Ready needs her as soon as it can
 * (ideally it's empty), Recommendation Sent is where renewals stall while the
 * clock runs down to the renewal, and Completed can be hidden.
 */
export type ColumnId = "scheduled" | "awaiting" | "shopping" | "ready" | "sent" | "completed";

export const columns: { id: ColumnId; label: string; mini?: boolean }[] = [
  { id: "scheduled", label: "Scheduled", mini: true },
  { id: "awaiting", label: "Awaiting Response", mini: true },
  { id: "shopping", label: "Shopping", mini: true },
  { id: "ready", label: "Recommendation Ready" },
  { id: "sent", label: "Recommendation Sent" },
  { id: "completed", label: "Completed" },
];

/**
 * One household on the board. A named household (`invented` unset) is drawn
 * from the walk, since what's on its card follows what the presenter did; an
 * invented one carries the line its card says.
 */
export type Entry = {
  id: string;
  name: string;
  carrier: string;
  /** "Home + Auto" */
  lines: string;
  renews: string;
  increase: number;
  /** Said yes and waiting to be bound: its card turns blue. */
  approved?: boolean;
  invented?: { h: Invented; detail?: string };
};

/* ------------------------------------------------------------------ *
 * The named twelve
 * ------------------------------------------------------------------ */

const statusColumn: Record<string, ColumnId> = {
  Sent: "awaiting",
  Opened: "awaiting",
  Started: "awaiting",
  Shopping: "shopping",
  "Ready for you": "ready",
  "Sent to Leah": "sent",
  Approved: "sent",
  Done: "completed",
  Staying: "completed",
  Skipped: "completed",
};

/**
 * Earlier weeks' six on Monday, as Ashley's board has them, and after, once
 * Jenna clears them Monday afternoon, off-camera.
 */
function earlierColumn(id: string, day: Day, walk: Walk): ColumnId {
  if (day === "mon") {
    if (id === "rao" || id === "yates") return "shopping";
    if (id === "marin" || id === "kemp") return walk.recsSent.includes(id) ? "sent" : "ready";
    return walk.closed[id] === undefined ? "sent" : "completed";
  }
  return id === "rao" || id === "yates" || id === "marin" ? "sent" : "completed";
}

/** Where a named household stands on the walk's day. */
export function namedColumn(id: string, day: Day, walk: Walk): ColumnId {
  const h = thisWeek.find((x) => x.id === id);
  if (!h) return earlierColumn(id, day, walk);
  if (walk.skipped.includes(id)) return "completed";
  if (day === "mon") return "scheduled";
  return statusColumn[statusFor(h, day, walk).label] ?? "awaiting";
}

/** Whether a named household has said yes and is waiting for Jenna to bind it. */
function namedApproved(id: string, day: Day, walk: Walk) {
  if (day === "mon") return (id === "mercer" || id === "iyer") && walk.closed[id] === undefined;
  const h = thisWeek.find((x) => x.id === id);
  return !!h && day !== "wed" && statusFor(h, day, walk).label === "Approved";
}

function named(id: string, day: Day, walk: Walk): Entry {
  const c = cards.find((x) => x.id === id)!;
  return {
    id,
    name: c.name,
    carrier: c.carrier,
    lines: c.lines.split(" · ")[0],
    renews: c.renewal,
    increase: c.premium - c.was,
    approved: namedApproved(id, day, walk),
  };
}

/* ------------------------------------------------------------------ *
 * The invented pipeline, moved day by day
 * ------------------------------------------------------------------ */

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "3 days ago", from a date like "Oct 9" to the walk's day. */
function since(on: string, day: Day) {
  const [mon, date] = on.split(" ");
  const d = Math.round((dayDate[day].getTime() - new Date(2026, months.indexOf(mon), Number(date)).getTime()) / 86_400_000);
  return d === 0 ? "today" : d === 1 ? "yesterday" : `${d} days ago`;
}

function invented(h: Invented, detail?: string, approved?: boolean): Entry {
  return {
    id: h.id,
    name: h.name,
    carrier: h.carrier,
    lines: h.lines,
    renews: h.renews,
    increase: h.now - h.was,
    approved,
    invented: { h, detail },
  };
}

const waiting = (h: Invented, on: string, day: Day) =>
  invented(h, `Recommended ${pickLine(h)}. Sent ${since(on, day)}, no answer yet.`);

const done = (h: Invented, i: number) =>
  invented(
    h,
    i % 4 === 3 && !h.shop.staying
      ? "No answer before the renewal. Renewed as is."
      : h.shop.staying
        ? `Staying with ${h.carrier}.`
        : `Bound with ${pickLine(h)}.`,
  );

function inventedFor(day: Day): Record<ColumnId, Entry[]> {
  const { nextWeek, thisWeek: w1, awaiting: aw, shopping: sh, ready: rd, sent: sn, completed: cp } = pools;
  const sentMon = sn.map((h, i) =>
    i < 2
      ? invented(
          h,
          h.shop.staying
            ? `${h.first} ${h.first.includes(" and ") ? "are" : "is"} staying with ${h.carrier}. Bind the renewal before ${h.renewsLong}.`
            : `${h.first} approved ${h.shop.pick}. Bind it in the portal before ${h.renewsLong}.`,
          true,
        )
      : waiting(h, `Oct ${5 + (i % 5)}`, day),
  );

  if (day === "mon") {
    return {
      scheduled: w1.map((h) => invented(h)),
      awaiting: aw.map((h) => invented(h)),
      shopping: sh.map((h) => invented(h)),
      ready: rd.map((h) => invented(h, shopLine(h))),
      sent: sentMon,
      completed: cp.map(done),
    };
  }

  // From Wednesday: Tuesday's emails are out and waiting, except two who
  // answered Tuesday night, as Leah did, and move with the Pruitts: shopped
  // Wednesday, back Thursday, sent Thursday afternoon. The waiting pool's
  // soonest seven answered and are being shopped, and the rest of its
  // earliest renewals renewed as they were, off the board. Monday's ready
  // went out Monday afternoon, half of Monday's shops went out Tuesday, and
  // Monday's sent all answered. From Thursday a few more of Tuesday's answer
  // each day.
  const fast = w1.slice(-2);
  const tuesday = w1.slice(0, -2);
  const answered = aw.slice(0, 7);
  const stillWaiting = aw.slice(44);
  const sent = [...rd.map((h) => waiting(h, "Oct 12", day)), ...sh.slice(0, 4).map((h) => waiting(h, "Oct 13", day))];
  const completed = [...sn.map(done), ...cp.slice(0, 3).map(done)];
  const back = day === "wed" ? 0 : day === "thu" ? 3 : 6;

  return {
    scheduled: nextWeek.map((h) => invented(h)),
    awaiting: [...tuesday.slice(back), ...stillWaiting].map((h) => invented(h)),
    shopping: [...answered, ...tuesday.slice(0, back), ...(day === "wed" ? fast : [])].map((h) => invented(h)),
    ready: day === "thu" ? fast.map((h) => invented(h, shopLine(h))) : [],
    sent: day === "fri" ? [...sent, ...fast.map((h) => waiting(h, "Oct 15", day))] : sent,
    completed,
  };
}

/* ------------------------------------------------------------------ *
 * The board
 * ------------------------------------------------------------------ */

const when = (renews: string) => Date.parse(`${renews} 2026`);

const namedIds = [...thisWeek.map((h) => h.id), ...earlier.map((e) => e.id)];

/**
 * Every column's households on the walk's day. Scheduled runs biggest
 * increase first, as the Monday email lists it, since that's who is likeliest
 * to shop on their own; every other column runs soonest renewal first.
 */
export function boardFor(day: Day, walk: Walk): Record<ColumnId, Entry[]> {
  const board = inventedFor(day);
  for (const id of namedIds) board[namedColumn(id, day, walk)].push(named(id, day, walk));
  for (const col of columns) {
    board[col.id].sort(
      col.id === "scheduled" ? (a, b) => b.increase - a.increase : (a, b) => when(a.renews) - when(b.renews),
    );
  }
  return board;
}

/** Monday's 48, for the Monday email: this week's six and the rest, biggest increase first. */
export const mondayScheduled = () =>
  [...thisWeek.map((h) => ({ id: h.id, name: h.name, carrier: h.carrier, increase: h.now - h.was })),
    ...pools.thisWeek.map((h) => ({ id: h.id, name: h.name, carrier: h.carrier, increase: h.now - h.was }))]
    .sort((a, b) => b.increase - a.increase);
