import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react";
import uBadge from "@/assets/upline-u-square.svg";
import { HomeThumb } from "@/components/HomeThumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemGroup } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { dayLabel, money, thisWeek, type Day, type Household } from "@/data";
import { badgeVariant, statusFor } from "@/status";
import type { Walk, WalkProps } from "@/walk";

const words = ["No", "One", "Two", "Three", "Four", "Five", "Six"];

/**
 * The week's renewals, one click from the banner. On Monday it shows the same
 * six two ways, one above the other, so the team can compare: the list, and
 * the same list handed over the way a great colleague would hand it over.
 * On the other days it's the list with where each household stands.
 */
export function Renewals({
  day,
  walk,
  update,
  go,
  onBack,
  onOpen,
  onSeeEveryone,
}: WalkProps & { day: Day; onBack: () => void; onOpen: (id: string) => void; onSeeEveryone: () => void }) {
  const n = thisWeek.filter((h) => !walk.skipped.includes(h.id)).length;
  const word = words[n].toLowerCase();

  return (
    <div className="shell pt-10 pb-(--space-section)">
      <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={onBack}>
        <ArrowLeft data-icon="inline-start" />
        Overview
      </Button>

      <section aria-labelledby="renewals-title" className="mt-10">
        <p className="eyebrow text-muted-foreground">{dayLabel[day]}</p>
        {day === "mon" ? (
          <>
            <h1 id="renewals-title" className="mt-5 max-w-[24ch] text-5xl text-balance">
              {walk.approvedAll
                ? `All ${word} are set for tomorrow at 9:00 AM.`
                : `${words[n]} ${n === 1 ? "renewal goes" : "renewals go"} out tomorrow at 9:00 AM.`}
            </h1>
            <p className="mt-6 max-w-[60ch] font-display text-lg font-normal text-muted-foreground">
              {walk.approvedAll
                ? "Nice. You can still open any of them before then."
                : "Each one is drafted in your voice and sends from your inbox. Look over any you like, or let them go."}
            </p>
            {walk.approvedAll ? (
              <Button variant="link" className="mt-5 h-auto p-0 font-sans text-sm" onClick={() => update({ approvedAll: false })}>
                Undo
              </Button>
            ) : (
              <Button size="lg" className="mt-7" onClick={() => update({ approvedAll: true })} disabled={n === 0}>
                All {n} look good
              </Button>
            )}
          </>
        ) : (
          <>
            <h1 id="renewals-title" className="mt-5 max-w-[24ch] text-5xl text-balance">
              {day === "wed" ? `Your ${word} went out Tuesday morning.` : "Here's where this week's renewals stand."}
            </h1>
            <p className="mt-6 max-w-[60ch] font-display text-lg font-normal text-muted-foreground">
              {day === "wed"
                ? "Here's where each one stands. Nothing needs you today."
                : "Everyone else is moving on their own."}
            </p>
          </>
        )}

        <div className="mt-10">
          {day === "mon" && <p className="mb-3 text-right text-sm text-muted-foreground">Biggest increase first</p>}
          <ItemGroup className="gap-0 divide-y border bg-card">
            {thisWeek.map((h) => (
              <Row key={h.id} h={h} day={day} walk={walk} onOpen={onOpen} />
            ))}
          </ItemGroup>
        </div>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-sm">
          <p className="text-muted-foreground">
            {day === "mon"
              ? "Also in motion: Priya Patel and Kevin Brooks are being shopped, with results due Tuesday."
              : "Earlier weeks: Priya's and Kevin's recommendations went out Tuesday, and Elena Vasquez hasn't answered yet."}
          </p>
          <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={onSeeEveryone}>
            See everyone
            <ArrowRight data-icon="inline-end" />
          </Button>
        </div>
      </section>

      {day === "mon" && (
        <>
          <Separator className="my-(--space-section)" />
          <FromAColleague walk={walk} update={update} go={go} onOpen={onOpen} />
        </>
      )}
    </div>
  );
}

