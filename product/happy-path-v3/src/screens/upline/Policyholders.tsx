import { useState } from "react";
import { ArrowLeft, Check, LayoutGrid, List } from "lucide-react";
import { cn } from "cn";
import { CarrierMark } from "@/components/CarrierMark";
import { Chips } from "@/components/Chips";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { money, thisWeek, whoLeft, type Day } from "@/data";
import { cards, fileFor } from "@/household/data";
import { statusFor } from "@/status";
import { chipsFor, type Chip } from "@/tasks";
import type { Walk, WalkProps } from "@/walk";

/** The stage filter's buckets, in the order a renewal moves through them. They're the board's columns too. */
type Group = "scheduled" | "progress" | "ready" | "closing" | "closed" | "left";

const groups: { id: Group; label: string; column: string }[] = [
  { id: "scheduled", label: "Scheduled", column: "Ready to reach out" },
  { id: "progress", label: "In progress", column: "Shopping" },
  { id: "ready", label: "Ready for you", column: "Ready to send rec" },
  { id: "closing", label: "Closing", column: "Closing" },
  { id: "closed", label: "Closed", column: "Closed" },
  { id: "left", label: "Left", column: "Left" },
];

type View = "board" | "list";

type Stage = { label: string; group: Group; looksGood?: boolean };

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
  chips: Chip[];
  /** Whether the row opens the household's drawer. The three who left have no file. */
  opens: boolean;
};

/** Where this week's statuses fall in the filter. */
const groupOf: Record<string, Group> = {
  Sent: "progress",
  Opened: "progress",
  Started: "progress",
  Shopping: "progress",
  "Sent to Leah": "progress",
  "Ready for you": "ready",
  Approved: "closing",
  Done: "closed",
  Staying: "closed",
  Skipped: "closed",
};

/**
 * Earlier weeks' households, Monday and after. Monday follows Ashley's v2
 * board, as the homepage does; Jenna clears them Monday afternoon,
 * off-camera, so from Wednesday they're in the state `earlier` (data.ts)
 * gives as later.
 */
const earlierStages: Record<string, [Stage["label"], Group, Stage["label"], Group]> = {
  rao: ["Shopping", "progress", "Rec sent", "progress"],
  yates: ["Shopping", "progress", "Rec sent", "progress"],
  marin: ["Ready for you", "ready", "Rec sent", "progress"],
  kemp: ["Ready for you", "ready", "Staying", "closed"],
  mercer: ["Approved", "closing", "Done", "closed"],
  iyer: ["Approved", "closing", "Staying", "closed"],
};

/** Where a household stands on the walk's day, following what the presenter has done. */
function stageFor(id: string, day: Day, walk: Walk): Stage {
  const week = thisWeek.find((h) => h.id === id);
  if (week) {
    const skipped = walk.skipped.includes(id);
    if (day === "mon") {
      return skipped
        ? { label: "Skipped", group: "closed" }
        : { label: "Scheduled", group: "scheduled", looksGood: walk.approved.includes(id) };
    }
    const { label } = statusFor(week, day, walk);
    return { label, group: groupOf[label] ?? "progress" };
  }

  const [monLabel, monGroup, laterLabel, laterGroup] = earlierStages[id];
  if (day !== "mon") return { label: laterLabel, group: laterGroup };
  if (walk.closed[id] !== undefined) return { label: "Closed", group: "closed" };
  return { label: monLabel, group: monGroup };
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
      chips: chipsFor(c.id, day, walk),
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
        stage: { label: "Left", group: "left" as const },
        chips: [],
        opens: false,
      };
    })
    .sort((a, b) => when(b.renews) - when(a.renews));

  return [...renewing, ...left];
}

const badgeFor = (g: Group) =>
  g === "ready" || g === "closing" ? "default" : g === "closed" || g === "left" ? "secondary" : "outline";

/**
 * Everyone renewing this season, as a board or a table. The board is the
 * default (the 2026-09-29 review): Ashley's v2 columns, Ready to reach out,
 * Shopping, Ready to send rec and Closing, then Closed and Left, one card per
 * household. The table has the same households as rows: who they are, what
 * they have, when it renews, what it costs, where the renewal stands today,
 * and how to reach them, with the stage as a chip. Stages follow the walk, as
 * the homepage's do. A stage filter and a name search sit above both views
 * and apply to both, and a card or a row opens the household's drawer, the
 * same one the homepage opens. It's the widest page in Upline, so it takes a
 * wider shell than the rest; the table's phone and email share a column, so
 * it fits at 1440 without scrolling sideways, and the board scrolls inside
 * itself below that.
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
  const [view, setView] = useState<View>("board");
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

      <h1 className="mt-10 text-4xl">Policyholder List</h1>

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
        <div className="flex items-center gap-4">
          <Input
            type="search"
            aria-label="Search policyholders by name"
            placeholder="Search by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72"
          />
          {/* Board or List, drawn as the stage buttons are and flush, so the
              pair reads as one control. */}
          <div role="group" aria-label="View" className="flex">
            <ViewButton on={view === "board"} onClick={() => setView("board")} label="Board" icon={<LayoutGrid />} />
            <ViewButton on={view === "list"} onClick={() => setView("list")} label="List" icon={<List />} />
          </div>
        </div>
      </div>

      {view === "board" ? (
        <Board rows={shown} filter={filter} household={household} onHousehold={onHousehold} />
      ) : (
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
                <TableHead>Stage</TableHead>
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
      )}
    </div>
  );
}

