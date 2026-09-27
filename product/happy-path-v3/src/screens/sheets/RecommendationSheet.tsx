import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { QuoteDialog } from "@/screens/sheets/QuoteDialog";
import {
  agency,
  callahan,
  money,
  numbers,
  options,
  quotes,
  recEmails,
  recSubject,
  talkingPoints,
  type Day,
  type PickId,
  type Quote,
} from "@/data";
import { focusPanel } from "@/lib/focus";
import type { WalkProps } from "@/walk";

/**
 * The Callahans' shop, the one drawer an agent should expect to open. It
 * reads top to bottom the way Stacey would think it through: what came back
 * and what to say about it, which carrier goes out under Stacey's name, and the
 * email Dana gets. The comparison table and the carrier PDFs are there for
 * whoever wants them, one click down. Nothing goes to Dana until Stacey sends.
 */
export function RecommendationSheet({
  open,
  day,
  onClose,
  walk,
  update,
}: WalkProps & { open: boolean; day: Day; onClose: () => void }) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const sent = walk.recSent || day === "fri";
  const draft = walk.recDraft ?? recEmails[walk.pick];
  const erie = options.find((o) => o.current)!;

  const send = () => {
    update({ recSent: true });
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        onOpenAutoFocus={focusPanel}
        className="w-full gap-0 p-0 outline-none data-[side=right]:sm:max-w-[640px]">
        <SheetHeader className="gap-1 border-b px-7 py-6 pr-16">
          <SheetTitle className="font-display text-2xl">{callahan.name}</SheetTitle>
          <SheetDescription>
            {callahan.lines} · {callahan.carrier} · Renews {callahan.renewsLong} · Shopped Thursday morning
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-10 overflow-y-auto px-7 py-8 text-base">
          <p className="font-display text-2xl">
            Auto-Owners will write the same coverage for {money(4640)}. That's {money(erie.price - 4640)} less than
            Erie's renewal.
          </p>

          <section aria-labelledby="rec-points">
            <h3 id="rec-points" className="text-xl">
              What to call out
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {talkingPoints.map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 bg-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="rec-pick">
            <h3 id="rec-pick" className="text-xl">
              Your pick
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">Dana sees one option: the one you choose here.</p>
            <RadioGroup
              value={walk.pick}
              onValueChange={(v) => update({ pick: v as PickId, recDraft: null })}
              disabled={sent}
              className="mt-4 gap-3"
            >
              {options.map((o) => {
                const diff = erie.price - o.price;
                return (
                  <FieldLabel key={o.id} htmlFor={`pick-${o.id}`}>
                    <Field orientation="horizontal" className="items-center!">
                      <RadioGroupItem value={o.id} id={`pick-${o.id}`} />
                      <FieldContent>
                        <FieldTitle className="text-base">{o.carrier}</FieldTitle>
                        <FieldDescription>{o.tag}</FieldDescription>
                      </FieldContent>
                      <span className="text-right">
                        <span className="block text-base font-medium tabular-nums">{money(o.price)}</span>
                        <span className="block text-sm text-muted-foreground tabular-nums">
                          {o.current ? "Renewal" : `${money(diff)} less`}
                        </span>
                      </span>
                    </Field>
                  </FieldLabel>
                );
              })}
            </RadioGroup>

            <Collapsible className="mt-4">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="group w-full justify-between">
                  Show the numbers
                  <ChevronDown data-icon="inline-end" className="transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Table className="mt-4 text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[34%]">
                        <span className="sr-only">Coverage</span>
                      </TableHead>
                      <TableHead>Erie today</TableHead>
                      <TableHead>Auto-Owners</TableHead>
                      <TableHead>Grange</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {numbers.map((r) => (
                      <TableRow key={r.label}>
                        <TableCell className="text-muted-foreground">{r.label}</TableCell>
                        <TableCell className="tabular-nums">{r.erie}</TableCell>
                        <NumberCell value={r.ao} />
                        <NumberCell value={r.grange} />
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="mt-3 text-sm text-muted-foreground">"Same" means it matches what Erie has today.</p>
              </CollapsibleContent>
            </Collapsible>
          </section>

          <section aria-labelledby="rec-quotes">
            <h3 id="rec-quotes" className="text-xl">
              From the carriers
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">The quotes as each carrier sent them.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {quotes.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setQuote(q)}
                  className="flex items-center gap-3 border bg-card p-3 text-left transition-colors hover:bg-background"
                >
                  <span aria-hidden className="grid size-10 shrink-0 place-items-center bg-muted">
                    <FileText className="size-4 text-muted-foreground" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {q.carrier} {q.current ? "renewal" : "quote"}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {q.title.replace(/ (renewal|quote)$/, "")} · {q.premium}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section aria-labelledby="rec-email">
            <h3 id="rec-email" className="text-xl">
              The email to Dana
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              From {agency.agent.email}, with a link to Dana's page. It goes out when you send it.
            </p>
            <p className="mt-5 text-sm">
              <span className="text-muted-foreground">Subject </span>
              {recSubject}
            </p>
            <Textarea
              aria-label="Email to Dana"
              className="mt-2 min-h-[19rem] leading-relaxed"
              value={draft}
              readOnly={sent}
              onChange={(e) => update({ recDraft: e.target.value })}
            />
          </section>
        </div>

        <SheetFooter className="border-t px-7 py-5">
          {sent ? (
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Sent</Badge>
              <p className="text-sm">Sent to Dana Thursday at 11:20 AM.</p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">Your name is on this one, so it waits for you.</p>
              <Button size="lg" onClick={send}>
                Send to Dana
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>

      <QuoteDialog quote={quote} onClose={() => setQuote(null)} />
    </Sheet>
  );
}

function NumberCell({ value }: { value: string | null }) {
  return value === null ? (
    <TableCell className="text-muted-foreground">Same</TableCell>
  ) : (
    <TableCell className="font-medium tabular-nums">{value}</TableCell>
  );
}
