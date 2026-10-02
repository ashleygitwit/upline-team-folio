import { useEffect, useMemo, useRef, useState } from "react";
import { Columns3, Funnel, List, Search } from "lucide-react";
import { cn } from "cn";
import logoWhite from "@/assets/upline-logo-white.svg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { agency, cards as allCards, lastWeek, type Card, type Column } from "@/data";
import { focusPanel } from "@/lib/focus";
import { useMobile } from "@/lib/viewport";
import type { ScreenProps } from "@/App";
import { Board, ListView } from "@/screens/queue/Board";
import { HouseholdSheet } from "@/screens/queue/HouseholdSheet";
import { Retention } from "@/screens/queue/Retention";
import { columns, spoken } from "@/screens/queue/columns";

type Phase = "outreach" | "shopping" | "binding";
type When = "any" | "today" | "week" | "twoWeeks" | "thirty";
type Premium = "all" | "increase" | "flat" | "decrease";

const inWindow = (days: number, when: When) =>
  when === "any" ? true : when === "today" ? days === 0 : when === "week" ? days <= 7 : when === "twoWeeks" ? days <= 14 : days <= 30;

/**
 * Ashley's renewal board, the one Upline screen in the walk. It shows up three
 * times: Monday with the Callahans ready to reach out, again once Dana has
 * answered and the shop is running, and again once she has approved and the
 * renewal needs closing out.
 */
