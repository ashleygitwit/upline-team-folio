import { money } from "@/data";

/**
 * The rest of Jenna's pipeline: invented households that fill the homepage's
 * board to the volume an agency like Stockton Hill would carry. A book of
 * about 2,500 policies over 52 weeks is about 48 renewal emails a week, with
 * about 55 waiting on an answer and about 41 somewhere between shopping and
 * done (Amanda's sketch, 2026-09-30). The twelve named households keep their
 * files and their walk; these have no file, so their cards don't open.
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
  // One in ten comes in flat; the rest go up 2 to 16%, never more than the
  // Pruitts' $870, so they stay at the top of Monday's list.
  const now = rand() < 0.1 ? was : was + Math.min(820, Math.round((was * between(2, 16)) / 100));

  const date = new Date(from.getTime() + between(0, Math.round((to.getTime() - from.getTime()) / 86_400_000)) * 86_400_000);

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
 */
export const pools = {
  /** Next week's emails, scheduled from Wednesday on. */
  nextWeek: cohort(48, [11, 19], [11, 27]),
  /** This week's emails beside the named six: 42 + 6 = 48 going out Tuesday. */
  thisWeek: cohort(42, [11, 4], [11, 20]),
  /** Emailed in earlier weeks, no answer yet. */
  awaiting: cohort(55, [10, 20], [11, 13]),
  /** Answered, being shopped on Monday. */
  shopping: cohort(8, [10, 26], [11, 3]),
  /** Results back, recommendation ready to send on Monday. */
  ready: cohort(8, [10, 21], [10, 31]),
  /** Recommendation out on Monday; the first two have said yes. */
  sent: cohort(8, [10, 16], [10, 30]),
  /** Finished before the week started. */
  completed: cohort(10, [10, 13], [10, 25]),
};

/** What the shop found, in a sentence, as a Recommendation Ready card says it. */
export function shopLine(h: Invented) {
  if (h.shop.staying) {
    return `The pick is staying with ${h.carrier} at ${money(h.now)}. Nothing came in lower for the same coverage.`;
  }
  return `${h.shop.pick} came in at ${money(h.shop.price)} for the same coverage, ${money(h.now - h.shop.price)} less than ${h.carrier}'s renewal.`;
}

/** What was recommended, in a few words. */
export function pickLine(h: Invented) {
  return h.shop.staying
    ? `staying with ${h.carrier}`
    : `${h.shop.pick}, ${money(h.now - h.shop.price)} less`;
}
