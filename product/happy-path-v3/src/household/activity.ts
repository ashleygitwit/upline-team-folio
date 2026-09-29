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
import type { Walk } from "@/walk";

/** A phase's modal, opened from the drawer's banner or from a line in Recent activity. */
export type Phase = "outreach" | "nudge" | "shopping" | "results" | "closing";

/** What a banner or a line opens, the word it says it with, and for a nudge, which one. */
export type Opens = { phase: Phase; action: string; nudge?: string };

/**
 * One line in Recent activity. A big one needs Stacey, so it's drawn as a
 * card with `opens` as its button; any other line with `opens` has a link.
 */
export type Item = { when: string; label: string; detail?: string; opens?: Opens; big?: boolean };

/** The drawer's banner: blue when it needs Stacey, gray when it only says what's going on. */
export type Banner = { text: string; tone: "blue" | "gray"; opens?: Opens };

/** A shop in progress: each carrier, whether its quote is back, and when the results are due. */
export type Shop = { carriers: { name: string; back?: boolean }[]; due: string };

/**
 * Where a household stands on the walk's day, for its drawer: the stage over
 * its name, the banner, and Recent activity, which is what's coming up and
 * what has happened, newest first. The rest is what the phase modals say
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
  /** Once closed out, when and what Stacey wrote. */
  closed?: { when: string; note: string };
};

const stage = {
  reached: "Reached out",
  sent: "Rec sent",
  closed: "Closed",
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
            },
          ]),
      renewal(h.renews),
    ],
    past: [...(early ? [{ when: "Mon", label: "You sent the renewal email", opens: review }] : []), drafted, cameIn(h)],
    outreachSent: early ? "Sent Monday." : undefined,
  };
}

/** Skipped on Monday: Stacey is handling it herself, and the review's Undo brings it back. */
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
 * Up next; once Stacey sends it early or skips it, the banner says so until
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
    banner: { tone: "gray", text: `${n.what} scheduled for ${n.short} 9AM.`, opens: review },
    upNext: [{ when: `${n.goes ? dayShort[n.goes] : "Mon"} 9:00 AM`, label: `${n.what} goes out`, detail: n.why, opens: review }],
    past: [],
  };
}

