import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { retention, whoLeft } from "@/data";
import { focusPanel } from "@/lib/focus";
import type { WalkProps } from "@/walk";

/**
 * The gap in the strip, by name. Said plainly: who is worth a note and who
 * isn't, and one thing Stacey can do about it.
 */
export function WhoLeftSheet({ open, onClose, walk, update }: WalkProps & { open: boolean; onClose: () => void }) {
  const winBack = whoLeft.filter((l) => l.winBack);
  const names = winBack.map((l) => l.name.split(" ")[0]).join(" and ");

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        onOpenAutoFocus={focusPanel}
        className="w-full gap-0 p-0 outline-none data-[side=right]:sm:max-w-[520px]">
        <SheetHeader className="gap-1 border-b px-7 py-6 pr-16">
          <SheetTitle className="font-display text-2xl">The {whoLeft.length} who left</SheetTitle>
          <SheetDescription>
            Out of the {retention.sent} households you reached since {retention.since}.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-7 py-8 text-base">
          <ul className="divide-y border-y">
            {whoLeft.map((l) => (
              <li key={l.id} className="py-5">
                <p className="font-medium">{l.name}</p>
                <p className="text-sm text-muted-foreground">
                  {l.lines} · {l.when}
                </p>
                <p className="mt-2">{l.what}</p>
              </li>
            ))}
          </ul>
          <p>
            Carla and Joe moved out of state, so there's not much to do there. {names} might be worth a note from you.
          </p>
        </div>

        <SheetFooter className="border-t px-7 py-5">
          {walk.notesDrafted ? (
            <p role="status" className="flex items-start gap-3 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              Drafted. Both notes will be in Monday's list for you to look over before they send.
            </p>
          ) : (
            <Button size="lg" className="self-start" onClick={() => update({ notesDrafted: true })}>
              Draft a note to {names}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
