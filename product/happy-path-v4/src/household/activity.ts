import {
  dayName,
  days,
  earlier,
  money,
  nudgeByKey,
  optionById,
  options,
  thisWeek,
  type Day,
  type Household,
} from "@/data";
import { columnTitle } from "@/household/columns";
import { cards } from "@/household/data";
import { changedFields, isSnoozed, snoozeLabel } from "@/tasks";
import type { Walk } from "@/walk";

/** A phase's page, which slides over the drawer from its banner or from a line in Recent activity. */
export type Phase = "outreach" | "nudge" | "shopping" | "results" | "closing";

/** A page over the drawer: its phase, and for a nudge, which one. */
export type Page = { phase: Phase; nudge?: string };

/** What a banner or a line opens, and the word it says it with. */
export type Opens = Page & { action: string };

/**
 * One line in Recent activity. A big one needs Jenna, or is an email she can
 * review before it goes out on its own, so it's drawn as a card with `opens`
 * as its button; any other line with `opens` has a link.
 */
export type Item = { when: string; label: string; detail?: string; opens?: Opens; big?: boolean };

/**
 * The drawer's banner: blue when it needs Jenna, gray when it only says
 * what's going on. One for an email that's scheduled to go leads with a
 * clock.
 */
export type Banner = { text: string; tone: "blue" | "gray"; opens?: Opens; scheduled?: boolean };

/** A shop in progress: each carrier, whether its quote is back, and when the results are due. */
export type Shop = { carriers: { name: string; back?: boolean }[]; due: string };

/**
 * Where a household stands on the walk's day, for its drawer: the stage over
 * its name, the banner, and Recent activity, which is what's coming up and
 * what has happened, newest first. The rest is what the phase pages say
 * once there's nothing left to do in them.
 */
export type Activity = {
  stage: string;
  banner: Banner | null;
  upNext: Item[];
  past: Item[];
  shop?: Shop;
  /** Said at the foot of the outreach review once the email has gone. */
  outreachSent?: string;
  /** Said at the foot of an earlier week's results once the recommendation has gone. */
  recSent?: string;
  /** What's left before closing out: a sentence and the things to do. */
  closing?: { sub: string; owes: string[] };
  /** Once closed out, when and what Jenna wrote. */
  closed?: { when: string; note: string };
};

/** The stages between the ones columns.ts names, as the homepage board's columns say them. */
const stage = {
  reached: "Awaiting Response",
  sent: "Recommendation Sent",
  closed: "Completed",
};

const dayShort: Record<Day, string> = { mon: "Mon", wed: "Wed", thu: "Thu", fri: "Fri" };
const at = (d: Day) => days.indexOf(d);
const list = (xs: string[]) => xs.join(", ").replace(/, ([^,]*)$/, " and $1");
/** "Erie's", "Auto-Owners'". */
const their = (carrier: string) => (carrier.endsWith("s") ? `${carrier}'` : `${carrier}'s`);

const outreachView: Opens = { phase: "outreach", action: "View" };
const shopView: Opens = { phase: "shopping", action: "View" };
const resultsView: Opens = { phase: "results", action: "View" };
const closingView: Opens = { phase: "closing", action: "View" };

const renewal = (renews: string): Item => ({
  when: renews,
  label: "Renewal date",
  detail: "Coverage needs to be in place.",
});

const shopping = (when: string, carriers: string[], open: boolean): Item => ({
  when,
  label: `VA started shopping ${list(carriers)}`,
  opens: open ? shopView : undefined,
});

const dueBack = (when: string): Item => ({ when, label: "Shopping results due back" });

const shop = (carriers: string[], due: string, back: string[] = []): Shop => ({
  carriers: carriers.map((name) => ({ name, back: back.includes(name) })),
  due,
});

const beingShopped = (due: string): Banner => ({
  tone: "gray",
  text: `Being shopped. Results back ${due}.`,
  opens: shopView,
});

/* ------------------------------------------------------------------ *
 * This week's six
 * ------------------------------------------------------------------ */

const drafted: Item = { when: "Mon 7:00 AM", label: "Renewal email drafted in your voice" };

function cameIn(h: Household): Item {
  const pct = cards.find((c) => c.id === h.id)!.jumpPct;
  return {
    when: "Last week",
    label:
      pct === 0 ? `${their(h.carrier)} renewal came in at the same price` : `${their(h.carrier)} renewal came in ${pct}% higher`,
    detail: h.why,
  };
}

/** Send now marks the email early; otherwise it goes Tuesday at 9:00 AM with the rest. */
const sentEarly = (h: Household, walk: Walk) => walk.approved.includes(h.id);

/** After Monday: the email going out, and what came before it. */
function reachedOut(h: Household, walk: Walk): Item[] {
  const early = sentEarly(h, walk);
  return [
    {
      when: early ? "Mon" : "Tue 9:00 AM",
      label: early ? "You sent the renewal email" : "Renewal email sent",
      opens: outreachView,
    },
    drafted,
    cameIn(h),
  ];
}

