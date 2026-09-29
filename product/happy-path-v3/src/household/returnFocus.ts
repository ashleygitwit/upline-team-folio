import { createContext } from "react";

/**
 * Where focus goes when a phase modal over the drawer closes: back to the
 * banner or the Recent activity line that opened it. The drawer provides it;
 * a modal opened on its own (the Pruitts' results from the homepage or the
 * chat) keeps the dialog's own behavior.
 */
export const ReturnFocus = createContext<((e: Event) => void) | undefined>(undefined);
