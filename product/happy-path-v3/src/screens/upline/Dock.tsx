import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown, ChevronRight, ChevronUp, X } from "lucide-react";
import { cn } from "cn";
import { HomeThumb } from "@/components/HomeThumb";
import { HouseholdDetails } from "@/components/HouseholdDetails";
import { PersonLink } from "@/components/PersonLink";
import { PriceChange } from "@/components/PriceChange";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { agency, earlier, initials, money, thisWeek, upcoming, type Day, type Household } from "@/data";
import { badgeVariant, statusFor } from "@/status";
import { going } from "@/today";
import type { Walk, WalkProps } from "@/walk";

export type Panel = "scheduled" | "activity";

type DockProps = WalkProps & {
  day: Day;
  panel: Panel | null;
  /** The household whose full message is open beside the panel. */
  message: string | null;
  onPanel: (panel: Panel | null) => void;
  onMessage: (id: string | null) => void;
  onProfile: () => void;
  onResults: () => void;
  onEveryone: () => void;
};

const days: Day[] = ["mon", "wed", "thu", "fri"];

/** Whether a household's standing moved since the day before. */
function isNew(h: Household, day: Day, walk: Walk) {
  if (day === "mon" || walk.skipped.includes(h.id)) return false;
  const before = days[days.indexOf(day) - 1];
  return before === "mon" || statusFor(h, before, walk).detail !== statusFor(h, day, walk).detail;
}

/**
 * The bar along the bottom of every Upline page, with what's scheduled and
 * what just happened one click away. Each tab pops its panel up above it, the
 * way a messenger does, and the page underneath stays where it was. A message
 * opens in its own column to the panel's left.
 */
export function Dock({ day, panel, message, onPanel, onMessage, walk, ...rest }: DockProps) {
  const group = useRef<HTMLDivElement>(null);
  const tabs = useRef<Record<Panel, HTMLButtonElement | null>>({ scheduled: null, activity: null });
  const mounted = useRef(false);

  const scheduled = day === "mon" ? going(walk) : upcoming[day].filter((u) => !walk.skipped.includes(u.id)).length;
  const fresh = thisWeek.filter((h) => isNew(h, day, walk)).length;

  // Opening a panel moves focus into it; the stop the walk opens on does not.
  useEffect(() => {
    if (mounted.current && panel) group.current?.focus();
    mounted.current = true;
  }, [panel]);

  const close = () => {
    const from = panel;
    onMessage(null);
    onPanel(null);
    if (from) tabs.current[from]?.focus();
  };

  const toggle = (p: Panel) => {
    onMessage(null);
    onPanel(panel === p ? null : p);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Escape") return;
    e.stopPropagation();
    if (message) onMessage(null);
    else close();
  };

  const shown = { day, walk, message, onMessage, onClose: close, ...rest };

  return (
    <>
      {panel && (
        <div
          ref={group}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className={cn(
            "fixed right-0 bottom-(--dock-h) z-30 flex h-(--panel-h) max-w-full justify-end outline-none",
            "animate-in duration-200 fade-in-0 slide-in-from-bottom-2",
            panel === "scheduled" && "min-[1120px]:right-60",
          )}
        >
          {message && <Message key={message} id={message} {...shown} />}
          {panel === "scheduled" ? <Scheduled {...shown} /> : <Activity {...shown} />}
        </div>
      )}

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t bg-card">
        <div className="flex h-(--dock-h) justify-end">
          <Tab
            ref={(el) => {
              tabs.current.scheduled = el;
            }}
            label="Scheduled"
            count={scheduled}
            open={panel === "scheduled"}
            onClick={() => toggle("scheduled")}
          />
          <Tab
            ref={(el) => {
              tabs.current.activity = el;
            }}
            label="Recent Activity"
            count={fresh}
            open={panel === "activity"}
            onClick={() => toggle("activity")}
          />
        </div>
      </footer>
    </>
  );
}

