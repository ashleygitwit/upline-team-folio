import { createContext } from "react";
import type { QuoteDoc } from "@/household/data";

/**
 * Where a page's back button goes (PhasePage.tsx): what's under it, by name,
 * and the way back to it. The drawer provides it for each layer.
 */
export const PageBack = createContext<{ label: string; onBack: () => void } | null>(null);

/** Opens the carriers' quotes over a shop's results, from the link under its table. */
export const OpenQuotes = createContext<((docs: QuoteDoc[], from: HTMLElement) => void) | null>(null);
