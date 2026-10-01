import { dayDate, earlier, thisWeek, type Day } from "@/data";
import { cards } from "@/household/data";
import { firstCards } from "@/household/firstCards";
import { pickLine, pools, shopLine, type Invented } from "@/pipeline";
import { statusFor } from "@/status";
import { changeRequested, isSnoozed, renewalDate } from "@/tasks";
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
  /** Last year's premium and this year's renewal. */
  was: number;
  now: number;
  /** The change in dollars, and in percent, rounded. */
  increase: number;
  pct: number;
  /** Said yes and waiting to be bound: its card carries Ready to close. */
  approved?: boolean;
  invented?: { h: Invented; detail?: string };
  /** What a first card's card says (firstCards.ts), since it has no `invented` once it has a drawer. */
  detail?: string;
};

/** The change as a whole percent: 18 for $4,820 → $5,690. */
const pctOf = (was: number, now: number) => Math.round(((now - was) / was) * 100);

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
  // Send now on Monday sends the email then, so the household is waiting on
  // an answer from Monday, as its drawer says.
  if (day === "mon") return walk.approved.includes(id) ? "awaiting" : "scheduled";
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
    was: c.was,
    now: c.premium,
    increase: c.premium - c.was,
    pct: pctOf(c.was, c.premium),
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
    was: h.was,
    now: h.now,
    increase: h.now - h.was,
    pct: pctOf(h.was, h.now),
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
 * Where a first card (firstCards.ts) sits once Jenna has acted on it in the
 * walk, and what its card says: a recommendation sent from its drawer on
 * Monday goes out today, an approval closed out moves to Completed, an email
 * sent early is waiting on an answer, and a skipped one is done. Anything
 * else stays where the pipeline put it, saying what it said.
 */
function placeFirstCard(e: Entry, col: ColumnId, day: Day, walk: Walk): { col: ColumnId; detail?: string; approved?: boolean } {
  const { h, detail } = e.invented!;
  const first = firstCards[e.id].card.first;
  if (walk.skipped.includes(e.id)) return { col: "completed", detail: "Skipped. You're handling this one yourself this time." };
  if (col === "scheduled" && walk.approved.includes(e.id)) return { col: "awaiting" };
  if (day === "mon" && col === "ready" && walk.recsSent.includes(e.id)) {
    return { col: "sent", detail: `Recommended ${pickLine(h)}. Sent today, no answer yet.` };
  }
  if (e.approved) {
    if (walk.closed[e.id] !== undefined) return { col: "completed", detail: `Bound with ${pickLine(h)}.` };
    return {
      col,
      detail: `${first} approved ${h.shop.pick}. Bind it in the portal before ${h.renewsLong}.`,
      approved: true,
    };
  }
  return { col, detail };
}

/**
 * The first cards, drawn as the named households are, with a drawer, in the
 * places the pipeline gives them, and moved as the walk says. One that stays
 * in its column keeps its place there, so it's still the first card.
 */
function placeFirstCards(board: Record<ColumnId, Entry[]>, day: Day, walk: Walk) {
  const moved: [ColumnId, Entry][] = [];
  for (const { id: col } of columns) {
    board[col] = board[col].flatMap((e) => {
      if (!firstCards[e.id]) return [e];
      const to = placeFirstCard(e, col, day, walk);
      const entry: Entry = {
        ...e,
        name: firstCards[e.id].card.name,
        invented: undefined,
        detail: to.detail,
        approved: to.approved,
      };
      if (to.col === col) return [entry];
      moved.push([to.col, entry]);
      return [];
    });
  }
  for (const [col, e] of moved) board[col].push(e);
}

/**
 * Every column's households on the walk's day. Scheduled runs biggest
 * increase first, by percent as the board shows it, since the biggest jumps
 * are who is likeliest to shop on their own (the M1 rule: rank the biggest
 * increases first); every other column runs soonest renewal first.
 */
export function boardFor(day: Day, walk: Walk): Record<ColumnId, Entry[]> {
  const board = inventedFor(day);
  placeFirstCards(board, day, walk);
  for (const id of namedIds) board[namedColumn(id, day, walk)].push(named(id, day, walk));
  for (const col of columns) {
    board[col.id].sort(
      col.id === "scheduled"
        ? (a, b) => b.pct - a.pct || b.increase - a.increase
        : (a, b) => when(a.renews) - when(b.renews),
    );
  }
  return board;
}

/* ------------------------------------------------------------------ *
 * What needs Jenna
 * ------------------------------------------------------------------ */

/** Days from the walk's day to a renewal like "Oct 16"; negative once it's passed. */
export const daysUntil = (renews: string, day: Day) =>
  Math.round((renewalDate(renews).getTime() - dayDate[day].getTime()) / 86_400_000);

/**
 * When a renewal starts to need a look, by column, counted back from the
 * renewal by what still has to happen after that column: yellow `soon` days
 * out, red `urgent`. Awaiting Response goes earliest, since an answer still
 * has to come in and be shopped, and the team can't shop a renewal under two
 * weeks out (strategy sprint, Thursday afternoon); a sent recommendation only
 * needs a yes and a bind. Scheduled sends itself, Upline shops in a day or
 * two, and Completed is done, so those three never flag. Working numbers,
 * from 2026-10-01, to check with Austin and Stockton Hill. Until then one
 * rule ran across every column, yellow at ten days and red at five, which
 * left most of Awaiting Response's too-late-to-shop renewals unmarked.
 */
export const deadlines: Partial<Record<ColumnId, { soon: number; urgent: number }>> = {
  awaiting: { soon: 21, urgent: 14 },
  ready: { soon: 14, urgent: 10 },
  sent: { soon: 10, urgent: 5 },
};

