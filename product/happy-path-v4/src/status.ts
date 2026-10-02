import { optionById, type Day, type Household, type Status } from "@/data";
import type { Walk } from "@/walk";

/**
 * Where a household stands on a given day, once the outreach has gone. The
 * Pruitts' row follows what the presenter did in the walk; everyone else
 * follows the week as written in data.ts.
 */
export function statusFor(h: Household, day: Exclude<Day, "mon">, walk: Walk): Status {
  if (walk.skipped.includes(h.id)) {
    return { label: "Skipped", detail: "You're handling this one yourself this time." };
  }
  if (h.id === "pruitt") {
    const pick = optionById(walk.pick);
    if (day === "thu" && walk.recSent) {
      return { label: "Sent to Leah", detail: "Your recommendation went out this morning. Waiting on Leah." };
    }
    if (day === "fri") {
      if (walk.bound) return { label: "Done", detail: pick.current ? "Staying with Erie." : `Bound with ${pick.carrier}.` };
      return {
        label: "Approved",
        detail: pick.current
          ? "Leah and Tom are staying with Erie."
          : `Leah and Tom approved ${pick.carrier}. Bind it before November 3.`,
      };
    }
  }
  return h.status[day];
}
