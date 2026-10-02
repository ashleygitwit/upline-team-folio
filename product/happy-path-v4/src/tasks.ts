import { dayDate, days, earlier, mondayNeeds, pruitt, thisWeek, type Day, type Earlier } from "@/data";
import { cards } from "@/household/data";
import { firstCards } from "@/household/firstCards";
import type { Snooze, SnoozeUntil, Walk } from "@/walk";

/**
 * What needs Jenna, and what's pinned to a household: the tasks on the
 * homepage's board, snoozing a task, the countdown to a renewal, and what a
 * household asked for, which the board and the drawer both show. Added
 * after the 2026-09-29 review, where Austin asked for a snooze as the first
 * step toward task management and a marker for a life quote or updated
 * information, since neither has a flow of its own yet.
 */

/** One task: whose, what kind, and when they renew, for the sort. */
export type Task = { id: string; kind: "shopped" | "closing"; renews: string; earlier?: Earlier };

/**
 * Everything that would need Jenna on the walk's day, soonest renewal first,
 * snoozed or not. On Monday that's the earlier weeks' four and two of the
 * first cards (firstCards.ts), Hank Fischer's results and Lena Park's
 * approval; on Thursday and Friday it's the Pruitts.
 */
export function allTasks(day: Day, walk: Walk): Task[] {
  const tasks: Task[] = [];
  const skipped = walk.skipped.includes(pruitt.id);
  if (day === "thu" && !walk.recSent && !skipped) tasks.push({ id: pruitt.id, kind: "shopped", renews: pruitt.renews });
  if (day === "fri" && !skipped) tasks.push({ id: pruitt.id, kind: "closing", renews: pruitt.renews });
  if (day === "mon") {
    for (const e of mondayNeeds()) tasks.push({ id: e.id, kind: e.monday!.section, renews: e.renews, earlier: e });
    for (const f of Object.values(firstCards)) {
      if (f.monday) tasks.push({ id: f.card.id, kind: f.monday, renews: f.card.renewal });
    }
  }
  return tasks.sort((a, b) => renewalDate(a.renews).getTime() - renewalDate(b.renews).getTime());
}

/** What needs Jenna today and isn't snoozed. */
export const actionNeeded = (day: Day, walk: Walk) => allTasks(day, walk).filter((t) => !isSnoozed(t.id, day, walk));

/** What Jenna has snoozed that would otherwise need her today. */
export const snoozedTasks = (day: Day, walk: Walk) => allTasks(day, walk).filter((t) => isSnoozed(t.id, day, walk));

/** Whether a household has a task today, snoozed or not. */
export const needsAction = (id: string, day: Day, walk: Walk) => allTasks(day, walk).some((t) => t.id === id);

/* ------------------------------------------------------------------
 * Snooze
 * ------------------------------------------------------------------ */

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Nov 15" as a date in the walk's year. */
export function renewalDate(renews: string) {
  const [mon, date] = renews.split(" ");
  return new Date(2026, months.indexOf(mon), Number(date));
}

/**
 * Under two weeks from the renewal, a renewal is short on time: too late to
 * shop (the team's rule, from the strategy sprint), so it counts down, in
 * red (Countdown in components/Status.tsx).
 */
export const shortOnTime = 14;

/** Whether a renewal is under two weeks out, or past, on the walk's day. */
export const isShortOnTime = (renews: string, day: Day) =>
  daysBetween(dayDate[day], renewalDate(renews)) < shortOnTime;

/**
 * When a renewal like "Oct 20" is, on the walk's day, as the board and the
 * Monday email say it beside a clock: under two weeks out it counts down,
 * "8 days" (or Today, or Tomorrow), and further out it's the date, "Oct 26".
 * The full date is on hover (renewalDay). Until 2026-10-01 only a renewal
 * inside its column's deadlines said it, as a countdown, and the email said
 * "Renews in 8 days".
 */
export function countdown(renews: string, day: Day) {
  const days = daysBetween(dayDate[day], renewalDate(renews));
  if (days < 0) return `Renewed ${renews}`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return days < shortOnTime ? `${days} days` : renews;
}