/**
 * The accent down a card's or line's left edge, the hub's card-accent: red
 * or yellow when the renewal is inside its column's deadlines (above) and it
 * isn't done, and blue when the household has asked for something on top of
 * the renewal (a life quote, or a change on file). Blue means that and
 * nothing else, so a recommendation to send or an approval to bind carries no
 * bar of its own: its column, or the card's sentence and button, already
 * say so. Red beats yellow beats blue. Completed and snoozed carry none. The
 * words beside the bar say the same thing, so nothing rests on the color.
 */
export type Accent = "urgent" | "soon" | "requested";

export function accentFor(e: Entry, col: ColumnId, day: Day, walk: Walk): Accent | null {
  if (col === "completed") return null;
  if (!e.invented && isSnoozed(e.id, day, walk)) return null;
  const deadline = deadlines[col];
  const days = daysUntil(e.renews, day);
  if (deadline && days <= deadline.urgent) return "urgent";
  if (deadline && days <= deadline.soon) return "soon";
  if (!e.invented && changeRequested(e.id, day, walk)) return "requested";
  return null;
}

/** Whether an accent is about time (red or yellow), so the countdown beside it takes its color. */
export const timed = (accent: Accent | null): accent is "urgent" | "soon" =>
  accent === "urgent" || accent === "soon";

/**
 * What a mini column's red and yellow lines are counting to, said once over
 * each group instead of on every line, so a column of 55 with 34 flagged
 * still reads as a list (2026-10-01). Pipedrive paints every card; here the
 * column carries it. Only Awaiting Response flags among the mini columns.
 * The full columns go without, since each card's sentence says it.
 */
const groupLabels: Partial<Record<ColumnId, Record<GroupKey, string>>> = {
  awaiting: { urgent: "Too late to shop", soon: "Last week to shop", rest: "On track" },
};

export type GroupKey = "urgent" | "soon" | "rest";
export type Group = { key: GroupKey; label?: string; entries: Entry[] };

/**
 * A mini column's lines, cut where its deadlines fall: red, then yellow, then
 * the rest, each under its label. The column already runs soonest renewal
 * first, so each group is one block in the same order. A column with
 * nothing flagged is one group with no label, so an "On track" never stands
 * alone, and a group with no one in it (once Needs me or a search has
 * narrowed the column) isn't drawn.
 */
export function groupsFor(col: ColumnId, entries: Entry[], day: Day, walk: Walk): Group[] {
  const labels = groupLabels[col];
  const keyOf = (e: Entry): GroupKey => {
    const accent = accentFor(e, col, day, walk);
    return timed(accent) ? accent : "rest";
  };
  if (!labels || entries.every((e) => keyOf(e) === "rest")) return [{ key: "rest", entries }];
  return (["urgent", "soon", "rest"] as const)
    .map((key) => ({ key, label: labels[key], entries: entries.filter((e) => keyOf(e) === key) }))
    .filter((g) => g.entries.length > 0);
}

/**
 * The red and yellow renewals that aren't already a recommendation to send
 * or an approval to bind, grouped for the Monday email as the board groups
 * them: under a mini column's labels where it has them (Too late to shop,
 * then Last week to shop), and under Renewing soon otherwise.
 */
export function shortOnTime(needs: { e: Entry; col: ColumnId }[], day: Day, walk: Walk) {
  const groups = new Map<string, { e: Entry; col: ColumnId }[]>();
  for (const key of ["urgent", "soon"] as const) {
    for (const c of columns) {
      const label = groupLabels[c.id]?.[key];
      if (label) groups.set(label, []);
    }
  }
  groups.set("Renewing soon", []);
  for (const n of needs) {
    const accent = accentFor(n.e, n.col, day, walk);
    if (n.e.approved || n.col === "ready" || !timed(accent)) continue;
    groups.get(groupLabels[n.col]?.[accent] ?? "Renewing soon")!.push(n);
  }
  return [...groups].map(([title, items]) => ({ title, items })).filter((g) => g.items.length > 0);
}

/**
 * Whether a household needs Jenna on the walk's day: a recommendation to
 * send, an approval to bind, or anything with an accent. Completed and
 * snoozed don't.
 */
export function needsYou(e: Entry, col: ColumnId, day: Day, walk: Walk) {
  if (col === "completed") return false;
  if (!e.invented && isSnoozed(e.id, day, walk)) return false;
  return col === "ready" || !!e.approved || accentFor(e, col, day, walk) !== null;
}

/** Everything the Needs me toggle keeps. */
export const needsMe = (board: Record<ColumnId, Entry[]>, day: Day, walk: Walk) =>
  columns.flatMap((c) => board[c.id].filter((e) => needsYou(e, c.id, day, walk)).map((e) => ({ e, col: c.id })));

/**
 * A change in percent, as the board and the Monday email show it: "+18%", or
 * "0%" when it's flat. Over 10% (the shop-framing threshold) it's drawn in
 * the text color rather than gray, so a big jump is a glance away. It was
 * red until 2026-10-01, when 49 of Monday's 143 showed red for their change
 * against 3 for time, so red came off it and now only means time is short.
 */
export const pctLabel = (pct: number) => (pct > 0 ? `+${pct}%` : `${pct}%`);
export const bigIncrease = (pct: number) => pct > 10;

/**
 * A household's name as a card or line sets it: a couple's first names are
 * held together, so a name that wraps breaks before the surname ("Leah & Tom /
 * Pruitt") rather than after the ampersand.
 */
export const setName = (name: string) => name.replace(/^(\S+) & (\S+) /, "$1\u00a0&\u00a0$2 ");
