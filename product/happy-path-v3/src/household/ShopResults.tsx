import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  callahan,
  money,
  numbers,
  optionById,
  options,
  quotes,
  recEmails,
  talkingPoints,
  type Day,
} from "@/data";
import { columnTitle } from "@/household/columns";
import { cards, fileFor, quoteDoc, type Rec } from "@/household/data";
import { Recommendation } from "@/household/Recommendation";
import { focusPanel } from "@/lib/focus";
import type { WalkProps } from "@/walk";

const ao = optionById("ao");
const grange = optionById("grange");
const erie = options.find((o) => o.current)!;

/** What each coverage row means, said the way Elena's and Raymond's are. */
const help: Record<string, string> = {
  "Annual premium": "What they would pay for a year if this quote is written.",
  "Home deductible": "What they pay out of pocket on a home claim before the carrier pays.",
  Dwelling: "The rebuild limit on the house. Matches what Erie has on file today.",
  "Auto liability":
    "Bodily injury limits if they hurt someone in a crash. 100/300 is $100,000 per person, $300,000 per accident.",
  "Comp / collision": "Deductibles on the cars. Comprehensive is weather and theft. Collision is hitting something.",
  "Roof settlement": "How a roof claim is paid. Replacement cost pays for a new roof, without taking off for its age.",
};

/**
 * The Callahans' shop in v2.5's shape (the Recommendation tab Elena's and
 * Raymond's cards open there), built from v3's own numbers: the carriers
 * against Erie, the carrier documents, the talking points and an email for
 * each pick. v2.5 never showed the Callahans' results, since its walk goes
 * from Quotes are in straight to Dana's phone, so this is the first place
 * their shop is drawn in that layout.
 */
const rec: Rec = {
  pick: ao.carrier,
  summary: `Our recommendation: move Dana and Mike to ${ao.carrier}. They'll have the same coverage they have with ${erie.carrier}, but it'll cost them ${money(erie.price - ao.price)} less this year.`,
  email: recEmails.ao,
  currentLabel: erie.carrier,
  cols: [ao, grange].map((o) => ({ id: o.id, name: o.carrier })),
  coverage: numbers.map((n) => ({
    label: n.label,
    current: n.erie,
    quotes: { ao: n.ao ?? true, grange: n.grange ?? true },
    help: help[n.label],
  })),
  biggest: [
    {
      carrier: ao.carrier,
      text: `${money(ao.price)}. The same coverage they have with ${erie.carrier}, ${money(erie.price - ao.price)} less than the renewal if paid in full.`,
    },
    { carrier: grange.carrier, text: `${money(grange.price)}. The home deductible goes from $1,000 to $2,500.` },
  ],
  options: options.map((o) => ({
    id: o.id,
    name: o.carrier,
    lines: callahan.lines,
    price: o.price,
    current: o.current,
    email: recEmails[o.id],
  })),
  talkingPoints,
  quotes: quotes.map(quoteDoc),
};

/**
 * The Callahans' shop results, in a modal like the outreach review's: the
 * drawer's header and ground, v2.5's results scrolling under a header that
 * stays, and Send recommendation email in a footer under them. The pick and
 * the email are the walk's, so what Stacey picks and writes here is what Dana
 * gets. Once it has gone, the modal reads the same with the pick and the email
 * locked, and the footer says it went.
 *
 * It's the content of a dialog, so whoever opens it owns the Dialog: the
 * homepage's card and the chat open it on its own, and the Callahans' drawer
 * opens it from its banner, over the drawer.
 */
export function ShopResults({
  day,
  walk,
  update,
  onSend,
}: Pick<WalkProps, "walk" | "update"> & { day: Day; onSend: () => void }) {
  const card = cards.find((c) => c.id === callahan.id)!;
  const sent = walk.recSent || day === "fri";

  return (
    <DialogContent
      onOpenAutoFocus={focusPanel}
      aria-describedby={undefined}
      className="top-[calc(50%+var(--demo-bar-h)/2)] flex max-h-[calc(100svh-var(--demo-bar-h)-2rem)] flex-col gap-0 overflow-hidden bg-background p-0 outline-none sm:max-w-[640px]"
    >
      <DialogHeader className="gap-0 px-5 pt-4.5 pr-14">
        <p className="eyebrow text-muted-foreground">{columnTitle("recommend")}</p>
        <DialogTitle className="mt-1.5 font-display text-2xl">{card.name}</DialogTitle>
      </DialogHeader>
      <div className="mt-3.5 min-h-0 flex-1 overflow-y-auto border-t px-5 pt-4.5 pb-7">
        <Recommendation
          card={card}
          file={{ ...fileFor(card), rec }}
          body={walk.recDraft ?? recEmails[walk.pick]}
          setBody={(body) => update({ recDraft: body })}
          pick={optionById(walk.pick).carrier}
          onPick={(name) => update({ pick: options.find((o) => o.carrier === name)!.id, recDraft: null })}
          locked={sent}
        />
      </div>
      <div className="flex items-center border-t px-5 pt-3.5 pb-4">
        {sent ? (
          <p className="text-sm">Sent to Dana and Mike Thursday morning. We'll let you know when they answer.</p>
        ) : (
          <Button size="lg" className="w-full" onClick={onSend}>
            <Send data-icon="inline-start" />
            Send recommendation email
          </Button>
        )}
      </div>
    </DialogContent>
  );
}
