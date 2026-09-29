import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "cn";
import { CarrierMark } from "@/components/CarrierMark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { earlier, money, thisWeek, whoLeft, type Day } from "@/data";
import { cards, fileFor } from "@/household/data";
import { statusFor } from "@/status";
import type { Walk, WalkProps } from "@/walk";

/** The stage filter's buckets, in the order a renewal moves through them. */
type Group = "scheduled" | "progress" | "ready" | "closing" | "closed" | "left";

const groups: { id: Group; label: string }[] = [
  { id: "scheduled", label: "Scheduled" },
  { id: "progress", label: "In progress" },
  { id: "ready", label: "Ready for you" },
  { id: "closing", label: "Closing" },
  { id: "closed", label: "Closed" },
  { id: "left", label: "Left" },
];

type Stage = { label: string; detail: string; group: Group; looksGood?: boolean };

type Row = {
  id: string;
  name: string;
  lines: string;
  carrier: string;
  renews: string;
  premium: { was: number; now: number } | null;
  phone: string | null;
  email: string | null;
  stage: Stage;
  /** Whether the row opens the household's drawer. The three who left have no file. */
  opens: boolean;
};

/** Where this week's statuses fall in the filter. */
const groupOf: Record<string, Group> = {
  Sent: "progress",
  Opened: "progress",
  Started: "progress",
  Shopping: "progress",
  "Sent to Dana": "progress",
  "Ready for you": "ready",
  Approved: "closing",
  Done: "closed",
  Staying: "closed",
  Skipped: "closed",
};

/**
 * Earlier weeks' households, Monday and after. Monday follows Ashley's v2
 * board, as the homepage does; Stacey clears them Monday afternoon,
 * off-camera, so from Wednesday they're in the state `earlier` gives as later.
 */
const earlierStages: Record<string, [Stage["label"], Group, Stage["label"], Group]> = {
  patel: ["Shopping", "progress", "Rec sent", "progress"],
  brooks: ["Shopping", "progress", "Rec sent", "progress"],
  vasquez: ["Ready for you", "ready", "Rec sent", "progress"],
  foss: ["Ready for you", "ready", "Staying", "closed"],
  hart: ["Approved", "closing", "Done", "closed"],
  desai: ["Approved", "closing", "Staying", "closed"],
};

/** Where a household stands on the walk's day, following what the presenter has done. */
function stageFor(id: string, day: Day, walk: Walk): Stage {
  const week = thisWeek.find((h) => h.id === id);
  if (week) {
    const skipped = walk.skipped.includes(id);
    if (day === "mon") {
      return skipped
        ? { label: "Skipped", detail: "You're handling this one yourself this time.", group: "closed" }
        : {
            label: "Scheduled",
            detail: "Goes out Tuesday at 9:00 AM.",
            group: "scheduled",
            looksGood: walk.approved.includes(id),
          };
    }
    const s = statusFor(week, day, walk);
    return { ...s, group: groupOf[s.label] ?? "progress" };
  }

  const e = earlier.find((x) => x.id === id)!;
  const [monLabel, monGroup, laterLabel, laterGroup] = earlierStages[id];
  if (day !== "mon") return { label: laterLabel, detail: `${e.later}.`, group: laterGroup };
  const memo = walk.closed[id];
  if (memo !== undefined) return { label: "Closed", detail: memo || "Marked as closed.", group: "closed" };
  return { label: monLabel, detail: e.monday?.detail ?? `${e.mon}.`, group: monGroup };
}

const when = (renews: string) => Date.parse(`${renews} 2026`);

/** Everyone the prototype knows: renewing soonest first, then the three who left, most recent first. */
function rowsFor(day: Day, walk: Walk): Row[] {
  const renewing: Row[] = cards
    .map((c) => ({
      id: c.id,
      name: c.name,
      lines: c.lines.split(" · ")[0],
      carrier: c.carrier,
      renews: c.renewal,
      premium: { was: c.was, now: c.premium },
      phone: fileFor(c).phone,
      email: c.email,
      stage: stageFor(c.id, day, walk),
      opens: true,
    }))
    .sort((a, b) => when(a.renews) - when(b.renews));

  const left: Row[] = whoLeft
    .map((l) => {
      const [lines, carrier] = l.lines.split(" · ");
      return {
        id: l.id,
        name: l.name,
        lines,
        carrier,
        renews: l.date,
        premium: null,
        phone: null,
        email: null,
        stage: { label: "Left", detail: `${l.short}.`, group: "left" as const },
        opens: false,
      };
    })
    .sort((a, b) => when(b.renews) - when(a.renews));

  return [...renewing, ...left];
}

const badgeFor = (g: Group) =>
  g === "ready" || g === "closing" ? "default" : g === "closed" || g === "left" ? "secondary" : "outline";

/**
 * Everyone renewing this season, in one table: who they are, what they have,
 * when it renews, what it costs, where the renewal stands today, and how to
 * reach them. Stages follow the walk, as the homepage's do. A stage filter
 * and a name search sit above it, and a row opens the household's drawer,
 * the same one the homepage opens. It's the widest page in Upline, so it
 * takes a wider shell than the rest, and the phone and email share a column,
 * so it fits at 1440 without scrolling sideways.
 */
