import { useEffect, useRef, useState, type ReactNode } from "react";
import { AlarmClock, ArrowRight, MailClock } from "lucide-react";
import { cn } from "cn";
import { PlaceLine, Requests } from "@/components/Status";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/household/tabs";
import { pruitt, nudgeByKey, type Day } from "@/data";
import { activityFor, nudgeState, type Activity, type Banner, type Opens, type Page } from "@/household/activity";
import { columnTitle, spoken } from "@/household/columns";
import { money, type Card, type QuoteDoc } from "@/household/data";
import { fileOf } from "@/household/households";
import { focusPanel } from "@/lib/focus";
import { placeOf } from "@/phases";
import { Details } from "@/household/Details";
import { Notes } from "@/household/Notes";
import { OutreachFor } from "@/household/Outreach";
import { CloseOut, EarlierResults, NudgeReview, ShopInProgress } from "@/household/phases";
import { OpenQuotes, PageBack } from "@/household/pageNav";
import { Layer } from "@/household/PhasePage";
import { QuotesPage } from "@/household/Recommendation";
import { RecentActivity } from "@/household/RecentActivity";
import { changedFields, daysOut, isSnoozed, needsAction, requestsFor, snoozeLabel, snoozes } from "@/tasks";
import type { SnoozeUntil, WalkProps } from "@/walk";

type Tab = "details" | "activity" | "notes";

/**
 * A household, opened from its card or line on the homepage's board. Every
 * household has the same drawer: on white, the stage it's in, as the board's
 * column names it, over its name, a banner when something is going on, and
 * three tabs, and under the tabs, on gray 50, what each one holds. The tabs
 * are Recent activity, Details and Notes, which always open on Recent
 * activity, since what's coming up and what has happened is what Jenna opens
 * a household to see. Notes is Jenna's own. Closing the drawer gives the
 * focus back to whatever opened it (`returnFocus`): Radix gives it back only
 * to a trigger of its own, and the board opens the drawer without one.
 *
 * The banner is blue when it needs Jenna (results to review, an approval to
 * bind) and gray when it only says what's going on (an email or nudge
 * scheduled, a shop running, a recommendation out). It opens that phase's
 * page, and so do the lines in Recent activity that have more behind them:
 * the outreach review, a nudge, the shop, the results or the close-out,
 * each with its buttons in its footer. A page slides over the profile
 * (PhasePage.tsx), its back button named for the household, and the
 * carriers' quotes slide over the results the same way; Escape goes back
 * one at a time, and the close button or a click outside closes the drawer.
 * What's shown follows the walk's day (activity.ts), and what Jenna does on
 * a page lands in the walk: the email she edits is the one Leah gets, Send
 * now and Skip mark the email or nudge, sending a recommendation or closing
 * out moves the household on, and notes stay for the rest of the walk. Once
 * she has done it, the page goes back to the profile, which shows where
 * things stand now, and the toast at the drawer's foot says what happened.
 *
 * The Pruitts' results are `results`, which their card on the homepage
 * opens too, as the drawer with the results over it. Their email links to
 * Leah's questionnaire (`onOpenQuestionnaire`), as if it opened in another
 * tab.
 *
 * Started as v2.5's drawer (screens/queue/HouseholdSheet.tsx there).
 */
