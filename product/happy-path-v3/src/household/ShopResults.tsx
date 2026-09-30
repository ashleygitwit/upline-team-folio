import {
  pruitt,
  money,
  numbers,
  optionById,
  options,
  quotes,
  recEmails,
  talkingPoints,
  type Day,
} from "@/data";
import { cards, fileFor, quoteDoc, type Rec } from "@/household/data";
import { Recommendation } from "@/household/Recommendation";
import type { WalkProps } from "@/walk";

const ao = optionById("ao");
const grange = optionById("grange");
const erie = options.find((o) => o.current)!;

/** What each coverage row means, said the way Sofia's and Walter's are. */
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
 * The Pruitts' shop in v2.5's shape (the Recommendation tab Sofia's and
 * Walter's cards open there), built from v3's own numbers: the carriers
 * against Erie, the carrier documents, the talking points and an email for
 * each pick. v2.5 never showed the Pruitts' results, since its walk goes
 * from Quotes are in straight to Leah's phone, so this is the first place
 * their shop is drawn in that layout.
 */
const rec: Rec = {
  pick: ao.carrier,
  summary: `Our recommendation: move Leah and Tom to ${ao.carrier}. They'll have the same coverage they have with ${erie.carrier}, but it'll cost them ${money(erie.price - ao.price)} less this year.`,
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
    lines: pruitt.lines,
    price: o.price,
    current: o.current,
    email: recEmails[o.id],
  })),
  talkingPoints,
  quotes: quotes.map(quoteDoc),
};

/**
 * The Pruitts' shop results, in the three steps every shop's results take
 * (Recommendation.tsx). The pick and the email are the walk's, so what Jenna
 * picks and writes here is what Leah gets. Once it has gone, the steps read
 * the same with the pick and the email locked, and step 3 says it went.
 *
 * It's the content of a dialog, so whoever opens it owns the Dialog: the
 * homepage's card opens it on its own, and the Pruitts' drawer
 * opens it from its banner, over the drawer.
 */
export function ShopResults({
  day,
  walk,
  update,
  onSend,
}: Pick<WalkProps, "walk" | "update"> & { day: Day; onSend: () => void }) {
  const card = cards.find((c) => c.id === pruitt.id)!;
  const sent = walk.recSent || day === "fri";

  return (
    <Recommendation
      card={card}
      file={{ ...fileFor(card), rec }}
      body={walk.recDraft ?? recEmails[walk.pick]}
      setBody={(body) => update({ recDraft: body })}
      pick={optionById(walk.pick).carrier}
      onPick={(name) => update({ pick: options.find((o) => o.carrier === name)!.id, recDraft: null })}
      sent={sent ? "Sent to Leah and Tom Thursday morning. We'll let you know when they answer." : undefined}
      onSend={onSend}
    />
  );
}
