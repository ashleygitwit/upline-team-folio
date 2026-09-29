import { useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";
import { Dialog } from "@/components/ui/dialog";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/household/tabs";
import { callahan, nudgeByKey, thisWeek, type Day } from "@/data";
import { activityFor, nudgeState, type Activity, type Banner, type Opens } from "@/household/activity";
import { columnTitle, spoken } from "@/household/columns";
import { fileFor, money, type Card } from "@/household/data";
import { focusPanel } from "@/lib/focus";
import { Details } from "@/household/Details";
import { Notes } from "@/household/Notes";
import { CloseOut, EarlierResults, NudgeReview, OutreachReview, ShopInProgress } from "@/household/phases";
import { RecentActivity } from "@/household/RecentActivity";
import { ReturnFocus } from "@/household/returnFocus";
import type { WalkProps } from "@/walk";

type Tab = "details" | "activity" | "notes";

/**
 * A household, opened from a homepage row, a row menu's View Profile or the
 * Policyholder List. Every household has the same drawer: the stage it's in
 * over its name, a banner when something is going on, and three tabs, which
 * always open on Details. Recent activity is what's coming up and what has
 * happened; Notes is Stacey's own.
 *
 * The banner is blue when it needs Stacey (results to review, an approval to
 * bind) and gray when it only says what's going on (an email or nudge
 * scheduled, a shop running, a recommendation out). It opens that phase's
 * modal, and so do the lines in Recent activity that have more behind them:
 * the outreach review, a nudge, the shop, the results or the close-out,
 * each with its buttons in its footer. What's shown follows the walk's day
 * (activity.ts), and what Stacey does in a modal lands in the walk: the email
 * she edits is the one Dana gets, Send now and Skip mark the email or nudge,
 * sending a recommendation or closing out moves the household on, and notes
 * stay for the rest of the walk.
 *
 * The Callahans' results are `results`, the content of a dialog that the
 * homepage and the chat open on their own too. Their email links to Dana's
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
  /** Goes to Dana's questionnaire in the walk, from the Callahans' email. */
  onOpenQuestionnaire: () => void;
  /** The Callahans' shop results: the content of a dialog. */
  results: ReactNode;
}) {
  const file = fileFor(card);
  const h = thisWeek.find((x) => x.id === card.id);
  const activity: Activity = activityFor(card.id, day, walk) ?? {
    stage: columnTitle(card.col),
    banner: null,
    upNext: [],
    past: [],
  };
  // "Dana and Mike", "Ife": who the household is, in a sentence.
  const who = card.name.includes("&") ? spoken(card.name.replace(/\s+\S+$/, "")) : card.first;

  const [tab, setTab] = useState<Tab>("details");
  const [open, setOpen] = useState<Opens | null>(null);
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

  const email = h && {
    subject: h.subject,
    body: walk.drafts[h.id] ?? h.email,
    onChange: (body: string) => update((w) => ({ drafts: { ...w.drafts, [h.id]: body } })),
  };
  const skipped = h && walk.skipped.includes(h.id);

  const modal = (() => {
    switch (open?.phase) {
      case "outreach":
        return (
          <OutreachReview
            card={card}
            file={file}
            email={email}
            life={
              h && {
                on: walk.lifeQuote[h.id] ?? true,
                onChange: (on) => update((w) => ({ lifeQuote: { ...w.lifeQuote, [h.id]: on } })),
              }
            }
            sent={activity.outreachSent}
            skipped={
              skipped ? { onUndo: () => update((w) => ({ skipped: w.skipped.filter((x) => x !== card.id) })) } : undefined
            }
            onSkip={h && onSkipOutreach}
            onSend={
              h &&
              (() => {
                update((w) => ({ approved: [...new Set([...w.approved, card.id])] }));
                onDone(`Sent to ${spoken(card.name)}`);
              })
            }
            onOpenQuestionnaire={card.id === callahan.id ? onOpenQuestionnaire : undefined}
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
        return card.id === callahan.id ? (
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
                ...(card.id === callahan.id ? { bound: true } : {}),
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
      </SheetHeader>

      {activity.banner && <StatusBanner {...activity.banner} onOpen={openPhase} />}

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
          <Details card={card} file={file} />
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
 * underlined on hover. Blue with white type when it needs Stacey; the quiet
 * gray, with the link in blue, when it doesn't. The whole strip is the one
 * target, as there, and its focus ring is inside it, since a ring outside it
 * would be cut off at the drawer's edges. A banner with nowhere to go is only
 * its message.
 */
function StatusBanner({ text, tone, opens, onOpen }: Banner & { onOpen: (opens: Opens, from: HTMLElement) => void }) {
  const blue = tone === "blue";
  const strip = cn(
    "mt-3.5 flex w-full items-center justify-between gap-4 px-5 py-2 text-left text-sm",
    blue ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
  );
  if (!opens) return <p className={strip}>{text}</p>;
  return (
    <button
      type="button"
      onClick={(e) => onOpen(opens, e.currentTarget)}
      className={cn(
        "group pointer-coarse:min-h-11 focus-visible:-outline-offset-4",
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
  );
}
