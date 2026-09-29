import { pruitt, money, optionById, options, thisWeek, type Day } from "@/data";
import type { Walk } from "@/walk";

export const words = ["No", "One", "Two", "Three", "Four", "Five", "Six"];

/** How many of the six are still going out, once Jenna's skips are taken off. */
export const going = (walk: Walk) => thisWeek.filter((h) => !walk.skipped.includes(h.id)).length;

export type Today = {
  /** The brief under the greeting. */
  lead: string;
  sub?: string;
  /** Said only when Jenna asks what needs her, not in the brief. */
  more?: string;
  /**
   * The day's one action, and where it goes: down to Scheduled Renewal Emails,
   * the "Where does everyone stand?" answer, the results, or `done`, which
   * marks the Pruitts bound.
   */
  action?: { label: string; to: "scheduled" | "everyone" | "results" | "done"; primary?: boolean };
};

/**
 * Today's one thing, by day and by what the presenter has done so far. The
 * answer to "What needs me today?" says it, and Wednesday's homepage line is
 * its lead.
 */
export function todayFor(day: Day, walk: Walk): Today {
  const n = going(walk);
  const pick = optionById(walk.pick);
  const erie = options.find((o) => o.current)!;

  if (day === "mon") {
    return {
      lead: `${words[n]} ${n === 1 ? "renewal is" : "renewals are"} queued to send tomorrow at 9 AM.`,
      more: `Each one is drafted in your voice and sends from your inbox. You don't need to do anything. The biggest one this week is Leah and Tom Pruitt, up ${money(pruitt.now - pruitt.was)} because Maya got her license in August. From earlier weeks, Sofia Marin's and Walter Kemp's recommendations are ready to send, and Rhea Iyer and Diane Mercer are approved and need binding.`,
      action: { label: "Look them over", to: "scheduled" },
    };
  }

  if (day === "wed") {
    return {
      lead: "No tasks need immediate action today. All scheduled renewal emails went out Tuesday and the Pruitts are being shopped.",
      action: { label: "See where they stand", to: "everyone" },
    };
  }

  if (day === "thu") {
    return walk.recSent
      ? {
          lead: "Sent to Leah. Nothing else needs you today.",
          sub: "We'll let you know when Leah answers.",
          action: { label: "See where the rest stand", to: "everyone" },
        }
      : {
          lead: "Leah and Tom's results are back.",
          sub: `Auto-Owners will write the same coverage for ${money(4640)}, ${money(erie.price - 4640)} less than Erie's renewal.`,
          action: { label: "Review and send", to: "results", primary: true },
        };
  }

  if (walk.bound) {
    return {
      lead: "Done. The Pruitts are set.",
      sub: pick.current
        ? `Erie renews on ${pruitt.renewsLong}. One more household that stayed with you.`
        : `${pick.carrier} takes over on ${pruitt.renewsLong}, with ${money(erie.price - pick.price)} back for Leah and Tom. One more household that stayed with you.`,
    };
  }

  return pick.current
    ? {
        lead: "Leah and Tom are staying with Erie.",
        sub: `There's nothing to bind. Erie renews on its own on ${pruitt.renewsLong}, so mark it done to close it out.`,
        action: { label: "Mark it done", to: "done", primary: true },
      }
    : {
        lead: `Leah and Tom said yes to ${pick.carrier}.`,
        sub: `Bind it in the ${pick.carrier} portal before ${pruitt.renewsLong}, then mark it done here. They approved Thursday at 6:20 PM.`,
        action: { label: "Mark it done", to: "done", primary: true },
      };
}