/** The countdown's date in full, for its tooltip: "Renews Tuesday, October 20". */
export function renewalDay(renews: string, day: Day) {
  const date = renewalDate(renews);
  const when = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  return daysBetween(dayDate[day], date) < 0 ? `Renewed ${when}` : `Renews ${when}`;
}

/** A household's renewal, as "Nov 15", from whichever list has it. */
export const renewsFor = (id: string) =>
  cards.find((c) => c.id === id)?.renewal ??
  firstCards[id]?.card.renewal ??
  earlier.find((e) => e.id === id)?.renews ??
  thisWeek.find((h) => h.id === id)!.renews;

const daysBetween = (from: Date, to: Date) => Math.round((to.getTime() - from.getTime()) / 86_400_000);

/** How far out a household's renewal is on the walk's day. */
export const daysOut = (id: string, day: Day) => daysBetween(dayDate[day], renewalDate(renewsFor(id)));

/** The three snoozes, in the order the menu offers them. */
export const snoozes: { until: SnoozeUntil; label: string }[] = [
  { until: "tomorrow", label: "Until tomorrow" },
  { until: "nextWeek", label: "Until next week" },
  { until: "beforeRenewal", label: "Until 5 days before renewal" },
];

/** "until next week", for a sentence. */
export const snoozeLabel = (until: SnoozeUntil) => snoozes.find((s) => s.until === until)!.label.toLowerCase();

/**
 * Whether a snooze is still holding on the walk's day. Tomorrow's is over on
 * the next stop; next week's outlasts the walk, which is one week; the
 * renewal's lets go five days before it.
 */
function holding(id: string, snooze: Snooze, day: Day) {
  if (snooze.until === "tomorrow") return days.indexOf(day) <= days.indexOf(snooze.day);
  if (snooze.until === "nextWeek") return true;
  return daysOut(id, day) > 5;
}

export const isSnoozed = (id: string, day: Day, walk: Walk) => {
  const s = walk.snoozed[id];
  return !!s && holding(id, s, day);
};

/* ------------------------------------------------------------------
 * Requests
 * ------------------------------------------------------------------ */

/**
 * Something a household asked for on top of the renewal, as a gray line
 * under its name on the board and in its drawer's header (Requests in
 * components/Status.tsx).
 * They were gray chips until 2026-10-01, with Snoozed, Ready to close and
 * the renewal beside them, all the size and fill of a button.
 */
export type Request = { id: "life" | "info"; label: string };

/**
 * What the questionnaire changed on file, by household: how many details,
 * and which rows of the drawer's Details carry a marker. The Pruitts' come
 * from Leah's questionnaire on Tuesday; Neha's came in the Monday before.
 */
export const infoUpdated: Record<string, { from: Day; fields: string[] }> = {
  pruitt: { from: "wed", fields: ["Maya Pruitt"] },
  rao: { from: "mon", fields: ["Phone", "Address"] },
};

/** Which details the questionnaire changed, if it's back by the walk's day. */
export function changedFields(id: string, day: Day, walk: Walk): string[] {
  const u = infoUpdated[id];
  if (!u || days.indexOf(day) < days.indexOf(u.from)) return [];
  if (id === pruitt.id && (walk.skipped.includes(id) || !walk.danaAnswered)) return [];
  return u.fields;
}

/**
 * Whether the household asked for a life quote. Leah's answer is the walk's,
 * from Wednesday, when the questionnaire asked her at all; Sofia's is on file
 * from her questionnaire the week before.
 */
export function lifeRequested(id: string, day: Day, walk: Walk) {
  if (id === "marin") return true;
  if (id !== pruitt.id || day === "mon") return false;
  return walk.danaAnswered && walk.danaLife && (walk.lifeQuote[pruitt.id] ?? true) && !walk.skipped.includes(id);
}

/** What a household has asked for on the walk's day, in the order the lines are drawn. */
export function requestsFor(id: string, day: Day, walk: Walk): Request[] {
  const requests: Request[] = [];
  if (lifeRequested(id, day, walk)) requests.push({ id: "life", label: "Life quote requested" });
  if (changedFields(id, day, walk).length > 0) requests.push({ id: "info", label: "Info updated" });
  return requests;
}