function Row({ h, day, walk, onOpen }: { h: Household; day: Day; walk: Walk; onOpen: (id: string) => void }) {
  const skipped = walk.skipped.includes(h.id);
  const approved = !skipped && (walk.approvedAll || walk.approved.includes(h.id));
  const status = day === "mon" ? null : statusFor(h, day, walk);
  const increase = h.now - h.was;
  const sentence = status ? status.detail : skipped ? "Skipped. You're handling this one yourself." : h.why;

  // The home on the left tells the six apart at a glance; the facts sit
  // beside it, and the sentence that explains them underneath.
  return (
    <div role="listitem">
      <Item
        asChild
        className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto_1rem] items-start gap-x-5 gap-y-2 px-6 py-5 text-left hover:bg-background"
      >
        <button type="button" onClick={() => onOpen(h.id)}>
          <HomeThumb id={h.id} className="row-span-2" />

          <span className="min-w-0">
            <span className={skipped ? "block truncate text-base text-muted-foreground" : "block truncate text-base font-medium"}>
              {h.name}
            </span>
            <span className="block text-sm text-muted-foreground">
              {h.lines} · {h.carrier} · Renews {h.renews}
            </span>
          </span>

          <span className="text-right">
            {status ? (
              <Badge variant={badgeVariant(status.label)}>{status.label}</Badge>
            ) : skipped ? (
              <Badge variant="outline">Skipped</Badge>
            ) : (
              <>
                <span className="block text-base font-medium tabular-nums">
                  {increase > 0 ? `+${money(increase)}` : "No change"}
                </span>
                <span className="block text-sm text-muted-foreground tabular-nums">
                  {increase > 0 ? `${money(h.was)} → ${money(h.now)}` : money(h.now)}
                </span>
              </>
            )}
          </span>

          <span className="row-span-2 self-center">
            {approved && day === "mon" ? (
              <Check className="size-4 text-primary" aria-label="Looks good" />
            ) : (
              <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
            )}
          </span>

          <span className="col-span-2 col-start-2 max-w-[70ch] text-sm">{sentence}</span>
        </button>
      </Item>
    </div>
  );
}

/**
 * The same six, handed over the way a great colleague would: what's queued,
 * one decision, and a note on each household saying what they'd mention.
 * Everything is prepped; Stacey only has to say go.
 */
function FromAColleague({ walk, update, onOpen }: WalkProps & { onOpen: (id: string) => void }) {
  const n = thisWeek.filter((h) => !walk.skipped.includes(h.id)).length;
  const word = words[n].toLowerCase();

  return (
    <section aria-labelledby="colleague-title">
      <p className="flex items-center gap-3 text-sm text-muted-foreground">
        <img src={uBadge} alt="" className="size-6" />
        Upline · Monday, 8:00 AM
      </p>
      <h2 id="colleague-title" className="mt-5 max-w-[34ch] text-3xl text-balance">
        {walk.approvedAll
          ? `Done. All ${word} are scheduled to go out tomorrow at 9:00 AM.`
          : `I have ${word} renewal requests queued to send tomorrow. Do you want to review them, or schedule them to auto-send?`}
      </h2>
      {walk.approvedAll ? (
        <Button variant="link" className="mt-5 h-auto p-0 font-sans text-sm" onClick={() => update({ approvedAll: false })}>
          Undo
        </Button>
      ) : (
        <Button size="lg" className="mt-7" onClick={() => update({ approvedAll: true })} disabled={n === 0}>
          Schedule to auto-send
        </Button>
      )}

      <ol className="mt-10 max-w-[72ch] divide-y border-y">
        {thisWeek.map((h) => {
          const skipped = walk.skipped.includes(h.id);
          return (
            <li key={h.id} className="py-7">
              <p className="text-base">
                <span className={skipped ? "text-muted-foreground" : "font-medium"}>{h.name}</span>{" "}
                <span className="text-muted-foreground">(renews {h.renewsLong})</span>
              </p>
              <p className="mt-2 text-base">
                {skipped ? "You skipped this one, so it won't go out this time." : h.colleague}
              </p>
              <Button variant="link" className="mt-3 h-auto p-0 font-sans text-sm" onClick={() => onOpen(h.id)}>
                Review the email
                <ArrowRight data-icon="inline-end" />
              </Button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
