import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { callahan, dayLabel, money, optionById, options, thisWeek, type Day } from "@/data";
import type { WalkProps } from "@/walk";

const words = ["No", "One", "Two", "Three", "Four", "Five", "Six"];

/**
 * The top of the homepage: today's one thing. Monday's is a slim bar modelled
 * on the Founding Members bar on uplineinsurance.com, set inside the page
 * padding rather than edge to edge. Stacey has just read the email, so it
 * points her to the six instead of repeating the email. The later days use the
 * full blue band. Either way it has to be readable before coffee: one
 * sentence, one action.
 */
export function Banner({
  day,
  walk,
  update,
  onRenewals,
  onReview,
}: WalkProps & { day: Day; onRenewals: () => void; onReview: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  const n = thisWeek.filter((h) => !walk.skipped.includes(h.id)).length;
  const pick = optionById(walk.pick);
  const erie = options.find((o) => o.current)!;

  if (day === "mon") {
    if (dismissed) return null;
    return (
      <Notice
        message={
          walk.approvedAll
            ? `All ${words[n].toLowerCase()} are set for tomorrow at 9 AM.`
            : `${words[n]} ${n === 1 ? "renewal is" : "renewals are"} going out tomorrow at 9 AM.`
        }
        action={walk.approvedAll ? "See them again" : "Look them over"}
        onClick={onRenewals}
        onDismiss={() => setDismissed(true)}
      />
    );
  }

  let content: { headline: string; sub: string; action?: { label: string; onClick: () => void; arrow?: boolean } };

  if (day === "wed") {
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

/**
 * The slim bar, matching the marketing site's except for its width: the
 * sentence and its link are one control, centred on the blue, with a close
 * button at the right edge. Closing it hides it until the overview next opens.
 */
function Notice({
  message,
  action,
  onClick,
  onDismiss,
}: {
  message: string;
  action: string;
  onClick: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="shell pt-10">
      <section aria-label="Today" className="band-surface relative flex items-center justify-center px-12 py-2">
        <button
          type="button"
          onClick={onClick}
          className="group text-center text-sm sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5"
        >
          <span>{message}</span>{" "}
          <span className="whitespace-nowrap underline-offset-4 group-hover:underline">
            {action} <span aria-hidden>→</span>
          </span>
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="absolute top-1/2 right-6 -translate-y-1/2 text-white/80 transition-colors after:absolute after:-inset-3.5 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </section>
    </div>
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
