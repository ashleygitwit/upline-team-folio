import { useState } from "react";
import { ArrowLeft, ChevronDown, FileText } from "lucide-react";
import { PersonLink } from "@/components/PersonLink";
import { QuoteDialog } from "@/components/QuoteDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
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
import type { WalkProps } from "@/walk";

/**
 * The Callahans' shop, the one page an agent should expect to open. It reads
 * the way Stacey would think it through: what came back and what to say
 * about it, which carrier goes out under Stacey's name, and the email Dana
 * gets, which stays beside the rest so the pick and the words that carry it
 * are seen together. The comparison table and the carrier PDFs are there for
 * whoever wants them, one click down. Nothing goes to Dana until Stacey sends.
 */
export function Results({
  day,
  walk,
  update,
  onProfile,
  onSent,
}: WalkProps & { day: Day; onProfile: () => void; onSent: () => void }) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const sent = walk.recSent || day === "fri";
  const draft = walk.recDraft ?? recEmails[walk.pick];
  const erie = options.find((o) => o.current)!;

  const send = () => {
    update({ recSent: true });
    onSent();
  };

  return (
    <div className="shell pt-10 pb-(--space-section)">
      <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={onProfile}>
        <ArrowLeft data-icon="inline-start" />
        {callahan.name}
      </Button>

      <header className="mt-10">
        <p className="eyebrow text-muted-foreground">Shopped Thursday morning</p>
        <h1 className="mt-5 max-w-[26ch] text-5xl text-balance">
          Auto-Owners will write the same coverage for {money(4640)}.
        </h1>
        <p className="mt-6 max-w-[60ch] font-display text-lg font-normal text-muted-foreground">
          That's {money(erie.price - 4640)} less than Erie's renewal.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          <PersonLink h={callahan} onProfile={onProfile} /> · {callahan.lines} · {callahan.carrier} · Renews{" "}
          {callahan.renewsLong}
        </p>
      </header>

      <div className="mt-10 grid items-start gap-x-16 gap-y-10 border-t pt-10 text-base lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-10">
          <section aria-labelledby="rec-points">
            <h2 id="rec-points" className="text-xl">
              What to call out
            </h2>
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
            <h2 id="rec-pick" className="text-xl">
              Your pick
            </h2>
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
            <h2 id="rec-quotes" className="text-xl">
              From the carriers
            </h2>
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
        </div>

        <section
          aria-labelledby="rec-email"
          className="border bg-card p-(--card-pad) lg:sticky lg:top-[calc(var(--demo-bar-h)+2rem)]"
        >
          <h2 id="rec-email" className="text-xl">
            The email to Dana
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            From {agency.agent.email}, with a link to Dana's page. It goes out when you send it.
          </p>
          <p className="mt-5 text-sm">
            <span className="text-muted-foreground">Subject </span>
            {recSubject}
          </p>
          <Textarea
            aria-label="Email to Dana"
            className="mt-2 min-h-[19rem] bg-background leading-relaxed"
            value={draft}
            readOnly={sent}
            onChange={(e) => update({ recDraft: e.target.value })}
          />
          {sent ? (
            <div className="mt-5 flex items-center gap-3">
              <Badge variant="secondary">Sent</Badge>
              <p className="text-sm">Sent to Dana Thursday at 11:20 AM.</p>
            </div>
          ) : (
            <>
              <Button size="lg" className="mt-5 w-full" onClick={send}>
                Send to Dana
              </Button>
              <p className="mt-3 text-sm text-muted-foreground">Your name is on this one, so it waits for you.</p>
            </>
          )}
        </section>
      </div>

      <QuoteDialog quote={quote} onClose={() => setQuote(null)} />
    </div>
  );
}

function NumberCell({ value }: { value: string | null }) {
  return value === null ? (
    <TableCell className="text-muted-foreground">Same</TableCell>
  ) : (
    <TableCell className="font-medium tabular-nums">{value}</TableCell>
  );
}
