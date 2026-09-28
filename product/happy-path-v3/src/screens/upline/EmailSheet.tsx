import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { HomeThumb } from "@/components/HomeThumb";
import { HouseholdDetails } from "@/components/HouseholdDetails";
import { PersonLink } from "@/components/PersonLink";
import { PriceChange } from "@/components/PriceChange";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldLabel } from "@/components/ui/field";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { agency, money, thisWeek, type Day, type Household } from "@/data";
import { badgeVariant, statusFor } from "@/status";
import type { WalkProps } from "@/walk";

/**
 * One household's email in full, in a sheet from the right, opened from its
 * row under Scheduled Renewal Emails or from the profile. The email comes
 * first, exactly as it will send. Why the price moved, Upline's note, what
 * we'll ask and the household are each one click down. Ideally nobody edits
 * anything, because the drafts are good.
 */
export function EmailSheet({
  id,
  onClose,
  ...props
}: WalkProps & { id: string | null; day: Day; onClose: () => void; onProfile: () => void }) {
  // Keep the last household on screen while the sheet slides away.
  const [shown, setShown] = useState<Household | null>(null);
  const h = thisWeek.find((x) => x.id === id) ?? null;
  if (h && h !== shown) setShown(h);

  return (
    <Sheet open={h !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 p-0 outline-none data-[side=right]:sm:max-w-[600px]">
        {shown && <Body key={shown.id} h={shown} onClose={onClose} {...props} />}
      </SheetContent>
    </Sheet>
  );
}

function Body({
  h,
  day,
  walk,
  update,
  onClose,
  onProfile,
}: WalkProps & { h: Household; day: Day; onClose: () => void; onProfile: () => void }) {
  const [confirmSkip, setConfirmSkip] = useState(false);
  const editable = day === "mon";
  const skipped = walk.skipped.includes(h.id);
  const draft = walk.drafts[h.id] ?? h.email;
  const life = walk.lifeQuote[h.id] ?? true;
  const increase = h.now - h.was;
  const status = day === "mon" ? null : statusFor(h, day, walk);

  const looksGood = () => {
    update((w) => ({ approved: [...new Set([...w.approved, h.id])] }));
    onClose();
  };

  const skip = () => {
    update((w) => ({ skipped: [...new Set([...w.skipped, h.id])] }));
    onClose();
  };

  return (
    <>
      <SheetHeader className="flex-row items-start gap-4 border-b px-7 py-6 pr-16">
        <HomeThumb id={h.id} className="size-10" />
        <div className="min-w-0 flex-1">
          <SheetTitle className="font-display text-2xl">
            <PersonLink h={h} onProfile={onProfile} className="max-w-full truncate" />
          </SheetTitle>
          <SheetDescription className="mt-1">
            {h.lines} · {h.carrier} · Renews {h.renewsLong}
          </SheetDescription>
        </div>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-7 py-8 text-base">
        {status && (
          <div className="flex items-start gap-3">
            <Badge variant={badgeVariant(status.label)}>{status.label}</Badge>
            <p className="text-sm">{status.detail}</p>
          </div>
        )}

        <section aria-label="The email">
          <p className="text-sm text-muted-foreground">
            From {agency.agent.email} · {editable ? "Sends Tuesday at 9:00 AM" : "Sent Tuesday at 9:00 AM"}
          </p>
          <p className="mt-4 text-sm">
            <span className="text-muted-foreground">Subject </span>
            {h.subject}
          </p>
          <Textarea
            aria-label={`Email to ${h.first}`}
            className="mt-2 min-h-[21rem] bg-background leading-relaxed"
            value={draft}
            readOnly={!editable}
            onChange={(e) => update((w) => ({ drafts: { ...w.drafts, [h.id]: e.target.value } }))}
          />
        </section>

        <div className="flex flex-col gap-3">
          <Fold title="Why the price moved" hint={increase > 0 ? `+${money(increase)}` : "No change"}>
            <PriceChange h={h} />
          </Fold>

          <Fold title="A note from Upline">
            <p>{h.colleague}</p>
          </Fold>

          <Fold title={`What we'll ask ${h.first}`}>
            <p>
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
          </Fold>

          <Fold title="Household details">
            <HouseholdDetails h={h} day={day} />
          </Fold>
        </div>
      </div>

      {editable && (
        <SheetFooter className="border-t px-7 py-5">
          {skipped ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm">Skipped. {h.first} won't get an email this time, and we won't shop it.</p>
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
    </>
  );
}

function Fold({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="group w-full justify-between">
          <span className="flex items-baseline gap-3">
            {title}
            {hint && <span className="font-sans font-normal text-muted-foreground tabular-nums">{hint}</span>}
          </span>
          <ChevronDown data-icon="inline-end" className="transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pt-5 pb-3 text-base">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
