import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Item, ItemGroup } from "@/components/ui/item";
import { money, thisWeek, type Day, type Household } from "@/data";
import { badgeVariant, statusFor } from "@/status";
import type { Walk, WalkProps } from "@/walk";

const words = ["No", "One", "Two", "Three", "Four", "Five", "Six"];

/**
 * This week's renewals as one flat list: no columns, no board. The state of
 * each household is a sentence on its row. Monday is the only day with
 * anything to do here, and even then silence means send.
 */
export function Week({
  day,
  walk,
  update,
  onOpen,
  onSeeEveryone,
}: WalkProps & { day: Day; onOpen: (id: string) => void; onSeeEveryone: () => void }) {
  const sending = thisWeek.filter((h) => !walk.skipped.includes(h.id));
  const n = sending.length;

  return (
    <section aria-labelledby="week-title">
      {day === "mon" ? (
        <>
          <h2 id="week-title" className="max-w-[24ch] text-4xl text-balance">
            {walk.approvedAll
              ? `All ${words[n].toLowerCase()} are set for tomorrow at 9:00 AM.`
              : `${words[n]} ${n === 1 ? "renewal goes" : "renewals go"} out tomorrow at 9:00 AM.`}
          </h2>
          <p className="mt-4 max-w-[60ch] font-display text-lg font-normal text-muted-foreground">
            {walk.approvedAll
              ? "Nice. You can still open any of them before then."
              : "Each one is drafted in your voice and sends from your inbox. Look over any you like, or let them go."}
          </p>
          {walk.approvedAll ? (
            <Button
              variant="link"
              className="mt-5 h-auto p-0 font-sans text-sm"
              onClick={() => update({ approvedAll: false })}
            >
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
          <h2 id="week-title" className="max-w-[24ch] text-4xl text-balance">
            {day === "wed" ? "Nothing needs you today." : "Everyone else is moving on their own."}
          </h2>
          <p className="mt-4 max-w-[60ch] font-display text-lg font-normal text-muted-foreground">
            {day === "wed"
              ? `Your ${words[n].toLowerCase()} went out Tuesday at 9:00 AM from your inbox. Here's where each one stands.`
              : "Here's where each of this week's renewals stands."}
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
            : "Earlier weeks: Priya's and Kevin's recommendations went out Tuesday, and Elena Vasquez hasn't answered hers yet."}
        </p>
        <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={onSeeEveryone}>
          See everyone
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </section>
  );
}

function Row({ h, day, walk, onOpen }: { h: Household; day: Day; walk: Walk; onOpen: (id: string) => void }) {
  const skipped = walk.skipped.includes(h.id);
  const approved = !skipped && (walk.approvedAll || walk.approved.includes(h.id));
  const status = day === "mon" ? null : statusFor(h, day, walk);
  const increase = h.now - h.was;
  const sentence = status ? status.detail : skipped ? "Skipped. You're handling this one yourself." : h.why;

  // Two lines of facts (who, and what it costs) with the sentence that
  // explains it underneath, read the way you'd say it.
  return (
    <div role="listitem">
      <Item
        asChild
        className="grid grid-cols-[minmax(0,1fr)_auto_1rem] items-start gap-x-6 gap-y-3 px-6 py-5 text-left hover:bg-background"
      >
        <button type="button" onClick={() => onOpen(h.id)}>
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

          <span className="col-span-2 max-w-[70ch] text-sm">{sentence}</span>
        </button>
      </Item>
    </div>
  );
}
