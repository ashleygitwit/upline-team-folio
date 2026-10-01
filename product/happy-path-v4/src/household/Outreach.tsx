import { pruitt, thisWeek, type Day } from "@/data";
import { activityFor } from "@/household/activity";
import { spoken } from "@/household/columns";
import { fileFor, type Card } from "@/household/data";
import { OutreachReview } from "@/household/phases";
import type { WalkProps } from "@/walk";

/**
 * A household's outreach review wired to the walk: the email Jenna edits is
 * the one Leah gets, Life decides the questionnaire's life question, Send now
 * sends it then (so the household moves to Awaiting Response), and Skip asks
 * first. It's a page over the drawer, from the banner or Recent activity,
 * and the walk's review stop opens the Pruitts' drawer with it on top. From
 * the 2026-09-29 review until 2026-09-30 a Scheduled line on the homepage
 * opened it on its own; now every line opens the drawer.
 */
export function OutreachFor({
  card,
  day,
  walk,
  update,
  onDone,
  onSkipOutreach,
  onOpenQuestionnaire,
}: Pick<WalkProps, "walk" | "update"> & {
  card: Card;
  day: Day;
  /** Goes back to the profile and says what happened in the toast. */
  onDone: (said: string) => void;
  /** Asks before skipping the household's outreach. */
  onSkipOutreach: () => void;
  /** Goes to Leah's questionnaire in the walk, from the Pruitts' email. */
  onOpenQuestionnaire: () => void;
}) {
  const file = fileFor(card);
  const h = thisWeek.find((x) => x.id === card.id);
  const activity = activityFor(card.id, day, walk);
  const skipped = h && walk.skipped.includes(h.id);
  const email = h && {
    subject: h.subject,
    body: walk.drafts[h.id] ?? h.email,
    onChange: (body: string) => update((w) => ({ drafts: { ...w.drafts, [h.id]: body } })),
  };

  return (
    <OutreachReview
      card={card}
      file={file}
      email={email}
      life={
        h && {
          on: walk.lifeQuote[h.id] ?? true,
          onChange: (on) => update((w) => ({ lifeQuote: { ...w.lifeQuote, [h.id]: on } })),
        }
      }
      sent={activity?.outreachSent}
      skipped={skipped ? { onUndo: () => update((w) => ({ skipped: w.skipped.filter((x) => x !== card.id) })) } : undefined}
      onSkip={h && onSkipOutreach}
      onSend={
        h &&
        (() => {
          update((w) => ({ approved: [...new Set([...w.approved, card.id])] }));
          onDone(`Sent to ${spoken(card.name)}`);
        })
      }
      onOpenQuestionnaire={card.id === pruitt.id ? onOpenQuestionnaire : undefined}
    />
  );
}