function Tab({
  ref,
  label,
  count,
  open,
  onClick,
}: {
  ref: React.Ref<HTMLButtonElement>;
  label: string;
  count: number;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      onClick={onClick}
      className={cn(
        "flex h-full w-60 items-center justify-between gap-3 border-l px-6 text-left font-display text-sm font-medium transition-colors hover:bg-background focus-visible:-outline-offset-2",
        open && "bg-background",
      )}
    >
      <span className="flex items-center gap-3">
        {label}
        {count > 0 && (
          <Badge>
            {count}
            <span className="sr-only"> {label === "Scheduled" ? "scheduled" : "new"}</span>
          </Badge>
        )}
      </span>
      {open ? (
        <ChevronDown aria-hidden className="size-4 text-muted-foreground" />
      ) : (
        <ChevronUp aria-hidden className="size-4 text-muted-foreground" />
      )}
    </button>
  );
}

type Shown = WalkProps & {
  day: Day;
  message: string | null;
  onMessage: (id: string | null) => void;
  onClose: () => void;
  onProfile: () => void;
  onResults: () => void;
  onEveryone: () => void;
};

/** A panel's frame: its title, a way to put it away, and a list that scrolls. */
function Frame({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="flex w-90 shrink-0 flex-col border border-b-0 bg-card">
      <header className="flex items-start justify-between gap-4 border-b py-5 pr-4 pl-6">
        <h2 className="text-xl text-balance">{title}</h2>
        <Button variant="ghost" size="icon-sm" className="-mt-0.5" onClick={onClose}>
          <ChevronDown />
          <span className="sr-only">Minimize</span>
        </Button>
      </header>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </section>
  );
}