function monday(h: Household, walk: Walk): Activity {
  const early = sentEarly(h, walk);
  const review: Opens = { phase: "outreach", action: early ? "View" : "Review" };
  return {
    stage: early ? stage.reached : columnTitle("outreach"),
    banner: {
      tone: "gray",
      text: early ? "Renewal email sent." : "Renewal email scheduled for Tues 9AM.",
      opens: review,
      scheduled: !early,
    },
    upNext: [
      ...(early
        ? []
        : [
            {
              when: "Tue 9:00 AM",
              label: "Renewal email goes out",
              detail: "Drafted in your voice and sent from your inbox.",
              opens: review,
              big: true,
            },
          ]),
      renewal(h.renews),
    ],
    past: [...(early ? [{ when: "Mon", label: "You sent the renewal email", opens: review }] : []), drafted, cameIn(h)],
    outreachSent: early ? "Sent Monday." : undefined,
  };
}

/** Skipped on Monday: Jenna is handling it herself, and the review's Undo brings it back. */
function skipped(h: Household): Activity {
  const review: Opens = { phase: "outreach", action: "Review" };
  return {
    stage: stage.closed,
    banner: { tone: "gray", text: `Skipped. ${h.first} won't be emailed this time.`, opens: review },
    upNext: [],
    past: [
      { when: "Mon", label: "You skipped outreach", detail: "You're handling this one yourself this time.", opens: review },
      drafted,
      cameIn(h),
    ],
  };
}

/** Where a nudge or follow-up stands: scheduled, sent early, skipped, or gone at 9:00 AM on its day. */
export type NudgeState =
  | { state: "scheduled" }
  | { state: "sent"; when: string }
  | { state: "skipped" };

export function nudgeState(key: string, day: Day, walk: Walk): NudgeState {
  const n = nudgeByKey(key);
  const chose = walk.nudges[key];
  if (chose?.choice === "skipped") return { state: "skipped" };
  if (chose?.choice === "sent") return { state: "sent", when: `Sent ${dayName[chose.day]}.` };
  if (n.goes && at(day) >= at(n.goes)) return { state: "sent", when: `Sent ${dayName[n.goes]} at 9:00 AM.` };
  return { state: "scheduled" };
}

/**
 * A nudge's part in the drawer. Until it goes, it's the banner and a line in
 * Up next; once Jenna sends it early or skips it, the banner says so until
 * its day. After that it's a line in what has happened.
 */
function nudge(key: string, day: Day, walk: Walk): { banner: Banner | null; upNext: Item[]; past: Item[] } {
  const n = nudgeByKey(key);
  const what = n.what.toLowerCase();
  const chose = walk.nudges[key];
  const gone = n.goes !== null && at(day) >= at(n.goes);
  const review: Opens = { phase: "nudge", nudge: key, action: "Review" };
  const view: Opens = { ...review, action: "View" };

  if (chose?.choice === "sent") {
    return {
      banner: gone ? null : { tone: "gray", text: `${n.what} sent.`, opens: view },
      upNext: [],
      past: [{ when: dayShort[chose.day], label: `You sent the ${what}`, opens: view }],
    };
  }
  if (chose?.choice === "skipped") {
    return {
      banner: gone ? null : { tone: "gray", text: `${n.what} skipped.`, opens: review },
      upNext: [],
      past: [{ when: dayShort[chose.day], label: `You skipped the ${what}`, detail: n.why, opens: review }],
    };
  }
  if (gone) {
    return { banner: null, upNext: [], past: [{ when: `${dayShort[n.goes!]} 9:00 AM`, label: `${n.what} sent`, opens: view }] };
  }
  return {
    banner: { tone: "gray", text: `${n.what} scheduled for ${n.short} 9AM.`, opens: review, scheduled: true },
    upNext: [
      {
        when: `${n.goes ? dayShort[n.goes] : "Mon"} 9:00 AM`,
        label: `${n.what} goes out`,
        detail: n.why,
        opens: review,
        big: true,
      },
    ],
    past: [],
  };
}

