import { money, type Card, type Column } from "@/household/data";

/** The board's four columns, in Ashley's order and with her names. */
export const columns: { id: Column; title: string }[] = [
  { id: "outreach", title: "Ready to reach out" },
  { id: "shopping", title: "Shopping" },
  { id: "recommend", title: "Ready to send rec" },
  { id: "binding", title: "Closing" },
];

export const columnTitle = (col: Column) => columns.find((c) => c.id === col)!.title;

/** "Leah & Tom Pruitt" reads as "Leah and Tom Pruitt" in a sentence. */
export const spoken = (name: string) => name.replace(/\s*&\s*/g, " and ");

export const priceLine = (card: Card) =>
  card.jumpPct === 0 ? money(card.premium) : `${money(card.was)} → ${money(card.premium)}`;
