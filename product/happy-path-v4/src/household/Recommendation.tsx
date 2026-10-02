import { useContext, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Info, Send } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { money, recEmail, type Card, type HouseholdFile, type QuoteDoc } from "@/household/data";
import { CovMark, EmailFrame, SectionHead } from "@/household/parts";
import { OpenQuotes } from "@/household/pageNav";
import { PhaseFooter, PhasePage } from "@/household/PhasePage";
import { shopStory } from "@/household/shopStory";

type Step = 1 | 2 | 3;

/**
 * A shop that has come back, as a page over the drawer in three steps, each
 * with its buttons in the footer. Step 1 is the results: what the shop found, said in
 * a few sentences (shopStory.ts), our recommendation, the coverage table
 * against what the household has today, and a link to the carriers' quotes,
 * which slide over the results as a page of their own.
 * Step 2 is the pick, each plan with a line on what it means. Step 3 is the
 * email that carries it, which Send recommendation email sends. The email
 * never sends on its own.
 *
 * v3 adds to v2.5's layout: `pick` and `onPick` hand the pick to the walk, so
 * what Jenna picks is what Leah gets, and `sent` says the recommendation has
 * gone. Then the three steps still open, with the pick and the email locked
 * and step 3's footer saying when it went. Opening it again starts at step 1.
 */
