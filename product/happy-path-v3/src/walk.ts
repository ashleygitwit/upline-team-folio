import type { Day, PickId } from "./data";
import type { PillId } from "./pills";

/**
 * The walk: nine stops, one household (the Callahans) from Monday's list to a
 * bound policy, with the rest of the week moving around them. The presenter
 * bar steps through these in order, and each stop can be jumped to directly.
 */
export type ScreenId =
  | "monday-email"
  | "monday"
  | "review"
  | "dana-inbox"
  | "questionnaire"
  | "wednesday"
  | "results"
  | "dana-page"
  | "friday";

export const screens: { id: ScreenId; label: string; where: string }[] = [
  { id: "monday-email", label: "The Monday email", where: "Stacey's inbox · Monday, 8:00 AM" },
  { id: "monday", label: "Monday: Stacey opens Upline", where: "Upline · Monday, October 12" },
  { id: "review", label: "Review the Callahans' email", where: "Upline · Monday, October 12" },
  { id: "dana-inbox", label: "Dana's inbox", where: "Dana's phone · Tuesday, 9:02 AM" },
  { id: "questionnaire", label: "Dana's questionnaire", where: "Dana's phone · Tuesday, 7:40 PM" },
  { id: "wednesday", label: "Wednesday", where: "Upline · Wednesday, October 14" },
  { id: "results", label: "Thursday: results are back", where: "Upline · Thursday, October 15" },
  { id: "dana-page", label: "Dana's recommendation", where: "Dana's phone · Thursday, 6:12 PM" },
  { id: "friday", label: "Friday: bind it", where: "Upline · Friday, October 16" },
];

/** One question and what it's answered with. `null` has no answer written. */
export type Exchange = { key: number; question: string; answer: PillId | null };

/**
 * A conversation with Upline, titled by its first question. There's one a
 * day at most: it docks along the bottom until Stacey ends it, and the next
 * question starts a new one.
 */
export type Chat = { id: number; day: Day; title: string; asked: Exchange[] };

/**
 * What the presenter has done so far. It survives stepping back and forth, and
 * anything skipped by jumping ahead falls back to the default: the outreach
 * sends, the pick is Auto-Owners, and Dana approves.
 */
export type Walk = {
  approvedAll: boolean;
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
  notesDrafted: boolean;
  chats: Chat[];
};

export const initialWalk: Walk = {
  approvedAll: false,
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
  notesDrafted: false,
  chats: [],
};

export type WalkProps = {
  walk: Walk;
  update: (patch: Partial<Walk> | ((w: Walk) => Partial<Walk>)) => void;
  go: (id: ScreenId) => void;
};
