import { cards, fileFor, type Card, type HouseholdFile } from "@/household/data";
import { firstCards } from "@/household/firstCards";

/**
 * Every household with a drawer: the twelve named ones (data.ts, which is
 * v2.5's word for word) and the six first cards (firstCards.ts), which are
 * v4's own and so live apart from them.
 */
export const cardFor = (id: string): Card | undefined => cards.find((c) => c.id === id) ?? firstCards[id]?.card;

/** A household's file: a first card's own, or the named twelve's (data.ts). */
export const fileOf = (card: Card): HouseholdFile => firstCards[card.id]?.file ?? fileFor(card);
