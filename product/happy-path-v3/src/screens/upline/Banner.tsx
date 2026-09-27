import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { callahan, dayLabel, money, optionById, options, thisWeek, type Day } from "@/data";
import type { WalkProps } from "@/walk";

const words = ["No", "One", "Two", "Three", "Four", "Five", "Six"];

/**
 * The top of the homepage: today's one thing, on the blue band. On Monday it
 * picks up exactly where the email left off (same message, same button), so
 * opening Upline feels like continuing the email rather than starting over.
 * It has to be readable before coffee: one sentence, one button.
 */
export function Banner({
  day,
  walk,
  update,
  onRenewals,
  onReview,
}: WalkProps & { day: Day; onRenewals: () => void; onReview: () => void }) {
  const n = thisWeek.filter((h) => !walk.skipped.includes(h.id)).length;
  const pick = optionById(walk.pick);
  const erie = options.find((o) => o.current)!;

  let content: { headline: string; sub: string; action?: { label: string; onClick: () => void; arrow?: boolean } };

  if (day === "mon") {
    content = walk.approvedAll
      ? {
          headline: `Good morning, Stacey. All ${words[n].toLowerCase()} are set for tomorrow at 9:00 AM.`,
          sub: "Nothing else needs you today. Enjoy your coffee.",
          action: { label: "See them again", onClick: onRenewals, arrow: true },
        }
      : {
          headline: `Good morning, Stacey. Your ${words[n].toLowerCase()} renewals go out tomorrow at 9:00 AM.`,
          sub: "Each one is drafted in your voice and sends from your inbox. Take a quick look, or let them go.",
          action: { label: "Look them over", onClick: onRenewals, arrow: true },
        };
  } else if (day === "wed") {
    content = {
      headline: "Good morning, Stacey. Nothing needs you today.",
      sub: `Your ${words[n].toLowerCase()} went out Tuesday at 9:00 AM, and the Callahans are already being shopped.`,
      action: { label: "See where they stand", onClick: onRenewals, arrow: true },
    };
  } else if (day === "thu") {
    content = walk.recSent
      ? {
          headline: "Sent to Dana. Nothing else needs you today.",
          sub: "We'll let you know when Dana answers.",
          action: { label: "See where the rest stand", onClick: onRenewals, arrow: true },
        }
      : {
          headline: "Good morning, Stacey. Dana and Mike's results are back.",
          sub: `Auto-Owners will write the same coverage for ${money(4640)}, ${money(erie.price - 4640)} less than Erie's renewal.`,
          action: { label: "Review and send", onClick: onReview },
        };
  } else if (walk.bound) {
    return (
      <Band day={day} live>
        <div className="flex items-start gap-5">
          <Celebration />
          <div>
            <p className="font-display text-4xl text-balance">Done. The Callahans are set.</p>
            <p className="mt-3 max-w-[56ch] font-display text-lg font-normal text-blue-100">
              {pick.current
                ? `Erie renews on ${callahan.renewsLong}. One more household that stayed with you.`
                : `${pick.carrier} takes over on ${callahan.renewsLong}, with ${money(erie.price - pick.price)} back for Dana and Mike. One more household that stayed with you.`}
            </p>
            <Button
              variant="link"
              className="mt-4 h-auto p-0 font-sans text-sm text-white"
              onClick={() => update({ bound: false })}
            >
              Undo
            </Button>
          </div>
        </div>
      </Band>
    );
  } else {
    content = pick.current
      ? {
          headline: "Good morning, Stacey. Dana and Mike are staying with Erie.",
          sub: `There's nothing to bind. Erie renews on its own on ${callahan.renewsLong}, so mark it done to close it out.`,
          action: { label: "Mark it done", onClick: () => update({ bound: true }) },
        }
      : {
          headline: `Good morning, Stacey. Dana and Mike said yes to ${pick.carrier}.`,
          sub: `Bind it in the ${pick.carrier} portal before ${callahan.renewsLong}, then mark it done here. They approved Thursday at 6:20 PM.`,
          action: { label: "Mark it done", onClick: () => update({ bound: true }) },
        };
  }

  return (
    <Band day={day} live={day === "thu" || day === "fri"}>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="max-w-[40rem]">
          <p className="font-display text-4xl text-balance">{content.headline}</p>
          <p className="mt-3 font-display text-lg font-normal text-blue-100">{content.sub}</p>
        </div>
        {content.action && (
          <Button size="lg" variant="secondary" onClick={content.action.onClick}>
            {content.action.label}
            {content.action.arrow && <ArrowRight data-icon="inline-end" />}
          </Button>
        )}
      </div>
    </Band>
  );
}

function Band({ day, live = false, children }: { day: Day; live?: boolean; children: React.ReactNode }) {
  return (
    <section aria-label="Today" aria-live={live ? "polite" : undefined} className="band-surface">
      <div className="shell py-12">
        <p className="eyebrow mb-4 text-white">{dayLabel[day]}</p>
        {children}
      </div>
    </section>
  );
}

/** A check that pops in and draws itself. Reduced motion shows it still. */
function Celebration() {
  return (
    <span aria-hidden className="celebrate-pop grid size-14 shrink-0 place-items-center bg-white text-primary">
      <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path className="celebrate-draw" d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="square" />
      </svg>
    </span>
  );
}
