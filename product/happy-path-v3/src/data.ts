/**
 * Everything the walk shows. The households, prices, household details and
 * the Pruitts' outreach and questionnaire copy come from Ashley's v2
 * (upline-happy-path-demo.html, Sept 22) so the same people carry across
 * versions. What v2 did not have is written here: the other five outreach
 * emails, the week's statuses by day, the Pruitts' shop results and talking
 * points, and the three households who left.
 */

export const agency = {
  name: "Harbor Point Insurance",
  short: "Harbor Point",
  phone: "(330) 555-0140",
  agent: {
    name: "Jenna Ruiz",
    first: "Jenna",
    initials: "JR",
    title: "Account Manager",
    email: "jenna@harborpointins.com",
  },
};

export const questionnaireUrl = "harborpoint.coverage-review.com/d/pruitt";
export const proposalUrl = "harborpoint.coverage-review.com/p/pruitt";

export type Day = "mon" | "wed" | "thu" | "fri";

/** The walk's days, in order. */
export const days: Day[] = ["mon", "wed", "thu", "fri"];

export const dayLabel: Record<Day, string> = {
  mon: "Monday, October 12",
  wed: "Wednesday, October 14",
  thu: "Thursday, October 15",
  fri: "Friday, October 16",
};

/** Each day's date, for counting down to a renewal. Monday's is the day the Monday email goes out. */
export const dayDate: Record<Day, Date> = {
  mon: new Date(2026, 9, 12),
  wed: new Date(2026, 9, 14),
  thu: new Date(2026, 9, 15),
  fri: new Date(2026, 9, 16),
};

/** The weekday on its own, for the homepage's greeting. */
export const dayName: Record<Day, string> = {
  mon: "Monday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
};

export type Status = { label: string; detail: string };

export type Policy = {
  line: string;
  short: string;
  current: number;
  renewal: number;
  detail: string;
};

export type Household = {
  id: string;
  name: string;
  first: string;
  lines: string;
  carrier: string;
  renews: string;
  renewsLong: string;
  was: number;
  now: number;
  /** Monday's one line on why the price moved. */
  why: string;
  /** The same household, as a colleague who prepped it would hand it over. */
  colleague: string;
  subject: string;
  email: string;
  address: string;
  phone: string;
  people: { name: string; role: string; note?: string }[];
  vehicles: string[];
  home?: string[];
  policies: Policy[];
  status: Record<Exclude<Day, "mon">, Status>;
};

const link = (id: string) => `https://harborpoint.coverage-review.com/d/${id}`;

/**
 * This week's six, in the order the list shows them: the biggest dollar
 * increase first, since that is who is most likely to shop on their own.
 */
