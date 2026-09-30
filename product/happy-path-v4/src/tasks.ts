import { dayDate, days, earlier, mondayNeeds, pruitt, thisWeek, type Day, type Earlier } from "@/data";
import { cards } from "@/household/data";
import type { Snooze, SnoozeUntil, Walk } from "@/walk";

/**
 * What needs Jenna, and what's pinned to a household: the tasks on the
 * homepage's board, snoozing a task, and the chips the board and the drawer
 * both show. Added after the 2026-09-29 review, where
 * Austin asked for a snooze as the first step toward task management and a
 * chip for a life quote or updated information, since neither has a flow of
 * its own yet.
 */

/** One task: whose, what kind, and when they renew, for the sort. */
export type Task = { id: string; kind: "shopped" | "closing"; renews: string; earlier?: Earlier };

/**
 * Everything that would need Jenna on the walk's day, soonest renewal first,
 * snoozed or not. On Monday that's the earlier weeks' four; on Thursday and
 * Friday it's the Pruitts.
 */
export function allTasks(day: Day, walk: Walk): Task[] {
  const tasks: Task[] = [];
  const skipped = walk.skipped.includes(pruitt.id);
  if (day === "thu" && !walk.recSent && !skipped) tasks.push({ id: pruitt.id, kind: "shopped", renews: pruitt.renews });
  if (day === "fri" && !skipped) tasks.push({ id: pruitt.id, kind: "closing", renews: pruitt.renews });
  if (day === "mon") {
    for (const e of mondayNeeds()) tasks.push({ id: e.id, kind: e.monday!.section, renews: e.renews, earlier: e });
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

/** A household's renewal, as "Nov 15", from whichever list has it. */
export const renewsFor = (id: string) =>
  cards.find((c) => c.id === id)?.renewal ?? earlier.find((e) => e.id === id)?.renews ?? thisWeek.find((h) => h.id === id)!.renews;

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
 * Chips
 * ------------------------------------------------------------------ */

export type Chip = { id: "snoozed" | "life" | "info" | "closing"; label: string };

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

/** The chips a household wears on the walk's day, in the order they're drawn. */
export function chipsFor(id: string, day: Day, walk: Walk): Chip[] {
  const chips: Chip[] = [];
  if (isSnoozed(id, day, walk)) chips.push({ id: "snoozed", label: "Snoozed" });
  if (lifeRequested(id, day, walk)) chips.push({ id: "life", label: "Life quote requested" });
  if (changedFields(id, day, walk).length > 0) chips.push({ id: "info", label: "Info updated" });
  return chips;
}
