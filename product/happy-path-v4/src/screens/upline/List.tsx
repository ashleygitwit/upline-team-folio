import { cn } from "cn";
import { CarrierMark } from "@/components/CarrierMark";
import { Countdown, PhaseStatusLine } from "@/components/Status";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { setName } from "@/board";
import { notInPrototype } from "@/lib/rowTip";
import { completedOn, phases, type PhaseId, type Placed } from "@/phases";
import { Price, type BoardProps } from "@/screens/upline/Board";
import { renewalDate } from "@/tasks";

/**
 * The homepage as a table, the toolbar's List (Toolbar.tsx): the same
 * households the board has, after the toolbar's filters and search, a row
 * each, as v3's Policyholder List drew its table. Who they are, what they
 * have, with which carrier, when it renews (red under two weeks out, as on
 * the board), last year's price to this year's, and where it stands, the
 * board's column and its status in words. Open renewals run soonest first,
 * then Completed as its column runs, with the day each was completed where
 * the status would be. A named household's row opens its drawer, as its card
 * does, with the name as the row's button for the keyboard; an invented
 * one's doesn't, and its name says so when pointed at. v3's Contact column
 * isn't here, since only the named households have a phone or an email. The
 * table runs the page's length rather than the board's 1000px.
 */
export function List({
  placed,
  filtered,
  day,
  walk,
  household,
  onHousehold,
}: BoardProps & { placed: Record<PhaseId, Placed[]>; filtered: boolean }) {
  const open = phases
    .filter((p) => p.id !== "completed")
    .flatMap((p) => placed[p.id].map((x) => ({ ...x, phase: p })))
    .sort((a, b) => renewalDate(a.e.renews).getTime() - renewalDate(b.e.renews).getTime());
  const done = placed.completed.map((x) => ({ ...x, phase: phases.find((p) => p.id === "completed")! }));
  const rows = [...open, ...done];

  return (
    <div className="border bg-card">
      {rows.length === 0 ? (
        <p className="px-6 py-5 text-base text-muted-foreground">
          {filtered ? "No one matches those filters." : "No one is renewing."}
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
              <TableHead className="pr-5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ e, status, phase }) => {
              const selected = household === e.id;
              const onOpen = e.invented ? undefined : () => onHousehold(e.id);
              return (
                <TableRow
                  key={e.id}
                  onClick={onOpen}
                  className={cn(onOpen && "cursor-pointer", selected && "bg-muted hover:bg-muted")}
                >
                  <TableCell className="py-3 pl-5 font-display text-base font-medium">
                    {onOpen ? (
                      <button
                        type="button"
                        data-household={e.id}
                        aria-pressed={selected}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          onOpen();
                        }}
                        className="text-left underline-offset-4 hover:underline"
                      >
                        {setName(e.name)}
                      </button>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" aria-disabled className="cursor-default text-left">
                            {setName(e.name)}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>{notInPrototype}</TooltipContent>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-muted-foreground">{e.lines}</TableCell>
                  <TableCell className="py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <CarrierMark carrier={e.carrier} />
                      {e.carrier}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    {phase.id === "completed" ? (
                      <span className="text-muted-foreground">{e.renews}</span>
                    ) : (
                      <Countdown renews={e.renews} day={day} />
                    )}
                  </TableCell>
                  <TableCell className="py-3">
                    <Price was={e.was} now={e.now} pct={e.pct} className="flex-nowrap" />
                  </TableCell>
                  <TableCell className="py-3">{phase.label}</TableCell>
                  <TableCell className="py-3 pr-5">
                    {status ? (
                      <PhaseStatusLine status={status} day={day} />
                    ) : (
                      <span className="text-muted-foreground">Completed {completedOn(e, walk)}</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
