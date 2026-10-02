import { daysUntil } from "@/board";
import type { Day } from "@/data";
import { phases, type PhaseId, type Placed } from "@/phases";

/**
 * What narrows the homepage, board or list (Toolbar.tsx): v2.5's Filters,
 * by renewal date, stage, premium and Closing · needs me, and v3's search by
 * name. They're the page's own, so every stop opens on everything.
 */
export type When = "any" | "today" | "week" | "twoWeeks" | "thirty";
export type Premium = "all" | "increase" | "flat" | "decrease";

export type Filters = {
  when: When;
  stage: "all" | PhaseId;
  premium: Premium;
  /** Closing's Ready for Review only: said yes and waiting on Jenna to bind it. */
  needsMe: boolean;
};

export const noFilters: Filters = { when: "any", stage: "all", premium: "all", needsMe: false };

export const isFiltered = (f: Filters) => f.when !== "any" || f.stage !== "all" || f.premium !== "all" || f.needsMe;

/** Whether a renewal `days` out falls in the window, as v2.5 counted them. One that's passed falls in none. */
const inWindow = (days: number, when: When) =>
  when === "any"
    ? true
    : days < 0
      ? false
      : when === "today"
        ? days === 0
        : when === "week"
          ? days <= 7
          : when === "twoWeeks"
            ? days <= 14
            : days <= 30;

/** Every column's households that pass the filters and the search, in the order they came. */
export function narrow(
  placed: Record<PhaseId, Placed[]>,
  f: Filters,
  query: string,
  day: Day,
): Record<PhaseId, Placed[]> {
  const q = query.trim().toLowerCase();
  const keep = ({ e, status }: Placed, phase: PhaseId) =>
    (!q || e.name.toLowerCase().includes(q)) &&
    inWindow(daysUntil(e.renews, day), f.when) &&
    (f.stage === "all" || f.stage === phase) &&
    (f.premium !== "increase" || e.pct > 0) &&
    (f.premium !== "flat" || e.pct === 0) &&
    (f.premium !== "decrease" || e.pct < 0) &&
    (!f.needsMe || (phase === "closing" && status === "readyForReview"));
  return Object.fromEntries(phases.map(({ id }) => [id, placed[id].filter((p) => keep(p, id))])) as Record<
    PhaseId,
    Placed[]
  >;
}
