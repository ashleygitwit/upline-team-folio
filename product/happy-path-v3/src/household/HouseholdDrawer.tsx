import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { thisWeek } from "@/data";
import { spoken } from "@/household/columns";
import { cards, type Card } from "@/household/data";
import { HouseholdSheet } from "@/household/HouseholdSheet";
import { focusPanel } from "@/lib/focus";
import type { WalkProps } from "@/walk";

/**
 * A household's drawer, as v2.5 opens it from its board: the same sheet, the
 * same skip and close-out dialogs and the same toast (Queue.tsx there). It
 * opens under the navigation (--sheet-top in index.css). v3 opens it from a
 * Scheduled row, from a row menu's View Profile, and from the Callahans'
 * profile, and its outcomes land in v3's walk: Send now marks the email as
 * looking good, Skip outreach skips it, and Close out closes the household with the
 * note as its memo. The Callahans' email links to Dana's questionnaire, which
 * takes the walk there.
 */
export function HouseholdDrawer({
  id,
  onClose,
  onOpenQuestionnaire,
  walk,
  update,
}: Pick<WalkProps, "walk" | "update"> & { id: string | null; onClose: () => void; onOpenQuestionnaire: () => void }) {
  // Keep the last household on screen while the sheet slides away.
  const [shown, setShown] = useState<Card | null>(null);
  const card = cards.find((c) => c.id === id) ?? null;
  if (card && card !== shown) setShown(card);

  const [skipping, setSkipping] = useState<Card | null>(null);
  const [closing, setClosing] = useState<Card | null>(null);
  const [closeNote, setCloseNote] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const say = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  };

  // This week's households write their email, life quote and skip into the walk.
  const h = shown ? thisWeek.find((x) => x.id === shown.id) : undefined;

  const skip = () => {
    if (!skipping) return;
    const skipId = skipping.id;
    update((w) => ({ skipped: [...new Set([...w.skipped, skipId])] }));
    setSkipping(null);
    onClose();
    say("Skipped · moved to closed for this cycle");
  };

  const closeOut = () => {
    if (!closing) return;
    const closeId = closing.id;
    const note = closeNote.trim();
    update((w) => ({ closed: { ...w.closed, [closeId]: note } }));
    setClosing(null);
    setCloseNote("");
    onClose();
    say("Closed out");
  };

  return (
    <>
      <Sheet open={card !== null} onOpenChange={(o) => !o && onClose()}>
        {shown && (
          <HouseholdSheet
            key={shown.id}
            card={shown}
            onSendOutreach={() => {
              update((w) => ({ approved: [...new Set([...w.approved, shown.id])] }));
              onClose();
              say(`Sent to ${spoken(shown.name)}`);
            }}
            onSendRec={() => {
              onClose();
              say("Recommendation queued to send");
            }}
            onOpenResults={() => {}}
            onAskCloseOut={() => setClosing(shown)}
            onSkipOutreach={shown.col === "outreach" ? () => setSkipping(shown) : undefined}
            onOpenQuestionnaire={onOpenQuestionnaire}
            email={
              h && {
                subject: h.subject,
                body: walk.drafts[h.id] ?? h.email,
                onChange: (body) => update((w) => ({ drafts: { ...w.drafts, [h.id]: body } })),
              }
            }
            life={
              h && {
                on: walk.lifeQuote[h.id] ?? true,
                onChange: (on) => update((w) => ({ lifeQuote: { ...w.lifeQuote, [h.id]: on } })),
              }
            }
            skipped={
              h && walk.skipped.includes(h.id)
                ? { onUndo: () => update((w) => ({ skipped: w.skipped.filter((x) => x !== h.id) })) }
                : undefined
            }
          />
        )}
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
              Tell us what happened for {closing && spoken(closing.name)}
            </DialogTitle>
            <DialogDescription>
              Is {closing?.first} staying put? Did you bind a new carrier, or are you still waiting on something?
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
