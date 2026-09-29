import { createContext, useContext } from "react";

/**
 * Whether the renewal board is drawn inside the phone. Only the three board
 * screens offer Mobile, as in Ashley's v2; everything else is always desktop.
 */
export const MobileContext = createContext(false);

export const useMobile = () => useContext(MobileContext);
