import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet } from "@/components/ui/sheet";
import type { Day } from "@/data";
import type { Page } from "@/household/activity";
import { spoken } from "@/household/columns";
import type { Card } from "@/household/data";
import { cardFor } from "@/household/households";
import { HouseholdSheet } from "@/household/HouseholdSheet";
import { ShopResults } from "@/household/ShopResults";
import { focusPanel } from "@/lib/focus";
import type { WalkProps } from "@/walk";

/**
 * A household's drawer, as v2.5 opens it from its board: the same sheet, the
 * same skip dialog and the same toast (Queue.tsx there). It opens under the
 * navigation (--sheet-top in index.css). v4 opens it from any card or line
 * on the homepage's board, and from an approved card's View profile and
 * close; the walk's review stop and View the full report on the Pruitts'
 * card open it with a page already over it (`page`). What happens in it
 * lands in the walk (HouseholdSheet.tsx), and whatever sends, skips or
 * closes out goes back to the profile and says so in the toast. Until
 * 2026-10-01 it closed the drawer instead, and the Pruitts' results and a
 * household's outreach review also opened on their own, as modals over the
 * board.
 */
export function HouseholdDrawer({
  id,
  day,
  page,
  onPage,
  onClose,
  onOpenQuestionnaire,
  returnFocus,
  walk,
  update,
}: Pick<WalkProps, "walk" | "update"> & {
  id: string | null;
  day: Day;
  /** The page over the drawer, if one is open. */
  page: Page | null;
  onPage: (page: Page | null) => void;
  onClose: () => void;
  onOpenQuestionnaire: () => void;
  /** Gives the focus back to what opened the drawer, once it has closed. */
  returnFocus: (id: string) => void;
}) {
  // Keep the last household on screen while the sheet slides away.
  const [shown, setShown] = useState<Card | null>(null);
  const card = (id && cardFor(id)) || null;
  if (card && card !== shown) setShown(card);

  const [skipping, setSkipping] = useState<Card | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const say = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  };

  const done = (said: string) => {
    onPage(null);
    say(said);
  };

  const skip = () => {
    if (!skipping) return;
    const skipId = skipping.id;
    update((w) => ({ skipped: [...new Set([...w.skipped, skipId])], outreachOn: { ...w.outreachOn, [skipId]: day } }));
    setSkipping(null);
    done("Skipped · moved to closed for this cycle");
  };

  const sendRec = () => {
    update({ recSent: true });
    done("Sent to Leah and Tom");
  };
  const results = <ShopResults day={day} walk={walk} update={update} onSend={sendRec} />;

  return (
    <>
      <Sheet open={card !== null} onOpenChange={(o) => !o && onClose()}>
        {shown && (
          <HouseholdSheet
            key={shown.id}
            card={shown}
            day={day}
            walk={walk}
            update={update}
            page={page}
            onPage={onPage}
            toast={toast}
            onDone={done}
            onSkipOutreach={() => setSkipping(shown)}
            onOpenQuestionnaire={onOpenQuestionnaire}
            results={results}
            returnFocus={returnFocus}
          />
        )}
      </Sheet>

      <Dialog open={!!skipping} onOpenChange={(o) => !o && setSkipping(null)}>
        <DialogContent onOpenAutoFocus={focusPanel} className="outline-none">
          {/* No eyebrow over the question: "Skip outreach" there said what
              the question and its button already do (it came off on 2026-10-01). */}
          <DialogHeader>
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
    </>
  );
}