/** The Pruitts after Monday: shopped Wednesday, results Thursday, approved Thursday night, closed Friday. */
function callahanLater(h: Household, day: Day, walk: Walk): Activity {
  const pick = optionById(walk.pick);
  const ao = optionById("ao");
  const erie = options.find((o) => o.current)!;
  const carriers = ["Auto-Owners", "Erie", "Grange"];
  const renew = renewal(h.renews);
  const answered: Item[] = [
    { when: "Tue 7:40 PM", label: "Leah finished the questionnaire" },
    { when: "Tue 9:02 AM", label: "Leah opened the renewal email" },
    ...reachedOut(h, walk),
  ];

  if (day === "wed") {
    return {
      stage: columnTitle("shopping"),
      banner: beingShopped("Thursday"),
      shop: shop(carriers, "Thursday"),
      upNext: [dueBack("Thu"), renew],
      past: [shopping("Wed 8:30 AM", carriers, true), ...answered],
    };
  }

  const results: Item = {
    when: "Thu 7:15 AM",
    label: "Shopping results came back",
    detail: `Auto-Owners came in at ${money(ao.price)} for the same coverage, ${money(erie.price - ao.price)} less than Erie's renewal.`,
  };
  const shopDone = [shopping("Wed 8:30 AM", carriers, false), ...answered];
  const shopped = [results, ...shopDone];

  if (day === "thu" && !walk.recSent) {
    return {
      stage: columnTitle("recommend"),
      banner: {
        tone: "blue",
        text: "Leah and Tom's Renewal Shopping Results have been updated.",
        opens: { phase: "results", action: "Review" },
      },
      upNext: [renew],
      past: [{ ...results, big: true, opens: { phase: "results", action: "View results" } }, ...shopDone],
    };
  }

  const sentRec: Item = {
    when: "Thu 9:30 AM",
    label: "You sent the recommendation",
    detail: pick.current ? "Stay with Erie." : `Switch from Erie to ${pick.carrier}.`,
    opens: resultsView,
  };

  if (day === "thu") {
    return {
      stage: stage.sent,
      banner: { tone: "gray", text: "Recommendation sent to Leah and Tom.", opens: resultsView },
      upNext: [renew],
      past: [sentRec, ...shopped],
    };
  }

  const approved: Item = {
    when: "Thu 6:20 PM",
    label: pick.current ? "Leah and Tom are staying with Erie" : `Leah and Tom approved ${pick.carrier}`,
  };
  const decided = [{ when: "Thu 6:12 PM", label: "Leah opened your recommendation" }, sentRec, ...shopped];

  if (!walk.bound) {
    return {
      stage: columnTitle("binding"),
      banner: {
        tone: "blue",
        text: pick.current
          ? "Leah and Tom are staying with Erie. Close it out."
          : `Leah and Tom approved ${pick.carrier}. Bind it before Nov 15.`,
        opens: { phase: "closing", action: "Review" },
      },
      upNext: [renew],
      past: [
        {
          ...approved,
          big: true,
          detail: pick.current
            ? "There's nothing to bind. Erie renews on its own on November 15, so close it out."
            : `Bind it in the ${pick.carrier} portal before November 15, then close it out.`,
          opens: { phase: "closing", action: "Close out" },
        },
        ...decided,
      ],
      closing: {
        sub: pick.current
          ? "Leah and Tom are staying with Erie. There's nothing to bind: Erie renews on its own on November 15."
          : `Leah and Tom approved ${pick.carrier} Thursday at 6:20 PM. Bind it in the ${pick.carrier} portal before November 15.`,
        owes: pick.current ? [] : [`Bind ${pick.carrier} in the portal`],
      },
    };
  }

  const note = walk.closed[h.id] ?? "";
  return {
    stage: stage.closed,
    banner: null,
    upNext: [],
    past: [
      {
        when: "Fri",
        label: "You closed it out",
        detail: note || (pick.current ? "Staying with Erie." : `Bound with ${pick.carrier}.`),
        opens: closingView,
      },
      approved,
      ...decided,
    ],
    closed: { when: "Friday", note },
  };
}

/** The other five after Monday, from their statuses and the week's nudges (data.ts). */
const later: Record<string, (h: Household, day: Day, walk: Walk) => Activity> = {
  pruitt: callahanLater,

  adeyemi(h, day, walk) {
    const opened: Item[] = [
      { when: "Tue 11:20 AM", label: "Tobi opened the renewal email", detail: "No questionnaire yet." },
      ...reachedOut(h, walk),
    ];
    const n = nudge("adeyemi-thu", day, walk);
    if (day === "wed") {
      return { stage: stage.reached, banner: n.banner, upNext: [...n.upNext, renewal(h.renews)], past: [...n.past, ...opened] };
    }
    const started: Item[] = [{ when: "Thu 10:05 AM", label: "Tobi started the questionnaire" }, ...n.past, ...opened];
    if (day === "thu") {
      return { stage: stage.reached, banner: n.banner, upNext: [renewal(h.renews)], past: started };
    }
    const carriers = ["Erie", "Auto-Owners", "Grange"];
    return {
      stage: columnTitle("shopping"),
      banner: beingShopped("Monday"),
      shop: shop(carriers, "Monday"),
      upNext: [dueBack("Mon"), renewal(h.renews)],
      past: [
        shopping("Fri 8:30 AM", carriers, true),
        { when: "Thu 7:50 PM", label: "Tobi finished the questionnaire" },
        ...started,
      ],
    };
  },

  whitmore(h, day, walk) {
    const started: Item[] = [{ when: "Tue 8:40 PM", label: "Carol started the questionnaire" }, ...reachedOut(h, walk)];
    if (day === "wed") {
      return { stage: stage.reached, banner: null, upNext: [renewal(h.renews)], past: started };
    }
    const carriers = ["Auto-Owners", "Erie", "Grange"];
    const shopped: Item[] = [
      shopping("Thu 8:30 AM", carriers, true),
      { when: "Wed 9:15 PM", label: "Carol finished the questionnaire" },
      ...started,
    ];
    if (day === "thu") {
      return {
        stage: columnTitle("shopping"),
        banner: beingShopped("Friday afternoon"),
        shop: shop(carriers, "Friday afternoon"),
        upNext: [dueBack("Fri afternoon"), renewal(h.renews)],
        past: shopped,
      };
    }
    return {
      stage: columnTitle("shopping"),
      banner: { tone: "gray", text: "Being shopped. One carrier left, back this afternoon.", opens: shopView },
      shop: shop(carriers, "this afternoon", ["Auto-Owners", "Erie"]),
      upNext: [dueBack("Fri afternoon"), renewal(h.renews)],
      past: [{ when: "Fri 10:30 AM", label: "Two of three quotes are in", detail: "Grange is the one left to quote." }, ...shopped],
    };
  },

  conti(h, day, walk) {
    const stopped: Item[] = [
      { when: "Tue 6:30 PM", label: "Marisa stopped partway through the questionnaire", detail: "At the vehicles question." },
      { when: "Tue 6:10 PM", label: "Marisa started the questionnaire" },
      ...reachedOut(h, walk),
    ];
    const first = nudge("conti-thu", day, walk);
    if (day === "wed") {
      return { stage: stage.reached, banner: first.banner, upNext: [...first.upNext, renewal(h.renews)], past: stopped };
    }
    const next = nudge("conti-mon", day, walk);
    return {
      stage: stage.reached,
      banner: next.banner,
      upNext: [...next.upNext, renewal(h.renews)],
      past: [
        ...next.past,
        { when: "Thu 11:00 AM", label: "Marisa answered more, then stopped again", detail: "One question left." },
        ...first.past,
        ...stopped,
      ],
    };
  },

  lindqvist(h, day, walk) {
    const n = nudge("lindqvist-fri", day, walk);
    return {
      stage: stage.reached,
      banner: n.banner,
      upNext: [...n.upNext, renewal(h.renews)],
      past: [...n.past, ...reachedOut(h, walk)],
    };
  },

  pham(h, _day, walk) {
    return {
      stage: stage.closed,
      banner: null,
      upNext: [],
      past: [
        {
          when: "Tue 2:15 PM",
          label: "Andy replied: happy with Erie, no shop needed",
          detail: "Nothing else to do this time. Erie renews on its own.",
        },
        ...reachedOut(h, walk),
      ],
    };
  },
};

