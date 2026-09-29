import { useState } from "react";
import { ArrowRight, LoaderCircle, Send } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/household/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  agency,
  fileFor,
  money,
  outreachBody,
  outreachEmail,
  questionnaireUrl,
  recBody,
  type Card,
  type HouseholdFile,
  type TimelineItem,
} from "@/household/data";
import { focusPanel } from "@/lib/focus";
import { Details } from "@/household/Details";
import { Recommendation } from "@/household/Recommendation";
import { columnTitle } from "@/household/columns";
import { CarrierLogo, EmailFrame, SectionHead, Timeline } from "@/household/parts";

type Tab = "details" | "outreach" | "shopping" | "rec" | "closing";

const stageTab: Record<Card["col"], { id: Tab; label: string }> = {
  outreach: { id: "outreach", label: "Outreach" },
  shopping: { id: "shopping", label: "Shopping" },
  recommend: { id: "rec", label: "Recommendation" },
  binding: { id: "closing", label: "Closing" },
};

/**
 * A household, opened from the board. It opens on the stage it's in (the
 * shop, the recommendation or closing) with the file one tab over. Footer
 * actions follow the stage. A household waiting on its outreach email has no
 * tabs: it opens on the file, under a banner that says when the email goes,
 * and the banner's Review brings up the policy, the email and shaping the
 * shop in a modal over it, with Skip outreach and Send now in a footer that
 * stays under the scrolling review rather than at the drawer's foot. The
 * email's questionnaire link is a link, in place of a list of what's in the
 * questionnaire: the Callahans' goes to Dana's questionnaire in the walk
 * (`onOpenQuestionnaire`), as if it opened in another tab, and the others
 * say they aren't in this prototype.
 *
 * v2.5's drawer (screens/queue/HouseholdSheet.tsx there), ported into v3. The
 * only additions are hooks into v3's walk: `email` shows and saves v3's own
 * draft, so Dana's inbox gets what Stacey approved; `life` is the walk's life
 * quote switch, which the questionnaire reads; `skipped` swaps the outreach
 * footer for an Undo once a household is skipped.
 */