export function Queue({ onNext, phase }: ScreenProps & { phase: Phase }) {
  const mobile = useMobile();
  const [view, setView] = useState<"board" | "list">("board");
  const [search, setSearch] = useState("");
  const [when, setWhen] = useState<When>("any");
  const [stage, setStage] = useState<"all" | Column>("all");
  const [premium, setPremium] = useState<Premium>("all");
  const [needsMe, setNeedsMe] = useState(false);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [closed, setClosed] = useState<string[]>([]);
  const [open, setOpen] = useState<Card | null>(null);
  const [shown, setShown] = useState<Card | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [closing, setClosing] = useState<Card[] | null>(null);
  const [closeNote, setCloseNote] = useState("");
  const [skipping, setSkipping] = useState<Card | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const [showRetention, setShowRetention] = useState(true);
  const [lastWeekOpen, setLastWeekOpen] = useState(false);
  const toastTimer = useRef<number>(undefined);
  const filtered = when !== "any" || stage !== "all" || premium !== "all" || needsMe;

  if (open && open !== shown) setShown(open);

  // The Callahans move across the board as the week goes on.
  const board = useMemo(
    () =>
      allCards
        .map((c): Card => {
          if (!c.target) return c;
          if (phase === "shopping")
            return { ...c, col: "shopping", note: "Questionnaire in. VA shopping Erie, Auto-Owners, Grange." };
          if (phase === "binding")
            return {
              ...c,
              col: "binding",
              ageDays: 0,
              owes: ["Bind Auto-Owners in the portal", "Mark closed in Upline"],
              note: "Dana approved. Coverage is not in place.",
            };
          return c;
        })
        .filter((c) => !skipped.includes(c.id) && !closed.includes(c.id)),
    [phase, skipped, closed],
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return board.filter(
      (c) =>
        !(q && !c.name.toLowerCase().includes(q)) &&
        inWindow(c.daysOut, when) &&
        (stage === "all" || c.col === stage) &&
        !(premium === "increase" && c.jumpPct <= 0) &&
        !(premium === "flat" && c.jumpPct !== 0) &&
        !(premium === "decrease" && c.jumpPct >= 0) &&
        !(needsMe && !(c.col === "binding" && (c.ageDays ?? 0) >= 3)),
    );
  }, [board, search, when, stage, premium, needsMe]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const say = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  };

  const sendOutreach = (ids: string[]) => {
    const names = ids.map((id) => board.find((c) => c.id === id)?.name).filter(Boolean);
    say(`Sending ${names.length === 1 ? names[0] : `${names.length} emails`} Tuesday 9:00`);
    setOpen(null);
    if (ids.includes("callahan") && phase === "outreach") onNext();
  };

  const sendRec = (ids: string[]) => {
    say(ids.length === 1 ? "Recommendation queued to send" : `${ids.length} recommendations queued`);
    setOpen(null);
  };

  const skip = () => {
    if (!skipping) return;
    setSkipped((s) => [...s, skipping.id]);
    setSkipping(null);
    setOpen(null);
    say("Skipped · moved to closed for this cycle");
  };

  const closeOut = () => {
    if (!closing) return;
    const ids = closing.map((c) => c.id);
    setClosed((s) => [...s, ...ids]);
    setClosing(null);
    setCloseNote("");
    setOpen(null);
    if (ids.includes("callahan") && phase === "binding") setCelebrate(true);
    else say("Closed out");
  };

  const action = (col: Column, inCol: Card[]) =>
    col === "outreach" || col === "recommend" ? (
      <Button
        variant="link"
        size="xs"
        className="h-auto px-0"
        disabled={!inCol.length}
        onClick={() => (col === "outreach" ? sendOutreach : sendRec)(inCol.map((c) => c.id))}
      >
        Send {inCol.length}
      </Button>
    ) : null;

  return (
    <div className={cn("bg-background", !mobile && "min-h-[calc(100svh-var(--demo-bar-h))]")}>
      <header
        className={cn(
          "band-surface sticky z-20 flex items-center gap-4 px-7 py-3",
          mobile ? "top-0 z-[1] gap-2.5 px-3 py-2.5" : "top-(--demo-bar-h)",
        )}
      >
        <img src={logoWhite} alt="Upline" className="h-[22px] w-auto" />
        <div className="ml-auto flex items-center gap-2.5 text-sm">
          {!mobile && <span>{agency.agent.name}</span>}
          <Avatar>
            <AvatarFallback className="bg-card text-xs font-medium text-primary">{agency.agent.initials}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className={cn(mobile ? "px-3 pt-3.5 pb-9" : "px-6 pt-5 pb-30")}>
        <p className="eyebrow text-muted-foreground">{agency.name}</p>
        <h1 className={cn("mt-1.5", mobile ? "text-2xl" : "text-3xl")}>Renewal outreach</h1>

        <div className="mt-4.5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-sans text-base font-normal">Retention data</h2>
          <Button variant="secondary" size="sm" onClick={() => setShowRetention((s) => !s)}>
            {showRetention ? "Collapse" : "Expand"}
          </Button>
        </div>
        {showRetention && <Retention />}

        <div className={cn("mt-5.5 mb-3.5 flex flex-col gap-2.5", mobile && "gap-2")}>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="font-sans text-base font-normal">Outreach queue</h2>
            {!mobile && (
              <Button variant="link" size="xs" className="h-auto px-0" onClick={() => setLastWeekOpen(true)}>
                Last week's outreach
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={filtered ? "outline" : "secondary"}
                  size="sm"
                  className={cn(filtered && "border-primary text-primary")}
                >
                  <Funnel data-icon="inline-start" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[260px] gap-2.5">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="filter-when">Renewal date</FieldLabel>
                  <Select value={when} onValueChange={(v) => setWhen(v as When)}>
                    <SelectTrigger id="filter-when" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any renewal date</SelectItem>
                      <SelectItem value="today">Renews today</SelectItem>
                      <SelectItem value="week">This week</SelectItem>
                      <SelectItem value="twoWeeks">Next 2 weeks</SelectItem>
                      <SelectItem value="thirty">Next 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="filter-stage">Stage</FieldLabel>
                  <Select value={stage} onValueChange={(v) => setStage(v as "all" | Column)}>
                    <SelectTrigger id="filter-stage" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {columns.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="filter-premium">Premium</FieldLabel>
                  <Select value={premium} onValueChange={(v) => setPremium(v as Premium)}>
                    <SelectTrigger id="filter-premium" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="increase">Increase</SelectItem>
                      <SelectItem value="flat">No change</SelectItem>
                      <SelectItem value="decrease">Decrease</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field orientation="horizontal" className="mt-1">
                  <Checkbox id="filter-needs" checked={needsMe} onCheckedChange={(v) => setNeedsMe(v === true)} />
                  <FieldLabel htmlFor="filter-needs">Closing · needs me</FieldLabel>
                </Field>
              </PopoverContent>
            </Popover>

            <Tabs value={view} onValueChange={(v) => setView(v as "board" | "list")}>
              <TabsList aria-label="Board or list">
                <TabsTrigger value="board">
                  <Columns3 />
                  Board
                </TabsTrigger>
                <TabsTrigger value="list">
                  <List />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search names"
              aria-label="Search names"
              className="pl-9"
            />
          </div>
        </div>

        {view === "board" ? (
          <Board cards={visible} onOpen={setOpen} action={action} />
        ) : (
          <ListView cards={visible} onOpen={setOpen} action={action} />
        )}
        {!visible.length && <p className="mt-3 text-sm text-muted-foreground">No households match those filters.</p>}
      </div>

      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        {shown && (
          <HouseholdSheet
            key={shown.id}
            card={shown}
            onSendOutreach={() => sendOutreach([shown.id])}
            onSendRec={() => sendRec([shown.id])}
            onOpenResults={() => {
              if (shown.target && phase === "shopping") onNext();
            }}
            onAskCloseOut={() => setClosing([shown])}
            onSkipOutreach={shown.col === "outreach" ? () => setSkipping(shown) : undefined}
          />
        )}
      </Sheet>

      <Sheet open={lastWeekOpen} onOpenChange={setLastWeekOpen}>
        <SheetContent onOpenAutoFocus={focusPanel} className="w-full gap-0 bg-background p-0 outline-none data-[side=right]:sm:max-w-[640px]">
          <SheetHeader className="gap-0 px-5 pt-4.5 pb-4 pr-14">
            <p className="eyebrow text-muted-foreground">Week of October 5</p>
            <SheetTitle className="mt-1.5 font-display text-2xl">Last week's outreach</SheetTitle>
            <SheetDescription className="mt-2">Who you emailed, and where they are now</SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto border-t px-5 pt-2 pb-7">
            {lastWeek.map((row) => {
              const card = board.find((c) => c.id === row.id);
              return (
                <button
                  key={row.id}
                  type="button"
                  disabled={!card}
                  onClick={() => {
                    if (!card) return;
                    setLastWeekOpen(false);
                    setOpen(card);
                  }}
                  className="flex w-full items-center justify-between gap-3 border-b px-0.5 py-3 text-left enabled:hover:text-primary disabled:cursor-default"
                >
                  <span>
                    <span className="block text-sm font-medium">{row.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      Sent {row.sent} · renews {row.renewal}
                    </span>
                  </span>
                  <Badge variant="secondary">{row.stage}</Badge>
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!skipping} onOpenChange={(o) => !o && setSkipping(null)}>
        <DialogContent onOpenAutoFocus={focusPanel} className="outline-none">
          <DialogHeader>
            <p className="eyebrow text-muted-foreground">Skip outreach</p>
            <DialogTitle className="font-display text-2xl">
              Are you sure you want to skip reaching out to {skipping && spoken(skipping.name)}?
            </DialogTitle>
            <DialogDescription>
              They will not be emailed about their upcoming renewal. This household will go straight to close for the
              cycle.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setSkipping(null)}>
              Cancel
            </Button>
            <Button onClick={skip}>Skip outreach</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!closing} onOpenChange={(o) => !o && setClosing(null)}>
        <DialogContent className="outline-none">
          <DialogHeader>
            <p className="eyebrow text-muted-foreground">Close out</p>
            <DialogTitle className="font-display text-2xl">
              Tell us what happened for {closing?.[0] && spoken(closing[0].name)}
            </DialogTitle>
            <DialogDescription>
              Is {closing?.[0]?.first} staying put? Did you bind a new carrier, or are you still waiting on something?
            </DialogDescription>
          </DialogHeader>
          <Textarea
            aria-label="What happened"
            value={closeNote}
            onChange={(e) => setCloseNote(e.target.value)}
            placeholder="She is staying with Erie. I bound it this morning."
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setClosing(null)}>
              Cancel
            </Button>
            <Button onClick={closeOut}>Close out</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={celebrate} onOpenChange={setCelebrate}>
        <SheetContent onOpenAutoFocus={focusPanel} className="grid w-full place-items-center bg-background px-5.5 outline-none data-[side=right]:sm:max-w-[420px]">
          <div className="w-full border border-blue-100 bg-blue-100/30 px-4 py-7 text-center">
            <Badge>Closed-won · pending AMS verify</Badge>
            <SheetTitle className="my-2 font-display text-3xl">Nice.</SheetTitle>
            <SheetDescription className="text-base">The card left Closing. Approve was never bound.</SheetDescription>
            <Button className="mt-5 w-full" onClick={() => setCelebrate(false)}>
              Back to the queue
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <div aria-live="polite" role="status">
        {toast && (
          <div className="fixed bottom-25 left-1/2 z-[55] -translate-x-1/2 bg-dark-bg px-4.5 py-3 text-sm font-medium text-dark-fg animate-in duration-200 fade-in-0">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