/* ------------------------------------------------------------------ *
 * Earlier weeks' six, as Ashley's board has them on Monday and as the
 * homepage's board has them after, once Jenna clears them Monday
 * afternoon, off-camera.
 * ------------------------------------------------------------------ */

/** Being shopped on Monday, with the recommendation sent Tuesday. */
function shoppingEarlier(
  first: string,
  day: Day,
  renews: string,
  carriers: string[],
  answered: Item,
  emailed: string,
): Activity {
  const start: Item[] = [answered, { when: emailed, label: "Renewal email sent", opens: outreachView }];
  const outreachSent = `Sent ${emailed.replace("Oct", "October")}.`;
  if (day === "mon") {
    return {
      stage: columnTitle("shopping"),
      banner: beingShopped("Tuesday"),
      shop: shop(carriers, "Tuesday"),
      upNext: [dueBack("Tue"), renewal(renews)],
      past: [shopping("Mon 8:30 AM", carriers, true), ...start],
      outreachSent,
    };
  }
  return {
    stage: stage.sent,
    banner: { tone: "gray", text: `Recommendation sent Tuesday. Waiting on ${first}.` },
    upNext: [renewal(renews)],
    past: [
      { when: "Tue 2:00 PM", label: "You sent the recommendation" },
      { when: "Tue 10:30 AM", label: "Shopping results came back" },
      shopping("Mon 8:30 AM", carriers, false),
      ...start,
    ],
    outreachSent,
  };
}

/** Results waiting on Monday. Jenna sends them from the drawer, or off-camera Monday afternoon. */
function readyEarlier(id: string, day: Day, walk: Walk, start: Item[], results: Item, after: (sent: Item[]) => Activity): Activity {
  const e = earlier.find((x) => x.id === id)!;
  const first = e.name.split(" ")[0];
  const inWalk = walk.recsSent.includes(id);
  const back = { ...results, detail: e.monday!.detail };
  const recSent = `Sent to ${first} Monday.`;

  if (day === "mon" && !inWalk) {
    return {
      stage: columnTitle("recommend"),
      banner: {
        tone: "blue",
        text: `${first}'s Renewal Shopping Results have been updated.`,
        opens: { phase: "results", action: "Review" },
      },
      upNext: [renewal(e.renews)],
      past: [{ ...back, big: true, opens: { phase: "results", action: "View results" } }, ...start],
    };
  }
  const sent: Item[] = [
    { when: inWalk ? "Mon" : "Mon 3:00 PM", label: "You sent the recommendation", opens: resultsView },
    back,
    ...start,
  ];
  if (day === "mon") {
    return {
      stage: stage.sent,
      banner: { tone: "gray", text: `Recommendation sent to ${first}.`, opens: resultsView },
      upNext: [renewal(e.renews)],
      past: sent,
      recSent,
    };
  }
  return { ...after(sent), recSent };
}

/** Approved and waiting to be bound on Monday, closed out from the drawer or off-camera Monday afternoon. */
function closingEarlier(
  id: string,
  day: Day,
  walk: Walk,
  start: Item[],
  approved: Item,
  { banner, detail, sub, owes, done }: { banner: string; detail: string; sub: string; owes: string[]; done: string },
): Activity {
  const e = earlier.find((x) => x.id === id)!;
  const note = walk.closed[id];

  if (day === "mon" && note === undefined) {
    return {
      stage: columnTitle("binding"),
      banner: { tone: "blue", text: banner, opens: { phase: "closing", action: "Review" } },
      upNext: [renewal(e.renews)],
      past: [{ ...approved, detail, big: true, opens: { phase: "closing", action: "Close out" } }, ...start],
      closing: { sub, owes },
    };
  }
  const inWalk = note !== undefined;
  return {
    stage: stage.closed,
    banner: null,
    upNext: [],
    past: [
      { when: inWalk ? "Mon" : "Mon 4:00 PM", label: "You closed it out", detail: note || done, opens: closingView },
      approved,
      ...start,
    ],
    closed: { when: "Monday", note: inWalk ? note : done },
  };
}