export const thisWeek: Household[] = [
  {
    id: "pruitt",
    name: "Leah & Tom Pruitt",
    first: "Leah",
    lines: "Home + Auto",
    carrier: "Erie",
    renews: "Nov 15",
    renewsLong: "November 15",
    was: 4820,
    now: 5690,
    why: "Maya got her license in August. That's most of the jump, and it's all on the auto.",
    colleague:
      "Their premium increases by $870 this year, mostly because their daughter Maya got her license. Big year for them, and since their son Eli is about to go through the same thing a year from now, I'd mention that as something to consider when we look at new plans.",
    subject: "A heads up on your November 15 renewal",
    email: [
      "Hi Leah,",
      "Hope you and Tom are doing well. It's that time of year again, and I wanted to give you a heads up on where your renewal is coming in.",
      "Your home and auto renew on November 15 at $5,690, which is about $870 more than last year.",
      "Increases can come from a few different places: the market, a claim, or a change in coverage during the year. When one comes in like this, I'd like to shop it and see what else is out there for you.",
      "Before I can, there are a few details I need to confirm, especially Maya's driver's license number. It takes about five minutes:",
      `Answer a few quick questions → ${link("pruitt")}`,
      "Once I have your answers I'll get to work and come back to you well before the 15th.",
      "Jenna",
    ].join("\n\n"),
    address: "2214 Ridgewood Rd, Hudson, OH 44236",
    phone: "(330) 555-0194",
    people: [
      { name: "Leah Pruitt", role: "Named insured", note: "Primary contact" },
      { name: "Tom Pruitt", role: "Spouse", note: "Named insured" },
      { name: "Maya Pruitt", role: "Driver", note: "Licensed August 2026 · license number missing" },
      { name: "Eli Pruitt", role: "Son", note: "Age 15 · permit next year" },
    ],
    vehicles: ["2019 Honda CR-V", "2016 Toyota Camry"],
    home: ["Roof replaced 2024", "No trampoline", "No dog"],
    policies: [
      { line: "Homeowners (HO-3)", short: "Home", current: 1640, renewal: 1785, detail: "Dwelling $485,000 · $1,000 deductible" },
      { line: "Personal auto", short: "Auto", current: 3180, renewal: 3905, detail: "2 vehicles · 3 drivers" },
    ],
    status: {
      wed: { label: "Shopping", detail: "Leah finished the questionnaire Tuesday night. We're shopping Auto-Owners, Erie and Grange, back Thursday." },
      thu: { label: "Ready for you", detail: "Results are back. Auto-Owners came in $1,050 under Erie." },
      fri: { label: "Approved", detail: "Leah and Tom approved your pick Thursday evening." },
    },
  },
  {
    id: "adeyemi",
    name: "Tobi Adeyemi",
    first: "Tobi",
    lines: "Auto",
    carrier: "Grange",
    renews: "Nov 8",
    renewsLong: "November 8",
    was: 2344,
    now: 2860,
    why: "Grange rerated the Tesla. There are no accidents on file.",
    colleague:
      "Tobi's auto is up $516, and it isn't anything Tobi did: Grange rerated the Tesla. There are no accidents on file, so this one should shop well. I'd lead with that, since nobody likes paying more for nothing.",
    subject: "A heads up on your November 8 renewal",
    email: [
      "Hi Tobi,",
      "Hope you're doing well. I wanted to give you a heads up on where your auto renewal is coming in.",
      "It renews on November 8 at $2,860, which is about $516 more than last year. Most of that is Grange rerating the Tesla, not anything you did.",
      "When one comes in like this, I'd like to shop it and see what else is out there for you. There are a few details I need to confirm first. It takes about five minutes:",
      `Answer a few quick questions → ${link("adeyemi")}`,
      "Once I have your answers I'll get to work and come back to you well before the 8th.",
      "Jenna",
    ].join("\n\n"),
    address: "145 S Main St, Apt 4C, Akron, OH 44308",
    phone: "(330) 555-0118",
    people: [{ name: "Tobi Adeyemi", role: "Named insured" }],
    vehicles: ["2022 Tesla Model Y", "2015 Honda Civic"],
    policies: [
      { line: "Personal auto", short: "Auto", current: 2344, renewal: 2860, detail: "2 vehicles · 1 driver" },
    ],
    status: {
      wed: { label: "Opened", detail: "Tobi opened the email but hasn't started the questionnaire. We'll nudge Thursday." },
      thu: { label: "Started", detail: "Tobi started the questionnaire after this morning's nudge." },
      fri: { label: "Shopping", detail: "Tobi finished the questionnaire. We're shopping Erie, Auto-Owners and Grange, back Monday." },
    },
  },
  {
    id: "whitmore",
    name: "Doug & Carol Whitmore",
    first: "Doug",
    lines: "Home + Auto",
    carrier: "Auto-Owners",
    renews: "Nov 12",
    renewsLong: "November 12",
    was: 3614,
    now: 4120,
    why: "Auto-Owners raised rates in Ohio this summer. Nothing changed on their end.",
    colleague:
      "Doug and Carol are up $506 because Auto-Owners raised rates across Ohio this summer. Nothing changed on their end. They have a yellow Lab, so I'd make sure any new home quote doesn't exclude the dog.",
    subject: "A heads up on your November 12 renewal",
    email: [
      "Hi Doug,",
      "Hope you and Carol are doing well. It's that time of year again, and I wanted to give you a heads up on where your renewal is coming in.",
      "Your home and auto renew on November 12 at $4,120, which is about $506 more than last year. Auto-Owners raised rates across Ohio this summer, so this isn't anything on your end.",
      "I'd still like to shop it and see what else is out there for you. There are a few details I need to confirm first. It takes about five minutes:",
      `Answer a few quick questions → ${link("whitmore")}`,
      "Once I have your answers I'll get to work and come back to you well before the 12th.",
      "Jenna",
    ].join("\n\n"),
    address: "2208 Ridgewood Rd, Hudson, OH 44236",
    phone: "(330) 555-0162",
    people: [
      { name: "Doug Whitmore", role: "Named insured" },
      { name: "Carol Whitmore", role: "Spouse", note: "Named insured" },
    ],
    vehicles: ["2021 Ford F-150", "2018 Subaru Forester"],
    home: ["Roof replaced 2019", "No trampoline", "Dog: yellow Labrador"],
    policies: [
      { line: "Homeowners (HO-3)", short: "Home", current: 1520, renewal: 1740, detail: "Dwelling $410,000 · $1,000 deductible" },
      { line: "Personal auto", short: "Auto", current: 2094, renewal: 2380, detail: "2 vehicles · 2 drivers" },
    ],
    status: {
      wed: { label: "Started", detail: "Carol started the questionnaire last night." },
      thu: { label: "Shopping", detail: "Carol finished the questionnaire. We're shopping now, back Friday afternoon." },
      fri: { label: "Shopping", detail: "One carrier left to quote. Back this afternoon." },
    },
  },
  {
    id: "conti",
    name: "Marisa Conti",
    first: "Marisa",
    lines: "Home + Auto",
    carrier: "Ohio Mutual",
    renews: "Nov 4",
    renewsLong: "November 4",
    was: 3495,
    now: 3880,
    why: "Ohio Mutual is up 11% across the package. There are no claims on file.",
    colleague:
      "Marisa's home and auto are up $385, about 11% across the package, with no claims. It's the soonest renewal on the list, so if the questionnaire sits, I'd give Marisa a call on Thursday.",
    subject: "A heads up on your November 4 renewal",
    email: [
      "Hi Marisa,",
      "Hope you're doing well. I wanted to give you a heads up on where your renewal is coming in.",
      "Your home and auto renew on November 4 at $3,880, which is about $385 more than last year.",
      "When one comes in like this, I'd like to shop it and see what else is out there for you. There are a few details I need to confirm first. It takes about five minutes:",
      `Answer a few quick questions → ${link("conti")}`,
      "Once I have your answers I'll get to work and come back to you before the 4th.",
      "Jenna",
    ].join("\n\n"),
    address: "512 Crain Ave, Kent, OH 44240",
    phone: "(330) 555-0133",
    people: [{ name: "Marisa Conti", role: "Named insured" }],
    vehicles: ["2017 Jeep Grand Cherokee"],
    home: ["Roof replaced 2018", "No trampoline", "No dog"],
    policies: [
      { line: "Homeowners (HO-3)", short: "Home", current: 1410, renewal: 1560, detail: "Dwelling $290,000 · $1,000 deductible" },
      { line: "Personal auto", short: "Auto", current: 2085, renewal: 2320, detail: "1 vehicle · 1 driver" },
    ],
    status: {
      wed: { label: "Started", detail: "Marisa stopped at the vehicles question. We'll nudge Thursday." },
      thu: { label: "Started", detail: "Still one question left after this morning's nudge. We'll try again Monday." },
      fri: { label: "Started", detail: "Still one question left. We'll nudge again Monday." },
    },
  },
  {
    id: "lindqvist",
    name: "Jordan Lindqvist",
    first: "Jordan",
    lines: "Home + Umbrella",
    carrier: "Westfield",
    renews: "Nov 20",
    renewsLong: "November 20",
    was: 1780,
    now: 1940,
    why: "Up 9% on the house and the umbrella, with no claims. We'll offer to shop it, gently.",
    colleague:
      "Jordan and Casey are only up $160, so I kept this one soft: a shop if they want it, no pressure. They have a trampoline and a goldendoodle, so I'd keep the umbrella in anything we bring back.",
    subject: "A heads up on your November 20 renewal",
    email: [
      "Hi Jordan,",
      "Hope you and Casey are doing well. I wanted to give you a heads up on your renewal.",
      "Your home and umbrella renew on November 20 at $1,940, which is about $160 more than last year. That's a modest increase, but I'm happy to shop it if you'd like to see what else is out there.",
      "If so, there are a few details I need to confirm first. It takes about five minutes:",
      `Answer a few quick questions → ${link("lindqvist")}`,
      "If you're happy where you are, no need to do anything.",
      "Jenna",
    ].join("\n\n"),
    address: "640 Fairway Ln, Stow, OH 44224",
    phone: "(330) 555-0144",
    people: [
      { name: "Jordan Lindqvist", role: "Named insured" },
      { name: "Casey Lindqvist", role: "Spouse" },
    ],
    vehicles: [],
    home: ["Roof replaced 2021", "Trampoline", "Dog: goldendoodle"],
    policies: [
      { line: "Homeowners (HO-3)", short: "Home", current: 1280, renewal: 1390, detail: "Dwelling $365,000 · $2,500 deductible" },
      { line: "Personal umbrella", short: "Umbrella", current: 500, renewal: 550, detail: "$1M limit" },
    ],
    status: {
      wed: { label: "Sent", detail: "Not opened yet. A short follow-up goes Friday." },
      thu: { label: "Sent", detail: "Not opened yet. A short follow-up goes Friday." },
      fri: { label: "Sent", detail: "The follow-up went out this morning." },
    },
  },
  {
    id: "pham",
    name: "Andy Pham",
    first: "Andy",
    lines: "Auto",
    carrier: "Erie",
    renews: "Nov 18",
    renewsLong: "November 18",
    was: 1680,
    now: 1680,
    why: "Same price as last year. This email is a coverage check, not a price shop.",
    colleague:
      "Andy's auto came in at the same $1,680 as last year. I'd still send it: the Tacoma is six years old now, so it's a good moment to ask whether full coverage still makes sense on it.",
    subject: "Your November 18 renewal",
    email: [
      "Hi Andy,",
      "Hope you're doing well. Your auto renews on November 18 at $1,680, the same as last year.",
      "Even when the price holds, it's worth a quick look at your coverage and deductibles to make sure they still fit. If anything's changed, like a new car, a new driver or a move, this is the easiest time to tell me:",
      `Answer a few quick questions → ${link("pham")}`,
      "If nothing's changed, you don't need to do anything.",
      "Jenna",
    ].join("\n\n"),
    address: "31 Portage Trl, Cuyahoga Falls, OH 44221",
    phone: "(330) 555-0177",
    people: [{ name: "Andy Pham", role: "Named insured" }],
    vehicles: ["2020 Toyota Tacoma"],
    policies: [
      { line: "Personal auto", short: "Auto", current: 1680, renewal: 1680, detail: "1 vehicle · 1 driver" },
    ],
    status: {
      wed: { label: "Staying", detail: "Andy replied: happy with Erie, no shop needed. Nothing else to do this time." },
      thu: { label: "Staying", detail: "Andy replied: happy with Erie, no shop needed. Nothing else to do this time." },
      fri: { label: "Staying", detail: "Andy replied: happy with Erie, no shop needed. Nothing else to do this time." },
    },
  },
];

