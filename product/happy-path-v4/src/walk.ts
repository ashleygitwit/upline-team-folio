import type { Day, PickId } from "./data";

/**
 * The walk: sixteen stops, one household (the Pruitts) from Monday's list to
 * a bound policy, with the rest of the week moving around them. The presenter
 * bar steps through these in order, and each stop can be jumped to directly.
 *
 * Seven of the stops are cards, the ones with `text`: a slate screen before
 * each change of day or person and before Jenna first signs in to Upline,
 * with a story title (`label`), the day (`where`) and a sentence setting up
 * what comes next. They're fixed, so they
 * tell the usual path; a screen that has gone differently says so itself.
 */
export type ScreenId =
  | "card-monday"
  | "monday-email"
  | "card-monday-upline"
  | "monday"
  | "review"
  | "card-tuesday"
  | "dana-inbox"
  | "questionnaire"
  | "card-wednesday"
  | "wednesday"
  | "card-thursday"
  | "thursday"
  | "card-thursday-evening"
  | "dana-page"
  | "card-friday"
  | "friday";

export const screens: { id: ScreenId; label: string; where: string; text?: string }[] = [
  {
    id: "card-monday",
    label: "A new week",
    where: "Monday, October 12, 8:00 AM",
    text: "Jenna is an agent at Harbor Point Insurance. Before she's at her desk, Upline has written to tell her what needs her this week.",
  },
  { id: "monday-email", label: "The Monday email", where: "Jenna's inbox · Monday, 8:00 AM" },
  {
    id: "card-monday-upline",
    label: "At her desk",
    where: "Monday, October 12",
    text: "Jenna signs in to Upline to work through the list from her email.",
  },
  { id: "monday", label: "Monday: Jenna opens Upline", where: "Upline · Monday, October 12" },
  { id: "review", label: "Review the Pruitts' email", where: "Upline · Monday, October 12" },
  {
    id: "card-tuesday",
    label: "Meanwhile, at the Pruitts'",
    where: "Tuesday, October 13, 9:02 AM",
    text: "Leah and Tom's home and auto renew with Erie on November 15. Jenna's renewal email has just reached Leah's phone.",
  },
  { id: "dana-inbox", label: "Leah's inbox", where: "Leah's phone · Tuesday, 9:02 AM" },
  { id: "questionnaire", label: "Leah's questionnaire", where: "Leah's phone · Tuesday, 7:40 PM" },
  {
    id: "card-wednesday",
    label: "Back at the agency",
    where: "Wednesday, October 14",
    text: "Leah answered Jenna's questions last night, and Upline has started shopping the Pruitts' home and auto.",
  },
  { id: "wednesday", label: "Wednesday", where: "Upline · Wednesday, October 14" },
  {
    id: "card-thursday",
    label: "The quotes are in",
    where: "Thursday, October 15",
    text: "The carriers have come back on the Pruitts, and Jenna has a recommendation to make.",
  },
  { id: "thursday", label: "Thursday: results are back", where: "Upline · Thursday, October 15" },
  {
    id: "card-thursday-evening",
    label: "That evening",
    where: "Thursday, October 15, 6:12 PM",
    text: "Leah opens Jenna's recommendation on her phone after work.",
  },
  { id: "dana-page", label: "Leah's recommendation", where: "Leah's phone · Thursday, 6:12 PM" },
  {
    id: "card-friday",
    label: "Closing the week",
    where: "Friday, October 16",
    text: "Leah and Tom said yes. All that's left is for Jenna to bind it in the carrier's portal.",
  },
  { id: "friday", label: "Friday: bind it", where: "Upline · Friday, October 16" },
];

/** A note Jenna left on a household: the walk's day, the clock time she posted it, and what she wrote. */
export type Note = { id: number; day: Day; time: string; text: string };

/** A nudge Jenna sent early or skipped, and the day she did it. */
export type NudgeChoice = { choice: "sent" | "skipped"; day: Day };

/** How long a task is snoozed for (tasks.ts says when each lets go). */
export type SnoozeUntil = "tomorrow" | "nextWeek" | "beforeRenewal";

/** A task Jenna snoozed: for how long, and the day she did it. */
export type Snooze = { until: SnoozeUntil; day: Day };

/**
 * What the presenter has done so far. It survives stepping back and forth, and
 * anything skipped by jumping ahead falls back to the default: the outreach
 * sends, the pick is Auto-Owners, and Leah approves.
 */
export type Walk = {
  approved: string[];
  skipped: string[];
  drafts: Record<string, string>;
  lifeQuote: Record<string, boolean>;
  pick: PickId;
  recDraft: string | null;
  recSent: boolean;
  danaAnswered: boolean;
  danaApproved: boolean;
  bound: boolean;
  /** Earlier weeks' approvals Jenna marked closed on Monday, with her memo. */
  closed: Record<string, string>;
  notesDrafted: boolean;
  /** Nudges and follow-ups Jenna sent early or skipped from a drawer, by `nudges` key (data.ts). */
  nudges: Record<string, NudgeChoice>;
  /** Earlier weeks' recommendations Jenna sent from a drawer on Monday. */
  recsSent: string[];
  /** Each household's notes, oldest first. */
  notes: Record<string, Note[]>;
  /** Tasks Jenna snoozed off the homepage, by household. */
  snoozed: Record<string, Snooze>;
  /** Whether Leah said yes to a life quote in her questionnaire. */
  danaLife: boolean;
};

export const initialWalk: Walk = {
  approved: [],
  skipped: [],
  drafts: {},
  lifeQuote: {},
  pick: "ao",
  recDraft: null,
  recSent: false,
  danaAnswered: false,
  danaApproved: false,
  bound: false,
  closed: {},
  notesDrafted: false,
  nudges: {},
  recsSent: [],
  notes: {},
  snoozed: {},
  danaLife: true,
};

export type WalkProps = {
  walk: Walk;
  update: (patch: Partial<Walk> | ((w: Walk) => Partial<Walk>)) => void;
  go: (id: ScreenId) => void;
};