const earlierWeeks: Record<string, (day: Day, walk: Walk) => Activity> = {
  rao: (day) =>
    shoppingEarlier(
      "Neha",
      day,
      "Oct 28",
      ["Auto-Owners", "Erie", "Grange"],
      { when: "Mon 7:15 AM", label: "Neha finished the questionnaire" },
      "Oct 6",
    ),

  yates: (day) =>
    shoppingEarlier(
      "Marcus",
      day,
      "Oct 30",
      ["Erie", "Auto-Owners", "Grange"],
      { when: "Oct 11", label: "Marcus finished the questionnaire", detail: "One VIN is still missing." },
      "Oct 6",
    ),

  marin: (day, walk) => ({
    ...readyEarlier(
      "marin",
      day,
      walk,
      [
        shopping("Oct 7", ["Auto-Owners", "Grange", "Erie"], false),
        { when: "Oct 6", label: "Sofia finished the questionnaire" },
        { when: "Oct 2", label: "Renewal email sent", opens: outreachView },
      ],
      { when: "Oct 9", label: "Shopping results came back" },
      (sent) => ({
        stage: stage.sent,
        banner: { tone: "gray", text: "Recommendation sent Monday. Waiting on Sofia.", opens: resultsView },
        upNext: [renewal("Oct 22")],
        past: sent,
      }),
    ),
    outreachSent: "Sent October 2.",
  }),

  kemp: (day, walk) => ({
    ...readyEarlier(
      "kemp",
      day,
      walk,
      [
        shopping("Oct 6", ["Westfield", "Ohio Mutual", "Cincinnati"], false),
        { when: "Oct 5", label: "Walter finished the questionnaire" },
        { when: "Oct 2", label: "Renewal email sent", opens: outreachView },
      ],
      { when: "Oct 8", label: "Shopping results came back" },
      (sent) => ({
        stage: stage.closed,
        banner: null,
        upNext: [],
        past: [
          {
            when: "Tue 10:20 AM",
            label: "Walter is staying with Nationwide",
            detail: "Nothing to bind. Nationwide renews on its own.",
          },
          ...sent,
        ],
      }),
    ),
    outreachSent: "Sent October 2.",
  }),

  mercer: (day, walk) => ({
    ...closingEarlier(
      "mercer",
      day,
      walk,
      [
        { when: "Oct 8", label: "You sent the recommendation", detail: "Switch from Erie to Auto-Owners." },
        { when: "Oct 6", label: "Shopping results came back" },
        { when: "Oct 3", label: "Diane finished the questionnaire" },
        { when: "Oct 1", label: "Renewal email sent", opens: outreachView },
      ],
      { when: "Oct 9", label: "Diane approved Auto-Owners" },
      {
        banner: "Diane approved Auto-Owners. Bind it before Oct 18.",
        detail: "Bind it in the portal before October 18, then close it out.",
        sub: "Diane approved Auto-Owners on October 9. Bind it in the portal before October 18.",
        owes: ["Bind Auto-Owners in the portal"],
        done: "Bound with Auto-Owners.",
      },
    ),
    outreachSent: "Sent October 1.",
  }),

  iyer: (day, walk) => ({
    ...closingEarlier(
      "iyer",
      day,
      walk,
      [
        { when: "Oct 6", label: "You sent the recommendation", detail: "Stay with Westfield." },
        { when: "Oct 4", label: "Shopping results came back" },
        { when: "Sep 30", label: "Rhea finished the questionnaire" },
        { when: "Sep 28", label: "Renewal email sent", opens: outreachView },
      ],
      { when: "Oct 8", label: "Rhea is staying with Westfield" },
      {
        banner: "Rhea is staying with Westfield. Bind it before Oct 16.",
        detail: "Bind the renewal and confirm the mortgagee clause before October 16, then close it out.",
        sub: "Rhea is staying with Westfield. Bind the renewal and confirm the mortgagee clause before October 16.",
        owes: ["Bind Westfield", "Confirm mortgagee clause"],
        done: "Staying with Westfield.",
      },
    ),
    outreachSent: "Sent September 28.",
  }),
};

/* ------------------------------------------------------------------ *
 * The first cards (firstCards.ts): the invented households that are the
 * first card in a column on some day of the walk, each told the way a named
 * household on the same path is.
 * ------------------------------------------------------------------ */

/** A first card's renewal email, still waiting to go: scheduled, sent early, or skipped. */
function waitingEmail(
  id: string,
  first: string,
  day: Day,
  walk: Walk,
  { renews, past }: { renews: string; past: Item[] },
): Activity {
  const on = walk.outreachOn[id] ?? day;
  const review: Opens = { phase: "outreach", action: "Review" };
  const view: Opens = { phase: "outreach", action: "View" };
  if (walk.skipped.includes(id)) {
    return {
      stage: stage.closed,
      banner: { tone: "gray", text: `Skipped. ${first} won't be emailed this time.`, opens: review },
      upNext: [],
      past: [
        { when: dayShort[on], label: "You skipped outreach", detail: "You're handling this one yourself this time.", opens: review },
        ...past,
      ],
    };
  }
  if (walk.approved.includes(id)) {
    return {
      stage: stage.reached,
      banner: { tone: "gray", text: "Renewal email sent.", opens: view },
      upNext: [renewal(renews)],
      past: [{ when: dayShort[on], label: "You sent the renewal email", opens: view }, ...past],
      outreachSent: `Sent ${dayName[on]}.`,
    };
  }
  return {
    stage: columnTitle("outreach"),
    banner: { tone: "gray", text: "Renewal email scheduled for Tues 9AM.", opens: review, scheduled: true },
    upNext: [
      {
        when: "Tue 9:00 AM",
        label: "Renewal email goes out",
        detail: "Drafted in your voice and sent from your inbox.",
        opens: review,
        big: true,
      },
      renewal(renews),
    ],
    past,
  };
}