export function Policyholders({
  day,
  walk,
  household,
  onHome,
  onHousehold,
}: WalkProps & {
  day: Day;
  /** The household open in the drawer. */
  household: string | null;
  onHome: () => void;
  onHousehold: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Group | "all">("all");
  const [query, setQuery] = useState("");

  const rows = rowsFor(day, walk);
  const count = (g: Group) => rows.filter((r) => r.stage.group === g).length;
  const q = query.trim().toLowerCase();
  const shown = rows.filter(
    (r) => (filter === "all" || r.stage.group === filter) && (!q || r.name.toLowerCase().includes(q)),
  );

  return (
    <div className="shell max-w-7xl pt-10 pb-(--space-section)">
      <Button variant="link" className="h-auto p-0 font-sans text-sm" onClick={onHome}>
        <ArrowLeft data-icon="inline-start" />
        Home
      </Button>

      <header className="mt-10">
        <h1 className="text-4xl">Policyholders</h1>
        <p className="mt-2 font-display text-lg font-normal text-muted-foreground">
          Everyone renewing this season, and where each one stands today.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        {/* One on at a time, drawn as Shape the shop's buttons are: on is
            the blue outline, so it doesn't compete with a primary action.
            A stage with no one in it drops out, unless it's the one on. */}
        <div role="group" aria-label="Filter by stage" className="flex flex-wrap gap-2">
          <FilterButton on={filter === "all"} onClick={() => setFilter("all")} label="All" n={rows.length} />
          {groups
            .filter((g) => count(g.id) > 0 || filter === g.id)
            .map((g) => (
              <FilterButton
                key={g.id}
                on={filter === g.id}
                onClick={() => setFilter(g.id)}
                label={g.label}
                n={count(g.id)}
              />
            ))}
        </div>
        <Input
          type="search"
          aria-label="Search policyholders by name"
          placeholder="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-72"
        />
      </div>

      <div className="mt-4 border bg-card">
        {shown.length === 0 ? (
          <p className="px-6 py-5 text-base text-muted-foreground">
            {q ? `No one matches “${query.trim()}”.` : "No one is at this stage today."}
          </p>
        ) : (
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Policyholder</TableHead>
                <TableHead>Lines</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Renews</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead className="min-w-72">Stage</TableHead>
                <TableHead className="pr-5">Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((r) => (
                <PolicyholderRow
                  key={r.id}
                  r={r}
                  selected={household === r.id}
                  onOpen={r.opens ? () => onHousehold(r.id) : undefined}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function FilterButton({ on, onClick, label, n }: { on: boolean; onClick: () => void; label: string; n: number }) {
  return (
    <Button
      variant="outline"
      aria-pressed={on}
      onClick={onClick}
      className="aria-pressed:border-primary aria-pressed:text-primary aria-pressed:hover:text-primary"
    >
      {label}
      <span className="font-mono text-xs font-normal text-muted-foreground">{n}</span>
    </Button>
  );
}

/**
 * One household. The whole row opens its drawer, and the name is the row's
 * button for the keyboard. The three who left have no file in this
 * prototype, so their rows don't open, and their names say so when pointed at.
 */
function PolicyholderRow({ r, selected, onOpen }: { r: Row; selected: boolean; onOpen?: () => void }) {
  const dash = <span className="text-muted-foreground">—</span>;
  const same = r.premium && r.premium.was === r.premium.now;

  return (
    <TableRow
      onClick={onOpen}
      className={cn(onOpen && "cursor-pointer", selected && "bg-muted hover:bg-muted")}
    >
      <TableCell className="py-3 pl-5 font-medium">
        {onOpen ? (
          <button type="button" aria-pressed={selected} onClick={onOpen} className="text-left underline-offset-4 hover:underline">
            {r.name}
          </button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-disabled className="cursor-default text-left">
                {r.name}
              </button>
            </TooltipTrigger>
            <TooltipContent>Their file isn't in this prototype.</TooltipContent>
          </Tooltip>
        )}
      </TableCell>
      <TableCell className="py-3 text-muted-foreground">{r.lines}</TableCell>
      <TableCell className="py-3">
        <span className="inline-flex items-center gap-1.5">
          <CarrierMark carrier={r.carrier} />
          {r.carrier}
        </span>
      </TableCell>
      <TableCell className="py-3 tabular-nums">{r.renews}</TableCell>
      <TableCell className="py-3 font-mono">
        {!r.premium ? (
          dash
        ) : same ? (
          <>
            {money(r.premium.now)} <span className="font-sans text-muted-foreground">no change</span>
          </>
        ) : (
          <>
            {money(r.premium.was)} <span className="text-muted-foreground">→</span> {money(r.premium.now)}
          </>
        )}
      </TableCell>
      <TableCell className="py-3 whitespace-normal">
        <span className="flex items-center gap-2">
          <Badge variant={badgeFor(r.stage.group)}>{r.stage.label}</Badge>
          {r.stage.looksGood && <Check className="size-4 text-primary" aria-label="Looks good" />}
        </span>
        <span className="mt-1.5 block text-muted-foreground">{r.stage.detail}</span>
      </TableCell>
      <TableCell className="py-3 pr-5">
        {r.phone ? (
          <>
            <span className="block tabular-nums">{r.phone}</span>
            <span className="mt-1.5 block text-muted-foreground">{r.email}</span>
          </>
        ) : (
          dash
        )}
      </TableCell>
    </TableRow>
  );
}