function Face({ name }: { name: string }) {
  return (
    <Avatar size="lg">
      <AvatarFallback>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}

/**
 * A row in either panel. The whole row opens what's behind it, and the name
 * on top of it goes to the client's profile instead.
 */
function Row({
  h,
  selected,
  onOpen,
  onProfile,
  aside,
  children,
}: {
  h: Household;
  selected?: boolean;
  onOpen?: () => void;
  onProfile: () => void;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li className={cn("relative flex gap-3 px-6 py-4", onOpen && "hover:bg-background", selected && "bg-muted hover:bg-muted")}>
      <Face name={h.name} />
      <div className="min-w-0 flex-1 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <PersonLink h={h} onProfile={onProfile} className="relative z-10 truncate" />
          {aside}
        </div>
        {onOpen ? (
          <button
            type="button"
            aria-pressed={selected}
            onClick={onOpen}
            className="mt-1 block w-full text-left after:absolute after:inset-0"
          >
            {children}
          </button>
        ) : (
          <div className="mt-1">{children}</div>
        )}
      </div>
    </li>
  );
}

/**
 * What's going out. On Monday that's the six, each with the start of its
 * email, and one button to say they all look good. Later in the week it's the
 * nudges and follow-ups Upline sends on its own.
 */
function Scheduled({ day, walk, update, message, onMessage, onClose, onProfile }: Shown) {
  const n = going(walk);

  if (day !== "mon") {
    const list = upcoming[day].filter((u) => !walk.skipped.includes(u.id));
    return (
      <Frame title="Scheduled" onClose={onClose}>
        <p className="border-b px-6 py-5 text-sm">
          {list.length > 0
            ? "Nudges and follow-ups go out from your inbox on their own. Nothing here needs you."
            : "Nothing is scheduled."}
        </p>
        <ul className="divide-y border-b">
          {list.map((u) => {
            const h = thisWeek.find((x) => x.id === u.id)!;
            return (
              <Row key={u.id} h={h} onProfile={onProfile}>
                <p>
                  {u.what} · Goes {u.when}
                </p>
                <p className="mt-1 text-muted-foreground">{u.why}</p>
              </Row>
            );
          })}
        </ul>
      </Frame>
    );
  }

  return (
    <Frame title="Scheduled to send tomorrow at 9 AM" onClose={onClose}>
      <div className="border-b px-6 py-5">
        <p className="text-sm">
          {walk.approvedAll
            ? "Nice. You can still open any of them before then."
            : "Each one is drafted in your voice and sends from your inbox. Look over any you like, or let them go."}
        </p>
        {walk.approvedAll ? (
          <Button variant="link" className="mt-3 h-auto p-0 font-sans text-sm" onClick={() => update({ approvedAll: false })}>
            Undo
          </Button>
        ) : (
          <Button className="mt-4" onClick={() => update({ approvedAll: true })} disabled={n === 0}>
            All {n} look good
          </Button>
        )}
      </div>
      <p className="px-6 pt-4 pb-1 text-right text-sm text-muted-foreground">Biggest increase first</p>
      <ul className="divide-y border-b">
        {thisWeek.map((h) => {
          const skipped = walk.skipped.includes(h.id);
          const approved = !skipped && (walk.approvedAll || walk.approved.includes(h.id));
          const increase = h.now - h.was;
          return (
            <Row
              key={h.id}
              h={h}
              selected={message === h.id}
              onOpen={() => onMessage(message === h.id ? null : h.id)}
              onProfile={onProfile}
              aside={
                <span className="flex shrink-0 items-center gap-2 text-muted-foreground tabular-nums">
                  {increase > 0 ? `+${money(increase)}` : "No change"}
                  {approved && <Check className="size-4 text-primary" aria-label="Looks good" />}
                </span>
              }
            >
              {skipped ? (
                <span className="text-muted-foreground">Skipped. You're handling this one yourself.</span>
              ) : (
                <span className="line-clamp-2 text-muted-foreground">
                  {(walk.drafts[h.id] ?? h.email).split(/\n\n+/).slice(0, 3).join(" ")}
                </span>
              )}
            </Row>
          );
        })}
      </ul>
    </Frame>
  );
}

/**
 * What just happened. Through the week it's where each of the six stands,
 * whoever moved since yesterday first, then the earlier weeks still in
 * motion. The Callahans' rows go to their profile, or to their results the
 * morning those come back.
 */
function Activity({ day, walk, message, onMessage, onClose, onProfile, onResults, onEveryone }: Shown) {
  const six = day === "mon" ? [] : [...thisWeek].sort((a, b) => Number(isNew(b, day, walk)) - Number(isNew(a, day, walk)));

  return (
    <Frame title="Recent Activity" onClose={onClose}>
      {six.length > 0 && (
        <ul className="divide-y border-b">
          {six.map((h) => {
            const status = statusFor(h, day as Exclude<Day, "mon">, walk);
            const ready = h.id === "callahan" && status.label === "Ready for you";
            const open =
              h.id === "callahan" ? (ready ? onResults : onProfile) : () => onMessage(message === h.id ? null : h.id);
            return (
              <Row
                key={h.id}
                h={h}
                selected={message === h.id}
                onOpen={open}
                onProfile={onProfile}
                aside={<ChevronRight aria-hidden className="size-4 shrink-0 self-center text-muted-foreground" />}
              >
                <Badge variant={badgeVariant(status.label)}>{status.label}</Badge>
                <span className="mt-2 block">{status.detail}</span>
              </Row>
            );
          })}
        </ul>
      )}

      <div className="px-6 pt-5">
        <h3 className="eyebrow text-muted-foreground">Earlier weeks</h3>
        <p className="mt-3 text-sm">
          {day === "mon"
            ? "Also in motion: Priya Patel and Kevin Brooks are being shopped, with results due Tuesday."
            : "Priya's and Kevin's recommendations went out Tuesday, and Elena Vasquez hasn't answered yet."}
        </p>
      </div>
      <ul className="mt-5 divide-y border-y">
        {earlier.map((e) => (
          <li key={e.id} className="flex gap-3 px-6 py-4">
            <Face name={e.name} />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium">{e.name}</p>
              <p className="mt-1">{day === "mon" ? e.mon : e.later}</p>
              <p className="mt-1 text-muted-foreground">
                {e.lines} · Renews {e.renews}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="px-6 py-5">
        <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={onEveryone}>
          See everyone
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </Frame>
  );
}

/**
 * One household's email in full, in its own column beside the list. The
 * email comes first, exactly as it will send. Why the price moved, Upline's
 * note, what we'll ask and the household are each one click down. Ideally
 * nobody edits anything, because the drafts are good.
 */
function Message({ id, day, walk, update, onMessage, onProfile }: Shown & { id: string }) {
  const [confirmSkip, setConfirmSkip] = useState(false);
  const h = thisWeek.find((x) => x.id === id);
  if (!h) return null;

  const editable = day === "mon";
  const skipped = walk.skipped.includes(h.id);
  const draft = walk.drafts[h.id] ?? h.email;
  const life = walk.lifeQuote[h.id] ?? true;
  const increase = h.now - h.was;
  const status = day === "mon" ? null : statusFor(h, day, walk);
  const close = () => onMessage(null);

  const looksGood = () => {
    update((w) => ({ approved: [...new Set([...w.approved, h.id])] }));
    close();
  };

  const skip = () => {
    update((w) => ({ skipped: [...new Set([...w.skipped, h.id])] }));
    close();
  };

  return (
    <section
      aria-label={`Email to ${h.name}`}
      className="flex w-120 min-w-0 flex-col border border-r-0 border-b-0 bg-card"
    >
      <header className="flex items-start gap-4 border-b py-5 pr-4 pl-6">
        <HomeThumb id={h.id} className="size-10" />
        <div className="min-w-0 flex-1">
          <PersonLink h={h} onProfile={onProfile} className="block max-w-full truncate font-display text-xl" />
          <p className="mt-1 text-sm text-muted-foreground">
            {h.lines} · {h.carrier} · Renews {h.renewsLong}
          </p>
        </div>
        <Button variant="ghost" size="icon-sm" className="-mt-0.5" onClick={close}>
          <X />
          <span className="sr-only">Close</span>
        </Button>
      </header>

      <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-6 text-base">
        {status && (
          <div className="flex items-start gap-3">
            <Badge variant={badgeVariant(status.label)}>{status.label}</Badge>
            <p className="text-sm">{status.detail}</p>
          </div>
        )}

        <section aria-label="The email">
          <p className="text-sm text-muted-foreground">
            From {agency.agent.email} · {editable ? "Sends Tuesday at 9:00 AM" : "Sent Tuesday at 9:00 AM"}
          </p>
          <p className="mt-4 text-sm">
            <span className="text-muted-foreground">Subject </span>
            {h.subject}
          </p>
          <Textarea
            aria-label={`Email to ${h.first}`}
            className="mt-2 min-h-[21rem] bg-background leading-relaxed"
            value={draft}
            readOnly={!editable}
            onChange={(e) => update((w) => ({ drafts: { ...w.drafts, [h.id]: e.target.value } }))}
          />
        </section>

        <div className="flex flex-col gap-3">
          <Fold title="Why the price moved" hint={increase > 0 ? `+${money(increase)}` : "No change"}>
            <PriceChange h={h} />
          </Fold>

          <Fold title="A note from Upline">
            <p>{h.colleague}</p>
          </Fold>

          <Fold title={`What we'll ask ${h.first}`}>
            <p>
              To confirm their contact details and anything new in the household
              {h.id === "callahan" ? ", including Sophie's license number" : ""}, and whether they know anyone who'd
              want the same look at their renewal.
            </p>
            <Field orientation="horizontal" className="mt-5">
              <Switch
                id={`life-${h.id}`}
                checked={life}
                disabled={!editable}
                onCheckedChange={(v) => update((w) => ({ lifeQuote: { ...w.lifeQuote, [h.id]: v } }))}
              />
              <FieldLabel htmlFor={`life-${h.id}`} className="font-normal">
                Also ask if they'd like a life quote
              </FieldLabel>
            </Field>
          </Fold>

          <Fold title="Household details">
            <HouseholdDetails h={h} day={day} />
          </Fold>
        </div>
      </div>

      {editable && (
        <footer className="border-t px-6 py-5">
          {skipped ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm">
                Skipped. {h.first} won't get an email this time, and we won't shop it.
              </p>
              <Button variant="outline" onClick={() => update((w) => ({ skipped: w.skipped.filter((x) => x !== h.id) }))}>
                Undo
              </Button>
            </div>
          ) : confirmSkip ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm">
                Skip {h.first} this time? They won't get an email and we won't shop it. You can change this until
                Tuesday at 9:00 AM.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setConfirmSkip(false)}>
                  Keep it
                </Button>
                <Button variant="secondary" onClick={skip}>
                  Skip this renewal
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <Button variant="ghost" className="-ml-3.5" onClick={() => setConfirmSkip(true)}>
                Skip this renewal
              </Button>
              <Button onClick={looksGood}>Looks good</Button>
            </div>
          )}
        </footer>
      )}
    </section>
  );
}

function Fold({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="group w-full justify-between">
          <span className="flex items-baseline gap-3">
            {title}
            {hint && <span className="font-sans font-normal text-muted-foreground tabular-nums">{hint}</span>}
          </span>
          <ChevronDown data-icon="inline-end" className="transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pt-5 pb-3 text-base">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
