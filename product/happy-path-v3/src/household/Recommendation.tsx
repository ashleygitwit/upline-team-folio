import { useState } from "react";
import { Info, X } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { money, recEmail, type Card, type HouseholdFile, type QuoteDoc } from "@/household/data";
import { focusPanel } from "@/lib/focus";
import { CovMark, EmailFrame, SectionHead } from "@/household/parts";

/**
 * A shop that has come back: what each carrier offered against what the
 * household has today, the carrier documents, what to call out, the pick, and
 * the email that carries it. The email never sends on its own.
 */
export function Recommendation({
  card,
  file,
  body,
  setBody,
}: {
  card: Card;
  file: HouseholdFile;
  body: string;
  setBody: (s: string) => void;
}) {
  const rec = file.rec;
  const [pick, setPick] = useState(rec?.pick ?? "");
  const [help, setHelp] = useState<string | null>(null);
  const [doc, setDoc] = useState<QuoteDoc | null>(null);
  const first = file.namedInsured.split(" ")[0];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <SectionHead className="mb-1.5">Shopping results</SectionHead>
        <p className="mb-3 text-sm text-muted-foreground">
          The biggest differences in coverage and price, pulled directly from each carrier we shopped.
        </p>
        {rec ? (
          <div className="border bg-card">
            <Table className="text-xs">
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="eyebrow min-w-32 text-muted-foreground">Coverage</TableHead>
                  <TableHead className="eyebrow bg-background text-muted-foreground">
                    <span className="block text-[9.5px] text-foreground">Current carrier</span>
                    {rec.currentLabel}
                  </TableHead>
                  {rec.cols.map((c) => (
                    <TableHead key={c.id} className="eyebrow text-muted-foreground">
                      {c.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rec.coverage.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="align-top font-medium whitespace-normal">
                      <span className="inline-flex items-center gap-1.5">
                        {row.label}
                        {row.help && (
                          <Button
                            variant={help === row.label ? "secondary" : "ghost"}
                            size="icon-xs"
                            aria-label={`What ${row.label} means`}
                            aria-expanded={help === row.label}
                            onClick={() => setHelp((h) => (h === row.label ? null : row.label))}
                            className={cn(help === row.label && "text-primary")}
                          >
                            <Info />
                          </Button>
                        )}
                      </span>
                      {help === row.label && row.help && (
                        <p className="mt-1.5 max-w-[180px] text-xs font-normal text-muted-foreground">{row.help}</p>
                      )}
                    </TableCell>
                    <TableCell className="bg-background align-top">{row.current}</TableCell>
                    {rec.cols.map((c) => (
                      <TableCell key={c.id} className="align-top">
                        <CovMark value={row.quotes[c.id]} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{card.note}</p>
        )}
      </div>

      {rec?.biggest && (
        <div className="border bg-card px-4 py-3.5">
          <SectionHead>Biggest changes</SectionHead>
          <ul className="mt-2 grid gap-2.5">
            {rec.biggest.map((b) => (
              <li key={b.carrier} className="text-sm">
                <span className="font-medium">{b.carrier}. </span>
                {b.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {rec && rec.quotes.length > 0 && <QuoteStrip docs={rec.quotes} onOpen={setDoc} />}

      {rec?.talkingPoints && (
        <div>
          <SectionHead>Things to note</SectionHead>
          <p className="mt-1 mb-2.5 text-sm text-muted-foreground">
            Here's what to call out, no matter which quote you send.
          </p>
          <ol className="grid gap-2.5">
            {rec.talkingPoints.map((t, i) => (
              <li key={t} className="grid grid-cols-[22px_1fr] items-start gap-2.5 text-sm">
                <span className="grid size-5.5 place-items-center bg-blue-100 font-mono text-[11px] text-primary">
                  {i + 1}
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {rec && (
        <div className="border border-blue-100 bg-blue-100/30 px-4 py-3.5">
          <SectionHead>Our recommendation</SectionHead>
          <p className="mt-2 text-base font-medium">{rec.summary}</p>
        </div>
      )}

      {rec?.options && (
        <fieldset className="border border-primary px-4 pt-4 pb-3.5">
          <legend className="sr-only">Quote to include</legend>
          <p className="eyebrow mb-1 text-primary">Select what you recommend</p>
          <p className="mb-2.5 text-sm text-muted-foreground">Choose the one to include in your email to {first}.</p>
          <RadioGroup
            value={pick}
            onValueChange={(name) => {
              setPick(name);
              const o = rec.options.find((x) => x.name === name);
              if (o?.email) setBody(o.email);
            }}
            className="gap-2"
          >
            {rec.options.map((o) => (
              <FieldLabel key={o.id} htmlFor={`pick-${card.id}-${o.id}`} className="bg-card">
                <Field orientation="horizontal" className="items-center!">
                  <RadioGroupItem value={o.name} id={`pick-${card.id}-${o.id}`} />
                  <FieldContent>
                    <FieldTitle className="text-base">
                      {o.name}
                      {o.current && <Badge variant="outline">Current carrier</Badge>}
                    </FieldTitle>
                    <FieldDescription>
                      {o.lines} · {money(o.price)}
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        </fieldset>
      )}

      <EmailFrame
        toolbar="Recommendation email · does not auto-send"
        to={card.target ? recEmail.to : `${file.namedInsured} <${card.email}>`}
        subject={card.target ? recEmail.subject : "I looked at your renewal"}
      >
        <Textarea
          aria-label="Recommendation email"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="min-h-60 border-0 bg-transparent px-5.5 py-5 text-[15px] leading-relaxed"
        />
      </EmailFrame>

      <DocDialog doc={doc} onClose={() => setDoc(null)} />
    </div>
  );
}

/** The current policy documents, then each quote as the carrier sent it. */
function QuoteStrip({ docs, onOpen }: { docs: QuoteDoc[]; onOpen: (d: QuoteDoc) => void }) {
  const current = docs.filter((d) => d.current);
  const shopped = docs.filter((d) => !d.current);
  return (
    <div className="grid gap-3">
      <div>
        <SectionHead>Quotes from the carriers</SectionHead>
        <p className="mt-1 text-sm text-muted-foreground">
          Current policy documents, then each quote pulled directly from the carrier. Open one to read the full page.
        </p>
      </div>
      {current.length > 0 && <QuoteGroup label="Current carrier" docs={current} onOpen={onOpen} />}
      {shopped.length > 0 && <QuoteGroup label="Shopped" docs={shopped} onOpen={onOpen} />}
    </div>
  );
}

function QuoteGroup({ label, docs, onOpen }: { label: string; docs: QuoteDoc[]; onOpen: (d: QuoteDoc) => void }) {
  return (
    <div className="grid gap-2">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(118px,1fr))] gap-2.5">
        {docs.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onOpen(d)}
            className="grid gap-2 border bg-card p-2.5 text-left transition-colors hover:border-primary"
          >
            <span aria-hidden className="relative block h-22 overflow-hidden border bg-background px-2 pt-2 pb-2.5">
              <span className="mb-2 block text-[8px] font-semibold tracking-wider text-primary uppercase">{d.carrier}</span>
              <span
                className="block h-10.5 [mask-image:linear-gradient(90deg,#000_70%,transparent)]"
                style={{
                  background:
                    "repeating-linear-gradient(to bottom, color-mix(in srgb, var(--muted-foreground) 22%, transparent) 0 2px, transparent 2px 8px)",
                }}
              />
              <span className="absolute right-1.5 bottom-1.5 bg-primary px-1.5 py-0.5 font-mono text-[9px] text-primary-foreground">
                PDF
              </span>
            </span>
            <span>
              <span className="block text-sm font-medium">{d.carrier}</span>
              <span className="block text-xs text-muted-foreground">{d.title}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** A carrier document, page by page, the way it came from the carrier. */
function DocDialog({ doc, onClose }: { doc: QuoteDoc | null; onClose: () => void }) {
  const [shown, setShown] = useState(doc);
  if (doc && doc !== shown) setShown(doc);
  if (!shown) return null;

  return (
    <Dialog open={doc !== null} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={focusPanel}
        className="grid max-h-[min(86svh,860px)] grid-rows-[auto_1fr] gap-0 overflow-hidden bg-muted p-0 outline-none sm:max-w-[640px]"
      >
        <header className="flex items-start justify-between gap-4 border-b bg-card px-4.5 py-4">
          <div>
            <p className="eyebrow text-muted-foreground">{shown.current ? "Current carrier" : "Quote from the carrier"}</p>
            <DialogTitle className="mt-0.5 font-display text-lg">
              {shown.carrier} · {shown.title}
            </DialogTitle>
            <DialogDescription className="mt-0.5">{shown.filename}</DialogDescription>
          </div>
          <Button variant="outline" onClick={onClose}>
            <X data-icon="inline-start" />
            Close
          </Button>
        </header>
        <div className="grid gap-4 overflow-auto px-5 pt-4.5 pb-7">
          {shown.pages.map((p) => (
            <article key={p.kicker} className="min-h-[420px] border bg-card px-8 pt-7 pb-8">
              <p className="eyebrow mb-2.5 text-muted-foreground">{p.kicker}</p>
              <h4 className="text-2xl">{shown.carrier}</h4>
              <p className="mt-0.5 mb-4 text-sm text-muted-foreground">{shown.title}</p>
              <dl className="grid gap-2">
                {p.rows.map((r) => (
                  <div key={`${p.kicker}-${r.label}`} className="grid grid-cols-[1fr_auto] gap-3 border-t py-2 text-sm">
                    <dt className="text-muted-foreground">{r.label}</dt>
                    <dd className="text-right font-medium">{r.value}</dd>
                  </div>
                ))}
              </dl>
              {p.note && <p className="mt-4 text-sm text-muted-foreground">{p.note}</p>}
            </article>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