const firstCardWeeks: Record<string, (day: Day, walk: Walk) => Activity> = {
  /** Cole Doyle: waiting on an answer Monday, with a nudge for Wednesday; answers it, and is shopped from Wednesday. */
  "inv-102": (day, walk) => {
    const carriers = ["Auto-Owners", "Erie", "Grange"];
    const outreachSent = "Sent October 6.";
    const n = nudge("doyle-wed", day, walk);
    const before: Item[] = [
      { when: "Oct 7", label: "Cole opened the renewal email", detail: "No questionnaire yet." },
      { when: "Oct 6", label: "Renewal email sent", opens: outreachView },
      { when: "Oct 2", label: "Auto-Owners' renewal came in 9% higher", detail: "The hail claim on the roof in April is most of it." },
    ];
    if (day === "mon") {
      return { stage: stage.reached, banner: n.banner, upNext: [...n.upNext, renewal("Oct 20")], past: [...n.past, ...before], outreachSent };
    }
    const answered: Item[] = [
      shopping("Wed 11:00 AM", carriers, true),
      { when: "Wed 9:40 AM", label: "Cole finished the questionnaire", detail: "He confirmed the new roof went on in May." },
      ...n.past,
      ...before,
    ];
    if (day === "wed") {
      return {
        stage: columnTitle("shopping"),
        banner: beingShopped("Friday"),
        shop: shop(carriers, "Friday"),
        upNext: [dueBack("Fri"), renewal("Oct 20")],
        past: answered,
        outreachSent,
      };
    }
    const one: Item = { when: "Thu 3:20 PM", label: "One of three quotes is in", detail: "Erie and Grange are still out." };
    if (day === "thu") {
      return {
        stage: columnTitle("shopping"),
        banner: beingShopped("Friday"),
        shop: shop(carriers, "Friday", ["Auto-Owners"]),
        upNext: [dueBack("Fri"), renewal("Oct 20")],
        past: [one, ...answered],
        outreachSent,
      };
    }
    return {
      stage: columnTitle("shopping"),
      banner: { tone: "gray", text: "Being shopped. One carrier left, back this afternoon.", opens: shopView },
      shop: shop(carriers, "this afternoon", ["Auto-Owners", "Erie"]),
      upNext: [dueBack("Fri afternoon"), renewal("Oct 20")],
      past: [{ when: "Fri 10:15 AM", label: "Two of three quotes are in", detail: "Grange is the one left to quote." }, one, ...answered],
      outreachSent,
    };
  },

  /** Troy Lowry: shopped Monday and sent Tuesday, as Neha Rao is. */
  "inv-145": (day) => {
    const carriers = ["Nationwide", "Travelers", "Westfield"];
    const outreachSent = "Sent October 6.";
    const start: Item[] = [
      { when: "Oct 9", label: "Troy finished the questionnaire", detail: "He confirmed the new commute, 25 miles each way." },
      { when: "Oct 6", label: "Renewal email sent", opens: outreachView },
      { when: "Oct 1", label: "Nationwide's renewal came in 11% higher", detail: "Most of it is the longer commute since August." },
    ];
    if (day === "mon") {
      return {
        stage: columnTitle("shopping"),
        banner: beingShopped("Tuesday"),
        shop: shop(carriers, "Tuesday"),
        upNext: [dueBack("Tue"), renewal("Oct 26")],
        past: [shopping("Mon 8:30 AM", carriers, true), ...start],
        outreachSent,
      };
    }
    const sent: Item[] = [
      { when: "Tue 2:00 PM", label: "You sent the recommendation", detail: "Switch from Nationwide to Travelers.", opens: resultsView },
      {
        when: "Tue 10:30 AM",
        label: "Shopping results came back",
        detail: "Travelers came in at $1,795 for the same coverage, $75 less than Nationwide's renewal.",
      },
      shopping("Mon 8:30 AM", carriers, false),
      ...start,
    ];
    return {
      stage: stage.sent,
      banner: { tone: "gray", text: "Recommendation sent Tuesday. Waiting on Troy.", opens: resultsView },
      upNext: [renewal("Oct 26")],
      past: day === "wed" ? sent : [{ when: "Wed 8:05 PM", label: "Troy opened your recommendation", detail: "No answer yet." }, ...sent],
      outreachSent,
      recSent: "Sent to Troy Tuesday.",
    };
  },

  /** Hank Fischer: results to send Monday, from the drawer or off-camera that afternoon, as Sofia Marin's are. */
  "inv-160": (day, walk) => {
    const inWalk = walk.recsSent.includes("inv-160");
    const outreachSent = "Sent October 1.";
    const start: Item[] = [
      shopping("Oct 6", ["Grange", "Ohio Mutual", "Nationwide"], false),
      { when: "Oct 5", label: "Hank finished the questionnaire", detail: "He sent Nolan's license number." },
      { when: "Oct 1", label: "Renewal email sent", opens: outreachView },
      { when: "Sep 28", label: "Grange's renewal came in 13% higher", detail: "Hank added his son Nolan as a driver in July." },
    ];
    const back: Item = {
      when: "Oct 9",
      label: "Shopping results came back",
      detail: "Ohio Mutual came in at $1,573 for the same coverage, $235 less than Grange's renewal.",
    };
    if (day === "mon" && !inWalk) {
      return {
        stage: columnTitle("recommend"),
        banner: {
          tone: "blue",
          text: "Hank's Renewal Shopping Results have been updated.",
          opens: { phase: "results", action: "Review" },
        },
        upNext: [renewal("Oct 22")],
        past: [{ ...back, big: true, opens: { phase: "results", action: "View results" } }, ...start],
        outreachSent,
      };
    }
    const sent: Item[] = [
      { when: inWalk ? "Mon" : "Mon 3:00 PM", label: "You sent the recommendation", opens: resultsView },
      back,
      ...start,
    ];
    const recSent = "Sent to Hank Monday.";
    if (day === "mon") {
      return {
        stage: stage.sent,
        banner: { tone: "gray", text: "Recommendation sent to Hank.", opens: resultsView },
        upNext: [renewal("Oct 22")],
        past: sent,
        outreachSent,
        recSent,
      };
    }
    return {
      stage: stage.sent,
      banner: { tone: "gray", text: "Recommendation sent Monday. Waiting on Hank.", opens: resultsView },
      upNext: [renewal("Oct 22")],
      past: day === "wed" ? sent : [{ when: "Wed 6:40 PM", label: "Hank opened your recommendation", detail: "No answer yet." }, ...sent],
      outreachSent,
      recSent,
    };
  },

  /** Lena Park: approved, to bind Monday, closed out from the drawer or off-camera that afternoon, as Diane Mercer is. */
  "inv-168": (day, walk) => {
    const note = walk.closed["inv-168"];
    const base = { outreachSent: "Sent September 25.", recSent: "Sent to Lena October 5." };
    const start: Item[] = [
      { when: "Oct 5", label: "You sent the recommendation", detail: "Switch from Erie to Grange.", opens: resultsView },
      {
        when: "Oct 2",
        label: "Shopping results came back",
        detail: "Grange came in at $2,082 for the same coverage, $257 less than Erie's renewal.",
      },
      shopping("Sep 29", ["Erie", "Grange", "Nationwide"], false),
      { when: "Sep 28", label: "Lena finished the questionnaire" },
      { when: "Sep 25", label: "Renewal email sent", opens: outreachView },
      { when: "Sep 21", label: "Erie's renewal came in at the same price", detail: "Lena asked to shop it anyway." },
    ];
    const approved: Item = { when: "Oct 8", label: "Lena approved Grange" };
    if (day === "mon" && note === undefined) {
      return {
        ...base,
        stage: columnTitle("binding"),
        banner: { tone: "blue", text: "Lena approved Grange. Bind it before Oct 16.", opens: { phase: "closing", action: "Review" } },
        upNext: [renewal("Oct 16")],
        past: [
          {
            ...approved,
            detail: "Bind it in the Grange portal before October 16, then close it out.",
            big: true,
            opens: { phase: "closing", action: "Close out" },
          },
          ...start,
        ],
        closing: {
          sub: "Lena approved Grange on October 8. Bind it in the Grange portal before October 16, then send Erie the cancellation.",
          owes: ["Bind Grange in the portal", "Send Erie the cancellation"],
        },
      };
    }
    const inWalk = note !== undefined;
    const done = "Bound with Grange. Erie cancellation sent.";
    return {
      ...base,
      stage: stage.closed,
      banner: null,
      upNext: day === "fri" ? [] : [{ when: "Oct 16", label: "Grange policy starts", detail: "Erie's ends the same day." }],
      past: [
        ...(day === "fri" ? [{ when: "Oct 16", label: "Grange policy started" }] : []),
        { when: inWalk ? "Mon" : "Mon 4:00 PM", label: "You closed it out", detail: note || done, opens: closingView },
        approved,
        ...start,
      ],
      closed: { when: "Monday", note: inWalk ? note : done },
    };
  },

  /** Grace Tanaka: bound before the walk, with Erie starting Thursday. */
  "inv-173": (day) => {
    const done = "Bound Erie in the portal. Ohio Mutual cancellation sent.";
    const history: Item[] = [
      { when: "Oct 2", label: "You closed it out", detail: done, opens: closingView },
      { when: "Oct 1", label: "Grace and Ken approved Erie" },
      { when: "Sep 29", label: "You sent the recommendation", detail: "Switch from Ohio Mutual to Erie.", opens: resultsView },
      {
        when: "Sep 28",
        label: "Shopping results came back",
        detail: "Erie came in at $4,002 for the same coverage, $652 less than Ohio Mutual's renewal.",
      },
      shopping("Sep 24", ["Ohio Mutual", "Erie", "Westfield"], false),
      { when: "Sep 23", label: "Grace finished the questionnaire", detail: "She'd like to see what else is out there." },
      { when: "Sep 21", label: "Renewal email sent", opens: outreachView },
      { when: "Sep 18", label: "Ohio Mutual's renewal came in 4% higher", detail: "Under 10%, so the email offered a shop." },
    ];
    const started = at(day) >= at("thu");
    return {
      stage: stage.closed,
      banner: null,
      upNext: started ? [] : [{ when: "Oct 15", label: "Erie policy starts", detail: "Ohio Mutual's ends the same day." }],
      past: started ? [{ when: "Oct 15", label: "Erie policy started" }, ...history] : history,
      outreachSent: "Sent September 21.",
      recSent: "Sent to Grace and Ken September 29.",
      closed: { when: "October 2", note: done },
    };
  },

  /** Elena Varga: next week's email, drafted Wednesday, waiting until Tuesday. */
  "inv-10": (day, walk) =>
    waitingEmail("inv-10", "Elena", day, walk, {
      renews: "Nov 26",
      past: [
        { when: "Wed 7:00 AM", label: "Renewal email drafted in your voice" },
        {
          when: "Tue",
          label: "Auto-Owners' renewal came in 16% higher",
          detail: "The roof is from 2008, and Auto-Owners now pays it actual cash value.",
        },
      ],
    }),

  /** Sara Ortiz: this week's email Tuesday, as the Pruitts' is; answers Wednesday night and is shopped from Thursday. */
  "inv-82": (day, walk) => {
    const drafted: Item = { when: "Mon 7:00 AM", label: "Renewal email drafted in your voice" };
    const came: Item = {
      when: "Last week",
      label: "Erie's renewal came in 4% higher",
      detail: "Under 10%, so the email offers a shop rather than pushing one.",
    };
    if (day === "mon" || walk.skipped.includes("inv-82")) {
      return waitingEmail("inv-82", "Sara", day, walk, { renews: "Nov 4", past: [drafted, came] });
    }
    const early = walk.approved.includes("inv-82");
    const outreachSent = early ? "Sent Monday." : "Sent Tuesday at 9:00 AM.";
    const sent: Item[] = [
      { when: "Tue 4:10 PM", label: "Sara opened the renewal email" },
      { when: early ? "Mon" : "Tue 9:00 AM", label: early ? "You sent the renewal email" : "Renewal email sent", opens: outreachView },
      drafted,
      came,
    ];
    if (day === "wed") return { stage: stage.reached, banner: null, upNext: [renewal("Nov 4")], past: sent, outreachSent };
    const carriers = ["Erie", "Nationwide", "Ohio Mutual"];
    const shopped: Item[] = [
      shopping("Thu 8:30 AM", carriers, true),
      { when: "Wed 8:45 PM", label: "Sara finished the questionnaire", detail: "She'd like to see what else is out there." },
      ...sent,
    ];
    if (day === "thu") {
      return {
        stage: columnTitle("shopping"),
        banner: beingShopped("Monday"),
        shop: shop(carriers, "Monday"),
        upNext: [dueBack("Mon"), renewal("Nov 4")],
        past: shopped,
        outreachSent,
      };
    }
    return {
      stage: columnTitle("shopping"),
      banner: { tone: "gray", text: "Being shopped. One carrier left, back Monday.", opens: shopView },
      shop: shop(carriers, "Monday", ["Erie", "Nationwide"]),
      upNext: [dueBack("Mon"), renewal("Nov 4")],
      past: [{ when: "Fri 11:20 AM", label: "Two of three quotes are in", detail: "Ohio Mutual is the one left to quote." }, ...shopped],
      outreachSent,
    };
  },
};

