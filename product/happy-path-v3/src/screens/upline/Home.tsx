import { BandGrain } from "@/components/BandGrain";
import { Button } from "@/components/ui/button";
import { agency, callahan, dayName, mondayNeeds, money, optionById, options, type Day } from "@/data";
import { matchPill, pillById, suggested, type PillId } from "@/pills";
import { AskBox, Suggestions } from "@/screens/upline/Ask";
import { Sections } from "@/screens/upline/Sections";
import { going, todayFor, words } from "@/today";
import type { Walk, WalkProps } from "@/walk";

type HomeProps = WalkProps & {
  day: Day;
  household: string | null;
  onAsk: (question: string, answer: PillId | null) => void;
  onHousehold: (id: string) => void;
  /** Opens the Callahans' shop results. */
  onResults: () => void;
  onPolicyholders: () => void;
};

/**
 * The homepage, the same every day: the band, then the sections. It has to be
 * readable before coffee, so the band only greets Stacey, says in one line
 * what's going on, and offers the box to ask anything and the way to her
 * whole book; everything she might act on sits below it, in the three
 * sections, most pressing first. Asking docks a chat along the bottom.
 */
export function Home({ day, walk, onAsk, onPolicyholders, ...props }: HomeProps) {
  return (
    <>
      <Hero day={day} walk={walk} onAsk={onAsk} onPolicyholders={onPolicyholders} />
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
 * email opens. A greeting for the day, the day's line, the box to ask anything
 * with three questions written out inside it, and a link to the Policyholder
 * List. It never holds a card or a button, so it reads the same every day. The
 * link is white and underlined, the band's link, since the kit's blue would
 * vanish on the blue.
 */
function Hero({
  day,
  walk,
  onAsk,
  onPolicyholders,
}: {
  day: Day;
  walk: Walk;
  onAsk: HomeProps["onAsk"];
  onPolicyholders: () => void;
}) {
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
          <AskBox label="Ask me anything" className="mt-10 text-left" onAsk={(q) => onAsk(q, matchPill(q))}>
            <Suggestions ids={suggested} size="sm" onAsk={(id) => onAsk(pillById(id).question, id)} />
          </AskBox>
          <div className="mt-(--space-tight) flex justify-center">
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
 * far. Monday counts what's below; Wednesday's is the day's brief, which the
 * chat's "What needs me today?" also reads; Thursday and Friday follow the
 * Callahans.
 */
function lineFor(day: Day, walk: Walk): string {
  const skipped = walk.skipped.includes(callahan.id);

  if (day === "mon") {
    const closing = mondayNeeds("closing").filter((e) => walk.closed[e.id] === undefined).length;
    const shopped = mondayNeeds("shopped").length;
    const n = going(walk);
    return `You have ${plural(closing, "renewal", "renewals")} closing this week and ${plural(shopped, "shop", "shops")} ready for review. ${words[n]} renewal ${n === 1 ? "email goes" : "emails go"} out tomorrow at 9 AM.`;
  }

  if (day === "wed") return todayFor(day, walk).lead;

  if (skipped) return "Nothing needs you today.";

  if (day === "thu") {
    return walk.recSent
      ? "Your recommendation went to Dana and Mike. We'll let you know when they answer."
      : "Shopping has been completed for Dana and Mike Callahan.";
  }

  const pick = optionById(walk.pick);
  const erie = options.find((o) => o.current)!;
  if (walk.bound) {
    return pick.current
      ? `Done. The Callahans are set. Erie renews on ${callahan.renewsLong}.`
      : `Done. The Callahans are set. ${pick.carrier} takes over on ${callahan.renewsLong}, with ${money(erie.price - pick.price)} back for Dana and Mike.`;
  }
  return pick.current
    ? "Dana and Mike are staying with Erie. There's nothing to bind, so mark it closed below."
    : `Dana and Mike said yes to ${pick.carrier}. Bind it in the ${pick.carrier} portal before ${callahan.renewsLong}, then mark it closed below.`;
}
