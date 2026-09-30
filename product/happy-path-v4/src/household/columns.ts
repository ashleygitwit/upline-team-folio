import { money, type Card, type Column } from "@/household/data";

/**
 * The stages a household's drawer and phase modals name, in Ashley's order.
 * They were her v2 column names (Ready to reach out, Shopping, Ready to send
 * rec, Closing) until 2026-09-30, when they took the homepage board's names
 * (board.ts), so the drawer says the column its card is in. An approval
 * waiting to be bound sits in Recommendation Sent on the board, with Ready to
 * close on its card, so that's what binding says too.
 */
export const columns: { id: Column; title: string }[] = [
  { id: "outreach", title: "Scheduled" },
  { id: "shopping", title: "Shopping" },
  { id: "recommend", title: "Recommendation Ready" },
  { id: "binding", title: "Recommendation Sent" },
];

export const columnTitle = (col: Column) => columns.find((c) => c.id === col)!.title;

/** "Leah & Tom Pruitt" reads as "Leah and Tom Pruitt" in a sentence. */
export const spoken = (name: string) => name.replace(/\s*&\s*/g, " and ");

export const priceLine = (card: Card) =>
  card.jumpPct === 0 ? money(card.premium) : `${money(card.was)} → ${money(card.premium)}`;
