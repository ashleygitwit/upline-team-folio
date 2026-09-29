import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { agency, compareRows, dana, money, proposalNumbers } from "@/data";
import type { ScreenProps } from "@/App";

/**
 * The page Dana opens from Stacey's email, under Stockton Hill's name: a note,
 * the pick, what changes, and one question. Saying yes doesn't bind anything;
 * it tells Stacey to call.
 */
export function Proposal({ onNext }: ScreenProps) {
  const [answer, setAnswer] = useState<"stay" | "switch" | null>(null);

  return (
    <div className="agency min-h-[calc(100svh-var(--demo-bar-h))] bg-agency-bg px-5 pt-6 pb-20">
      <div className="mx-auto max-w-[720px]">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-agency px-6 py-4.5 text-white [--ring:#ffffff]">
          <div className="flex items-center gap-3">
            <span aria-hidden className="grid size-9 place-items-center bg-white/15 font-display font-medium">
              SH
            </span>
            <div>
              <span className="block font-display text-lg">{agency.name}</span>
              <span className="block text-[11px] tracking-wider opacity-80">Independent · Dublin, Ohio</span>
            </div>
          </div>
          <div className="text-right text-sm">
            {agency.agent.name}
            <br />
            <a href={`mailto:${agency.email}`} className="underline underline-offset-4">
              {agency.phone}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 border border-t-0 bg-agency-accent/15 px-6 py-2.5 text-sm">
          <span aria-hidden className="size-2 bg-agency-accent" />
          <span>
            Prepared for {dana.name} · home and auto · renews {dana.renewalDate}
          </span>
        </div>

        <div className="border border-t-0 bg-card">
          <Block className="bg-linear-to-b from-agency-soft to-card to-70%">
            <p className="eyebrow text-primary">A note from {agency.agent.name}</p>
            <div className="mt-3.5 flex max-w-[58ch] flex-col gap-3.5 text-lg leading-relaxed">
              <p>Hey {dana.first},</p>
              <p>
                I went ahead and shopped a variety of carriers, and Auto-Owners looks like the best bet, especially if
                you bundle auto and home together.
              </p>
              <p>Sophie is on the policy now, and that's why Erie came in higher. Auto-Owners can write the same coverage for less.</p>
            </div>
            <p className="mt-4.5 font-display text-lg">{agency.agent.name}</p>
          </Block>

          <Block>
            <p className="eyebrow text-primary">The pick</p>
            <h2 className="mt-1.5 text-2xl">Move both home and auto to Auto-Owners.</h2>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-2 border-primary bg-agency-soft px-5 py-4.5">
              <div>
                <p className="font-medium">Auto-Owners · bundled</p>
                <p className="mt-1 text-sm text-muted-foreground">Same deductibles, same liability, replacement cost on the roof.</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-3xl">{money(proposalNumbers.owners)}</p>
                <p className="text-sm text-muted-foreground">{money(proposalNumbers.perYear)} less than Erie</p>
              </div>
            </div>
          </Block>

          <Block>
            <p className="eyebrow text-primary">Here's what's changing</p>
            <h2 className="mt-1.5 text-2xl">Your current coverage next to the recommendation.</h2>
            <div className="mt-4 border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-agency-soft hover:bg-agency-soft">
                    <TableHead className="eyebrow text-muted-foreground">Coverage</TableHead>
                    <TableHead className="eyebrow text-muted-foreground">Current · Erie</TableHead>
                    <TableHead className="eyebrow text-muted-foreground">Recommended · Auto-Owners</TableHead>
                    <TableHead className="eyebrow text-muted-foreground">What's changed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compareRows.map((r) => {
                    const same = r.note === "Same";
                    return (
                      <TableRow key={r.label}>
                        <TableCell>{r.label}</TableCell>
                        <TableCell>{r.current}</TableCell>
                        <TableCell className={cn(!same && "font-medium text-primary")}>{r.rec}</TableCell>
                        <TableCell>
                          {same ? (
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                              <Check className="size-3.5 text-primary" aria-hidden />
                              Same
                            </span>
                          ) : (
                            <span className="font-medium text-primary">{r.note}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">The coverage matches what you have with Erie. The change is the price.</p>
          </Block>

          <Block>
            <div className="border border-primary bg-agency-soft px-5 pt-5.5 pb-5 animate-in duration-200 fade-in-0" key={answer ?? "ask"}>
              {answer === null ? (
                <>
                  <h2 className="text-2xl">Would you like to move forward with our recommendation?</h2>
                  <div className="mt-4.5 flex flex-wrap gap-2.5">
                    <Button variant="secondary" size="lg" className="bg-card" onClick={() => setAnswer("stay")}>
                      No, stay with Erie
                    </Button>
                    <Button size="lg" onClick={() => setAnswer("switch")}>
                      Yes, switch to Auto-Owners
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg font-medium">
                    {answer === "switch"
                      ? "Great, we'll get in contact with you to go over details and paperwork to bind the new policy."
                      : "Got it. We'll keep you with Erie, and Stacey will be in touch if anything else comes up before November 15."}
                  </p>
                  <Button className="mt-4" onClick={onNext}>
                    Back to the week
                  </Button>
                </>
              )}
            </div>
          </Block>
        </div>
      </div>
    </div>
  );
}

function Block({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("border-t px-6 py-7 first:border-t-0", className)}>{children}</section>;
}