/** The Callahans after Monday: shopped Wednesday, results Thursday, approved Thursday night, closed Friday. */
function callahanLater(h: Household, day: Day, walk: Walk): Activity {
  const pick = optionById(walk.pick);
  const ao = optionById("ao");
  const erie = options.find((o) => o.current)!;
  const carriers = ["Auto-Owners", "Erie", "Grange"];
  const renew = renewal(h.renews);
  const answered: Item[] = [
    { when: "Tue 7:40 PM", label: "Dana finished the questionnaire" },
    { when: "Tue 9:02 AM", label: "Dana opened the renewal email" },
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
        text: "Dana and Mike's Renewal Shopping Results have been updated.",
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
      banner: { tone: "gray", text: "Recommendation sent to Dana and Mike.", opens: resultsView },
      upNext: [renew],
      past: [sentRec, ...shopped],
    };
  }

  const approved: Item = {
    when: "Thu 6:20 PM",
    label: pick.current ? "Dana and Mike are staying with Erie" : `Dana and Mike approved ${pick.carrier}`,
  };
  const decided = [{ when: "Thu 6:12 PM", label: "Dana opened your recommendation" }, sentRec, ...shopped];

  if (!walk.bound) {
    return {
      stage: columnTitle("binding"),
      banner: {
        tone: "blue",
        text: pick.current
          ? "Dana and Mike are staying with Erie. Close it out."
          : `Dana and Mike approved ${pick.carrier}. Bind it before Nov 15.`,
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
          ? "Dana and Mike are staying with Erie. There's nothing to bind: Erie renews on its own on November 15."
          : `Dana and Mike approved ${pick.carrier} Thursday at 6:20 PM. Bind it in the ${pick.carrier} portal before November 15.`,
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
  callahan: callahanLater,

  okonkwo(h, day, walk) {
    const opened: Item[] = [
      { when: "Tue 11:20 AM", label: "Ife opened the renewal email", detail: "No questionnaire yet." },
      ...reachedOut(h, walk),
    ];
    const n = nudge("okonkwo-thu", day, walk);
    if (day === "wed") {
      return { stage: stage.reached, banner: n.banner, upNext: [...n.upNext, renewal(h.renews)], past: [...n.past, ...opened] };
    }
    const started: Item[] = [{ when: "Thu 10:05 AM", label: "Ife started the questionnaire" }, ...n.past, ...opened];
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
        { when: "Thu 7:50 PM", label: "Ife finished the questionnaire" },
        ...started,
      ],
    };
  },

  brennan(h, day, walk) {
    const started: Item[] = [{ when: "Tue 8:40 PM", label: "Ellen started the questionnaire" }, ...reachedOut(h, walk)];
    if (day === "wed") {
      return { stage: stage.reached, banner: null, upNext: [renewal(h.renews)], past: started };
    }
    const carriers = ["Auto-Owners", "Erie", "Grange"];
    const shopped: Item[] = [
      shopping("Thu 8:30 AM", carriers, true),
      { when: "Wed 9:15 PM", label: "Ellen finished the questionnaire" },
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

  rossi(h, day, walk) {
    const stopped: Item[] = [
      { when: "Tue 6:30 PM", label: "Gina stopped partway through the questionnaire", detail: "At the vehicles question." },
      { when: "Tue 6:10 PM", label: "Gina started the questionnaire" },
      ...reachedOut(h, walk),
    ];
    const first = nudge("rossi-thu", day, walk);
    if (day === "wed") {
      return { stage: stage.reached, banner: first.banner, upNext: [...first.upNext, renewal(h.renews)], past: stopped };
    }
    const next = nudge("rossi-mon", day, walk);
    return {
      stage: stage.reached,
      banner: next.banner,
      upNext: [...next.upNext, renewal(h.renews)],
      past: [
        ...next.past,
        { when: "Thu 11:00 AM", label: "Gina answered more, then stopped again", detail: "One question left." },
        ...first.past,
        ...stopped,
      ],
    };
  },

  miller(h, day, walk) {
    const n = nudge("miller-fri", day, walk);
    return {
      stage: stage.reached,
      banner: n.banner,
      upNext: [...n.upNext, renewal(h.renews)],
      past: [...n.past, ...reachedOut(h, walk)],
    };
  },

  nguyen(h, _day, walk) {
    return {
      stage: stage.closed,
      banner: null,
      upNext: [],
      past: [
        {
          when: "Tue 2:15 PM",
          label: "Chris replied: happy with Erie, no shop needed",
          detail: "Nothing else to do this time. Erie renews on its own.",
        },
        ...reachedOut(h, walk),
      ],
    };
  },
};

/* ------------------------------------------------------------------ *
 * Earlier weeks' six, as Ashley's board has them on Monday and as the
 * Policyholder List has them after, once Stacey clears them Monday
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

/** Results waiting on Monday. Stacey sends them from the drawer, or off-camera Monday afternoon. */
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
  patel: (day) =>
    shoppingEarlier(
      "Priya",
      day,
      "Oct 28",
      ["Auto-Owners", "Erie", "Grange"],
      { when: "Mon 7:15 AM", label: "Priya finished the questionnaire" },
      "Oct 6",
    ),

  brooks: (day) =>
    shoppingEarlier(
      "Kevin",
      day,
      "Oct 30",
      ["Erie", "Auto-Owners", "Grange"],
      { when: "Oct 11", label: "Kevin finished the questionnaire", detail: "One VIN is still missing." },
      "Oct 6",
    ),

  vasquez: (day, walk) => ({
    ...readyEarlier(
      "vasquez",
      day,
      walk,
      [
        shopping("Oct 7", ["Auto-Owners", "Grange", "Erie"], false),
        { when: "Oct 6", label: "Elena finished the questionnaire" },
        { when: "Oct 2", label: "Renewal email sent", opens: outreachView },
      ],
      { when: "Oct 9", label: "Shopping results came back" },
      (sent) => ({
        stage: stage.sent,
        banner: { tone: "gray", text: "Recommendation sent Monday. Waiting on Elena.", opens: resultsView },
        upNext: [renewal("Oct 22")],
        past: sent,
      }),
    ),
    outreachSent: "Sent October 2.",
  }),

  foss: (day, walk) => ({
    ...readyEarlier(
      "foss",
      day,
      walk,
      [
        shopping("Oct 6", ["Westfield", "Ohio Mutual", "Cincinnati"], false),
        { when: "Oct 5", label: "Raymond finished the questionnaire" },
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
            label: "Raymond is staying with Nationwide",
            detail: "Nothing to bind. Nationwide renews on its own.",
          },
          ...sent,
        ],
      }),
    ),
    outreachSent: "Sent October 2.",
  }),

  hart: (day, walk) => ({
    ...closingEarlier(
      "hart",
      day,
      walk,
      [
        { when: "Oct 8", label: "You sent the recommendation", detail: "Switch from Erie to Auto-Owners." },
        { when: "Oct 6", label: "Shopping results came back" },
        { when: "Oct 3", label: "Linda finished the questionnaire" },
        { when: "Oct 1", label: "Renewal email sent", opens: outreachView },
      ],
      { when: "Oct 9", label: "Linda approved Auto-Owners" },
      {
        banner: "Linda approved Auto-Owners. Bind it before Oct 18.",
        detail: "Bind it in the portal before October 18, then close it out.",
        sub: "Linda approved Auto-Owners on October 9. Bind it in the portal before October 18.",
        owes: ["Bind Auto-Owners in the portal"],
        done: "Bound with Auto-Owners.",
      },
    ),
    outreachSent: "Sent October 1.",
  }),

  desai: (day, walk) => ({
    ...closingEarlier(
      "desai",
      day,
      walk,
      [
        { when: "Oct 6", label: "You sent the recommendation", detail: "Stay with Westfield." },
        { when: "Oct 4", label: "Shopping results came back" },
        { when: "Sep 30", label: "Anika finished the questionnaire" },
        { when: "Sep 28", label: "Renewal email sent", opens: outreachView },
      ],
      { when: "Oct 8", label: "Anika is staying with Westfield" },
      {
        banner: "Anika is staying with Westfield. Bind it before Oct 16.",
        detail: "Bind the renewal and confirm the mortgagee clause before October 16, then close it out.",
        sub: "Anika is staying with Westfield. Bind the renewal and confirm the mortgagee clause before October 16.",
        owes: ["Bind Westfield", "Confirm mortgagee clause"],
        done: "Staying with Westfield.",
      },
    ),
    outreachSent: "Sent September 28.",
  }),
};

/**
 * A household's drawer on the walk's day, following what the presenter has
 * done: this week's six from Monday's email through the week's statuses and
 * nudges, and earlier weeks' six from Ashley's board on Monday to the
 * Policyholder List's stages after. `null` for anyone without a file.
 */
export function activityFor(id: string, day: Day, walk: Walk): Activity | null {
  const h = thisWeek.find((x) => x.id === id);
  if (h) {
    if (walk.skipped.includes(id)) return skipped(h);
    if (day === "mon") return monday(h, walk);
    return {
      ...later[id](h, day, walk),
      outreachSent: sentEarly(h, walk) ? "Sent Monday." : "Sent Tuesday at 9:00 AM.",
    };
  }
  return earlierWeeks[id]?.(day, walk) ?? null;
}
