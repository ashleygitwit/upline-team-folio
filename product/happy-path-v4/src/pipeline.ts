import { money } from "@/data";

/**
 * The rest of Jenna's pipeline: invented households that fill the homepage's
 * board to the volume an agency like Stockton Hill would carry. A book of
 * about 2,500 policies over 52 weeks is about 48 renewal emails a week, with
 * about 55 waiting on an answer and about 41 somewhere between shopping and
 * done (Amanda's sketch, 2026-09-30). The twelve named households keep their
 * files and their walk; these have no file, so their cards don't open, but
 * for the six first cards (household/firstCards.ts), which do.
 *
 * They're generated from a fixed seed, so the same names land in the same
 * places every time the prototype loads. Every name is invented.
 */

export type Invented = {
  id: string;
  name: string;
  /** "Amy", or "Amy and Ben" for a couple, for a sentence. */
  first: string;
  lines: string;
  carrier: string;
  /** "Nov 15" */
  renews: string;
  /** "November 15" */
  renewsLong: string;
  was: number;
  now: number;
  /** What the shop came back with, for anyone past shopping. */
  shop: { quotes: { carrier: string; price: number }[]; pick: string; price: number; staying: boolean };
};

/* ------------------------------------------------------------------ *
 * A small seeded generator, so the pipeline is the same on every load.
 * ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20261012);
const between = (lo: number, hi: number) => lo + Math.floor(rand() * (hi - lo + 1));
const pickOne = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)];
function weighted<T>(list: readonly (readonly [T, number])[]): T {
  let r = rand() * list.reduce((sum, [, w]) => sum + w, 0);
  for (const [item, w] of list) {
    r -= w;
    if (r <= 0) return item;
  }
  return list[list.length - 1][0];
}

// None of the named households' or the agency's surnames, so no invented
// card reads as a relative of someone in the walk.
const firsts = [
  "Amy", "Ben", "Carla", "Dev", "Elena", "Frank", "Grace", "Hank", "Iris", "Jamal", "Kara", "Luis", "Mona",
  "Nate", "Olive", "Pete", "Quinn", "Rosa", "Sam", "Tara", "Umar", "Vera", "Wes", "Yara", "Zach", "Alma",
  "Brett", "Chloe", "Dale", "Erin", "Faye", "Gus", "Hazel", "Ivan", "June", "Kurt", "Lena", "Miles", "Nora",
  "Owen", "Priya", "Reid", "Sara", "Troy", "Uma", "Vince", "Wendy", "Abby", "Cole", "Dina", "Gwen", "Hugo",
  "Ines", "Joel", "Kim", "Leo", "Noah", "Ruth", "Omar", "Tess",
] as const;

const lasts = [
  "Abbott", "Barnes", "Castillo", "Delgado", "Ellison", "Fischer", "Garner", "Holt", "Ingram", "Jansen",
  "Keller", "Lowry", "Moreno", "Nakamura", "Okafor", "Park", "Quint", "Reyes", "Schultz", "Tran",
  "Underwood", "Vance", "Walsh", "Young", "Zimmer", "Akers", "Brandt", "Chen", "Doyle", "Esposito",
  "Foley", "Grady", "Hanley", "Irwin", "Joyce", "Kowalski", "Lam", "Mahoney", "Novak", "Ortiz",
  "Petrov", "Quinlan", "Rhodes", "Sutton", "Tolliver", "Ulrich", "Varga", "Whelan", "Yoder", "Zeller",
  "Alvarez", "Beck", "Carver", "Dunn", "Eaton", "Fong", "Gallo", "Horvat", "Ibarra", "Jensen",
  "Kline", "Lutz", "Mireles", "Nash", "Olsen", "Pierce", "Rourke", "Stahl", "Tanaka", "Voss",
  "Wade", "Yilmaz", "Baird", "Crowe", "Duarte", "Farris", "Greer", "Huang", "Kaur", "Molina",
] as const;

// Harbor Point's markets, weighted roughly as a small Ohio agency's book runs.
const carriers = [
  ["Erie", 30],
  ["Auto-Owners", 15],
  ["Grange", 12],
  ["Westfield", 12],
  ["Nationwide", 11],
  ["Ohio Mutual", 10],
  ["Travelers", 10],
] as const;

const lineMix = [
  ["Home + Auto", 45, 2800, 6200],
  ["Auto", 30, 1100, 3200],
  ["Home", 20, 1000, 2600],
  ["Home + Umbrella", 5, 1500, 2400],
] as const;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthsLong = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const used = new Set<string>();

function household(n: number, from: Date, to: Date): Invented {
  let name = "";
  let first = "";
  while (!name || used.has(name)) {
    const last = pickOne(lasts);
    const a = pickOne(firsts);
    // About one in five is a couple.
    if (rand() < 0.2) {
      let b = pickOne(firsts);
      while (b === a) b = pickOne(firsts);
      name = `${a} & ${b} ${last}`;
      first = `${a} and ${b}`;
    } else {
      name = `${a} ${last}`;
      first = a;
    }
  }
  used.add(name);

  const [lines, , lo, hi] = weighted(lineMix.map((l) => [l, l[1]] as const));
  const carrier = weighted(carriers);
  const was = between(lo, hi);
  // One in ten comes in flat. Of the rest, most go up in single digits and
  // about a third by 10% or more, never more than 16% or the Pruitts' $870, so
  // the named households stay at the top of Monday's list, and the board's
  // red (over 10%) marks the jumps rather than half the book.
  const pct = rand() < 0.1 ? 0 : rand() < 0.65 ? between(2, 9) : between(10, 16);
  const now = was + Math.min(820, Math.round((was * pct) / 100));

  // By calendar day, so a range across the end of daylight saving time
  // doesn't land an hour short, on the day before.
  const span = Math.round((to.getTime() - from.getTime()) / 86_400_000);
  const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + between(0, span));

  // What a shop would come back with: two other markets, one usually under
  // the renewal. About one in six stays put.
  const others = carriers.map(([c]) => c).filter((c) => c !== carrier);
  const a = pickOne(others);
  let b = pickOne(others);
  while (b === a) b = pickOne(others);
  const staying = rand() < 0.16;
  const low = Math.round(now * (1 - between(4, 18) / 100));
  const high = Math.round(now * (1 + between(1, 8) / 100));
  const quotes = [
    { carrier, price: now },
    { carrier: a, price: staying ? high : low },
    { carrier: b, price: staying ? Math.round(now * (1 + between(2, 10) / 100)) : Math.round((low + high) / 2) },
  ];
  const best = staying ? quotes[0] : quotes[1];

  return {
    id: `inv-${n}`,
    name,
    first,
    lines,
    carrier,
    renews: `${months[date.getMonth()]} ${date.getDate()}`,
    renewsLong: `${monthsLong[date.getMonth()]} ${date.getDate()}`,
    was,
    now,
    shop: { quotes, pick: best.carrier, price: best.price, staying },
  };
}

let next = 0;
const cohort = (count: number, from: [number, number], to: [number, number]) =>
  Array.from({ length: count }, () =>
    household(next++, new Date(2026, from[0] - 1, from[1]), new Date(2026, to[0] - 1, to[1])),
  ).sort((x, y) => Date.parse(`${x.renews} 2026`) - Date.parse(`${y.renews} 2026`));

/**
 * The pools, by where each starts the week. board.ts moves them from day to
 * day: this week's go out Tuesday and wait for an answer from Wednesday, the
 * waiting pool's soonest renewals answer and get shopped, and so on.
 *
 * Every range is 22 days later than it was until 2026-10-02 (Oct 13 to Nov
 * 27), so everyone renews after the Pruitts' November 3 and they come first
 * in whichever column they're in, which makes the walk easier to follow.
 * Nothing renews within two weeks of the walk's week any more, so no
 * countdown is red.
 */
