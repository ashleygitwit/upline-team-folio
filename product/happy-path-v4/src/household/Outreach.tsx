import { pruitt, thisWeek, type Day } from "@/data";
import { activityFor } from "@/household/activity";
import { spoken } from "@/household/columns";
import type { Card } from "@/household/data";
import { firstCards } from "@/household/firstCards";
import { fileOf } from "@/household/households";
import { OutreachReview } from "@/household/phases";
import { previewHref } from "@/questionnaire";
import type { WalkProps } from "@/walk";

/**
 * A household's outreach review wired to the walk: the email Jenna edits is
 * the one Leah gets, Life decides the questionnaire's life question (and the
 * preview's, as View the Questionnaire opens it), Send now
 * sends it then (so the household moves to Awaiting Response), and Skip asks
 * first. This week's six have Send now and Skip until Monday's over; a first
 * card (firstCards.ts) has them while its email is still waiting to go, and
 * otherwise reads back the email it was sent. It's a page over the drawer, from the banner or Recent activity,
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
  const file = fileOf(card);
  const h = thisWeek.find((x) => x.id === card.id);
  const f = firstCards[card.id];
  const activity = activityFor(card.id, day, walk);
  const skipped = (h || f) && walk.skipped.includes(card.id);
  const drafted = h ?? (f && { subject: f.outreach.subject, email: f.outreach.email });
  const email = drafted && {
    subject: drafted.subject,
    body: walk.drafts[card.id] ?? drafted.email,
    onChange: (body: string) => update((w) => ({ drafts: { ...w.drafts, [card.id]: body } })),
  };
  // Whether Jenna can still send it early or skip it.
  const waiting = !!h || (!!f?.outreach.waitsOn?.includes(day) && !walk.approved.includes(card.id));

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
      onSkip={waiting ? onSkipOutreach : undefined}
      onSend={
        waiting
          ? () => {
              update((w) => ({
                approved: [...new Set([...w.approved, card.id])],
                outreachOn: { ...w.outreachOn, [card.id]: day },
              }));
              onDone(`Sent to ${spoken(card.name)}`);
            }
          : undefined
      }
      onOpenQuestionnaire={card.id === pruitt.id ? onOpenQuestionnaire : undefined}
      questionnairePreview={card.id === pruitt.id ? previewHref(walk.lifeQuote[pruitt.id] ?? true) : undefined}
    />
  );
}