export const pruitt = thisWeek[0];

/**
 * What's scheduled once Tuesday's outreach has gone: the nudges and follow-ups
 * the week's statuses already mention, each keyed to its email in `nudges`.
 */
export type Upcoming = { id: string; nudge: string; what: string; when: string; why: string };

export const upcoming: Record<Exclude<Day, "mon">, Upcoming[]> = {
  wed: [
    { id: "adeyemi", nudge: "adeyemi-thu", what: "Nudge", when: "Thursday", why: "Tobi opened the email but hasn't started the questionnaire." },
    { id: "conti", nudge: "conti-thu", what: "Nudge", when: "Thursday", why: "Marisa stopped at the vehicles question." },
    { id: "lindqvist", nudge: "lindqvist-fri", what: "Follow-up", when: "Friday", why: "Jordan hasn't opened the email yet." },
  ],
  thu: [
    { id: "lindqvist", nudge: "lindqvist-fri", what: "Follow-up", when: "Friday", why: "Jordan hasn't opened the email yet." },
    { id: "conti", nudge: "conti-mon", what: "Nudge", when: "Monday", why: "Marisa still has one question left after this morning's nudge." },
  ],
  fri: [{ id: "conti", nudge: "conti-mon", what: "Nudge", when: "Monday", why: "Marisa still has one question left." }],
};

