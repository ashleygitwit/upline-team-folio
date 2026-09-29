import { callahan, money, optionById, options, thisWeek, type Day } from "@/data";
import type { Walk } from "@/walk";

export const words = ["No", "One", "Two", "Three", "Four", "Five", "Six"];

/** How many of the six are still going out, once Stacey's skips are taken off. */
export const going = (walk: Walk) => thisWeek.filter((h) => !walk.skipped.includes(h.id)).length;

export type Today = {
  /** The brief under the greeting. */
  lead: string;
  sub?: string;
  /** Said only when Stacey asks what needs her, not in the brief. */
  more?: string;
  /**
   * The day's one action, and where it goes: down to Scheduled Renewal Emails,
   * the "Where does everyone stand?" answer, the results, or `done`, which
   * marks the Callahans bound.
   */
  action?: { label: string; to: "scheduled" | "everyone" | "results" | "done"; primary?: boolean };
  /** Friday, once it's bound: the end of the walk. */
  celebrate?: boolean;
};

/**
 * Today's one thing, by day and by what the presenter has done so far. The
 * homepage's brief says it, and so does the answer to "What needs me today?".
 */
export function todayFor(day: Day, walk: Walk): Today {
  const n = going(walk);
  const pick = optionById(walk.pick);
  const erie = options.find((o) => o.current)!;

  if (day === "mon") {
    return {
      lead: `${words[n]} ${n === 1 ? "renewal is" : "renewals are"} queued to send tomorrow at 9 AM.`,
      more: `Each one is drafted in your voice and sends from your inbox. You don't need to do anything. The biggest one this week is Dana and Mike Callahan, up ${money(callahan.now - callahan.was)} because Sophie got her license in August. From earlier weeks, Elena Vasquez's and Raymond Foss's recommendations are ready to send, and Anika Desai and Linda Hart are approved and need binding.`,
      action: { label: "Look them over", to: "scheduled" },
    };
  }

  if (day === "wed") {
    return {
      lead: "No tasks need immediate action today. All scheduled renewal emails went out Tuesday and the Callahans are being shopped.",
      action: { label: "See where they stand", to: "everyone" },
    };
  }

  if (day === "thu") {
    return walk.recSent
      ? {
          lead: "Sent to Dana. Nothing else needs you today.",
          sub: "We'll let you know when Dana answers.",
          action: { label: "See where the rest stand", to: "everyone" },
        }
      : {
          lead: "Dana and Mike's results are back.",
          sub: `Auto-Owners will write the same coverage for ${money(4640)}, ${money(erie.price - 4640)} less than Erie's renewal.`,
          action: { label: "Review and send", to: "results", primary: true },
        };
  }

  if (walk.bound) {
    return {
      lead: "Done. The Callahans are set.",
      sub: pick.current
        ? `Erie renews on ${callahan.renewsLong}. One more household that stayed with you.`
        : `${pick.carrier} takes over on ${callahan.renewsLong}, with ${money(erie.price - pick.price)} back for Dana and Mike. One more household that stayed with you.`,
      celebrate: true,
    };
  }

  return pick.current
    ? {
        lead: "Dana and Mike are staying with Erie.",
        sub: `There's nothing to bind. Erie renews on its own on ${callahan.renewsLong}, so mark it done to close it out.`,
        action: { label: "Mark it done", to: "done", primary: true },
      }
    : {
        lead: `Dana and Mike said yes to ${pick.carrier}.`,
        sub: `Bind it in the ${pick.carrier} portal before ${callahan.renewsLong}, then mark it done here. They approved Thursday at 6:20 PM.`,
        action: { label: "Mark it done", to: "done", primary: true },
      };
}
