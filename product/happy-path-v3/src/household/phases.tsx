import { useState } from "react";
import { Check, LoaderCircle, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { dayName, type Nudge } from "@/data";
import type { Activity, NudgeState, Shop } from "@/household/activity";
import { columnTitle } from "@/household/columns";
import { agency, money, outreachEmail, type Card, type HouseholdFile } from "@/household/data";
import { CarrierLogo, EmailFrame, LinkedEmail, SectionHead } from "@/household/parts";
import { PhaseFooter, PhaseModal } from "@/household/PhaseModal";
import { Recommendation } from "@/household/Recommendation";

/**
 * The phase modals a drawer opens from its banner and from Recent activity,
 * one per phase that has more to it than a line: the outreach review, a
 * nudge or follow-up, a shop in progress, an earlier week's results and the
 * close-out. The Pruitts' results are ShopResults.tsx, since the homepage
 * and the chat open them too. Each takes its action in its footer, and once
 * it's done, opens read-only with the footer saying what happened.
 */

/**
 * The renewal email before it goes: the policy as it renews, the email, and
 * shaping the shop. `sent` locks it and says when it went; `skipped` swaps
 * the footer for an Undo. This week's six bring the walk's email; an earlier
 * week's household, whose email went before the walk, reads a draft built
 * from its card.
 */
export function OutreachReview({
  card,
  file,
  email,
  life,
  sent,
  skipped,
  onSkip,
  onSend,
  onOpenQuestionnaire,
}: {
  card: Card;
  file: HouseholdFile;
  email?: { subject: string; body: string; onChange: (body: string) => void };
  life?: { on: boolean; onChange: (on: boolean) => void };
  sent?: string;
  skipped?: { onUndo: () => void };
  onSkip?: () => void;
  onSend?: () => void;
  /** Goes to Leah's questionnaire in the walk, from the Pruitts' email. */
  onOpenQuestionnaire?: () => void;
}) {
  return (
    <PhaseModal
      eyebrow="Outreach"
      title={card.name}
      footer={
        skipped ? (
          <PhaseFooter done>
            <p className="text-sm">Skipped. {card.first} won't be emailed this time, and we won't shop it.</p>
            <Button variant="secondary" size="lg" onClick={skipped.onUndo}>
              Undo
            </Button>
          </PhaseFooter>
        ) : sent ? (
          <PhaseFooter done>
            <p className="text-sm">{sent}</p>
          </PhaseFooter>
        ) : (
          onSend && (
            <PhaseFooter>
              {onSkip && (
                <Button variant="secondary" size="lg" onClick={onSkip}>
                  Skip outreach
                </Button>
              )}
              <Button size="lg" className="flex-1" onClick={onSend}>
                <Send data-icon="inline-start" />
                Send now
              </Button>
            </PhaseFooter>
          )
        )
      }
    >
      <div className="flex flex-col gap-4">
        <PolicyNow card={card} file={file} />
        <EmailFrame
          toolbar={`From ${agency.agent.name}'s mailbox`}
          to={card.target ? outreachEmail.to : `${file.namedInsured} <${card.email}>`}
          subject={email?.subject ?? "A quick look at your renewal"}
        >
          <LinkedEmail
            body={email?.body ?? outreachDraft(card)}
            onChange={email?.onChange ?? (() => {})}
            onLink={card.target ? onOpenQuestionnaire : undefined}
            readOnly={!!sent}
          />
        </EmailFrame>
        <ShapeTheShop card={card} file={file} life={life} locked={!!sent} />
      </div>
    </PhaseModal>
  );
}

/** A nudge or follow-up: why it's going and when, and its email, which Jenna can edit, send now or skip. */
export function NudgeReview({
  card,
  file,
  nudge,
  state,
  body,
  onChange,
  onSkip,
  onSend,
  onUndo,
}: {
  card: Card;
  file: HouseholdFile;
  nudge: Nudge;
  state: NudgeState;
  body: string;
  onChange: (body: string) => void;
  onSkip: () => void;
  onSend: () => void;
  onUndo: () => void;
}) {
  const what = nudge.what.toLowerCase();
  const goes = nudge.goes ? dayName[nudge.goes] : "Monday";
  return (
    <PhaseModal
      eyebrow={nudge.what}
      title={card.name}
      footer={
        state.state === "skipped" ? (
          <PhaseFooter done>
            <p className="text-sm">
              Skipped. {card.first} won't get this {what}.
            </p>
            <Button variant="secondary" size="lg" onClick={onUndo}>
              Undo
            </Button>
          </PhaseFooter>
        ) : state.state === "sent" ? (
          <PhaseFooter done>
            <p className="text-sm">{state.when}</p>
          </PhaseFooter>
        ) : (
          <PhaseFooter>
            <Button variant="secondary" size="lg" onClick={onSkip}>
              Skip {what}
            </Button>
            <Button size="lg" className="flex-1" onClick={onSend}>
              <Send data-icon="inline-start" />
              Send now
            </Button>
          </PhaseFooter>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <SectionHead>Why it's going</SectionHead>
          <p className="mt-1.5 text-sm">
            {nudge.why}
            {state.state === "scheduled" && ` It goes ${goes} at 9:00 AM from your inbox.`}
          </p>
        </div>
        <EmailFrame
          toolbar={`From ${agency.agent.name}'s mailbox`}
          to={`${file.namedInsured} <${card.email}>`}
          subject={nudge.subject}
        >
          <LinkedEmail body={body} onChange={onChange} readOnly={state.state === "sent"} />
        </EmailFrame>
      </div>
    </PhaseModal>
  );
}

/** A shop in progress: who VA is quoting, which quotes are back, and when the results are due. Nothing needs Jenna. */
export function ShopInProgress({ card, shop }: { card: Card; shop: Shop }) {
  return (
    <PhaseModal eyebrow={columnTitle("shopping")} title={card.name}>
      <div className="bg-muted px-5 pt-4.5 pb-4">
        <Badge variant="outline" className="bg-card">
          <LoaderCircle className="animate-spin motion-reduce:animate-none" data-icon="inline-start" />
          Shopping in progress
        </Badge>
        <p className="mt-2.5 font-display text-lg">Results back {shop.due}.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          VA is running {shop.carriers.length} carriers for this household, quoted directly with each one.
        </p>
        <div className="mt-3.5 grid gap-2">
          {shop.carriers.map((c) => (
            <div key={c.name} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 border bg-card px-3.5 py-3">
              <CarrierLogo name={c.name} />
              <div>
                <p className="text-base font-medium">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.back ? "Quote is in" : "Quote in progress"}</p>
              </div>
              <span className="eyebrow text-primary">{c.back ? "Back" : "Shopping"}</span>
            </div>
          ))}
        </div>
      </div>
    </PhaseModal>
  );
}

/**
 * An earlier week's shop results (Sofia's and Walter's), in the same three
 * steps as the Pruitts' (Recommendation.tsx), locked once it has gone.
 */
export function EarlierResults({
  card,
  file,
  body,
  setBody,
  sent,
  onSend,
}: {
  card: Card;
  file: HouseholdFile;
  body: string;
  setBody: (body: string) => void;
  sent?: string;
  onSend: () => void;
}) {
  return <Recommendation card={card} file={file} body={body} setBody={setBody} sent={sent} onSend={onSend} />;
}

/**
 * Approved and waiting on Jenna: what's left to do, and what happened, which
 * Close out keeps as the household's memo. Once closed, it reads back the
 * memo and says when.
 */
export function CloseOut({
  card,
  activity,
  onCloseOut,
}: {
  card: Card;
  activity: Activity;
  onCloseOut: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const { closing, closed } = activity;

  return (
    <PhaseModal
      eyebrow={columnTitle("binding")}
      title={card.name}
      footer={
        closed ? (
          <PhaseFooter done>
            <p className="text-sm">Closed out {closed.when}.</p>
          </PhaseFooter>
        ) : (
          <PhaseFooter>
            <Button size="lg" className="w-full" onClick={() => onCloseOut(note.trim())}>
              Close out
            </Button>
          </PhaseFooter>
        )
      }
    >
      {closed ? (
        <div>
          <SectionHead>What happened</SectionHead>
          <p className="mt-1.5 text-sm">{closed.note || "Closed out without a note."}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {closing && (
            <div>
              <p className="text-base">{closing.sub}</p>
              {closing.owes.length > 0 && (
                <>
                  <SectionHead className="mt-4">What's left</SectionHead>
                  <ul className="mt-2 grid gap-1.5 text-sm">
                    {closing.owes.map((o) => (
                      <li key={o} className="flex items-center gap-2.5">
                        <span aria-hidden className="size-2 shrink-0 border border-primary" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
          <div>
            <SectionHead>What happened</SectionHead>
            <p className="mt-1.5 mb-3 text-sm text-muted-foreground">
              Is {card.first} staying put? Did you bind a new carrier, or are you still waiting on something?
            </p>
            <Textarea
              aria-label="What happened"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Bound it in the portal this morning."
            />
          </div>
        </div>
      )}
    </PhaseModal>
  );
}

/** The policy as it renews: each line, the total, and why it went up. */
function PolicyNow({ card, file }: { card: Card; file: HouseholdFile }) {
  const now = file.policies.reduce((s, p) => s + p.current, 0);
  const next = file.policies.reduce((s, p) => s + p.renewal, 0);
  const pct = now === 0 ? 0 : Math.round(((next - now) / now) * 100);
  const carrier = file.policies[0]?.carrier ?? card.carrier;
  const why =
    file.driver ??
    (pct === 0
      ? "No change on the renewal. No claims, no changes on file."
      : `${carrier}'s renewal is up ${pct}%. No claims, no changes on file.`);

  return (
    <div>
      <p className="eyebrow mb-2.5 text-primary">Current policy · {carrier}</p>
      {file.policies.map((p) => (
        <div key={p.line} className="flex items-baseline justify-between gap-3 border-t py-2 text-sm">
          <p>
            <span className="font-medium">{lineName(p.line)}</span>
            <span className="text-muted-foreground"> renews {p.renews ?? card.renewal}</span>
          </p>
          <p className="font-mono whitespace-nowrap">
            {money(p.current)} <span className="text-muted-foreground">→</span> {money(p.renewal)}
          </p>
        </div>
      ))}
      <div className="flex items-baseline justify-between gap-3 border-t py-2 text-base">
        <p>
          <span className="font-medium">Total</span>
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            {pct === 0 ? "No change" : `${pct > 0 ? "+" : ""}${pct}%`}
          </span>
        </p>
        <p className="font-mono text-sm whitespace-nowrap">
          {money(now)} <span className="text-muted-foreground">→</span> {money(next)}
        </p>
      </div>
      <div className="mt-3 border-t pt-3 text-sm">
        <p className="mb-1 font-medium">{pct === 0 ? "What is driving it?" : "What is driving the increase?"}</p>
        <p>{why}</p>
      </div>
    </div>
  );
}

const lineName = (line: string) => (/auto/i.test(line) ? "Auto" : /umbrella/i.test(line) ? "Umbrella" : "Home");

/**
 * What else to quote while we shop. Lines the household already has with us
 * can't be picked, and once the email has gone (`locked`) none can.
 */
function ShapeTheShop({
  card,
  file,
  life,
  locked,
}: {
  card: Card;
  file: HouseholdFile;
  life?: { on: boolean; onChange: (on: boolean) => void };
  locked?: boolean;
}) {
  const has = (k: string) => card.kinds.includes(k as Card["kinds"][number]);
  const both = has("home") && has("auto");
  const rows = [
    {
      id: "home",
      label: "Homeowners",
      hint: "Quote a home policy while we shop.",
      locked: has("home"),
      why: both ? "This individual already has home and auto with us." : "This individual already has homeowners with us.",
      on: !has("home") && has("auto"),
    },
    {
      id: "auto",
      label: "Auto",
      hint: "Quote auto while we shop.",
      locked: has("auto"),
      why: both ? "This individual already has home and auto with us." : "This individual already has auto with us.",
      on: !has("auto") && has("home"),
    },
    { id: "medicare", label: "Medicare", hint: "Supplement options at renewal.", locked: true, why: "Not available due to their age.", on: false },
    { id: "life", label: "Life", hint: "Ask if they want a life quote while we shop.", locked: false, why: "", on: file.people.length > 1 },
  ];
  const [on, setOn] = useState(() => new Set(rows.filter((r) => r.on && !r.locked).map((r) => r.id)));
  const toggle = (id: string) =>
    id === "life" && life
      ? life.onChange(!life.on)
      : setOn((s) => {
          const n = new Set(s);
          if (n.has(id)) n.delete(id);
          else n.add(id);
          return n;
        });

  // One button each, on or off, with its line said on hover. What doesn't
  // apply is grayed and does nothing, but stays hoverable (aria-disabled, not
  // disabled) so it can say why. On is the blue outline with a check, not the
  // filled blue, which is Send now's.
  return (
    <div>
      <SectionHead>Shape the shop</SectionHead>
      <p className="mt-1.5 mb-3 text-sm text-muted-foreground">
        {locked
          ? "What we asked about in the email."
          : "Pick what you want included. Recommended items are on. Grayed items do not apply."}
      </p>
      <div className="flex flex-wrap gap-2">
        {rows.map((r) => {
          const pressed = !r.locked && (r.id === "life" && life ? life.on : on.has(r.id));
          const inert = r.locked || locked;
          return (
            <Tooltip key={r.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  aria-pressed={r.locked ? undefined : pressed}
                  aria-disabled={inert || undefined}
                  onClick={inert ? undefined : () => toggle(r.id)}
                  className="aria-pressed:border-primary aria-pressed:text-primary aria-pressed:hover:text-primary aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:bg-background"
                >
                  {pressed && <Check data-icon="inline-start" />}
                  {r.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{r.locked ? r.why : locked ? "The email has gone out." : r.hint}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}

/** The renewal email for a household the walk doesn't write one for, with its questionnaire link. */
function outreachDraft(card: Card) {
  const link = `https://${agency.questionnaireHost}/d/${card.id}`;
  const price =
    card.jumpPct === 0
      ? `Your ${card.lines} renews ${card.renewal} at ${money(card.premium)}, the same as last year.`
      : `Your ${card.lines} renews ${card.renewal} at ${money(card.premium)}, which is about ${money(card.premium - card.was)} more than last year.`;
  const why =
    card.jumpPct === 0
      ? "Renewals move for all sorts of reasons, so I always take a look before one rolls over."
      : "Increases can come from a few different places, the market, a claim, or a change in coverage during the year. When one comes in like this, I'd like to shop it and see what else is out there for you.";
  return `Hi ${card.first},\n\nHope you're doing well. It's that time of year again, and I wanted to give you a heads up on where your renewal is coming in.\n\n${price}\n\n${why}\n\nBefore I can, there are a few details I need to confirm. It takes about five minutes:\n\nAnswer a few quick questions → ${link}\n\nOnce I have your answers I'll get to work and come back to you well before the renewal.`;
}
