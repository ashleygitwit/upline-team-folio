import { useRef, useState, type ReactNode } from "react";
import { AlarmClock, ArrowRight } from "lucide-react";
import { cn } from "cn";
import { Chips } from "@/components/Chips";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/household/tabs";
import { pruitt, nudgeByKey, type Day } from "@/data";
import { activityFor, nudgeState, type Activity, type Banner, type Opens } from "@/household/activity";
import { columnTitle, spoken } from "@/household/columns";
import { fileFor, money, type Card } from "@/household/data";
import { focusPanel } from "@/lib/focus";
import { Details } from "@/household/Details";
import { Notes } from "@/household/Notes";
import { OutreachFor } from "@/household/Outreach";
import { CloseOut, EarlierResults, NudgeReview, ShopInProgress } from "@/household/phases";
import { RecentActivity } from "@/household/RecentActivity";
import { ReturnFocus } from "@/household/returnFocus";
import { changedFields, chipsFor, daysOut, isSnoozed, needsAction, snoozeLabel, snoozes } from "@/tasks";
import type { SnoozeUntil, WalkProps } from "@/walk";

type Tab = "details" | "activity" | "notes";

/**
 * A household, opened from a homepage row, a row menu's View Profile or the
 * Policyholder List. Every household has the same drawer: the stage it's in
 * over its name, a banner when something is going on, and three tabs, which
 * always open on Details. Recent activity is what's coming up and what has
 * happened; Notes is Jenna's own.
 *
 * The banner is blue when it needs Jenna (results to review, an approval to
 * bind) and gray when it only says what's going on (an email or nudge
 * scheduled, a shop running, a recommendation out). It opens that phase's
 * modal, and so do the lines in Recent activity that have more behind them:
 * the outreach review, a nudge, the shop, the results or the close-out,
 * each with its buttons in its footer. What's shown follows the walk's day
 * (activity.ts), and what Jenna does in a modal lands in the walk: the email
 * she edits is the one Leah gets, Send now and Skip mark the email or nudge,
 * sending a recommendation or closing out moves the household on, and notes
 * stay for the rest of the walk.
 *
 * The Pruitts' results are `results`, the content of a dialog that the
 * homepage opens on its own too. Their email links to Leah's
 * questionnaire (`onOpenQuestionnaire`), as if it opened in another tab.
 *
 * Started as v2.5's drawer (screens/queue/HouseholdSheet.tsx there).
 */
export function HouseholdSheet({
  card,
  day,
  walk,
  update,
  onDone,
  onSkipOutreach,
  onOpenQuestionnaire,
  results,
}: Pick<WalkProps, "walk" | "update"> & {
  card: Card;
  day: Day;
  /** Closes the drawer and says what happened in the toast. */
  onDone: (said: string) => void;
  /** Asks before skipping the household's outreach. */
  onSkipOutreach: () => void;
  /** Goes to Leah's questionnaire in the walk, from the Pruitts' email. */
  onOpenQuestionnaire: () => void;
  /** The Pruitts' shop results: the content of a dialog. */
  results: ReactNode;
}) {
  const file = fileFor(card);
  const activity: Activity = activityFor(card.id, day, walk) ?? {
    stage: columnTitle(card.col),
    banner: null,
    upNext: [],
    past: [],
  };
  // "Leah and Tom", "Tobi": who the household is, in a sentence.
  const who = card.name.includes("&") ? spoken(card.name.replace(/\s+\S+$/, "")) : card.first;

  const [tab, setTab] = useState<Tab>("details");
  const [open, setOpen] = useState<Opens | null>(null);

  // A task on today's Action Needed list can be snoozed from the banner, and
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

  // A phase modal gives the focus back to the banner or line that opened it.
  const opener = useRef<HTMLElement | null>(null);
  const openPhase = (opens: Opens, from: HTMLElement) => {
    opener.current = from;
    setOpen(opens);
  };
  const returnFocus = (e: Event) => {
    if (!opener.current?.isConnected) return;
    e.preventDefault();
    opener.current.focus();
  };

  const modal = (() => {
    switch (open?.phase) {
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
        return activity.shop ? <ShopInProgress card={card} shop={activity.shop} /> : null;
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
          />
        );
      default:
        return null;
    }
  })();

  return (
    <SheetContent
      onOpenAutoFocus={focusPanel}
      // The drawer's state outlives it, so a drawer closed from inside a modal
      // (by sending or skipping) opens next time on Details, with no modal.
      onCloseAutoFocus={() => {
        setOpen(null);
        setTab("details");
      }}
      className="w-full gap-0 bg-background p-0 outline-none data-[side=right]:sm:max-w-[640px]"
    >
      <SheetHeader className="gap-0 px-5 pt-4.5 pb-0 pr-14">
        <p className="eyebrow text-muted-foreground">{activity.stage}</p>
        <SheetTitle className="mt-1.5 font-display text-2xl">{card.name}</SheetTitle>
        <SheetDescription className="mt-2">
          {card.jumpPct === 0
            ? `No change (${money(card.premium)})`
            : `+${card.jumpPct}% (${money(card.was)} → ${money(card.premium)})`}{" "}
          · {card.lines} · renews {card.renewal}
        </SheetDescription>
        <Chips chips={chipsFor(card.id, day, walk)} className="mt-2.5" />
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

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as Tab)}
        className={cn("min-h-0 flex-1 gap-0", !activity.banner && "mt-3.5")}
      >
        {/* The list's side padding gives way on a phone, where the drawer is
            three quarters of the screen, so the three tabs still fit. */}
        <TabsList variant="line" className="w-full justify-start border-b px-2 sm:px-4">
          <TabsTrigger value="details" className="flex-none">
            Details
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex-none">
            Recent activity
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex-none">
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="min-h-0 overflow-y-auto px-5 pt-4.5 pb-7">
          <Details card={card} file={file} changed={changedFields(card.id, day, walk)} />
        </TabsContent>

        <TabsContent value="activity" className="min-h-0 overflow-y-auto px-5 pt-4.5 pb-7">
          <RecentActivity activity={activity} onOpen={openPhase} />
        </TabsContent>

        <TabsContent value="notes" className="flex min-h-0 flex-col">
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

      <Dialog open={modal !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <ReturnFocus.Provider value={returnFocus}>{modal}</ReturnFocus.Provider>
      </Dialog>
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
 * its message. A blue banner for a task on today's list ends in a clock,
 * which snoozes it; a snoozed banner is gray and ends in Undo.
 */
function StatusBanner({
  text,
  tone,
  opens,
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
    "flex w-full items-center justify-between gap-4 px-5 py-2 text-left text-sm",
    blue ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
  );
  if (undo) {
    return (
      <div className={cn("mt-3.5", strip)}>
        <span>{text}</span>
        <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={undo}>
          Undo
        </Button>
      </div>
    );
  }
  if (!opens) return <p className={cn("mt-3.5", strip)}>{text}</p>;
  return (
    <div className={cn("mt-3.5 flex items-stretch", blue ? "bg-primary" : "bg-muted")}>
      <button
        type="button"
        onClick={(e) => onOpen(opens, e.currentTarget)}
        className={cn(
          "group min-w-0 flex-1 pointer-coarse:min-h-11 focus-visible:-outline-offset-4",
          strip,
          blue && "focus-visible:outline-primary-foreground",
        )}
      >
        <span>{text}</span>
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
              className="mr-2 self-center text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground focus-visible:outline-primary-foreground"
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
