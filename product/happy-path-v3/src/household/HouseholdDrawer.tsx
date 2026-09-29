import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet } from "@/components/ui/sheet";
import type { Day } from "@/data";
import { spoken } from "@/household/columns";
import { cards, type Card } from "@/household/data";
import { HouseholdSheet } from "@/household/HouseholdSheet";
import { ShopResults } from "@/household/ShopResults";
import { focusPanel } from "@/lib/focus";
import type { WalkProps } from "@/walk";

/**
 * A household's drawer, as v2.5 opens it from its board: the same sheet, the
 * same skip dialog and the same toast (Queue.tsx there). It opens under the
 * navigation (--sheet-top in index.css). v3 opens it from a Scheduled row,
 * from a row menu's View Profile, from the Callahans' Closing row on Friday,
 * and from the Policyholder List. What happens in it lands in v3's walk
 * (HouseholdSheet.tsx), and whatever sends, skips or closes out closes the
 * drawer and says so in the toast.
 *
 * It also holds the Callahans' shop results, for opening on their own (from
 * the homepage's card or the chat) as well as from their drawer's banner, so
 * sending from either closes what's open and says so in the same toast.
 */
export function HouseholdDrawer({
  id,
  day,
  onClose,
  onOpenQuestionnaire,
  resultsOpen,
  onResultsOpen,
  walk,
  update,
}: Pick<WalkProps, "walk" | "update"> & {
  id: string | null;
  day: Day;
  onClose: () => void;
  onOpenQuestionnaire: () => void;
  /** Whether the Callahans' shop results are open on their own, outside the drawer. */
  resultsOpen: boolean;
  onResultsOpen: (open: boolean) => void;
}) {
  // Keep the last household on screen while the sheet slides away.
  const [shown, setShown] = useState<Card | null>(null);
  const card = cards.find((c) => c.id === id) ?? null;
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
    onClose();
    say(said);
  };

  const skip = () => {
    if (!skipping) return;
    const skipId = skipping.id;
    update((w) => ({ skipped: [...new Set([...w.skipped, skipId])] }));
    setSkipping(null);
    done("Skipped · moved to closed for this cycle");
  };

  // The recommendation goes, from the results on their own or over the drawer.
  const sendRec = () => {
    update({ recSent: true });
    onResultsOpen(false);
    onClose();
    say("Sent to Dana and Mike");
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
            onDone={done}
            onSkipOutreach={() => setSkipping(shown)}
            onOpenQuestionnaire={onOpenQuestionnaire}
            results={results}
          />
        )}
      </Sheet>

      <Dialog open={resultsOpen} onOpenChange={onResultsOpen}>
        {results}
      </Dialog>

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

      <div aria-live="polite" role="status">
        {toast && (
          <div className="fixed bottom-25 left-1/2 z-[55] -translate-x-1/2 bg-dark-bg px-4.5 py-3 text-sm font-medium text-dark-fg animate-in duration-200 fade-in-0">
            {toast}
          </div>
        )}
      </div>
    </>
  );
}