function ViewButton({ on, onClick, label, icon }: { on: boolean; onClick: () => void; label: string; icon: React.ReactNode }) {
  return (
    <Button
      variant="outline"
      aria-pressed={on}
      onClick={onClick}
      className="-ml-px first:ml-0 aria-pressed:relative aria-pressed:border-primary aria-pressed:text-primary aria-pressed:hover:text-primary"
    >
      {icon}
      {label}
    </Button>
  );
}

/**
 * The board: one column per stage, a card per household in it, soonest
 * renewal first as the table sorts them. A column with no one in it stays,
 * so the board keeps its shape from day to day, unless the stage filter is
 * on, when only that column is drawn. Each column is wide enough that the
 * longest carrier and renewal fit on a card's foot without truncating, so all
 * six don't fit in the shell: the board starts where the page does and scrolls
 * sideways inside itself, with Left the column most often off the edge.
 */
function Board({
  rows,
  filter,
  household,
  onHousehold,
}: {
  rows: Row[];
  filter: Group | "all";
  household: string | null;
  onHousehold: (id: string) => void;
}) {
  const columns = groups.filter((g) => filter === "all" || g.id === filter);
  return (
    <div className="mt-4 overflow-x-auto">
      <div
        className="grid items-start gap-3"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(16rem, 1fr))` }}
      >
        {columns.map((g) => {
          const inCol = rows.filter((r) => r.stage.group === g.id);
          return (
            <section
              key={g.id}
              aria-label={g.column}
              className="min-h-70 min-w-0 border bg-muted/45 px-2.5 pt-3 pb-3.5"
            >
              <h3 className="mb-2.5 flex min-h-7 items-center gap-2 font-sans text-sm font-semibold">
                {g.column}
                <span className="min-w-[1.4rem] bg-card px-1.5 py-px text-center font-mono text-xs font-normal">
                  {inCol.length}
                </span>
              </h3>
              {inCol.length === 0 ? (
                <p className="px-1 text-sm text-muted-foreground">No one here today.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {inCol.map((r) => (
                    <BoardCard
                      key={r.id}
                      r={r}
                      selected={household === r.id}
                      onOpen={r.opens ? () => onHousehold(r.id) : undefined}
                    />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

/**
 * One household on the board, after Ashley's v2 card: the name, its lines
 * and the change, and the carrier and renewal across the foot. The card is
 * its own button and opens the drawer; the three who left don't open, and say
 * so when pointed at.
 */
function BoardCard({ r, selected, onOpen }: { r: Row; selected: boolean; onOpen?: () => void }) {
  const same = r.premium && r.premium.was === r.premium.now;
  const body = (
    <>
      <span className="block px-3.5 pt-3 pb-2.5">
        <span className="block text-sm leading-tight font-medium">{r.name}</span>
        <span className="mt-1.5 block text-sm text-muted-foreground">
          {r.lines}
          {r.premium && (
            <>
              {" · "}
              {same ? `${money(r.premium.now)}, no change` : `${money(r.premium.was)} → ${money(r.premium.now)}`}
            </>
          )}
        </span>
        {r.stage.looksGood && (
          <span className="mt-1.5 flex items-center gap-1 text-xs text-primary">
            <Check className="size-3.5" aria-hidden />
            Looks good
          </span>
        )}
        <Chips chips={r.chips} className="mt-2" />
      </span>
      <span className="flex items-center justify-between gap-2 border-t px-3.5 pt-2 pb-2.5 text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1.5">
          <CarrierMark carrier={r.carrier} />
          <span className="truncate">{r.carrier}</span>
        </span>
        <span className="whitespace-nowrap">{onOpen ? `Renews ${r.renews}` : `Left ${r.renews}`}</span>
      </span>
    </>
  );
  const frame = "relative block w-full min-w-0 overflow-hidden border bg-card text-left";
  return (
    <li>
      {onOpen ? (
        <button
          type="button"
          aria-pressed={selected}
          onClick={onOpen}
          className={cn(frame, "transition-colors hover:border-primary", selected && "border-primary")}
        >
          {body}
        </button>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <div tabIndex={0} className={frame}>
              {body}
            </div>
          </TooltipTrigger>
          <TooltipContent>Their file isn't in this prototype.</TooltipContent>
        </Tooltip>
      )}
    </li>
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
        <span className="flex flex-wrap items-center gap-1.5">
          <Badge variant={badgeFor(r.stage.group)}>{r.stage.label}</Badge>
          {r.stage.looksGood && <Check className="size-4 text-primary" aria-label="Looks good" />}
          <Chips chips={r.chips} />
        </span>
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
