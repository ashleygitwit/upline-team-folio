import { createContext } from "react";

/**
 * Lets a tooltip over a whole line (NotBuilt in Board.tsx) step aside while
 * the pointer is on a countdown inside it (Countdown in components/Status.tsx),
 * so only the date shows.
 */
export const RowTip = createContext<(over: boolean) => void>(() => {});
