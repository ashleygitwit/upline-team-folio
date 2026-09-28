import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { earlier, thisWeek, whoLeft, type Day } from "@/data";
import { statusFor } from "@/status";
import { focusPanel } from "@/lib/focus";
import type { WalkProps } from "@/walk";

/**
 * Everyone Upline has reached lately, in one plain list: the answer to
 * "where do I see everyone I reached out to?" without a board to manage.
 */
export function EveryoneSheet({ open, day, onClose, walk }: WalkProps & { open: boolean; day: Day; onClose: () => void }) {
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        onOpenAutoFocus={focusPanel}
        className="w-full gap-0 p-0 outline-none data-[side=right]:sm:max-w-[720px]">
        <SheetHeader className="gap-1 border-b px-7 py-6 pr-16">
          <SheetTitle className="font-display text-2xl">Everyone lately</SheetTitle>
          <SheetDescription>The last four weeks of renewals, this week first.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-10 overflow-y-auto px-7 py-8">
          <Group title="This week">
            {thisWeek.map((h) => {
              const skipped = walk.skipped.includes(h.id);
              const where =
                day === "mon" ? (skipped ? "Skipped" : "Goes out Tuesday") : statusFor(h, day, walk).label;
              return (
                <TableRow key={h.id}>
                  <TableCell className="font-medium whitespace-normal">{h.name}</TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">
                    {h.lines} · {h.carrier}
                  </TableCell>
                  <TableCell>{h.renews}</TableCell>
                  <TableCell className="whitespace-normal">{where}</TableCell>
                </TableRow>
              );
            })}
          </Group>

          <Group title="Earlier weeks">
            {earlier.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium whitespace-normal">{e.name}</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">{e.lines}</TableCell>
                <TableCell>{e.renews}</TableCell>
                <TableCell className="whitespace-normal">{day === "mon" ? e.mon : e.later}</TableCell>
              </TableRow>
            ))}
          </Group>

          <Group title="Left">
            {whoLeft.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium whitespace-normal">{l.name}</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">{l.lines}</TableCell>
                <TableCell>{l.date}</TableCell>
                <TableCell className="whitespace-normal">{l.short}</TableCell>
              </TableRow>
            ))}
          </Group>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title}>
      <h3 className="text-xl">{title}</h3>
      <Table className="mt-3 table-fixed text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[27%]">Household</TableHead>
            <TableHead className="w-[31%]">Lines</TableHead>
            <TableHead className="w-[11%]">Renews</TableHead>
            <TableHead>Where it stands</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </section>
  );
}