export function HouseholdSheet({
  card,
  onSendOutreach,
  onSendRec,
  onOpenResults,
  onAskCloseOut,
  onSkipOutreach,
  onOpenQuestionnaire,
  email,
  life,
  skipped,
}: {
  card: Card;
  /** The review's Send now. */
  onSendOutreach: () => void;
  onSendRec: () => void;
  onOpenResults: () => void;
  onAskCloseOut: () => void;
  onSkipOutreach?: () => void;
  /** Goes to Dana's questionnaire in the walk, from the Callahans' email. */
  onOpenQuestionnaire?: () => void;
  email?: { subject: string; body: string; onChange: (body: string) => void };
  life?: { on: boolean; onChange: (on: boolean) => void };
  skipped?: { onUndo: () => void };
}) {
  const file = fileFor(card);
  const stage = stageTab[card.col];
  const link = card.target ? questionnaireUrl : `https://${agency.questionnaireHost}/d/${card.id}`;
  const [tab, setTab] = useState<Tab>(stage.id);
  const [draft, setDraft] = useState(card.target ? outreachBody.join("\n\n") : outreachDraft(card, link));
  const outreach = email?.body ?? draft;
  const setOutreach = email?.onChange ?? setDraft;
  const [rec, setRec] = useState(file.rec?.email ?? (card.target ? recBody.join("\n\n") : recDraft(card)));
  const [reviewing, setReviewing] = useState(false);

  return (
    <SheetContent
      onOpenAutoFocus={focusPanel}
      // The review's open state outlives the drawer, so a drawer closed from
      // inside the review (by sending or skipping) opens next time without it.
      onCloseAutoFocus={() => setReviewing(false)}
      className="w-full gap-0 bg-background p-0 outline-none data-[side=right]:sm:max-w-[640px]"
    >
      <SheetHeader className="gap-0 px-5 pt-4.5 pb-0 pr-14">
        <p className="eyebrow text-muted-foreground">{columnTitle(card.col)}</p>
        <SheetTitle className="mt-1.5 font-display text-2xl">{card.name}</SheetTitle>
        <SheetDescription className="mt-2">
          {card.jumpPct === 0
            ? `No change (${money(card.premium)})`
            : `+${card.jumpPct}% (${money(card.was)} → ${money(card.premium)})`}{" "}
          · {card.lines} · renews {card.renewal}
        </SheetDescription>
      </SheetHeader>

      {card.col === "outreach" ? (
        <Dialog open={reviewing} onOpenChange={setReviewing}>
          <ReviewBanner />
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4.5 pb-7">
            <Details card={card} file={file} />
          </div>

          {/* The Outreach tab's page, as a modal over the drawer: the drawer's
              header and ground, and its body scrolling under a header that
              stays, so the close button never scrolls away. It's centered in
              the window under the presenter's bar, since it's tall enough to
              reach it. */}
          <DialogContent
            onOpenAutoFocus={focusPanel}
            aria-describedby={undefined}
            className="top-[calc(50%+var(--demo-bar-h)/2)] flex max-h-[calc(100svh-var(--demo-bar-h)-2rem)] flex-col gap-0 overflow-hidden bg-background p-0 outline-none sm:max-w-[640px]"
          >
            <DialogHeader className="gap-0 px-5 pt-4.5 pr-14">
              <p className="eyebrow text-muted-foreground">{stage.label}</p>
              <DialogTitle className="mt-1.5 font-display text-2xl">{card.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-3.5 min-h-0 flex-1 overflow-y-auto border-t px-5 pt-4.5 pb-7">
              <div className="flex flex-col gap-4">
                <PolicyNow card={card} file={file} />
                <EmailFrame
                  toolbar={`From ${agency.agent.name}'s mailbox`}
                  to={card.target ? outreachEmail.to : `${file.namedInsured} <${card.email}>`}
                  subject={email?.subject ?? (card.target ? outreachEmail.subject : "A quick look at your renewal")}
                >
                  <LinkedEmail
                    body={outreach}
                    onChange={setOutreach}
                    onLink={card.target ? onOpenQuestionnaire : undefined}
                  />
                </EmailFrame>
                <ShapeTheShop card={card} file={file} life={life} />
              </div>
            </div>
            {/* Laid out as the drawer's own footer is: Send now fills the row
                up to Skip outreach, and once skipped, the line and Undo sit
                at either end. */}
            {onSkipOutreach && (
              <div
                className={cn(
                  "flex items-center border-t px-5 pt-3.5 pb-4",
                  skipped ? "justify-between gap-4" : "justify-end gap-2",
                )}
              >
                {skipped ? (
                  <>
                    <p className="text-sm">Skipped. {card.first} won't be emailed this time, and we won't shop it.</p>
                    <Button variant="secondary" size="lg" onClick={skipped.onUndo}>
                      Undo
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" size="lg" onClick={onSkipOutreach}>
                      Skip outreach
                    </Button>
                    <Button size="lg" className="flex-1" onClick={onSendOutreach}>
                      <Send data-icon="inline-start" />
                      Send now
                    </Button>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-3.5 min-h-0 flex-1 gap-0">
          <TabsList variant="line" className="w-full justify-start border-b px-4">
            <TabsTrigger value="details" className="flex-none">
              Details
            </TabsTrigger>
            <TabsTrigger value={stage.id} className="flex-none">
              {stage.label}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="min-h-0 overflow-y-auto px-5 pt-4.5 pb-7">
            <Details card={card} file={file} />
          </TabsContent>

          <TabsContent value="shopping" className="min-h-0 overflow-y-auto px-5 pt-4.5 pb-7">
            <Shopping card={card} file={file} onOpenResults={onOpenResults} />
          </TabsContent>

          <TabsContent value="rec" className="min-h-0 overflow-y-auto px-5 pt-4.5 pb-7">
            <Recommendation card={card} file={file} body={rec} setBody={setRec} />
          </TabsContent>

          <TabsContent value="closing" className="min-h-0 overflow-y-auto px-5 pt-4.5 pb-7">
            <Closing card={card} file={file} />
          </TabsContent>
        </Tabs>
      )}

      {card.col === "recommend" && (
        <SheetFooter className="mt-0 border-t px-5 pt-3.5 pb-4">
          <Button size="lg" className="w-full" onClick={onSendRec}>
            <Send data-icon="inline-start" />
            Send recommendation email
          </Button>
        </SheetFooter>
      )}
      {card.col === "binding" && (
        <SheetFooter className="mt-0 border-t px-5 pt-3.5 pb-4">
          <Button size="lg" className="w-full" onClick={onAskCloseOut}>
            Close out
          </Button>
        </SheetFooter>
      )}
    </SheetContent>
  );
}

/**
 * When the outreach email goes, and a way to it, where the tabs would be:
 * uplineinsurance.com's founding-member banner (Navbar.tsx there), a strip of
 * blue with white type across the drawer, the message on the left and its
 * link on the right, underlined on hover. The whole strip is the one target,
 * as there, and its focus ring is white and inside it, since a ring outside
 * it would be cut off at the drawer's edges. It's the review modal's trigger,
 * so closing the modal puts the focus back on it.
 */
function ReviewBanner() {
  return (
    <DialogTrigger asChild>
      <button
        type="button"
        className="group mt-3.5 flex w-full items-center justify-between gap-4 bg-primary px-5 py-2 text-left text-sm text-primary-foreground focus-visible:-outline-offset-4 focus-visible:outline-primary-foreground"
      >
        <span>Renewal email scheduled for Tues 9AM.</span>
        <span className="flex shrink-0 items-center gap-1 font-medium underline-offset-4 group-hover:underline">
          Review
          <ArrowRight aria-hidden className="size-3.5" />
        </span>
      </button>
    </DialogTrigger>
  );
}

/**
 * An email's words, still editable, with its questionnaire link as a link:
 * the paragraphs either side of it are two boxes that read as one, and the
 * link line between them goes to the questionnaire. Without `onLink` the
 * link is drawn but says it isn't in this prototype, since only the
 * Callahans' questionnaire is. An email with no link line is one box.
 */
function LinkedEmail({ body, onChange, onLink }: { body: string; onChange: (body: string) => void; onLink?: () => void }) {
  const paragraphs = body.split(/\n\n+/);
  const at = paragraphs.findIndex((p) => linkLine.test(p));
  // Each box keeps the kit's own padding, so its focus ring has room, and the
  // frame's padding is short by as much, so the words sit where one box's did.
  const words = "min-h-0 resize-none border-0 bg-transparent text-[15px] leading-relaxed";

  if (at < 0) {
    return (
      <div className="p-3">
        <Textarea aria-label="Outreach email" value={body} onChange={(e) => onChange(e.target.value)} className={words} />
      </div>
    );
  }

  const before = paragraphs.slice(0, at).join("\n\n");
  const after = paragraphs.slice(at + 1).join("\n\n");
  const [, label, url] = paragraphs[at].match(linkLine)!;
  const join = (b: string, a: string) => onChange([b, paragraphs[at], a].filter((part) => part.trim()).join("\n\n"));

  return (
    <div className="p-3">
      <Textarea
        aria-label="Outreach email, before the questionnaire link"
        value={before}
        onChange={(e) => join(e.target.value, after)}
        className={words}
      />
      <p className="my-4 px-2.5 text-[15px] leading-relaxed">
        {onLink ? (
          <button type="button" onClick={onLink} className={linkStyle}>
            {label}
          </button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-disabled className={linkStyle}>
                {label}
              </button>
            </TooltipTrigger>
            <TooltipContent>Only the Callahans' questionnaire is in this prototype.</TooltipContent>
          </Tooltip>
        )}
        <span className="block text-sm break-all text-muted-foreground">{url.replace(/^https?:\/\//, "")}</span>
      </p>
      <Textarea
        aria-label="Outreach email, after the questionnaire link"
        value={after}
        onChange={(e) => join(before, e.target.value)}
        className={words}
      />
    </div>
  );
}

/** A paragraph that's only a link: its words, an arrow, and the address, as Dana's inbox reads it. */
const linkLine = /^(.*?) → (https?:\/\/\S+)$/;
const linkStyle = "text-left text-primary underline underline-offset-4 hover:no-underline";

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
    <div className="border bg-card px-4.5 pt-4 pb-3.5">
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

/** What else to quote while we shop. Lines the household already has with us can't be picked. */
function ShapeTheShop({
  card,
  file,
  life,
}: {
  card: Card;
  file: HouseholdFile;
  life?: { on: boolean; onChange: (on: boolean) => void };
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

  return (
    <div className="bg-muted px-4 pt-3.5 pb-3">
      <SectionHead>Shape the shop</SectionHead>
      <p className="mt-1.5 mb-2.5 text-sm text-muted-foreground">
        Check what you want included. Recommended items are on. Grayed items do not apply.
      </p>
      <div className="grid gap-2">
        {rows.map((r) => (
          <FieldLabel key={r.id} htmlFor={`shape-${card.id}-${r.id}`} className="bg-card">
            <Field orientation="horizontal" data-disabled={r.locked}>
              <Checkbox
                id={`shape-${card.id}-${r.id}`}
                checked={!r.locked && (r.id === "life" && life ? life.on : on.has(r.id))}
                disabled={r.locked}
                onCheckedChange={() =>
                  r.id === "life" && life
                    ? life.onChange(!life.on)
                    : setOn((s) => {
                        const n = new Set(s);
                        if (n.has(r.id)) n.delete(r.id);
                        else n.add(r.id);
                        return n;
                      })
                }
              />
              <FieldContent>
                <FieldTitle>{r.label}</FieldTitle>
                <FieldDescription>{r.locked ? r.why : r.hint}</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        ))}
      </div>
    </div>
  );
}

/** A shop in progress: who we're quoting, and what has happened so far. */
function Shopping({ card, file, onOpenResults }: { card: Card; file: HouseholdFile; onOpenResults: () => void }) {
  const carriers = file.shopCarriers ?? ["Auto-Owners", "Erie", "Grange"];
  const items: TimelineItem[] = file.timeline ?? [
    { label: "You sent the outreach email", date: "Last week", state: "done" },
    { label: "They completed the questionnaire", date: "Yesterday", state: "done" },
    {
      label: `VA is shopping ${carriers.join(", ").replace(/, ([^,]*)$/, " and $1")}`,
      date: "In progress",
      state: "now",
      detail: "Check back tomorrow for quotes.",
    },
    { label: "Renewal date. Coverage needs to be in place.", date: card.renewal, state: "soon" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-muted px-5 pt-4.5 pb-4">
        <Badge variant="outline" className="bg-card">
          <LoaderCircle className="animate-spin" data-icon="inline-start" />
          Shopping in progress
        </Badge>
        <p className="mt-2.5 font-display text-lg">Check back tomorrow to see updates.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          VA is running {carriers.length} carriers for this household, quoted directly with each one.
        </p>
        <div className="mt-3.5 grid gap-2">
          {carriers.map((c) => (
            <div key={c} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 border bg-card px-3.5 py-3">
              <CarrierLogo name={c} />
              <div>
                <p className="text-base font-medium">{c}</p>
                <p className="text-sm text-muted-foreground">Quote in progress</p>
              </div>
              <span className="eyebrow text-primary">Shopping</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHead className="mb-2">What has happened</SectionHead>
        <Timeline items={items} />
      </div>

      {card.target && (
        <Button variant="outline" size="lg" className="w-full" onClick={onOpenResults}>
          Quotes are in. Continue
          <ArrowRight data-icon="inline-end" />
        </Button>
      )}
    </div>
  );
}

/** Approved and waiting on the agent: record what happened so the household can leave the board. */
function Closing({ card, file }: { card: Card; file: HouseholdFile }) {
  const c = file.closing;
  return (
    <div className="flex flex-col gap-4">
      <div className={cn("border bg-card px-4.5 py-4")}>
        <h3 className="text-2xl">{c?.title ?? `Close out ${file.namedInsured}'s renewal`}</h3>
        <p className="mt-2 text-base text-muted-foreground">
          {c?.sub ??
            `You reached out and sent a recommendation. Record ${file.namedInsured}'s decision before ${card.renewal} so this household can leave the queue.`}
        </p>
      </div>
      {c && <Timeline items={c.timeline} />}
    </div>
  );
}

function outreachDraft(card: Card, link: string) {
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

function recDraft(card: Card) {
  return `Hi ${card.first},\n\nI looked at your ${card.renewal} renewal. I put the pick on a short page so you can see why I didn't go another direction.\n\nThis does not put coverage in place. Reply with a couple of times that work and I'll call you.`;
}