/**
 * A nudge or follow-up and the email it sends, which Jenna can review from
 * the household's drawer. Each goes at 9:00 AM on `goes`, or next Monday,
 * after the walk, when that's null. `short` is its day as the drawer's
 * banner says Tuesday's email ("Tues 9AM").
 */
export type Nudge = {
  key: string;
  id: string;
  what: "Nudge" | "Follow-up";
  goes: Day | null;
  short: string;
  why: string;
  subject: string;
  email: string;
};

export const nudges: Nudge[] = [
  {
    key: "adeyemi-thu",
    id: "adeyemi",
    what: "Nudge",
    goes: "thu",
    short: "Thurs",
    why: "Tobi opened the email but hasn't started the questionnaire.",
    subject: "Re: A heads up on your November 8 renewal",
    email: [
      "Hi Tobi,",
      "Just bumping this up in case it got buried. Your auto renews on November 8, and I'd like to shop it before then, since most of the increase is Grange rerating the Tesla.",
      "The questions take about five minutes:",
      `Answer a few quick questions → ${link("adeyemi")}`,
      "Jenna",
    ].join("\n\n"),
  },
  {
    key: "conti-thu",
    id: "conti",
    what: "Nudge",
    goes: "thu",
    short: "Thurs",
    why: "Marisa stopped at the vehicles question.",
    subject: "Re: A heads up on your November 4 renewal",
    email: [
      "Hi Marisa,",
      "You got most of the way through the questions. There's just the vehicles part left, and then I can start shopping your home and auto before November 4.",
      `Pick up where you left off → ${link("conti")}`,
      "Jenna",
    ].join("\n\n"),
  },
  {
    key: "conti-mon",
    id: "conti",
    what: "Nudge",
    goes: null,
    short: "Mon",
    why: "Marisa still has one question left.",
    subject: "Re: A heads up on your November 4 renewal",
    email: [
      "Hi Marisa,",
      "You're one question away. Once it's in, I'll shop your home and auto right away, which still gives us time before November 4.",
      `Finish the last question → ${link("conti")}`,
      "If it's easier, reply here and I'll give you a call.",
      "Jenna",
    ].join("\n\n"),
  },
  {
    key: "lindqvist-fri",
    id: "lindqvist",
    what: "Follow-up",
    goes: "fri",
    short: "Fri",
    why: "Jordan hasn't opened the email yet.",
    subject: "Re: A heads up on your November 20 renewal",
    email: [
      "Hi Jordan,",
      "A quick follow-up on my note about your November 20 renewal. It's up about $160 this year. If you'd like me to shop it, the questions take about five minutes:",
      `Answer a few quick questions → ${link("lindqvist")}`,
      "If you're happy where you are, no need to do anything.",
      "Jenna",
    ].join("\n\n"),
  },
];

