/**
 * Everything the walk shows. The households, prices, household details and
 * the Callahans' outreach and questionnaire copy come from Ashley's v2
 * (upline-happy-path-demo.html, Sept 22) so the same people carry across
 * versions. What v2 did not have is written here: the other five outreach
 * emails, the week's statuses by day, the Callahans' shop results and talking
 * points, the three households who left, and the Callahans' profile: their
 * history before this week and Dana's questionnaire answers.
 */

export const agency = {
  name: "Stockton Hill Insurance",
  short: "Stockton Hill",
  phone: "(614) 555-0140",
  agent: {
    name: "Stacey Cole",
    first: "Stacey",
    initials: "SC",
    title: "Account Manager",
    email: "stacey@stocktonhillins.com",
  },
};

export const questionnaireUrl = "stocktonhill.coverage-review.com/d/callahan";
export const proposalUrl = "stocktonhill.coverage-review.com/p/callahan";

export type Day = "mon" | "wed" | "thu" | "fri";

/** The walk's days, in order. */
export const days: Day[] = ["mon", "wed", "thu", "fri"];

export const dayLabel: Record<Day, string> = {
  mon: "Monday, October 12",
  wed: "Wednesday, October 14",
  thu: "Thursday, October 15",
  fri: "Friday, October 16",
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

const link = (id: string) => `https://stocktonhill.coverage-review.com/d/${id}`;

/**
 * This week's six, in the order the list shows them: the biggest dollar
 * increase first, since that is who is most likely to shop on their own.
 */
export const thisWeek: Household[] = [
  {
    id: "callahan",
    name: "Dana & Mike Callahan",
    first: "Dana",
    lines: "Home + Auto",
    carrier: "Erie",
    renews: "Nov 15",
    renewsLong: "November 15",
    was: 4820,
    now: 5690,
    why: "Sophie got her license in August. That's most of the jump, and it's all on the auto.",
    colleague:
      "Their premium increases by $870 this year, mostly because their daughter Sophie got her license. Big year for them, and since their son Owen is about to go through the same thing a year from now, I'd mention that as something to consider when we look at new plans.",
    subject: "A heads up on your November 15 renewal",
    email: [
      "Hi Dana,",
      "Hope you and Mike are doing well. It's that time of year again, and I wanted to give you a heads up on where your renewal is coming in.",
      "Your home and auto renew on November 15 at $5,690, which is about $870 more than last year.",
      "Increases can come from a few different places: the market, a claim, or a change in coverage during the year. When one comes in like this, I'd like to shop it and see what else is out there for you.",
      "Before I can, there are a few details I need to confirm, especially Sophie's driver's license number. It takes about five minutes:",
      `Answer a few quick questions → ${link("callahan")}`,
      "Once I have your answers I'll get to work and come back to you well before the 15th.",
      "Stacey",
    ].join("\n\n"),
    address: "418 Walnut Ave, Dublin, OH 43017",
    phone: "(614) 555-0194",
    people: [
      { name: "Dana Callahan", role: "Named insured", note: "Primary contact" },
      { name: "Mike Callahan", role: "Spouse", note: "Named insured" },
      { name: "Sophie Callahan", role: "Driver", note: "Licensed August 2026 · license number missing" },
      { name: "Owen Callahan", role: "Son", note: "Age 15 · permit next year" },
    ],
    vehicles: ["2019 Honda CR-V", "2016 Toyota Camry"],
    home: ["Roof replaced 2024", "No trampoline", "No dog"],
    policies: [
      { line: "Homeowners (HO-3)", short: "Home", current: 1640, renewal: 1785, detail: "Dwelling $485,000 · $1,000 deductible" },
      { line: "Personal auto", short: "Auto", current: 3180, renewal: 3905, detail: "2 vehicles · 3 drivers" },
    ],
    status: {
      wed: { label: "Shopping", detail: "Dana finished the questionnaire Tuesday night. We're shopping Auto-Owners, Erie and Grange, back Thursday." },
      thu: { label: "Ready for you", detail: "Results are back. Auto-Owners came in $1,050 under Erie." },
      fri: { label: "Approved", detail: "Dana and Mike approved your pick Thursday evening." },
    },
  },
  {
    id: "okonkwo",
    name: "Ife Okonkwo",
    first: "Ife",
    lines: "Auto",
    carrier: "Grange",
    renews: "Nov 8",
    renewsLong: "November 8",
    was: 2344,
    now: 2860,
    why: "Grange rerated the Tesla. There are no accidents on file.",
    colleague:
      "Ife's auto is up $516, and it isn't anything Ife did: Grange rerated the Tesla. There are no accidents on file, so this one should shop well. I'd lead with that, since nobody likes paying more for nothing.",
    subject: "A heads up on your November 8 renewal",
    email: [
      "Hi Ife,",
      "Hope you're doing well. I wanted to give you a heads up on where your auto renewal is coming in.",
      "It renews on November 8 at $2,860, which is about $516 more than last year. Most of that is Grange rerating the Tesla, not anything you did.",
      "When one comes in like this, I'd like to shop it and see what else is out there for you. There are a few details I need to confirm first. It takes about five minutes:",
      `Answer a few quick questions → ${link("okonkwo")}`,
      "Once I have your answers I'll get to work and come back to you well before the 8th.",
      "Stacey",
    ].join("\n\n"),
    address: "88 N High St, Apt 12B, Columbus, OH 43215",
    phone: "(614) 555-0118",
    people: [{ name: "Ife Okonkwo", role: "Named insured" }],
    vehicles: ["2022 Tesla Model Y", "2015 Honda Civic"],
    policies: [
      { line: "Personal auto", short: "Auto", current: 2344, renewal: 2860, detail: "2 vehicles · 1 driver" },
    ],
    status: {
      wed: { label: "Opened", detail: "Ife opened the email but hasn't started the questionnaire. We'll nudge Thursday." },
      thu: { label: "Started", detail: "Ife started the questionnaire after this morning's nudge." },
      fri: { label: "Shopping", detail: "Ife finished the questionnaire. We're shopping Erie, Auto-Owners and Grange, back Monday." },
    },
  },
  {
    id: "brennan",
    name: "Pat & Ellen Brennan",
    first: "Pat",
    lines: "Home + Auto",
    carrier: "Auto-Owners",
    renews: "Nov 12",
    renewsLong: "November 12",
    was: 3614,
    now: 4120,
    why: "Auto-Owners raised rates in Ohio this summer. Nothing changed on their end.",
    colleague:
      "Pat and Ellen are up $506 because Auto-Owners raised rates across Ohio this summer. Nothing changed on their end. They have a yellow Lab, so I'd make sure any new home quote doesn't exclude the dog.",
    subject: "A heads up on your November 12 renewal",
    email: [
      "Hi Pat,",
      "Hope you and Ellen are doing well. It's that time of year again, and I wanted to give you a heads up on where your renewal is coming in.",
      "Your home and auto renew on November 12 at $4,120, which is about $506 more than last year. Auto-Owners raised rates across Ohio this summer, so this isn't anything on your end.",
      "I'd still like to shop it and see what else is out there for you. There are a few details I need to confirm first. It takes about five minutes:",
      `Answer a few quick questions → ${link("brennan")}`,
      "Once I have your answers I'll get to work and come back to you well before the 12th.",
      "Stacey",
    ].join("\n\n"),
    address: "412 Walnut Ave, Dublin, OH 43017",
    phone: "(614) 555-0162",
    people: [
      { name: "Pat Brennan", role: "Named insured" },
      { name: "Ellen Brennan", role: "Spouse", note: "Named insured" },
    ],
    vehicles: ["2021 Ford F-150", "2018 Subaru Forester"],
    home: ["Roof replaced 2019", "No trampoline", "Dog: yellow Labrador"],
    policies: [
      { line: "Homeowners (HO-3)", short: "Home", current: 1520, renewal: 1740, detail: "Dwelling $410,000 · $1,000 deductible" },
      { line: "Personal auto", short: "Auto", current: 2094, renewal: 2380, detail: "2 vehicles · 2 drivers" },
    ],
    status: {
      wed: { label: "Started", detail: "Ellen started the questionnaire last night." },
      thu: { label: "Shopping", detail: "Ellen finished the questionnaire. We're shopping now, back Friday afternoon." },
      fri: { label: "Shopping", detail: "One carrier left to quote. Back this afternoon." },
    },
  },
  {
    id: "rossi",
    name: "Gina Rossi",
    first: "Gina",
    lines: "Home + Auto",
    carrier: "Ohio Mutual",
    renews: "Nov 4",
    renewsLong: "November 4",
    was: 3495,
    now: 3880,
    why: "Ohio Mutual is up 11% across the package. There are no claims on file.",
    colleague:
      "Gina's home and auto are up $385, about 11% across the package, with no claims. It's the soonest renewal on the list, so if the questionnaire sits, I'd give Gina a call on Thursday.",
    subject: "A heads up on your November 4 renewal",
    email: [
      "Hi Gina,",
      "Hope you're doing well. I wanted to give you a heads up on where your renewal is coming in.",
      "Your home and auto renew on November 4 at $3,880, which is about $385 more than last year.",
      "When one comes in like this, I'd like to shop it and see what else is out there for you. There are a few details I need to confirm first. It takes about five minutes:",
      `Answer a few quick questions → ${link("rossi")}`,
      "Once I have your answers I'll get to work and come back to you before the 4th.",
      "Stacey",
    ].join("\n\n"),
    address: "740 S 3rd St, Columbus, OH 43206",
    phone: "(614) 555-0133",
    people: [{ name: "Gina Rossi", role: "Named insured" }],
    vehicles: ["2017 Jeep Grand Cherokee"],
    home: ["Roof replaced 2018", "No trampoline", "No dog"],
    policies: [
      { line: "Homeowners (HO-3)", short: "Home", current: 1410, renewal: 1560, detail: "Dwelling $290,000 · $1,000 deductible" },
      { line: "Personal auto", short: "Auto", current: 2085, renewal: 2320, detail: "1 vehicle · 1 driver" },
    ],
    status: {
      wed: { label: "Started", detail: "Gina stopped at the vehicles question. We'll nudge Thursday." },
      thu: { label: "Started", detail: "Still one question left after this morning's nudge. We'll try again Monday." },
      fri: { label: "Started", detail: "Still one question left. We'll nudge again Monday." },
    },
  },
  {
    id: "miller",
    name: "Sam Miller",
    first: "Sam",
    lines: "Home + Umbrella",
    carrier: "Westfield",
    renews: "Nov 20",
    renewsLong: "November 20",
    was: 1780,
    now: 1940,
    why: "Up 9% on the house and the umbrella, with no claims. We'll offer to shop it, gently.",
    colleague:
      "Sam and Alex are only up $160, so I kept this one soft: a shop if they want it, no pressure. They have a trampoline and a goldendoodle, so I'd keep the umbrella in anything we bring back.",
    subject: "A heads up on your November 20 renewal",
    email: [
      "Hi Sam,",
      "Hope you and Alex are doing well. I wanted to give you a heads up on your renewal.",
      "Your home and umbrella renew on November 20 at $1,940, which is about $160 more than last year. That's a modest increase, but I'm happy to shop it if you'd like to see what else is out there.",
      "If so, there are a few details I need to confirm first. It takes about five minutes:",
      `Answer a few quick questions → ${link("miller")}`,
      "If you're happy where you are, no need to do anything.",
      "Stacey",
    ].join("\n\n"),
    address: "210 Oakmont Dr, Powell, OH 43065",
    phone: "(614) 555-0144",
    people: [
      { name: "Sam Miller", role: "Named insured" },
      { name: "Alex Miller", role: "Spouse" },
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
    id: "nguyen",
    name: "Chris Nguyen",
    first: "Chris",
    lines: "Auto",
    carrier: "Erie",
    renews: "Nov 18",
    renewsLong: "November 18",
    was: 1680,
    now: 1680,
    why: "Same price as last year. This email is a coverage check, not a price shop.",
    colleague:
      "Chris's auto came in at the same $1,680 as last year. I'd still send it: the Tacoma is six years old now, so it's a good moment to ask whether full coverage still makes sense on it.",
    subject: "Your November 18 renewal",
    email: [
      "Hi Chris,",
      "Hope you're doing well. Your auto renews on November 18 at $1,680, the same as last year.",
      "Even when the price holds, it's worth a quick look at your coverage and deductibles to make sure they still fit. If anything's changed, like a new car, a new driver or a move, this is the easiest time to tell me:",
      `Answer a few quick questions → ${link("nguyen")}`,
      "If nothing's changed, you don't need to do anything.",
      "Stacey",
    ].join("\n\n"),
    address: "15 W 2nd Ave, Columbus, OH 43201",
    phone: "(614) 555-0177",
    people: [{ name: "Chris Nguyen", role: "Named insured" }],
    vehicles: ["2020 Toyota Tacoma"],
    policies: [
      { line: "Personal auto", short: "Auto", current: 1680, renewal: 1680, detail: "1 vehicle · 1 driver" },
    ],
    status: {
      wed: { label: "Staying", detail: "Chris replied: happy with Erie, no shop needed. Nothing else to do this time." },
      thu: { label: "Staying", detail: "Chris replied: happy with Erie, no shop needed. Nothing else to do this time." },
      fri: { label: "Staying", detail: "Chris replied: happy with Erie, no shop needed. Nothing else to do this time." },
    },
  },
];

export const callahan = thisWeek[0];

/** Initials for the list avatars: the first name and the family name. */
export const initials = (name: string) => {
  const parts = name.split(" ").filter((w) => w !== "&");
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

/**
 * What's scheduled once Tuesday's outreach has gone: the nudges and follow-ups
 * the week's statuses already mention. They are one line each because their
 * emails aren't written yet.
 */
export type Upcoming = { id: string; what: string; when: string; why: string };

export const upcoming: Record<Exclude<Day, "mon">, Upcoming[]> = {
  wed: [
    { id: "okonkwo", what: "Nudge", when: "Thursday", why: "Ife opened the email but hasn't started the questionnaire." },
    { id: "rossi", what: "Nudge", when: "Thursday", why: "Gina stopped at the vehicles question." },
    { id: "miller", what: "Follow-up", when: "Friday", why: "Sam hasn't opened the email yet." },
  ],
  thu: [
    { id: "miller", what: "Follow-up", when: "Friday", why: "Sam hasn't opened the email yet." },
    { id: "rossi", what: "Nudge", when: "Monday", why: "Gina still has one question left after this morning's nudge." },
  ],
  fri: [{ id: "rossi", what: "Nudge", when: "Monday", why: "Gina still has one question left." }],
};

/** How the agency is doing since the season's first outreach. */
export const retention = {
  since: "August 24",
  drafted: 81,
  sent: 79,
  stayed: 76,
  pct: 96,
  lastYearPct: 92,
  lifeLeads: 11,
};

/**
 * The overview's cards: what Stacey has been up to since the first renewals
 * went out, each said as one number and one sentence.
 */
export const activity = [
  {
    id: "outreach",
    eyebrow: "Outreach",
    figure: "79",
    label: "emails from your inbox",
    note: "We drafted 81, and you held two back to call yourself. That's what the skip is for.",
  },
  {
    id: "savings",
    eyebrow: "Shopping",
    figure: "$5,328",
    label: "back in your clients' pockets",
    note: "Nine of the 23 households we shopped switched, and they're saving $592 a year each on average.",
  },
  {
    id: "leads",
    eyebrow: "Cross-sell",
    figure: "11",
    label: "asked about a life quote",
    note: "They're with your sales team, and three already have a number.",
  },
];

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
    id: "webb",
    name: "Marcus Webb",
    lines: "Auto · Grange",
    date: "Sep 28",
    when: "Renewal passed September 28",
    what: "Went with Progressive directly. Marcus answered the questionnaire and then stopped replying.",
    short: "Went with Progressive",
    winBack: true,
  },
  {
    id: "reyes",
    name: "Tom Reyes",
    lines: "Home · Westfield",
    date: "Oct 3",
    when: "Renewal passed October 3",
    what: "Renewed somewhere else. Tom never opened the email or the follow-up.",
    short: "Renewed somewhere else",
    winBack: true,
  },
  {
    id: "dimarco",
    name: "Carla & Joe Dimarco",
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
   * Where this household sits on Monday's homepage, if it needs Stacey then:
   * a recommendation ready to send, or an approval to bind. These follow
   * Ashley's v2 board. Stacey clears them Monday afternoon, off-camera, so
   * from Wednesday they're in `later`'s state and off the homepage.
   */
  monday?: { section: "shopped" | "closing"; detail: string };
};

/** Earlier weeks, for the Everyone list and Monday's homepage. */
export const earlier: Earlier[] = [
  { id: "patel", name: "Priya Patel", lines: "Home + Auto · Erie", renews: "Oct 28", mon: "Shopping, back Tuesday", later: "Recommendation sent Tuesday" },
  { id: "brooks", name: "Kevin Brooks", lines: "Auto · Grange", renews: "Oct 30", mon: "Shopping, back Tuesday", later: "Recommendation sent Tuesday" },
  {
    id: "vasquez",
    name: "Elena Vasquez",
    lines: "Home + Auto · Travelers",
    renews: "Oct 22",
    mon: "Recommendation ready to send",
    later: "Waiting on Elena",
    monday: {
      section: "shopped",
      detail: "Auto-Owners came in at $3,480 for the same coverage, $730 less than Travelers' renewal. It doesn't send until you do.",
    },
  },
  {
    id: "foss",
    name: "Raymond Foss",
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
    id: "hart",
    name: "Linda Hart",
    lines: "Home + Auto · Erie",
    renews: "Oct 18",
    mon: "Approved Auto-Owners, not bound",
    later: "Bound with Auto-Owners",
    monday: {
      section: "closing",
      detail: "Linda approved Auto-Owners. Bind it in the portal before October 18, then mark it done.",
    },
  },
  {
    id: "desai",
    name: "Anika Desai",
    lines: "Home · Westfield",
    renews: "Oct 16",
    mon: "Staying with Westfield, not bound",
    later: "Staying with Westfield",
    monday: {
      section: "closing",
      detail: "Anika is staying with Westfield. Bind the renewal and confirm the mortgagee clause before October 16, then mark it done.",
    },
  },
];

/**
 * Earlier weeks' households that need Stacey on Monday in one section, soonest
 * renewal first. The Monday email and the homepage list them the same way.
 */
export const mondayNeeds = (section: "shopped" | "closing") =>
  earlier
    .filter((e) => e.monday?.section === section)
    .sort((a, b) => Date.parse(`${a.renews} 2026`) - Date.parse(`${b.renews} 2026`));

/* ------------------------------------------------------------------ *
 * The Callahans' shop
 * ------------------------------------------------------------------ */

export type PickId = "ao" | "grange" | "erie";

export type Option = {
  id: PickId;
  carrier: string;
  price: number;
  tag: string;
  current?: boolean;
  /** One line for Dana's page on what changes. */
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
  "Sophie rates cleanly as a new driver with Auto-Owners, so most of the savings are on the auto.",
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
    "Hi Dana,",
    "I shopped your home and auto ahead of November 15. Auto-Owners came back at $4,640 for the same coverage you have with Erie, about $1,050 less than the renewal offer.",
    "Sophie rates cleanly, and nothing else on the household needed to change. I put the details on a short page so you can see the pick and why I didn't go another direction:",
    `See the details → https://${proposalUrl}`,
    "This does not put coverage in place. Reply to this email with a couple of times that work this week and I'll call you to walk it through.",
    "Stacey",
  ].join("\n\n"),
  grange: [
    "Hi Dana,",
    "I shopped your home and auto ahead of November 15. Grange came back at $5,210, about $480 less than Erie's renewal. The tradeoff is the home deductible, which would go from $1,000 to $2,500.",
    "I put the details on a short page so you can see the numbers side by side:",
    `See the details → https://${proposalUrl}`,
    "This does not put coverage in place. Reply with a couple of times that work this week and I'll call you to walk it through.",
    "Stacey",
  ].join("\n\n"),
  erie: [
    "Hi Dana,",
    "I shopped your home and auto ahead of November 15. Erie's renewal is $5,690. The other quotes came in, and staying put is on the table if that's what you'd like to do.",
    "I put what came back on a short page:",
    `See the details → https://${proposalUrl}`,
    "This doesn't change anything on your policy. Reply if you'd like me to walk you through the other quotes.",
    "Stacey",
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
      { label: "Named insured", value: "Dana Callahan" },
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
      { label: "Named insured", value: "Dana Callahan" },
      { label: "Liability", value: "100/300" },
      { label: "Comp / collision", value: "$500 / $500" },
      { label: "Drivers", value: "Dana, Mike, Sophie" },
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
      { label: "Named insured", value: "Dana Callahan" },
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
      { label: "Named insured", value: "Dana Callahan" },
      { label: "Dwelling", value: "$485,000" },
      { label: "Home deductible", value: "$2,500" },
      { label: "Auto liability", value: "100/300" },
      { label: "Comp / collision", value: "$500 / $500" },
      { label: "Quoted", value: "October 15, 2026" },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Dana's questionnaire
 * ------------------------------------------------------------------ */

export const changeChoices = [
  { id: "sophie", label: "A new driver in the household", checked: true },
  { id: "vehicle", label: "A vehicle we don't have on file" },
  { id: "roof", label: "Roof work in the last few years" },
  { id: "dog", label: "A dog in the household" },
];

/* ------------------------------------------------------------------ *
 * The Callahans' profile
 * ------------------------------------------------------------------ */

/**
 * The Callahans before this week, newest first. Sophie's license and the roof
 * come from the household on file. The carrier history is invented so the
 * timeline has a change of provider to show.
 */
export type Past = { id: string; date: string; kind: string; title: string; detail: string };

export const callahanHistory: Past[] = [
  {
    id: "sophie",
    date: "Aug 2026",
    kind: "Updated details",
    title: "Sophie added as a driver",
    detail:
      "Sophie got her license in August and went on the auto policy as the third driver. Her license number was still missing, so it's the first thing this year's questionnaire asks for.",
  },
  {
    id: "roof",
    date: "2024",
    kind: "Updated details",
    title: "Roof replaced",
    detail: "Dana let us know the roof was replaced. Erie settles it at replacement cost.",
  },
  {
    id: "erie",
    date: "Nov 2023",
    kind: "Changed carriers",
    title: "Moved from Westfield to Erie",
    detail: "Home and auto moved together at renewal. Same limits and deductibles, written by Erie.",
  },
  {
    id: "joined",
    date: "Nov 2021",
    kind: "New client",
    title: "Joined Stockton Hill",
    detail: "Home and auto written with Westfield.",
  },
];

export const carrierHistory = [
  { carrier: "Erie", lines: "Home + Auto", span: "November 2023 to today" },
  { carrier: "Westfield", lines: "Home + Auto", span: "November 2021 to November 2023" },
];

/**
 * Dana's answers, as the profile shows them. The questionnaire in the walk
 * doesn't keep what the presenter types, so these are written here. `added`
 * is something we didn't have; `changed` replaces what was on file.
 */
export type Answer = { label: string; value: string; was?: string; change?: "added" | "changed" };

export const danaAnswers: { id: string; question: string; answers: Answer[] }[] = [
  {
    id: "contact",
    question: "Is this still the best way to reach you?",
    answers: [
      { label: "Name", value: "Dana Callahan" },
      { label: "Email", value: "dana@callahanfamily.com", was: "dana.callahan@gmail.com", change: "changed" },
      { label: "Phone", value: callahan.phone },
      { label: "Address", value: callahan.address },
    ],
  },
  {
    id: "changed",
    question: "Anything new we should know before we shop?",
    answers: [
      { label: "A new driver in the household", value: "Yes, Sophie" },
      { label: "A vehicle we don't have on file", value: "No" },
      { label: "Roof work in the last few years", value: "No" },
      { label: "A dog in the household", value: "No" },
    ],
  },
  {
    id: "license",
    question: "What's Sophie's driver's license number?",
    answers: [
      { label: "Sophie's license number", value: "RS104582", change: "added" },
      { label: "Sophie's occupation", value: "Student", change: "added" },
    ],
  },
  {
    id: "life",
    question: "Want a life insurance quote while we shop the rest?",
    answers: [{ label: "Life quote", value: "Yes, get me a number", change: "added" }],
  },
  {
    id: "referral",
    question: "Anyone else who should hear from us?",
    answers: [{ label: "Referral", value: "No one this time" }],
  },
];

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