export function Recommendation({
  card,
  file,
  body,
  setBody,
  pick: pickProp,
  onPick,
  sent,
  onSend,
}: {
  card: Card;
  file: HouseholdFile;
  body: string;
  setBody: (s: string) => void;
  pick?: string;
  onPick?: (name: string) => void;
  sent?: string;
  onSend: () => void;
}) {
  const rec = file.rec;
  const words = shopStory[card.id];
  const [ownPick, setOwnPick] = useState(rec?.pick ?? "");
  const pick = pickProp ?? ownPick;
  const setPick = onPick ?? setOwnPick;
  const [step, setStep] = useState<Step>(1);
  const [help, setHelp] = useState<string | null>(null);
  const locked = !!sent;
  const first = file.namedInsured.split(" ")[0];
  const headline = useId();

  // A new step starts at its top, with the focus on its headline, so a
  // screen reader says where it is. Opening the page puts the focus on its
  // title, as every page does (PhasePage.tsx).
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) return;
    heading.current?.closest("[data-phase-body]")?.scrollTo({ top: 0 });
    heading.current?.focus({ preventScroll: true });
  }, [step]);
  const go = (to: Step) => {
    moved.current = true;
    setStep(to);
  };

  // The footer's buttons can be long, so they wrap on a phone rather than
  // run off the page.
  const long = "h-auto min-h-13 py-3 whitespace-normal";
  const footer =
    step === 1 ? (
      <PhaseFooter>
        <Button size="lg" className={cn("w-full", long)} onClick={() => go(2)}>
          Continue to select your recommendation
          <ArrowRight data-icon="inline-end" />
        </Button>
      </PhaseFooter>
    ) : step === 2 ? (
      <PhaseFooter>
        <Button variant="secondary" size="lg" onClick={() => go(1)}>
          Back
        </Button>
        <Button size="lg" className={cn("flex-1", long)} onClick={() => go(3)}>
          Review recommendation email
          <ArrowRight data-icon="inline-end" />
        </Button>
      </PhaseFooter>
    ) : (
      <PhaseFooter>
        <Button variant="secondary" size="lg" onClick={() => go(2)}>
          Back
        </Button>
        {sent ? (
          <p className="flex-1 text-sm sm:ml-2">{sent}</p>
        ) : (
          <Button size="lg" className={cn("flex-1", long)} onClick={onSend}>
            <Send data-icon="inline-start" />
            Send recommendation email
          </Button>
        )}
      </PhaseFooter>
    );

  // Which step, in the mono face in gray and sentence case, as the marketing
  // site's product mockups count steps ("Step 1 of 4"); it was the eyebrow
  // until 2026-10-01. Under the step's title, its words follow at 8 to 12px,
  // and a block (the table, the plans, the email) at 24.
  const head = (title: string) => (
    <>
      <p className="font-mono text-xs text-muted-foreground">Step {step} of 3</p>
      <h3 ref={heading} id={headline} tabIndex={-1} className="mt-2 font-display text-xl">
        {title}
      </h3>
    </>
  );

  return (
    <PhasePage title="Recommendation" footer={footer}>
      {step === 1 && (
        <div>
          {head("Shopping Results")}
          {words && (
            <ul className="mt-3 grid gap-2 text-base">
              {words.story.map((line) => (
                <li key={line} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 size-2 shrink-0 border border-primary" />
                  {line}
                </li>
              ))}
            </ul>
          )}
          {rec && <p className="mt-3 text-base font-medium">{rec.summary}</p>}
          {rec ? (
            <>
              <div className="mt-6 border bg-card">
                <Table className="text-xs">
                  <TableHeader>
                    {/* The kit's table heads, as the rows are set, rather
                        than eyebrows, which they were until 2026-10-01, with
                        "Current carrier" at 9.5px over the current one. */}
                    <TableRow className="bg-muted hover:bg-muted">
                      <TableHead className="h-auto min-w-32 py-2 align-bottom">Coverage</TableHead>
                      <TableHead className="h-auto bg-background py-2 align-bottom">
                        {rec.currentLabel}
                        <span className="block font-normal text-muted-foreground">Current carrier</span>
                      </TableHead>
                      {rec.cols.map((c) => (
                        <TableHead key={c.id} className="h-auto py-2 align-bottom">
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
              {rec.quotes.length > 0 && <CarrierQuotes docs={rec.quotes} />}
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">{card.note}</p>
          )}
        </div>
      )}

      {step === 2 && (
        <div>
          {head("Select Your Recommendation")}
          <p className="mt-2 text-sm text-muted-foreground">Choose the plan to recommend in your email to {first}.</p>
          {rec?.options && (
            <RadioGroup
              aria-labelledby={headline}
              value={pick}
              disabled={locked}
              onValueChange={(name) => {
                setPick(name);
                const o = rec.options.find((x) => x.name === name);
                if (o?.email) setBody(o.email);
              }}
              className="mt-6 gap-3"
            >
              {rec.options.map((o) => (
                <FieldLabel key={o.id} htmlFor={`pick-${card.id}-${o.id}`} className="bg-card">
                  <Field orientation="horizontal" className="items-start!">
                    <RadioGroupItem value={o.name} id={`pick-${card.id}-${o.id}`} className="mt-1" />
                    <FieldContent>
                      <FieldTitle className="text-base">
                        {o.name}
                        {o.current && <Badge variant="outline">Current carrier</Badge>}
                      </FieldTitle>
                      <FieldDescription>
                        {o.lines} · {money(o.price)}
                      </FieldDescription>
                      {words?.about[o.id] && <p className="mt-1 text-sm">{words.about[o.id]}</p>}
                    </FieldContent>
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          )}
        </div>
      )}

      {step === 3 && (
        <div>
          {head("Review Your Recommendation Email")}
          <div className="mt-6">
            <EmailFrame
              toolbar="Recommendation email · does not auto-send"
              to={card.target ? recEmail.to : `${file.namedInsured} <${card.email}>`}
              subject={card.target ? recEmail.subject : "I looked at your renewal"}
            >
              <Textarea
                aria-label="Recommendation email"
                value={body}
                readOnly={locked}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-60 border-0 bg-transparent p-6 text-[15px] leading-relaxed"
              />
            </EmailFrame>
          </div>
        </div>
      )}
    </PhasePage>
  );
}

/** The link under the results table, which slides the carriers' quotes over the results. */
function CarrierQuotes({ docs }: { docs: QuoteDoc[] }) {
  const open = useContext(OpenQuotes);
  return (
    <button type="button" className={cn("mt-3", linkStyle)} onClick={(e) => open?.(docs, e.currentTarget)}>
      View quotes from the carriers
    </button>
  );
}

/**
 * The carriers' quotes, as a page over the results: the current policy
 * documents, then each quote as the carrier sent it, each a link to its PDF.
 * The PDFs aren't in this prototype yet, so the links say so when pointed
 * at. It was a modal over the results modal until 2026-10-01.
 */
export function QuotesPage({ docs }: { docs: QuoteDoc[] }) {
  const current = docs.filter((d) => d.current);
  const shopped = docs.filter((d) => !d.current);
  return (
    <PhasePage
      title="Quotes from the carriers"
      description="Current policy documents, then each quote pulled directly from the carrier."
    >
      <div className="flex flex-col gap-8">
        {current.length > 0 && <QuoteLinks label="Current carrier" docs={current} />}
        {shopped.length > 0 && <QuoteLinks label="Shopped" docs={shopped} />}
      </div>
    </PhasePage>
  );
}

function QuoteLinks({ label, docs }: { label: string; docs: QuoteDoc[] }) {
  return (
    <div>
      <SectionHead>{label}</SectionHead>
      <ul className="mt-3 grid gap-3">
        {docs.map((d) => (
          <li key={d.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" aria-disabled className={linkStyle}>
                  {d.carrier} · {d.title}
                </button>
              </TooltipTrigger>
              <TooltipContent>The carriers' PDFs aren't in this prototype yet.</TooltipContent>
            </Tooltip>
            <span className="block text-xs text-muted-foreground">{d.filename}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const linkStyle = "text-left text-sm text-primary underline underline-offset-4 hover:no-underline";