export const nudgeByKey = (key: string) => nudges.find((n) => n.key === key)!;

export type Left = {
  id: string;
  name: string;
  lines: string;
  date: string;
  when: string;
  what: string;
  short: string;
  winBack: boolean;
};

export const whoLeft: Left[] = [
  {
    id: "hollis",
    name: "Derek Hollis",
    lines: "Auto · Grange",
    date: "Sep 28",
    when: "Renewal passed September 28",
    what: "Went with Progressive directly. Marcus answered the questionnaire and then stopped replying.",
    short: "Went with Progressive",
    winBack: true,
  },
  {
    id: "sato",
    name: "Glen Sato",
    lines: "Home · Westfield",
    date: "Oct 3",
    when: "Renewal passed October 3",
    what: "Renewed somewhere else. Tom never opened the email or the follow-up.",
    short: "Renewed somewhere else",
    winBack: true,
  },
  {
    id: "bianchi",
    name: "Rita & Paul Bianchi",
    lines: "Home + Auto · Erie",
    date: "Sep 21",
    when: "Renewal passed September 21",
    what: "Moved to Arizona in September.",
    short: "Moved to Arizona",
    winBack: false,
  },
];

export type Earlier = {
  id: string;
  name: string;
  lines: string;
  renews: string;
  mon: string;
  later: string;
  /**
   * Where this household sits on Monday's homepage, if it needs Jenna then:
   * a recommendation ready to send, or an approval to bind. These follow
   * Ashley's v2 board. Jenna clears them Monday afternoon, off-camera, so
   * from Wednesday they're in `later`'s state and off the homepage.
   */
  monday?: { section: "shopped" | "closing"; detail: string };
};