export function HouseholdSheet({
  card,
  day,
  walk,
  update,
  page,
  onPage,
  toast,
  onDone,
  onSkipOutreach,
  onOpenQuestionnaire,
  results,
  returnFocus,
}: Pick<WalkProps, "walk" | "update"> & {
  card: Card;
  day: Day;
  /** The page over the profile, if one is open. */
  page: Page | null;
  onPage: (page: Page | null) => void;
  /** What the toast says, while it's up. */
  toast: string | null;
  /** Goes back to the profile and says what happened in the toast. */
  onDone: (said: string) => void;
  /** Asks before skipping the household's outreach. */
  onSkipOutreach: () => void;
  /** Goes to Leah's questionnaire in the walk, from the Pruitts' email. */
  onOpenQuestionnaire: () => void;
  /** The Pruitts' shop results, as a page. */
  results: ReactNode;
  /** Gives the focus back to what opened the drawer, once it has closed. */
  returnFocus: (id: string) => void;
}) {
  const file = fileOf(card);
  const activity: Activity = activityFor(card.id, day, walk) ?? {
    stage: columnTitle(card.col),
    banner: null,
    upNext: [],
    past: [],
  };
  const place = placeOf(card.id, day, walk);
  // "Leah and Tom", "Tobi": who the household is, in a sentence.
  const who = card.name.includes("&") ? spoken(card.name.replace(/\s+\S+$/, "")) : card.first;

  const [tab, setTab] = useState<Tab>("activity");
  // The carriers' quotes, over the results.
  const [quotes, setQuotes] = useState<{ docs: QuoteDoc[] } | null>(null);

  // A task on today's board can be snoozed from the banner, and
  // while it's snoozed the banner says so instead, with Undo.
  const snoozed = isSnoozed(card.id, day, walk);
  const snooze =
    activity.banner?.tone === "blue" && needsAction(card.id, day, walk)
      ? {
          daysOut: daysOut(card.id, day),
          onSnooze: (until: SnoozeUntil) => update((w) => ({ snoozed: { ...w.snoozed, [card.id]: { until, day } } })),
        }
      : undefined;
  const unsnooze = () =>
    update((w) => {
      const { [card.id]: _, ...rest } = w.snoozed;
      return { snoozed: rest };
    });
  const [rec, setRec] = useState(file.rec?.email ?? "");

  // Going back gives the focus to what opened the page: the banner or a line
  // in Recent activity, or for the quotes, the link under the results. A page
  // the walk opened with the drawer gives it to the drawer.
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const quotesOpener = useRef<HTMLElement | null>(null);
  const openPhase = (opens: Opens, from: HTMLElement) => {
    opener.current = from;
    onPage({ phase: opens.phase, nudge: opens.nudge });
  };
  const back = () => onPage(null);
  const openQuotes = (docs: QuoteDoc[], from: HTMLElement) => {
    quotesOpener.current = from;
    setQuotes({ docs });
  };
  const closeQuotes = () => setQuotes(null);
  const hadPage = useRef(page !== null);
  useEffect(() => {
    if (hadPage.current && page === null) {
      (opener.current?.isConnected ? opener.current : panel.current)?.focus();
      opener.current = null;
    }
    hadPage.current = page !== null;
  }, [page]);
  const hadQuotes = useRef(false);
  useEffect(() => {
    if (hadQuotes.current && quotes === null) quotesOpener.current?.focus();
    hadQuotes.current = quotes !== null;
  }, [quotes]);

  const pageFor = (open: Page) => {
    switch (open.phase) {
      case "outreach":
        return (
          <OutreachFor
            card={card}
            day={day}
            walk={walk}
            update={update}
            onDone={onDone}
            onSkipOutreach={onSkipOutreach}
            onOpenQuestionnaire={onOpenQuestionnaire}
          />
        );
      case "nudge": {
        const n = nudgeByKey(open.nudge!);
        const draftKey = `nudge:${n.key}`;
        const choose = (choice: "sent" | "skipped") =>
          update((w) => ({ nudges: { ...w.nudges, [n.key]: { choice, day } } }));
        return (
          <NudgeReview
            card={card}
            file={file}
            nudge={n}
            state={nudgeState(n.key, day, walk)}
            body={walk.drafts[draftKey] ?? n.email}
            onChange={(body) => update((w) => ({ drafts: { ...w.drafts, [draftKey]: body } }))}
            onSend={() => {
              choose("sent");
              onDone(`Sent to ${spoken(card.name)}`);
            }}
            onSkip={() => {
              choose("skipped");
              onDone(`${n.what} skipped`);
            }}
            onUndo={() =>
              update((w) => {
                const { [n.key]: _, ...rest } = w.nudges;
                return { nudges: rest };
              })
            }
          />
        );
      }
      case "shopping":
        return activity.shop ? <ShopInProgress shop={activity.shop} /> : null;
      case "results":
        return card.id === pruitt.id ? (
          results
        ) : (
          <EarlierResults
            card={card}
            file={file}
            body={rec}
            setBody={setRec}
            sent={activity.recSent}
            onSend={() => {
              update((w) => ({ recsSent: [...new Set([...w.recsSent, card.id])] }));
              onDone(`Sent to ${spoken(card.name)}`);
            }}
          />
        );
      case "closing":
        return (
          <CloseOut
            card={card}
            activity={activity}
            onCloseOut={(note) => {
              update((w) => ({
                closed: { ...w.closed, [card.id]: note },
                ...(card.id === pruitt.id ? { bound: true } : {}),
              }));
              onDone("Closed out");
            }}
            // Undo only on the day it was closed out: Monday's are closed
            // off-camera by Wednesday anyway, and the Pruitts close Friday.
            onUndo={
              walk.closed[card.id] !== undefined && (day === "mon" || card.id === pruitt.id)
                ? () =>
                    update((w) => {
                      const { [card.id]: _, ...closed } = w.closed;
                      return { closed, ...(card.id === pruitt.id ? { bound: false } : {}) };
                    })
                : undefined
            }
          />
        );
    }
  };

  return (
    <SheetContent
      ref={panel}
      onOpenAutoFocus={focusPanel}
      // The drawer's state outlives it, so a drawer closed with the quotes
      // open opens next time on Recent activity, with nothing over it. Upline
      // clears the page when it opens a household.
      onCloseAutoFocus={(e) => {
        setTab("activity");
        setQuotes(null);
        e.preventDefault();
        returnFocus(card.id);
      }}
      onEscapeKeyDown={(e) => {
        if (!page) return;
        e.preventDefault();
        if (quotes) closeQuotes();
        else back();
      }}
      // The close button sits level with the name's line, and its cross's
      // edge on the 24px the drawer's words keep from its edge.
      className="w-full gap-0 overflow-hidden bg-popover p-0 outline-none data-[side=right]:sm:max-w-[640px] [&>[data-slot=sheet-close]]:top-6"
    >
      {/* The profile, which nothing in can take the focus while a page covers it. */}
      <div inert={page !== null} className="flex min-h-0 flex-1 flex-col">
        <SheetHeader className="gap-0 p-6 pr-14">
          <SheetTitle className="font-display text-2xl">{card.name}</SheetTitle>
          <SheetDescription className="mt-2">
            {card.jumpPct === 0
              ? `No change (${money(card.premium)})`
              : `+${card.jumpPct}% (${money(card.was)} → ${money(card.premium)})`}{" "}
            · {card.lines} · renews {card.renewal}
          </SheetDescription>
          {/* The board's column and the card's status (phases.ts), then what
              they asked for, as the board's cards say them. The column was an
              eyebrow over the name until 2026-10-01. Snoozed was a chip here
              too; the gray banner says it, with Undo. */}
          <div className="mt-3 flex flex-col gap-1 text-sm">
            {place ? <PlaceLine {...place} /> : <p className="text-muted-foreground">{activity.stage}</p>}
            <Requests requests={requestsFor(card.id, day, walk)} />
          </div>
        </SheetHeader>

        {snoozed ? (
          <StatusBanner
            tone="gray"
            text={`Snoozed ${snoozeLabel(walk.snoozed[card.id].until)}.`}
            onOpen={openPhase}
            undo={unsnooze}
          />
        ) : (
          activity.banner && <StatusBanner {...activity.banner} onOpen={openPhase} snooze={snooze} />
        )}

        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="min-h-0 flex-1 gap-0">
          {/* The list's 12px and a tab's own 12px put the first tab's name on
              the 24px the drawer's words keep from its edge. */}
          <TabsList variant="line" className="w-full justify-start border-b px-3">
            <TabsTrigger value="activity" className="flex-none">
              Recent activity
            </TabsTrigger>
            <TabsTrigger value="details" className="flex-none">
              Details
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex-none">
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="min-h-0 overflow-y-auto bg-background p-6">
            <RecentActivity activity={activity} onOpen={openPhase} />
          </TabsContent>

          <TabsContent value="details" className="min-h-0 overflow-y-auto bg-background p-6">
            <Details card={card} file={file} changed={changedFields(card.id, day, walk)} />
          </TabsContent>

          <TabsContent value="notes" className="flex min-h-0 flex-col bg-background">
            <Notes
              first={who}
              notes={walk.notes[card.id] ?? []}
              onAdd={(text) =>
                update((w) => ({
                  notes: {
                    ...w.notes,
                    [card.id]: [
                      ...(w.notes[card.id] ?? []),
                      {
                        id: Date.now(),
                        day,
                        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
                        text,
                      },
                    ],
                  },
                }))
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      <OpenQuotes.Provider value={openQuotes}>
        <PageBack.Provider value={{ label: card.name, onBack: back }}>
          <Layer item={page} covered={quotes !== null}>
            {pageFor}
          </Layer>
        </PageBack.Provider>
      </OpenQuotes.Provider>
      <PageBack.Provider value={{ label: "Recommendation", onBack: closeQuotes }}>
        <Layer item={page && quotes}>{(q) => <QuotesPage docs={q.docs} />}</Layer>
      </PageBack.Provider>

      <div aria-live="polite" role="status">
        {toast && (
          <div className="absolute bottom-6 left-1/2 z-30 w-max max-w-[calc(100%-3rem)] -translate-x-1/2 bg-dark-bg px-6 py-3 text-sm font-medium text-dark-fg animate-in duration-200 fade-in-0">
            {toast}
          </div>
        )}
      </div>
    </SheetContent>
  );
}

/**
 * What's going on with the household, and a way to it, over the tabs:
 * uplineinsurance.com's founding-member banner (Navbar.tsx there), a strip
 * across the drawer with the message on the left and its link on the right,
 * underlined on hover. Blue with white type when it needs Jenna; the quiet
 * gray, with the link in blue, when it doesn't. The whole strip is the one
 * target, as there, and its focus ring is inside it, since a ring outside it
 * would be cut off at the drawer's edges. A banner with nowhere to go is only
 * its message. One for an email scheduled to go out leads with an envelope
 * with a clock at its corner, so it reads as waiting rather than done; it was
 * a plain clock until 2026-10-01, when the clock came to mean the countdown
 * to a renewal. A blue banner for a task on today's
 * list ends in an alarm clock, which snoozes it; a snoozed banner is gray
 * and ends in Undo.
 */
function StatusBanner({
  text,
  tone,
  opens,
  scheduled,
  onOpen,
  snooze,
  undo,
}: Banner & {
  onOpen: (opens: Opens, from: HTMLElement) => void;
  snooze?: { daysOut: number; onSnooze: (until: SnoozeUntil) => void };
  undo?: () => void;
}) {
  const blue = tone === "blue";
  const strip = cn(
    "flex w-full items-center justify-between gap-4 px-6 py-3 text-left text-sm",
    blue ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
  );
  const message = (
    <span className="flex items-center gap-2">
      {scheduled && <MailClock aria-hidden className="size-4 shrink-0" />}
      {text}
    </span>
  );
  if (undo) {
    return (
      <div className={strip}>
        <span>{text}</span>
        <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={undo}>
          Undo
        </Button>
      </div>
    );
  }
  if (!opens) return <p className={strip}>{message}</p>;
  return (
    <div className={cn("flex items-stretch", blue ? "bg-primary" : "bg-muted")}>
      <button
        type="button"
        onClick={(e) => onOpen(opens, e.currentTarget)}
        className={cn(
          "group min-w-0 flex-1 pointer-coarse:min-h-11 focus-visible:-outline-offset-4",
          strip,
          blue && "focus-visible:outline-primary-foreground",
        )}
      >
        {message}
        <span
          className={cn(
            "flex shrink-0 items-center gap-1 font-medium underline-offset-4 group-hover:underline",
            !blue && "text-primary",
          )}
        >
          {opens.action}
          <ArrowRight aria-hidden className="size-3.5" />
        </span>
      </button>
      {snooze && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Snooze"
              className="mr-4 self-center text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground focus-visible:outline-primary-foreground"
            >
              <AlarmClock />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            {snoozes.map((s) => (
              <DropdownMenuItem
                key={s.until}
                disabled={s.until === "beforeRenewal" && snooze.daysOut <= 5}
                onSelect={() => snooze.onSnooze(s.until)}
              >
                {s.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
