import { Button } from "@/components/ui/button";
import { callahan, money, optionById, options, type Day } from "@/data";
import type { WalkProps } from "@/walk";

/**
 * The one thing that needs Stacey, when there is one. It sits between how
 * she's doing and the week's list, and it is the only card with the blue
 * accent stroke. Monday and Wednesday have nothing here, so it isn't drawn.
 */
export function NeedsYou({ day, walk, update, onReview }: WalkProps & { day: Day; onReview: () => void }) {
  const pick = optionById(walk.pick);
  const erie = options.find((o) => o.current)!;
  const couple = "Dana and Mike";

  if (day === "thu") {
    if (walk.recSent) {
      return (
        <Card live>
          <h2 className="text-3xl">Sent to Dana.</h2>
          <p className="mt-3 max-w-[60ch] font-display text-lg font-normal text-muted-foreground">
            We'll let you know when she answers. Nothing else needs you today.
          </p>
        </Card>
      );
    }
    return (
      <Card eyebrow="Needs you" accent>
        <h2 className="mt-3 text-3xl">{couple}'s results are back.</h2>
        <p className="mt-3 max-w-[60ch] font-display text-lg font-normal text-muted-foreground">
          Auto-Owners will write the same coverage for {money(4640)}. That's {money(erie.price - 4640)} less than
          Erie's renewal.
        </p>
        <Button size="lg" className="mt-7" onClick={onReview}>
          Review and send
        </Button>
      </Card>
    );
  }

  // Friday: the policyholder said yes, and binding still happens in the
  // carrier's portal, so Upline's job is to make sure it can't be forgotten.
  if (walk.bound) {
    return (
      <Card live>
        <div className="flex items-start gap-5">
          <Celebration />
          <div>
            <h2 className="text-3xl">Done. The Callahans are set.</h2>
            <p className="mt-3 max-w-[56ch] font-display text-lg font-normal text-muted-foreground">
              {pick.current
                ? `Erie renews on ${callahan.renewsLong}. One more household that stayed with you.`
                : `${pick.carrier} takes over on ${callahan.renewsLong}, with ${money(erie.price - pick.price)} back for ${couple}. One more household that stayed with you.`}
            </p>
            <Button variant="link" className="mt-4 h-auto p-0 font-sans text-sm" onClick={() => update({ bound: false })}>
              Undo
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card eyebrow="Needs you" accent>
      {pick.current ? (
        <>
          <h2 className="mt-3 text-3xl">{couple} are staying with Erie.</h2>
          <p className="mt-3 max-w-[60ch] font-display text-lg font-normal text-muted-foreground">
            There's nothing to bind. Erie renews on its own on {callahan.renewsLong}, so mark it done to close it out.
          </p>
        </>
      ) : (
        <>
          <h2 className="mt-3 text-3xl">
            {couple} said yes to {pick.carrier}.
          </h2>
          <p className="mt-3 max-w-[60ch] font-display text-lg font-normal text-muted-foreground">
            Bind it in the {pick.carrier} portal before {callahan.renewsLong}, then mark it done here. They approved
            Thursday at 6:20 PM.
          </p>
        </>
      )}
      <Button size="lg" className="mt-7" onClick={() => update({ bound: true })}>
        Mark it done
      </Button>
    </Card>
  );
}

function Card({
  eyebrow,
  accent = false,
  live = false,
  children,
}: {
  eyebrow?: string;
  accent?: boolean;
  live?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-live={live ? "polite" : undefined}
      className={
        accent
          ? "border-l-3 border-primary bg-card px-(--card-pad) py-8"
          : "border bg-card px-(--card-pad) py-8"
      }
    >
      {eyebrow && <p className="eyebrow text-muted-foreground">{eyebrow}</p>}
      {children}
    </section>
  );
}

/** A check that pops in and draws itself. Reduced motion shows it still. */
function Celebration() {
  return (
    <span aria-hidden className="celebrate-pop grid size-14 shrink-0 place-items-center bg-primary text-primary-foreground">
      <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path className="celebrate-draw" d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="square" />
      </svg>
    </span>
  );
}