/**
 * A household's drawer on the walk's day, following what the presenter has
 * done: this week's six from Monday's email through the week's statuses and
 * nudges, earlier weeks' six from Ashley's board on Monday to where the
 * homepage's board has them after, and the seven first cards through the
 * week. `null` for anyone without a file.
 */
export function activityFor(id: string, day: Day, walk: Walk): Activity | null {
  const base = baseActivity(id, day, walk);
  if (!base) return null;
  const past = [...base.past];

  // What the questionnaire changed on file, said right after the line that
  // says it came back, so the count sits with its cause.
  const fields = changedFields(id, day, walk);
  if (fields.length > 0) {
    const at = past.findIndex((it) => /questionnaire/i.test(it.label));
    const line: Item = {
      when: at >= 0 ? past[at].when : "",
      label: `${fields.length} ${fields.length === 1 ? "detail" : "details"} changed on file`,
      detail: `${fields.join(", ")}. Update ${fields.length === 1 ? "it" : "them"} in EZLynx.`,
    };
    past.splice(at >= 0 ? at : past.length, 0, line);
  }

  // Snoozing is the newest thing Jenna did, so it heads the list.
  const s = walk.snoozed[id];
  if (s) {
    past.unshift({
      when: dayShort[s.day],
      label: `You snoozed this ${snoozeLabel(s.until)}`,
      detail: isSnoozed(id, day, walk) ? "It's off the homepage until then." : "It's back on the homepage.",
    });
  }
  return { ...base, past };
}

function baseActivity(id: string, day: Day, walk: Walk): Activity | null {
  const h = thisWeek.find((x) => x.id === id);
  if (h) {
    if (walk.skipped.includes(id)) return skipped(h);
    if (day === "mon") return monday(h, walk);
    return {
      ...later[id](h, day, walk),
      outreachSent: sentEarly(h, walk) ? "Sent Monday." : "Sent Tuesday at 9:00 AM.",
    };
  }
  return earlierWeeks[id]?.(day, walk) ?? firstCardWeeks[id]?.(day, walk) ?? null;
}
