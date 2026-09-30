import { BandGrain } from "@/components/BandGrain";
import { Button } from "@/components/ui/button";
import { agency, pruitt, dayName, mondayNeeds, money, optionById, options, type Day } from "@/data";
import { Sections } from "@/screens/upline/Sections";
import { going, words } from "@/today";
import type { Walk, WalkProps } from "@/walk";

type HomeProps = WalkProps & {
  day: Day;
  household: string | null;
  onHousehold: (id: string) => void;
  /** Opens a household's outreach review on its own, from a Scheduled row. */
  onOutreach: (id: string) => void;
  /** Opens the Pruitts' shop results. */
  onResults: () => void;
  onPolicyholders: () => void;
};

/**
 * The homepage, the same every day: the band, then the sections. It has to be
 * readable before coffee, so the band only greets Jenna, says in one line
 * what's going on, and offers the way to her whole book; everything she
 * might act on sits below it, in the sections, most pressing first.
 */
export function Home({ day, walk, onPolicyholders, ...props }: HomeProps) {
  return (
    <>
      <Hero day={day} walk={walk} onPolicyholders={onPolicyholders} />
      <div className="shell pb-(--space-section)">
        <div className="mx-auto max-w-180">
          <Sections day={day} walk={walk} {...props} />
        </div>
      </div>
    </>
  );
}

/**
 * The band: the design hub homepage's blue under the mountain, as the Monday
 * email opens. A greeting for the day, the day's line and a link to the
 * Policyholder List. It never holds a card or a button, so it reads the same
 * every day. The link is white and underlined, the band's link, since the
 * kit's blue would vanish on the blue. The box to ask anything that sat here
 * came out on 2026-09-30: the chat is below the line for the MVP.
 */
function Hero({ day, walk, onPolicyholders }: { day: Day; walk: Walk; onPolicyholders: () => void }) {
  return (
    <div className="band-surface relative isolate overflow-clip">
      <BandGrain />
      <div className="shell py-(--space-section)">
        <div className="mx-auto max-w-180 text-center">
          <h1 id="home-title" className="text-5xl text-balance">
            {day === "fri" ? `Happy ${dayName[day]}` : "Good morning"}, {agency.agent.first}
          </h1>
          <p aria-live="polite" className="mt-(--space-block) font-display text-xl font-medium text-balance">
            {lineFor(day, walk)}
          </p>
          <div className="mt-10 flex justify-center">
            <Button
              variant="link"
              className="h-auto p-0 font-sans text-sm text-primary-foreground underline"
              onClick={onPolicyholders}
            >
              Want to review progress on your full book? View your Policyholder List.
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const plural = (n: number, one: string, many: string) => `${words[n].toLowerCase()} ${n === 1 ? one : many}`;

/**
 * What's going on, in one line, by day and by what the presenter has done so
 * far. Monday counts what's below; Wednesday has nothing that needs Jenna;
 * Thursday and Friday follow the Pruitts.
 */
function lineFor(day: Day, walk: Walk): string {
  const skipped = walk.skipped.includes(pruitt.id);

  if (day === "mon") {
    const open = mondayNeeds().filter((e) => walk.closed[e.id] === undefined).length;
    const n = going(walk);
    return `You have ${plural(open, "renewal that needs", "renewals that need")} you this week. ${words[n]} renewal ${n === 1 ? "email goes" : "emails go"} out tomorrow at 9 AM.`;
  }

  if (day === "wed") {
    return "No tasks need immediate action today. All scheduled renewal emails went out Tuesday and the Pruitts are being shopped.";
  }

  if (skipped) return "Nothing needs you today.";

  if (day === "thu") {
    return walk.recSent
      ? "Your recommendation went to Leah and Tom. We'll let you know when they answer."
      : "Shopping has been completed for Leah and Tom Pruitt.";
  }

  const pick = optionById(walk.pick);
  const erie = options.find((o) => o.current)!;
  if (walk.bound) {
    return pick.current
      ? `Done. The Pruitts are set. Erie renews on ${pruitt.renewsLong}.`
      : `Done. The Pruitts are set. ${pick.carrier} takes over on ${pruitt.renewsLong}, with ${money(erie.price - pick.price)} back for Leah and Tom.`;
  }
  return pick.current
    ? "Leah and Tom are staying with Erie. There's nothing to bind, so close it out from their profile below."
    : `Leah and Tom said yes to ${pick.carrier}. Bind it in the ${pick.carrier} portal before ${pruitt.renewsLong}, then close it out from their profile below.`;
}