export const pools = {
  /**
   * Next week's emails, which aren't on the board: they're scheduled next
   * Monday, after the walk's week. They held Scheduled from Wednesday until
   * 2026-10-02. They're still made first, so everyone after them keeps the
   * name and the place the seed gives them.
   */
  nextWeek: cohort(48, [12, 11], [12, 19]),
  /** This week's emails beside the named six: 42 + 6 = 48 going out Tuesday. */
  thisWeek: cohort(42, [11, 26], [12, 12]),
  /** Emailed in earlier weeks, no answer yet. */
  awaiting: cohort(55, [11, 11], [12, 5]),
  /** Answered, being shopped on Monday. */
  shopping: cohort(8, [11, 17], [11, 25]),
  /** Results back, recommendation ready to send on Monday. */
  ready: cohort(8, [11, 12], [11, 22]),
  /** Recommendation out on Monday; the first two have said yes. */
  sent: cohort(8, [11, 7], [11, 21]),
  /** Finished before the week started. */
  completed: cohort(10, [11, 4], [11, 16]),
};

/**
 * What a shop found, in one short sentence, as a Recommendation Ready card
 * says it: how much the pick saves, or that staying is the pick and why.
 * `current` is the household's carrier today, `pick` the carrier picked.
 */
export function shopSentence(quotes: { carrier: string; price: number }[], current: string, pick: string) {
  const now = quotes.find((q) => q.carrier === current)!;
  if (pick === current) {
    const cheaper = quotes.find((q) => q.carrier !== current && q.price < now.price);
    return cheaper
      ? `Staying with ${current} is the pick. ${cheaper.carrier} is cheaper but covers less.`
      : `Staying with ${current} is the pick. Nothing came in lower.`;
  }
  const picked = quotes.find((q) => q.carrier === pick)!;
  return `${pick} came in ${money(now.price - picked.price)} less for the same coverage.`;
}

/** An invented household's shop, as a Recommendation Ready card says it. */
export const shopLine = (h: Invented) => shopSentence(h.shop.quotes, h.carrier, h.shop.pick);

/** What was recommended, in a few words. */
export function pickLine(h: Invented) {
  return h.shop.staying
    ? `staying with ${h.carrier}`
    : `${h.shop.pick}, ${money(h.now - h.shop.price)} less`;
}
