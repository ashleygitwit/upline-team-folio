/**
 * The questions Upline can answer: what an agent most wants to know before
 * coffee. What needs me, am I keeping my book, who did I lose, what did
 * shopping earn my clients, who can I cross-sell, and where does everyone
 * stand. Each one is answered from what the prototype already knows. Only
 * the first three are written out as suggestions; the rest answer when
 * typed, and "Where does everyone stand?" is also where the later days'
 * "See where they stand" goes.
 */
export type PillId = "today" | "retention" | "left" | "savings" | "life" | "everyone";

export const pills: { id: PillId; question: string; listens: string[] }[] = [
  { id: "today", question: "What needs me today?", listens: ["today", "need", "to do", "todo", "queue", "sched"] },
  { id: "retention", question: "How's my retention this season?", listens: ["retention", "retain", "kept", "keep", "stay", "outreach", "sent"] },
  { id: "left", question: "Who left, and can I win them back?", listens: ["left", "leave", "lost", "lose", "win", "churn"] },
  { id: "savings", question: "How much have I saved my clients?", listens: ["sav", "shop", "money", "switch", "pocket"] },
  { id: "life", question: "Who's asked about a life quote?", listens: ["life", "cross", "lead"] },
  { id: "everyone", question: "Where does everyone stand?", listens: ["everyone", "everybody", "stand", "status", "this week"] },
];

/** The suggestions written out under the ask box and in the chat. */
export const suggested: PillId[] = ["today", "retention", "left"];

export const pillById = (id: PillId) => pills.find((p) => p.id === id)!;

/** A typed question goes to the pill it sounds most like, or to none. */
export function matchPill(text: string): PillId | null {
  const t = text.toLowerCase();
  return pills.find((p) => p.listens.some((w) => t.includes(w)))?.id ?? null;
}
