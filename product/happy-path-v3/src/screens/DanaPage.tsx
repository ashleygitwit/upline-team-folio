import { useState } from "react";
import { Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AgencyMark, AgencyScope, Stage } from "@/components/Stage";
import { PlainEmail } from "@/components/PlainEmail";
import { agency, callahan, money, optionById, options, recEmails, recSubject } from "@/data";
import type { WalkProps } from "@/walk";

/**
 * Thursday evening: Stacey's email, then the page it links to. The page is
 * a brief, not a price grid: one pick, the reasoning up front, and a button
 * that says plainly it doesn't put coverage in place. If Stacey picked Erie,
 * it shows all three and suggests a call instead.
 */
export function DanaPage({ walk, update }: WalkProps) {
  const [view, setView] = useState<"email" | "page">(walk.danaApproved ? "page" : "email");
  const pick = optionById(walk.pick);
  const erie = options.find((o) => o.current)!;
  const saving = erie.price - pick.price;

  return (
    <Stage caption="Dana's phone · Thursday, October 15, 6:12 PM" size="phone">
      <AgencyScope>
        {view === "email" ? (
          <PlainEmail
            time="11:20 AM"
            subject={recSubject}
            body={walk.recDraft ?? recEmails[walk.pick]}
            onLink={() => setView("page")}
          />
        ) : walk.danaApproved ? (
          <div className="flex flex-1 flex-col">
            <PageHeader />
            <div className="flex flex-1 flex-col justify-center px-6" aria-live="polite">
              <span aria-hidden className="grid size-12 place-items-center bg-primary text-primary-foreground">
                <Check className="size-6" />
              </span>
              <h1 className="mt-6 text-2xl">Thanks, Dana.</h1>
              <p className="mt-3 text-base">
                {pick.current
                  ? `Nothing changes. Your Erie policy renews on ${callahan.renewsLong}.`
                  : `Stacey will take it from here and confirm with you before ${callahan.renewsLong}. Nothing changes until she does.`}
              </p>
              <Button
                variant="link"
                className="mt-8 h-auto self-start p-0 font-sans text-sm"
                onClick={() => update({ danaApproved: false })}
              >
                Undo
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <PageHeader />
            <article className="px-5 pt-8 pb-10">
              <p className="eyebrow text-muted-foreground">Your renewal, shopped</p>

              {pick.current ? (
                <>
                  <h1 className="mt-3 text-3xl">My advice: stay with Erie, Dana.</h1>
                  <p className="mt-4 text-base">
                    I shopped your home and auto with Auto-Owners and Grange too. Here's everything that came back.
                  </p>
                  <ul className="mt-6 divide-y border-y">
                    {options.map((o) => (
                      <li key={o.id} className="flex items-baseline justify-between gap-4 py-4">
                        <span>
                          <span className="block font-medium">{o.carrier}</span>
                          <span className="block text-sm text-muted-foreground">{o.current ? "Your renewal" : o.tag}</span>
                        </span>
                        <span className="text-base font-medium tabular-nums">{money(o.price)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <h1 className="mt-3 text-3xl">
                    Switch to {pick.carrier} and save {money(saving)} a year.
                  </h1>
                  <div className="mt-7 grid grid-cols-2 border">
                    <div className="border-r p-4">
                      <p className="text-sm text-muted-foreground">Erie's renewal</p>
                      <p className="mt-1 font-display text-2xl text-muted-foreground">{money(erie.price)}</p>
                      <p className="text-sm text-muted-foreground">a year</p>
                    </div>
                    <div className="bg-(--agency-soft) p-4">
                      <p className="text-sm">{pick.carrier}</p>
                      <p className="mt-1 font-display text-2xl">{money(pick.price)}</p>
                      <p className="text-sm text-muted-foreground">a year</p>
                    </div>
                  </div>
                  <p className="mt-5 text-base">{pick.change}</p>
                  <ul className="mt-4 flex flex-col gap-2 text-base">
                    {[
                      "$485,000 on the house",
                      pick.id === "grange" ? "$2,500 home deductible (up from $1,000)" : "$1,000 home deductible",
                      "100/300 auto liability",
                      "$500 comp and collision deductibles",
                      "Replacement cost on the roof",
                    ].map((t) => (
                      <li key={t} className="flex gap-3">
                        <Check aria-hidden className="mt-1 size-4 shrink-0 text-primary" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <figure className="mt-8 border-l-3 border-primary pl-4">
                <blockquote className="text-base">
                  {pick.id === "ao"
                    ? "Sophie rates cleanly with Auto-Owners, and nothing else on your household needed to change. Grange came in a little under Erie too, but it would have raised your home deductible to $2,500, so I didn't think it was worth it."
                    : pick.id === "grange"
                      ? "Grange saves you $480 a year. The tradeoff is a $2,500 home deductible, so if you'd rather keep it at $1,000, let's talk before you decide."
                      : "Staying put is on the table if that's what you'd like. Auto-Owners would save you $1,050 for the same coverage, so it's worth a quick call before you decide."}
                </blockquote>
                <figcaption className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-(--agency) text-xs text-white">{agency.agent.initials}</AvatarFallback>
                  </Avatar>
                  Stacey Cole, {agency.name}
                </figcaption>
              </figure>

              {!pick.current && (
                <p className="mt-8 text-base">
                  And congratulations on Sophie's license. She's on the new policy as a driver on the Camry.
                </p>
              )}

              <Button size="lg" className="mt-8 w-full" onClick={() => update({ danaApproved: true })}>
                {pick.current ? "Keep Erie" : `Approve ${pick.carrier}`}
              </Button>
              <p className="mt-3 text-sm text-muted-foreground">
                {pick.current
                  ? "Your policy renews as it is. Nothing to sign."
                  : `Approving tells Stacey to go ahead. It doesn't put coverage in place yet: she'll finish the paperwork and confirm with you before ${callahan.renewsLong}.`}
              </p>
              <p className="mt-6 text-base">Rather talk it through? Reply to Stacey's email and she'll call you.</p>
            </article>
          </div>
        )}
      </AgencyScope>
    </Stage>
  );
}

function PageHeader() {
  return (
    <header className="flex items-center justify-between border-b px-5 py-4">
      <AgencyMark />
      <span className="text-sm text-muted-foreground">For the Callahans</span>
    </header>
  );
}