/** Earlier weeks, for the Everyone list and Monday's homepage. */
export const earlier: Earlier[] = [
  { id: "rao", name: "Neha Rao", lines: "Home + Auto · Erie", renews: "Oct 28", mon: "Shopping, back Tuesday", later: "Recommendation sent Tuesday" },
  { id: "yates", name: "Marcus Yates", lines: "Auto · Grange", renews: "Oct 30", mon: "Shopping, back Tuesday", later: "Recommendation sent Tuesday" },
  {
    id: "marin",
    name: "Sofia Marin",
    lines: "Home + Auto · Travelers",
    renews: "Oct 22",
    mon: "Recommendation ready to send",
    later: "Waiting on Sofia",
    monday: {
      section: "shopped",
      detail: "Auto-Owners came in at $3,480 for the same coverage, $730 less than Travelers' renewal.",
    },
  },
  {
    id: "kemp",
    name: "Walter Kemp",
    lines: "Home · Nationwide",
    renews: "Oct 24",
    mon: "Recommendation ready to send",
    later: "Staying with Nationwide",
    monday: {
      section: "shopped",
      detail: "The pick is staying with Nationwide at $2,840. Westfield is a little cheaper, but the coverage he has is the better fit.",
    },
  },
  {
    id: "mercer",
    name: "Diane Mercer",
    lines: "Home + Auto · Erie",
    renews: "Oct 18",
    mon: "Approved Auto-Owners, not bound",
    later: "Bound with Auto-Owners",
    monday: {
      section: "closing",
      detail: "Diane approved Auto-Owners. Bind it in the portal before October 18.",
    },
  },
  {
    id: "iyer",
    name: "Rhea Iyer",
    lines: "Home · Westfield",
    renews: "Oct 16",
    mon: "Staying with Westfield, not bound",
    later: "Staying with Westfield",
    monday: {
      section: "closing",
      detail: "Rhea is staying with Westfield. Bind the renewal and confirm the mortgagee clause before October 16.",
    },
  },
];

/**
 * Earlier weeks' households that need Jenna on Monday, soonest renewal first.
 * The Monday email and the homepage list them the same way, in one section.
 */
export const mondayNeeds = () =>
  earlier
    .filter((e) => e.monday)
    .sort((a, b) => Date.parse(`${a.renews} 2026`) - Date.parse(`${b.renews} 2026`));

/* ------------------------------------------------------------------ *
 * The Pruitts' shop
 * ------------------------------------------------------------------ */

export type PickId = "ao" | "grange" | "erie";

export type Option = {
  id: PickId;
  carrier: string;
  price: number;
  tag: string;
  current?: boolean;
  /** One line for Leah's page on what changes. */
  change: string;
};

export const options: Option[] = [
  { id: "ao", carrier: "Auto-Owners", price: 4640, tag: "Same coverage", change: "Everything else stays the same." },
  { id: "grange", carrier: "Grange", price: 5210, tag: "$2,500 home deductible", change: "Your home deductible would go from $1,000 to $2,500." },
  { id: "erie", carrier: "Erie", price: 5690, tag: "Current carrier", current: true, change: "Nothing changes on your policy." },
];

export const optionById = (id: PickId) => options.find((o) => o.id === id)!;

export const talkingPoints = [
  "Auto-Owners will write the same home and auto for $4,640. That's $1,050 back this year, which more than covers Erie's $870 increase.",
  "Paid monthly, that's about $88 less each month than the Erie renewal.",
  "Maya rates cleanly as a new driver with Auto-Owners, so most of the savings are on the auto.",
  "Grange came in at $5,210, but it moves the home deductible to $2,500. That's the tradeoff behind the closer number.",
  "Nothing else on the household needed to change: same limits, same deductibles, and replacement cost on the roof.",
];

/** `null` means the same as Erie today. */
export const numbers: { label: string; erie: string; ao: string | null; grange: string | null }[] = [
  { label: "Annual premium", erie: "$5,690", ao: "$4,640", grange: "$5,210" },
  { label: "Home deductible", erie: "$1,000", ao: null, grange: "$2,500" },
  { label: "Dwelling", erie: "$485,000", ao: null, grange: null },
  { label: "Auto liability", erie: "100/300", ao: null, grange: null },
  { label: "Comp / collision", erie: "$500 / $500", ao: null, grange: null },
  { label: "Roof settlement", erie: "Replacement cost", ao: null, grange: null },
];

export const recSubject = "I looked at your November renewal";

