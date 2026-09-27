import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldLabel } from "@/components/ui/field";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { agency, money, thisWeek, type Day } from "@/data";
import { badgeVariant, statusFor } from "@/status";
import { focusPanel } from "@/lib/focus";
import type { WalkProps } from "@/walk";

/**
 * One household's outreach, opened from the list. It leads with why the
 * price moved, then the email exactly as it will send. Everything else, the
 * household and the questions we'll ask, is one line or one click away.
 * Ideally nobody opens this, because the drafts are good.
 */
export function OutreachSheet({
  id,
  day,
  onClose,
  walk,
  update,
}: WalkProps & { id: string | null; day: Day; onClose: () => void }) {
  const editable = day === "mon";
  // Keep the last household on screen while the sheet animates closed.
  const [shownId, setShownId] = useState(id);
  if (id && id !== shownId) setShownId(id);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const h = thisWeek.find((x) => x.id === shownId);

  if (!h) return null;

  const skipped = walk.skipped.includes(h.id);
  const draft = walk.drafts[h.id] ?? h.email;
  const life = walk.lifeQuote[h.id] ?? true;
  const increase = h.now - h.was;
  const pctOf = (a: number, b: number) => Math.round(((b - a) / a) * 100);
  const biggest = [...h.policies].sort((a, b) => b.renewal - b.current - (a.renewal - a.current))[0];
  const status = day === "mon" ? null : statusFor(h, day, walk);

  const close = () => {
    setConfirmSkip(false);
    onClose();
  };

  const looksGood = () => {
    update((w) => ({ approved: [...new Set([...w.approved, h.id])] }));
    close();
  };

  const skip = () => {
    update((w) => ({ skipped: [...new Set([...w.skipped, h.id])] }));
    close();
  };

  return (
    <Sheet open={id !== null} onOpenChange={(open) => !open && close()}>
      <SheetContent
        onOpenAutoFocus={focusPanel}
        className="w-full gap-0 p-0 outline-none data-[side=right]:sm:max-w-[600px]">
        <SheetHeader className="gap-1 border-b px-7 py-6 pr-16">
          <SheetTitle className="font-display text-2xl">{h.name}</SheetTitle>
          <SheetDescription>
            {h.lines} · {h.carrier} · Renews {h.renewsLong}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-10 overflow-y-auto px-7 py-8 text-base">
          {status && (
            <div className="flex items-start gap-3">
              <Badge variant={badgeVariant(status.label)}>{status.label}</Badge>
              <p className="text-sm">{status.detail}</p>
            </div>
          )}

          <section aria-label="What changed">
            <p className="font-display text-3xl">
              {increase > 0 ? `+${money(increase)}` : "No change"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground tabular-nums">
              {increase > 0
                ? `${money(h.was)} → ${money(h.now)} a year, up ${pctOf(h.was, h.now)}%`
                : `The same ${money(h.now)} a year as last time`}
            </p>
            <p className="mt-4">{h.why}</p>
            <dl className="mt-5 divide-y border-y text-sm">
              {h.policies.map((p) => {
                const up = p.renewal - p.current;
                return (
                  <div key={p.line} className="flex items-baseline justify-between gap-4 py-3">
                    <dt>
                      {p.short}
                      <span className="text-muted-foreground"> · {p.detail}</span>
                    </dt>
                    <dd className="shrink-0 tabular-nums">
                      {money(p.current)} → {money(p.renewal)}
                      <span
                        className={
                          h.policies.length > 1 && p === biggest && up > 0
                            ? "ml-3 inline-block w-12 text-right font-medium"
                            : "ml-3 inline-block w-12 text-right text-muted-foreground"
                        }
                      >
                        {up > 0 ? `+${pctOf(p.current, p.renewal)}%` : "0%"}
                      </span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>

          <section aria-labelledby="outreach-email">
            <h3 id="outreach-email" className="text-xl">
              The email
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              From {agency.agent.email} · {editable ? "Sends Tuesday at 9:00 AM" : "Sent Tuesday at 9:00 AM"}
            </p>
            <p className="mt-5 text-sm">
              <span className="text-muted-foreground">Subject </span>
              {h.subject}
            </p>
            <Textarea
              aria-label={`Email to ${h.first}`}
              className="mt-2 min-h-[21rem] leading-relaxed"
              value={draft}
              readOnly={!editable}
              onChange={(e) => update((w) => ({ drafts: { ...w.drafts, [h.id]: e.target.value } }))}
            />
          </section>

          <section aria-labelledby="outreach-ask">
            <h3 id="outreach-ask" className="text-xl">
              What we'll ask {h.first}
            </h3>
            <p className="mt-2">
              To confirm their contact details and anything new in the household
              {h.id === "callahan" ? ", including Sophie's license number" : ""}, and whether they know anyone who'd
              want the same look at their renewal.
            </p>
            <Field orientation="horizontal" className="mt-5">
              <Switch
                id={`life-${h.id}`}
                checked={life}
                disabled={!editable}
                onCheckedChange={(v) => update((w) => ({ lifeQuote: { ...w.lifeQuote, [h.id]: v } }))}
              />
              <FieldLabel htmlFor={`life-${h.id}`} className="font-normal">
                Also ask if they'd like a life quote
              </FieldLabel>
            </Field>
          </section>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="group w-full justify-between">
                Household details
                <ChevronDown data-icon="inline-end" className="transition-transform group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <dl className="mt-4 grid grid-cols-[8rem_1fr] gap-x-6 gap-y-4 text-sm">
                <dt className="text-muted-foreground">People</dt>
                <dd>
                  {h.people.map((p) => (
                    <p key={p.name}>
                      {p.name}
                      <span className="text-muted-foreground">
                        {" "}
                        · {p.role}
                        {p.note ? ` · ${p.note}` : ""}
                      </span>
                    </p>
                  ))}
                </dd>
                {h.vehicles.length > 0 && (
                  <>
                    <dt className="text-muted-foreground">Vehicles</dt>
                    <dd>{h.vehicles.join(" · ")}</dd>
                  </>
                )}
                {h.home && (
                  <>
                    <dt className="text-muted-foreground">Home</dt>
                    <dd>{h.home.join(" · ")}</dd>
                  </>
                )}
                <dt className="text-muted-foreground">Address</dt>
                <dd>{h.address}</dd>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{h.phone}</dd>
              </dl>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {editable && (
          <SheetFooter className="border-t px-7 py-5">
            {skipped ? (
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm">
                  Skipped. {h.first} won't get an email this time, and we won't shop it.
                </p>
                <Button
                  variant="outline"
                  onClick={() => update((w) => ({ skipped: w.skipped.filter((x) => x !== h.id) }))}
                >
                  Undo
                </Button>
              </div>
            ) : confirmSkip ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm">
                  Skip {h.first} this time? They won't get an email and we won't shop it. You can change this until
                  Tuesday at 9:00 AM.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setConfirmSkip(false)}>
                    Keep it
                  </Button>
                  <Button variant="secondary" onClick={skip}>
                    Skip this renewal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <Button variant="ghost" className="-ml-3.5" onClick={() => setConfirmSkip(true)}>
                  Skip this renewal
                </Button>
                <Button onClick={looksGood}>Looks good</Button>
              </div>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