export const recEmails: Record<PickId, string> = {
  ao: [
    "Hi Leah,",
    "I shopped your home and auto ahead of November 15. Auto-Owners came back at $4,640 for the same coverage you have with Erie, about $1,050 less than the renewal offer.",
    "Maya rates cleanly, and nothing else on the household needed to change. I put the details on a short page so you can see the pick and why I didn't go another direction:",
    `See the details → https://${proposalUrl}`,
    "This does not put coverage in place. Reply to this email with a couple of times that work this week and I'll call you to walk it through.",
    "Jenna",
  ].join("\n\n"),
  grange: [
    "Hi Leah,",
    "I shopped your home and auto ahead of November 15. Grange came back at $5,210, about $480 less than Erie's renewal. The tradeoff is the home deductible, which would go from $1,000 to $2,500.",
    "I put the details on a short page so you can see the numbers side by side:",
    `See the details → https://${proposalUrl}`,
    "This does not put coverage in place. Reply with a couple of times that work this week and I'll call you to walk it through.",
    "Jenna",
  ].join("\n\n"),
  erie: [
    "Hi Leah,",
    "I shopped your home and auto ahead of November 15. Erie's renewal is $5,690. The other quotes came in, and staying put is on the table if that's what you'd like to do.",
    "I put what came back on a short page:",
    `See the details → https://${proposalUrl}`,
    "This doesn't change anything on your policy. Reply if you'd like me to walk you through the other quotes.",
    "Jenna",
  ].join("\n\n"),
};

export type Quote = {
  id: string;
  carrier: string;
  title: string;
  filename: string;
  premium: string;
  current?: boolean;
  rows: { label: string; value: string }[];
};

export const quotes: Quote[] = [
  {
    id: "erie-home",
    carrier: "Erie",
    title: "Homeowners renewal",
    filename: "Erie_HO3_renewal.pdf",
    premium: "$1,785",
    current: true,
    rows: [
      { label: "Named insured", value: "Leah Pruitt" },
      { label: "Dwelling", value: "$485,000" },
      { label: "Deductible", value: "$1,000" },
      { label: "Liability", value: "$300,000" },
      { label: "Roof settlement", value: "Replacement cost" },
      { label: "Effective", value: "November 15, 2026" },
    ],
  },
  {
    id: "erie-auto",
    carrier: "Erie",
    title: "Personal auto renewal",
    filename: "Erie_auto_renewal.pdf",
    premium: "$3,905",
    current: true,
    rows: [
      { label: "Named insured", value: "Leah Pruitt" },
      { label: "Liability", value: "100/300" },
      { label: "Comp / collision", value: "$500 / $500" },
      { label: "Drivers", value: "Leah, Tom, Maya" },
      { label: "Vehicles", value: "2019 Honda CR-V · 2016 Toyota Camry" },
      { label: "Effective", value: "November 15, 2026" },
    ],
  },
  {
    id: "ao",
    carrier: "Auto-Owners",
    title: "Home and auto quote",
    filename: "AutoOwners_HA_quote.pdf",
    premium: "$4,640",
    rows: [
      { label: "Named insured", value: "Leah Pruitt" },
      { label: "Dwelling", value: "$485,000" },
      { label: "Home deductible", value: "$1,000" },
      { label: "Auto liability", value: "100/300" },
      { label: "Comp / collision", value: "$500 / $500" },
      { label: "Quoted", value: "October 15, 2026" },
    ],
  },
  {
    id: "grange",
    carrier: "Grange",
    title: "Home and auto quote",
    filename: "Grange_HA_quote.pdf",
    premium: "$5,210",
    rows: [
      { label: "Named insured", value: "Leah Pruitt" },
      { label: "Dwelling", value: "$485,000" },
      { label: "Home deductible", value: "$2,500" },
      { label: "Auto liability", value: "100/300" },
      { label: "Comp / collision", value: "$500 / $500" },
      { label: "Quoted", value: "October 15, 2026" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Leah's questionnaire
 * ------------------------------------------------------------------ */

export const changeChoices = [
  { id: "sophie", label: "A new driver in the household", checked: true },
  { id: "vehicle", label: "A vehicle we don't have on file" },
  { id: "roof", label: "Roof work in the last few years" },
  { id: "dog", label: "A dog in the household" },
];

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
