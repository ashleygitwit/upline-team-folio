// Synthetic happy-path household for the v2 product demo.
// Not a real Stockton Hill client. Numbers are illustrative.

export const agency = {
  name: "Stockton Hill Insurance",
  short: "Stockton Hill",
  agent: { name: "Stacey Cole", first: "Stacey", initials: "SC", title: "Account Manager" },
  owner: "Brandon Hill",
  carrierCount: 7,
  markets: ["Erie", "Auto-Owners", "Grange", "Ohio Mutual", "Westfield", "Cincinnati", "Nationwide"],
  questionnaireHost: "stocktonhill.coverage-review.com",
  phone: "(614) 555-0140",
  email: "stacey@stocktonhillins.com",
};

export const week = {
  label: "Week of October 12",
  monday: "Monday, October 12",
  sendAt: "Tuesday, October 13 at 9:00 AM",
  pullWindow: "30 to 45 days out",
  householdCount: 30,
};

export const client = {
  name: "Dana Callahan",
  first: "Dana",
  last: "Callahan",
  household: "The Callahans",
  initials: "DC",
  memberSince: 2018,
  address: "418 Walnut Ave, Dublin, OH 43017",
  email: "dana.callahan@gmail.com",
  phone: "(614) 555-0194",
  carrier: "Erie",
  renewalDate: "November 15, 2026",
  daysOut: 34,
  currentPremium: 4820,
  renewalPremium: 5690,
  changeAmt: 870,
  changePct: 18,
};

export const household = [
  { name: "Dana Callahan", role: "Named insured", initials: "DC", note: "Primary contact", dob: "04/11/1981", license: "On file" },
  { name: "Mike Callahan", role: "Spouse", initials: "MC", note: "Named insured", dob: "09/02/1979", license: "On file" },
  { name: "Sophie Callahan", role: "Driver", initials: "SC", note: "Licensed Aug 2026 · good student", dob: "06/18/2010", license: "DL# missing", flag: true },
];

export const policies = [
  {
    line: "Homeowners (HO-3)",
    short: "Home",
    carrier: "Erie",
    number: "Q34-8821941",
    renews: "November 15, 2026",
    currentPremium: 1640,
    renewalPremium: 1785,
    detail: "Dwelling $485,000 · $1,000 AOP deductible",
  },
  {
    line: "Personal Auto",
    short: "Auto",
    carrier: "Erie",
    number: "Q10-4419082",
    renews: "November 15, 2026",
    currentPremium: 3180,
    renewalPremium: 3905,
    detail: "2019 Honda CR-V · 2016 Toyota Camry · 3 drivers",
  },
];

export const contextFlags = [
  {
    tone: "gold",
    title: "Sophie is why the auto is up",
    body: "Licensed in August. Not a market increase. Her DL# is still missing, so we cannot shop auto until she answers.",
  },
  {
    tone: "indigo",
    title: "No life on file",
    body: "Two parents, a new driver. Cross-sell sits in the questionnaire. We do not fulfill life on day one; we still ask.",
  },
  {
    tone: "green",
    title: "Clean claims",
    body: "Nothing on the Claims tab. The $870 is the new driver, not a surcharge.",
  },
];

export const questionnaireUrl = `https://${agency.questionnaireHost}/d/callahan`;

export const outreachEmail = {
  subject: "A heads up on your November 15 renewal",
  to: `${client.name} <${client.email}>`,
  from: `${agency.agent.name}, ${agency.name}`,
};

export const outreachBody = [
  `Hi ${client.first},`,
  `Hope you and Mike are doing well. It's that time of year again, and I wanted to give you a heads up on where your renewal is coming in.`,
  `Your home and auto renew on November 15 at $5,690, which is about $870 more than last year.`,
  `Increases can come from a few different places, the market, a claim, or a change in coverage during the year. When one comes in like this, I'd like to shop it and see what else is out there for you.`,
  `Before I can, there are a few details I need to confirm, especially Sophie's driver's license number. It takes about five minutes:`,
  `Answer a few quick questions → ${questionnaireUrl}`,
  `Once I have your answers I'll get to work and come back to you well before the 15th.`,
];

export const questionnaireIntro = {
  headline: "Let's make sure we have a current picture before we shop",
  sub: `Your Erie home and auto renew ${client.renewalDate}. Please answer a few questions to make sure we have all your information up to date. This takes about 5 minutes.`,
  minutes: 5,
};

export const questionnaireSteps = [
  {
    id: "contact",
    section: "Confirm your info",
    kind: "confirm" as const,
    prompt: "Is this still the best way to reach you?",
    help: "We pre-filled this from your current policies. Fix anything that's out of date.",
  },
  {
    id: "changed",
    section: "What's changed",
    kind: "multi" as const,
    prompt: "Anything new we should know before we shop?",
    help: "Sophie was added in August. Tap anything else that applies.",
    choices: [
      { id: "sophie", label: "A new driver in the household" },
      { id: "vehicle", label: "A vehicle we don't have on file" },
      { id: "roof", label: "Roof work in the last few years" },
      { id: "dog", label: "A dog in the household" },
      { id: "none", label: "Nothing else has changed" },
    ],
  },
  {
    id: "dl",
    section: "Your household",
    kind: "text" as const,
    prompt: "What's Sophie's driver's license number?",
    help: "We need it to pull driving records when we quote. Occupation helps too, because companies use it to set price.",
    placeholder: "OH driver's license #",
  },
  {
    id: "life",
    section: "While we're looking",
    kind: "life" as const,
    prompt: "Want us to look at a life insurance quote while we shop the rest?",
    help: "No obligation. Interest and a coverage amount only. We will come back to it.",
    choices: [
      { id: "yes", label: "Yes, get me a number" },
      { id: "no", label: "No thanks" },
    ],
  },
  {
    id: "referral",
    section: "One last thing",
    kind: "referral" as const,
    prompt: "Anyone else who should hear from us the way you just did?",
    help: "A neighbor, a coworker, a family member who might want the same look at their renewal.",
  },
];

export const questionnaireAnswers = [
  { question: "Best way to reach you?", answer: "Confirmed. Email and mobile on file.", updated: false },
  { question: "What's changed?", answer: "Sophie licensed in August. Roof done in 2024.", updated: true },
  { question: "Sophie's DL#", answer: "OH SS 448217", updated: true, notInAms: true },
  { question: "Life quote?", answer: "Yes, looking at $500k", updated: true, notInAms: true },
  { question: "Anyone to refer?", answer: "Neighbor on Walnut, the Brennans", updated: true, notInAms: true },
];

export const talkingPoints = [
  {
    title: "Lead with Sophie, not the market",
    body: "The auto did not go up because Erie got greedy. A 16-year-old licensed in August is the whole story. Say that first so they don't think we missed it.",
  },
  {
    title: "Auto-Owners is the same coverage, less money",
    body: "Check, check, check, save. Liability, deductibles, and the bundle all match. $1,050 less than the Erie renewal.",
  },
  {
    title: "If they have room, Grange is the upsell",
    body: "Same price band as today, $250k/$500k liability and a cleaner umbrella path. We do not lead with it. If they want to stay close to what they have, Auto-Owners is the offer.",
  },
  {
    title: "Congratulate them",
    body: "Sophie just got her license. Say it. The household snapshot from the questionnaire rides along on purpose.",
  },
];

export const shopDiffs = [
  { label: "Annual premium", erie: "$5,690", owners: "$4,640", grange: "$5,210", same: false },
  { label: "Auto liability", erie: "100/300", owners: "100/300", grange: "250/500", same: false },
  { label: "Home AOP deductible", erie: "$1,000", owners: "$1,000", grange: "$1,000", same: true },
  { label: "Auto comp / collision", erie: "$500 / $500", owners: "$500 / $500", grange: "$500 / $500", same: true },
  { label: "Full tort", erie: "Yes", owners: "Yes", grange: "Yes", same: true },
  { label: "Roof settlement", erie: "Replacement", owners: "Replacement", grange: "Replacement", same: true },
];

export const carriers = [
  {
    id: "owners",
    name: "Auto-Owners",
    tag: "Recommended",
    role: "Parity · save",
    status: "winner" as const,
    total: 4640,
    home: 1710,
    auto: 2930,
    why: "Same coverage as Erie, $1,050 less. Sophie rates cleanly. This is the offer.",
  },
  {
    id: "grange",
    name: "Grange",
    tag: "Quoted",
    role: "Upsell",
    status: "quoted" as const,
    total: 5210,
    home: 1690,
    auto: 3520,
    why: "Higher auto liability and a cleaner path to umbrella. Still under the Erie renewal. Show only if they want more coverage.",
  },
  {
    id: "erie",
    name: "Erie",
    tag: "Current renewal",
    role: "Incumbent",
    status: "renewal" as const,
    total: 5690,
    home: 1785,
    auto: 3905,
    why: "Fine coverage, just priced for a new driver. We keep it on the agent's table so they can stay if they want the relationship.",
  },
];

export const savings = {
  perYear: 1050,
  pct: 18,
  erie: 5690,
  owners: 4640,
  grange: 5210,
};

export const proposalCompare = [
  { label: "Annual premium", current: "$5,690", rec: "$4,640", note: "$1,050 less if paid in full" },
  { label: "Home deductible", current: "$1,000", rec: "$1,000", note: "Same" },
  { label: "Auto liability", current: "100/300", rec: "100/300", note: "Same" },
  { label: "Comp / collision", current: "$500 / $500", rec: "$500 / $500", note: "Same" },
  { label: "Roof settlement", current: "Replacement", rec: "Replacement", note: "Same" },
  { label: "Full tort", current: "Yes", rec: "Yes", note: "Same" },
];

export const recEmail = {
  subject: "I looked at your November renewal",
  to: `${client.name} <${client.email}>`,
  from: `${agency.agent.name}, ${agency.name}`,
};

export const recEmailBody = [
  `Hi ${client.first},`,
  `I shopped your home and auto ahead of November 15. Auto-Owners came back at $4,640 for the same coverage you have with Erie, about $1,050 less than the renewal offer.`,
  `Sophie rates cleanly, and nothing else on the household needed to change. I put the details on a short page so you can see the pick and why I didn't go another direction.`,
  `This does not put coverage in place. Reply to this email with a couple of times that work this week and I'll call you to walk it through.`,
];

export const ruledOut = [
  {
    name: "Grange",
    why: "Came in close to what you pay today, with higher liability limits. A good fit if you want more coverage. Not the first offer when Auto-Owners already matches what you have and costs less.",
  },
  {
    name: "Staying with Erie",
    why: "Nothing wrong with the coverage. The number is just priced for a new driver, and Auto-Owners wrote Sophie without that jump.",
  },
];

export type QueueCol = "outreach" | "shopping" | "recommend" | "binding";
export type LineKind = "home" | "auto" | "umbrella";

export type QueueCard = {
  id: string;
  name: string;
  first: string;
  email: string;
  kinds: LineKind[];
  carrier: string;
  lines: string;
  renewal: string;
  daysOut: number;
  jumpPct: number;
  was: number;
  premium: number;
  note: string;
  col: QueueCol;
  target?: boolean;
  ageDays?: number;
  owes?: string[];
};

export const lineLabel: Record<LineKind, string> = {
  home: "Home",
  auto: "Auto",
  umbrella: "Umbrella",
};

export const queueCards: QueueCard[] = [
  { id: "callahan", name: "Dana & Mike Callahan", first: "Dana", email: "dana.callahan@gmail.com", kinds: ["home", "auto"], carrier: "Erie", lines: "Home + Auto · Erie", renewal: "Nov 15", daysOut: 34, jumpPct: 18, was: 4820, premium: 5690, note: "Sophie licensed in August. DL# missing.", col: "outreach", target: true },
  { id: "brennan", name: "Pat & Ellen Brennan", first: "Pat", email: "pat.brennan@gmail.com", kinds: ["home", "auto"], carrier: "Auto-Owners", lines: "Home + Auto · Auto-Owners", renewal: "Nov 12", daysOut: 31, jumpPct: 14, was: 3614, premium: 4120, note: "Neighbor on Walnut. Ready to send.", col: "outreach" },
  { id: "okonkwo", name: "Ife Okonkwo", first: "Ife", email: "ife.okonkwo@gmail.com", kinds: ["auto"], carrier: "Grange", lines: "Auto · Grange", renewal: "Nov 8", daysOut: 27, jumpPct: 22, was: 2344, premium: 2860, note: "Biggest jump this week.", col: "outreach" },
  { id: "miller", name: "Sam Miller", first: "Sam", email: "sam.miller@gmail.com", kinds: ["home", "umbrella"], carrier: "Westfield", lines: "Home + Umbrella · Westfield", renewal: "Nov 20", daysOut: 39, jumpPct: 9, was: 1780, premium: 1940, note: "Under 10%. Soft shop offer.", col: "outreach" },
  { id: "nguyen", name: "Chris Nguyen", first: "Chris", email: "chris.nguyen@gmail.com", kinds: ["auto"], carrier: "Erie", lines: "Auto · Erie", renewal: "Nov 18", daysOut: 37, jumpPct: 0, was: 1680, premium: 1680, note: "Flat. Coverage and deductibles.", col: "outreach" },
  { id: "rossi", name: "Gina Rossi", first: "Gina", email: "gina.rossi@gmail.com", kinds: ["home", "auto"], carrier: "Ohio Mutual", lines: "Home + Auto · Ohio Mutual", renewal: "Nov 4", daysOut: 23, jumpPct: 11, was: 3495, premium: 3880, note: "Held so Stacey can call first.", col: "outreach" },

  { id: "patel", name: "Priya Patel", first: "Priya", email: "priya.patel@gmail.com", kinds: ["home", "auto"], carrier: "Erie", lines: "Home + Auto · Erie", renewal: "Oct 28", daysOut: 16, jumpPct: 16, was: 4517, premium: 5240, note: "Questionnaire in yesterday. VA on Auto-Owners.", col: "shopping" },
  { id: "brooks", name: "Kevin Brooks", first: "Kevin", email: "kevin.brooks@gmail.com", kinds: ["auto"], carrier: "Grange", lines: "Auto · Grange", renewal: "Oct 30", daysOut: 18, jumpPct: 19, was: 2025, premium: 2410, note: "Waiting on a missing VIN.", col: "shopping" },

  { id: "vasquez", name: "Elena Vasquez", first: "Elena", email: "elena.vasquez@gmail.com", kinds: ["home", "auto"], carrier: "Travelers", lines: "Home + Auto · Travelers", renewal: "Oct 22", daysOut: 10, jumpPct: 18, was: 3568, premium: 4210, note: "Shop done. Rec does not auto-send.", col: "recommend" },
  { id: "foss", name: "Raymond Foss", first: "Raymond", email: "ray.foss@gmail.com", kinds: ["home"], carrier: "Nationwide", lines: "Home · Nationwide", renewal: "Oct 24", daysOut: 12, jumpPct: 11, was: 2559, premium: 2840, note: "Stay recommendation. Three options on the page.", col: "recommend" },

  { id: "hart", name: "Linda Hart", first: "Linda", email: "linda.hart@gmail.com", kinds: ["home", "auto"], carrier: "Erie", lines: "Home + Auto · Erie", renewal: "Oct 18", daysOut: 6, jumpPct: 12, was: 3536, premium: 3960, note: "Approved Monday. Not bound.", col: "binding", ageDays: 4, owes: ["Bind Auto-Owners in the portal", "Mark closed in Upline"] },
  { id: "desai", name: "Anika Desai", first: "Anika", email: "anika.desai@gmail.com", kinds: ["home"], carrier: "Westfield", lines: "Home · Westfield", renewal: "Oct 16", daysOut: 4, jumpPct: 8, was: 1593, premium: 1720, note: "Approved last week.", col: "binding", ageDays: 6, owes: ["Bind Westfield", "Confirm mortgagee clause", "Mark closed in Upline"] },
];

export type ChronoItem = { label: string; date: string; state: "done" | "now" | "soon"; detail?: string };
export type CovRow = { label: string; current: string; quotes: Record<string, string | true>; help?: string };
export type RecOption = { id: string; name: string; lines: string; price: number; current?: boolean; email?: string };
export type BiggestChange = { carrier: string; text: string };
export type QuoteDoc = {
  id: string;
  carrier: string;
  title: string;
  filename: string;
  current?: boolean;
  pages: { kicker: string; rows: { label: string; value: string }[]; note?: string }[];
};

export type HouseholdFile = {
  namedInsured: string;
  phone: string;
  address: string;
  people: { name: string; role: string; note?: string }[];
  vehicles: { year: string; make: string; model: string }[];
  policies: { line: string; carrier: string; current: number; renewal: number; detail: string; renews?: string }[];
  home?: { roof: string; trampoline: string; dog: string };
  driver?: string;
  shopCarriers?: string[];
  timeline?: ChronoItem[];
  rec?: {
    pick: string;
    summary: string;
    email: string;
    currentLabel: string;
    cols: { id: string; name: string }[];
    coverage: CovRow[];
    options: RecOption[];
    talkingPoints: string[];
    biggest: BiggestChange[];
    quotes: QuoteDoc[];
  };
  closing?: { title: string; sub: string; timeline: ChronoItem[] };
};

function zillow(address: string) {
  return `https://www.zillow.com/homes/${encodeURIComponent(address)}_rb/`;
}

function quotePdf({
  id, carrier, title, filename, current, premium, rows,
}: {
  id: string;
  carrier: string;
  title: string;
  filename: string;
  current?: boolean;
  premium: string;
  rows: { label: string; value: string }[];
}): QuoteDoc {
  return {
    id,
    carrier,
    title,
    filename,
    current,
    pages: [
      {
        kicker: "Page 1 · Quote summary",
        rows: [{ label: "Annual premium", value: premium }, ...rows],
        note: current
          ? "In-force renewal offer. Pulled from the carrier."
          : "Quote pulled directly from the carrier. Not a multi-rater estimate.",
      },
      {
        kicker: "Page 2 · Coverage detail",
        rows: rows.concat([
          { label: "Form", value: title },
          { label: "Pay plan", value: "Annual, paid in full" },
          { label: "Status", value: current ? "Renewal offer" : "Indication only" },
        ]),
        note: "Matching items are written out here so the page reads like the carrier document.",
      },
      {
        kicker: "Page 3 · Conditions",
        rows: [
          { label: "Binding", value: "This document does not put coverage in place." },
          { label: "Valid through", value: current ? "Renewal date" : "15 days from quote" },
          { label: "Produced for", value: "Stockton Hill Insurance" },
        ],
      },
    ],
  };
}

export const householdFiles: Record<string, HouseholdFile> = {
  callahan: {
    namedInsured: "Dana Callahan",
    phone: "(614) 555-0194",
    address: "418 Walnut Ave, Dublin, OH 43017",
    people: [
      { name: "Dana Callahan", role: "Named insured", note: "Primary contact" },
      { name: "Mike Callahan", role: "Spouse", note: "Named insured" },
      { name: "Sophie Callahan", role: "Driver", note: "Licensed Aug 2026 · DL# missing" },
    ],
    vehicles: [
      { year: "2019", make: "Honda", model: "CR-V" },
      { year: "2016", make: "Toyota", model: "Camry" },
    ],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Erie", current: 1640, renewal: 1785, detail: "Dwelling $485,000 · $1,000 AOP" },
      { line: "Personal auto", carrier: "Erie", current: 3180, renewal: 3905, detail: "2 vehicles · 3 drivers" },
    ],
    home: { roof: "Replaced 2024", trampoline: "No", dog: "No" },
    driver: "Sophie was licensed in August, which is causing the jump in Auto. There are no claims on file.",
    shopCarriers: ["Auto-Owners", "Erie", "Grange"],
    timeline: [
      { label: "You sent the outreach email", date: "Oct 13", state: "done" },
      { label: "Dana completed the questionnaire", date: "Oct 14", state: "done" },
      { label: "VA is shopping Auto-Owners, Erie, and Grange", date: "In progress", state: "now", detail: "Check back tomorrow for quotes." },
      { label: "Renewal date. Coverage needs to be in place.", date: "Nov 15", state: "soon" },
    ],
  },
  brennan: {
    namedInsured: "Pat Brennan",
    phone: "(614) 555-0162",
    address: "412 Walnut Ave, Dublin, OH 43017",
    people: [
      { name: "Pat Brennan", role: "Named insured" },
      { name: "Ellen Brennan", role: "Spouse", note: "Named insured" },
    ],
    vehicles: [
      { year: "2021", make: "Ford", model: "F-150" },
      { year: "2018", make: "Subaru", model: "Forester" },
    ],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Auto-Owners", current: 1520, renewal: 1740, detail: "Dwelling $410,000 · $1,000 AOP" },
      { line: "Personal auto", carrier: "Auto-Owners", current: 2094, renewal: 2380, detail: "2 vehicles · 2 drivers" },
    ],
    home: { roof: "Replaced 2019", trampoline: "No", dog: "Yes · yellow Labrador" },
    driver: "Auto-Owners filed a rate increase in Ohio this summer. There are no claims on file, and nothing changed on their end.",
  },
  okonkwo: {
    namedInsured: "Ife Okonkwo",
    phone: "(614) 555-0118",
    address: "88 N High St, Apt 12B, Columbus, OH 43215",
    people: [{ name: "Ife Okonkwo", role: "Named insured" }],
    vehicles: [
      { year: "2022", make: "Tesla", model: "Model Y" },
      { year: "2015", make: "Honda", model: "Civic" },
    ],
    policies: [
      { line: "Personal auto", carrier: "Grange", current: 2344, renewal: 2860, detail: "2 vehicles · 1 driver" },
    ],
    driver: "Two vehicles, one driver, and a 22% jump. Grange rerated the Tesla. There are no accidents on file.",
  },
  miller: {
    namedInsured: "Sam Miller",
    phone: "(614) 555-0144",
    address: "210 Oakmont Dr, Powell, OH 43065",
    people: [
      { name: "Sam Miller", role: "Named insured" },
      { name: "Alex Miller", role: "Spouse" },
    ],
    vehicles: [],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Westfield", current: 1280, renewal: 1390, detail: "Dwelling $365,000 · $2,500 AOP" },
      { line: "Personal umbrella", carrier: "Westfield", current: 500, renewal: 550, detail: "$1M limit" },
    ],
    home: { roof: "Replaced 2021", trampoline: "Yes", dog: "Yes · goldendoodle" },
    driver: "Westfield is up 9% on the house and the umbrella. Under 10%, and there are no claims. Soft shop is the offer.",
  },
  nguyen: {
    namedInsured: "Chris Nguyen",
    phone: "(614) 555-0177",
    address: "15 W 2nd Ave, Columbus, OH 43201",
    people: [{ name: "Chris Nguyen", role: "Named insured" }],
    vehicles: [{ year: "2020", make: "Toyota", model: "Tacoma" }],
    policies: [
      { line: "Personal auto", carrier: "Erie", current: 1680, renewal: 1680, detail: "1 vehicle · 1 driver" },
    ],
    driver: "Flat renewal. Same number as last year. This one is coverage and deductibles, not price.",
  },
  rossi: {
    namedInsured: "Gina Rossi",
    phone: "(614) 555-0133",
    address: "740 S 3rd St, Columbus, OH 43206",
    people: [{ name: "Gina Rossi", role: "Named insured" }],
    vehicles: [{ year: "2017", make: "Jeep", model: "Grand Cherokee" }],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Ohio Mutual", current: 1410, renewal: 1560, detail: "Dwelling $290,000 · $1,000 AOP" },
      { line: "Personal auto", carrier: "Ohio Mutual", current: 2085, renewal: 2320, detail: "1 vehicle · 1 driver" },
    ],
    home: { roof: "Replaced 2018", trampoline: "No", dog: "No" },
    driver: "Ohio Mutual is up 11% on the package. There are no claims on file. Stacey wanted to call first before we email.",
  },
  patel: {
    namedInsured: "Priya Patel",
    phone: "(614) 555-0188",
    address: "1022 Cambridge Blvd, Upper Arlington, OH 43221",
    people: [
      { name: "Priya Patel", role: "Named insured" },
      { name: "Raj Patel", role: "Spouse" },
      { name: "Asha Patel", role: "Driver", note: "Age 19" },
    ],
    vehicles: [
      { year: "2019", make: "Lexus", model: "RX 350" },
      { year: "2014", make: "Honda", model: "Odyssey" },
    ],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Erie", current: 1980, renewal: 2260, detail: "Dwelling $520,000 · $1,000 AOP" },
      { line: "Personal auto", carrier: "Erie", current: 2537, renewal: 2980, detail: "2 vehicles · 3 drivers" },
    ],
    home: { roof: "Replaced 2022", trampoline: "No", dog: "Yes · shih tzu" },
    shopCarriers: ["Auto-Owners", "Erie", "Grange"],
    timeline: [
      { label: "You sent the outreach email", date: "Oct 6", state: "done" },
      { label: "Priya completed the questionnaire", date: "Oct 12", state: "done" },
      { label: "VA is shopping Auto-Owners, Erie, and Grange", date: "In progress", state: "now", detail: "Check back tomorrow for quotes." },
      { label: "Renewal date. Coverage needs to be in place.", date: "Oct 28", state: "soon" },
    ],
  },
  brooks: {
    namedInsured: "Kevin Brooks",
    phone: "(614) 555-0109",
    address: "4419 Indianola Ave, Columbus, OH 43214",
    people: [{ name: "Kevin Brooks", role: "Named insured" }],
    vehicles: [{ year: "2018", make: "Chevrolet", model: "Silverado" }],
    policies: [
      { line: "Personal auto", carrier: "Grange", current: 2025, renewal: 2410, detail: "1 vehicle · 1 driver" },
    ],
    driver: "Grange is up 19% on the Silverado. Still waiting on a missing VIN. There are no accidents on file.",
    shopCarriers: ["Erie", "Auto-Owners", "Grange"],
    timeline: [
      { label: "You sent the outreach email", date: "Oct 6", state: "done" },
      { label: "Kevin completed the questionnaire", date: "Oct 11", state: "done" },
      { label: "VA is shopping Erie, Auto-Owners, and Grange", date: "In progress", state: "now", detail: "Check back tomorrow for quotes." },
      { label: "Renewal date. Coverage needs to be in place.", date: "Oct 30", state: "soon" },
    ],
  },
  vasquez: {
    namedInsured: "Elena Vasquez",
    phone: "(614) 555-0155",
    address: "390 S Drexel Ave, Bexley, OH 43209",
    people: [
      { name: "Elena Vasquez", role: "Named insured" },
      { name: "Luis Vasquez", role: "Spouse" },
    ],
    vehicles: [
      { year: "2020", make: "Honda", model: "Pilot" },
      { year: "2016", make: "Toyota", model: "Prius" },
    ],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Travelers", current: 1480, renewal: 1760, detail: "Dwelling $440,000 · $1,000 AOP" },
      { line: "Personal auto", carrier: "Travelers", current: 2088, renewal: 2450, detail: "2 vehicles · 2 drivers" },
    ],
    home: { roof: "Replaced 2020", trampoline: "No", dog: "Yes · beagle" },
    driver: "Travelers is up 18% on the package. There are no claims on file, and nothing changed on her end.",
    rec: {
      pick: "Auto-Owners",
      summary: "Our recommendation: move Elena to Auto-Owners. She'll have the same coverage she currently has with Travelers, but it'll cost her $730 less this year.",
      email: `Hi Elena,\n\nI shopped your home and auto ahead of October 22. Auto-Owners came back at $3,480 for the same coverage you have with Travelers, about $730 less than the renewal offer.\n\nNothing on the household needed to change.\n\nThis does not put coverage in place. Reply with a couple of times that work this week and I'll call you to walk it through.`,
      currentLabel: "Travelers",
      cols: [
        { id: "ao", name: "Auto-Owners" },
        { id: "grange", name: "Grange" },
        { id: "erie", name: "Erie" },
      ],
      coverage: [
        { label: "Annual premium", current: "$4,210", quotes: { ao: "$3,480", grange: "$3,920", erie: "$4,050" }, help: "What she would pay for a year if this quote is written." },
        { label: "Dwelling", current: "$440,000", quotes: { ao: true, grange: true, erie: true }, help: "The rebuild limit on the house. Matches what Travelers has on file today." },
        { label: "Home deductible", current: "$1,000", quotes: { ao: true, grange: true, erie: "$2,500" }, help: "What she pays out of pocket on a home claim before the carrier pays." },
        { label: "Auto liability", current: "100/300", quotes: { ao: true, grange: "250/500", erie: true }, help: "Bodily injury limits if she hurts someone in a crash. 100/300 is $100,000 per person, $300,000 per accident." },
        { label: "Uninsured motorist stacking", current: "Stacked", quotes: { ao: true, grange: true, erie: "Unstacked" }, help: "Whether uninsured-motorist limits from each car can be added together. Stacked is the stronger version." },
        { label: "Comp / collision", current: "$500 / $500", quotes: { ao: true, grange: true, erie: true }, help: "Deductibles on the cars. Comprehensive is weather and theft. Collision is hitting something." },
      ],
      biggest: [
        { carrier: "Auto-Owners", text: "$3,480. Almost identical coverage, $730 less than Travelers if paid in full." },
        { carrier: "Grange", text: "$3,920. Auto liability goes to 250/500." },
        { carrier: "Erie", text: "$4,050. Home deductible moves to $2,500, and uninsured motorist is unstacked." },
      ],
      options: [
        { id: "ao", name: "Auto-Owners", lines: "home and auto", price: 3480, email: `Hi Elena,\n\nI shopped your home and auto ahead of October 22. Auto-Owners came back at $3,480 for the same coverage you have with Travelers, about $730 less than the renewal offer.\n\nNothing on the household needed to change.\n\nThis does not put coverage in place. Reply with a couple of times that work this week and I'll call you to walk it through.` },
        { id: "travelers", name: "Travelers", lines: "home and auto", price: 4210, current: true, email: `Hi Elena,\n\nI shopped your home and auto ahead of October 22. Travelers is still your current carrier at $4,210.\n\nThe other quotes came in, and staying put is on the table if that is what you want to do.\n\nThis does not change anything on the policy. Reply if you want me to walk through the other quotes anyway.` },
        { id: "grange", name: "Grange", lines: "home and auto", price: 3920, email: `Hi Elena,\n\nI shopped your home and auto ahead of October 22. Grange came back at $3,920. It is not the lowest number, but it does raise auto liability to 250/500.\n\nThis does not put coverage in place. Reply with a couple of times that work this week and I'll call you to walk it through.` },
        { id: "erie", name: "Erie", lines: "home and auto", price: 4050, email: `Hi Elena,\n\nI shopped your home and auto ahead of October 22. Erie came back at $4,050. The home deductible would move to $2,500, which is the tradeoff on that number.\n\nThis does not put coverage in place. Reply with a couple of times that work this week and I'll call you to walk it through.` },
      ],
      talkingPoints: [
        "Auto-Owners will write the same home and auto for almost identical coverage. That is $730 a year back if paid in full.",
        "Paid monthly, that is about $61 less each month than the Travelers renewal.",
        "Grange raises auto liability to 250/500. That extra limit is worth having if she wants more protection, though it may not match what she needs right now.",
        "Erie moves the home deductible to $2,500. That is the tradeoff behind a number that looks close.",
        "Grange is not the most competitive on price. It does carry more coverage, including those higher liability limits.",
      ],
      quotes: [
        quotePdf({
          id: "tv-home",
          carrier: "Travelers",
          title: "Homeowners renewal",
          filename: "Travelers_HO3_renewal.pdf",
          current: true,
          premium: "$1,760",
          rows: [
            { label: "Named insured", value: "Elena Vasquez" },
            { label: "Dwelling", value: "$440,000" },
            { label: "Deductible", value: "$1,000" },
            { label: "Liability", value: "$300,000" },
            { label: "Effective", value: "October 22, 2026" },
          ],
        }),
        quotePdf({
          id: "tv-auto",
          carrier: "Travelers",
          title: "Personal auto renewal",
          filename: "Travelers_auto_renewal.pdf",
          current: true,
          premium: "$2,450",
          rows: [
            { label: "Named insured", value: "Elena Vasquez" },
            { label: "Liability", value: "100/300" },
            { label: "Comp / collision", value: "$500 / $500" },
            { label: "UM stacking", value: "Stacked" },
            { label: "Vehicles", value: "2020 Honda Pilot · 2016 Toyota Prius" },
          ],
        }),
        quotePdf({
          id: "ao",
          carrier: "Auto-Owners",
          title: "Home and auto quote",
          filename: "Auto-Owners_HA_quote.pdf",
          premium: "$3,480",
          rows: [
            { label: "Named insured", value: "Elena Vasquez" },
            { label: "Dwelling", value: "$440,000" },
            { label: "Home deductible", value: "$1,000" },
            { label: "Auto liability", value: "100/300" },
            { label: "UM stacking", value: "Stacked" },
            { label: "Quoted", value: "October 14, 2026" },
          ],
        }),
        quotePdf({
          id: "grange",
          carrier: "Grange",
          title: "Home and auto quote",
          filename: "Grange_HA_quote.pdf",
          premium: "$3,920",
          rows: [
            { label: "Named insured", value: "Elena Vasquez" },
            { label: "Dwelling", value: "$440,000" },
            { label: "Home deductible", value: "$1,000" },
            { label: "Auto liability", value: "250/500" },
            { label: "UM stacking", value: "Stacked" },
            { label: "Quoted", value: "October 14, 2026" },
          ],
        }),
        quotePdf({
          id: "erie",
          carrier: "Erie",
          title: "Home and auto quote",
          filename: "Erie_HA_quote.pdf",
          premium: "$4,050",
          rows: [
            { label: "Named insured", value: "Elena Vasquez" },
            { label: "Dwelling", value: "$440,000" },
            { label: "Home deductible", value: "$2,500" },
            { label: "Auto liability", value: "100/300" },
            { label: "UM stacking", value: "Unstacked" },
            { label: "Quoted", value: "October 14, 2026" },
          ],
        }),
      ],
    },
  },
  foss: {
    namedInsured: "Raymond Foss",
    phone: "(614) 555-0121",
    address: "27 W Beechwold Blvd, Columbus, OH 43214",
    people: [{ name: "Raymond Foss", role: "Named insured" }],
    vehicles: [],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Nationwide", current: 2559, renewal: 2840, detail: "Dwelling $310,000 · $2,500 AOP" },
    ],
    home: { roof: "Replaced 2017", trampoline: "No", dog: "No" },
    driver: "Nationwide is up 11% on the house. The roof is from 2017. There are no claims on file.",
    rec: {
      pick: "Nationwide",
      summary: "Our recommendation: stay with Nationwide. Westfield is a little cheaper, but the coverage and claims path he already has are a better fit than chasing a small save.",
      email: `Hi Raymond,\n\nI looked at your October 24 homeowners renewal. Nationwide came in at $2,840. Westfield was a little lower, but the coverage and claims path you already have are a better fit than chasing a small save.\n\nThis does not change anything on the policy. Reply if you want me to walk through the other quotes anyway.`,
      currentLabel: "Nationwide",
      cols: [
        { id: "west", name: "Westfield" },
        { id: "om", name: "Ohio Mutual" },
        { id: "cin", name: "Cincinnati" },
      ],
      coverage: [
        { label: "Annual premium", current: "$2,840", quotes: { west: "$2,690", om: "$2,780", cin: "$2,910" }, help: "What he would pay for a year if this quote is written." },
        { label: "Dwelling", current: "$310,000", quotes: { west: true, om: true, cin: true }, help: "The rebuild limit on the house. Matches what Nationwide has on file today." },
        { label: "Home deductible", current: "$2,500", quotes: { west: "$1,000", om: true, cin: true }, help: "What he pays out of pocket on a home claim before the carrier pays." },
        { label: "Roof settlement", current: "Replacement", quotes: { west: true, om: "ACV after 15 yrs", cin: true }, help: "How the carrier pays a roof claim. Replacement is full cost. ACV after 15 years pays depreciated value." },
      ],
      biggest: [
        { carrier: "Westfield", text: "$2,690. $150 less, but the deductible drops to $1,000." },
        { carrier: "Ohio Mutual", text: "$2,780. Roof pays actual cash value after 15 years. His roof is 2017." },
        { carrier: "Cincinnati", text: "$2,910. Higher than the Nationwide renewal, with matching coverage." },
      ],
      options: [
        { id: "nw", name: "Nationwide", lines: "homeowners", price: 2840, current: true, email: `Hi Raymond,\n\nI looked at your October 24 homeowners renewal. Nationwide came in at $2,840. Westfield was a little lower, but the coverage and claims path you already have are a better fit than chasing a small save.\n\nThis does not change anything on the policy. Reply if you want me to walk through the other quotes anyway.` },
        { id: "west", name: "Westfield", lines: "homeowners", price: 2690, email: `Hi Raymond,\n\nI looked at your October 24 homeowners renewal. Westfield came back at $2,690, $150 less than Nationwide. The deductible would drop to $1,000.\n\nThis does not put coverage in place. Reply if you want me to walk it through.` },
        { id: "om", name: "Ohio Mutual", lines: "homeowners", price: 2780, email: `Hi Raymond,\n\nI looked at your October 24 homeowners renewal. Ohio Mutual came back at $2,780. They pay the roof actual cash value after 15 years, and yours is from 2017.\n\nThis does not put coverage in place. Reply if you want me to walk it through.` },
        { id: "cin", name: "Cincinnati", lines: "homeowners", price: 2910, email: `Hi Raymond,\n\nI looked at your October 24 homeowners renewal. Cincinnati came back at $2,910, which is higher than staying with Nationwide.\n\nThis does not put coverage in place. Reply if you want me to walk it through.` },
      ],
      talkingPoints: [
        "Westfield is $150 less, but the deductible drops to $1,000.",
        "Paid monthly, that Westfield save is about $13 a month.",
        "Ohio Mutual pays the roof actual cash value after 15 years. His roof is 2017, so that may not match what he needs right now.",
        "Cincinnati came in higher than the Nationwide renewal.",
        "The save is small against moving the claim path this year.",
      ],
      quotes: [
        quotePdf({
          id: "nw",
          carrier: "Nationwide",
          title: "Homeowners renewal",
          filename: "Nationwide_HO3_renewal.pdf",
          current: true,
          premium: "$2,840",
          rows: [
            { label: "Named insured", value: "Raymond Foss" },
            { label: "Dwelling", value: "$310,000" },
            { label: "Deductible", value: "$2,500" },
            { label: "Roof settlement", value: "Replacement cost" },
            { label: "Effective", value: "October 24, 2026" },
          ],
        }),
        quotePdf({
          id: "west",
          carrier: "Westfield",
          title: "Homeowners quote",
          filename: "Westfield_HO3_quote.pdf",
          premium: "$2,690",
          rows: [
            { label: "Named insured", value: "Raymond Foss" },
            { label: "Dwelling", value: "$310,000" },
            { label: "Deductible", value: "$1,000" },
            { label: "Roof settlement", value: "Replacement cost" },
            { label: "Quoted", value: "October 16, 2026" },
          ],
        }),
        quotePdf({
          id: "om",
          carrier: "Ohio Mutual",
          title: "Homeowners quote",
          filename: "OhioMutual_HO3_quote.pdf",
          premium: "$2,780",
          rows: [
            { label: "Named insured", value: "Raymond Foss" },
            { label: "Dwelling", value: "$310,000" },
            { label: "Deductible", value: "$2,500" },
            { label: "Roof settlement", value: "ACV after 15 years" },
            { label: "Quoted", value: "October 16, 2026" },
          ],
        }),
        quotePdf({
          id: "cin",
          carrier: "Cincinnati",
          title: "Homeowners quote",
          filename: "Cincinnati_HO3_quote.pdf",
          premium: "$2,910",
          rows: [
            { label: "Named insured", value: "Raymond Foss" },
            { label: "Dwelling", value: "$310,000" },
            { label: "Deductible", value: "$2,500" },
            { label: "Roof settlement", value: "Replacement cost" },
            { label: "Quoted", value: "October 16, 2026" },
          ],
        }),
      ],
    },
  },
  hart: {
    namedInsured: "Linda Hart",
    phone: "(614) 555-0190",
    address: "608 S Roosevelt Ave, Columbus, OH 43209",
    people: [{ name: "Linda Hart", role: "Named insured" }],
    vehicles: [{ year: "2018", make: "Honda", model: "CR-V" }],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Erie", current: 1610, renewal: 1780, detail: "Dwelling $380,000 · $1,000 AOP" },
      { line: "Personal auto", carrier: "Erie", current: 1926, renewal: 2180, detail: "1 vehicle · 1 driver" },
    ],
    home: { roof: "Replaced 2023", trampoline: "No", dog: "No" },
    driver: "Erie is up 12% on home and auto. There are no claims on file, and nothing changed on her end.",
    closing: {
      title: "Close out Linda Hart's renewal",
      sub: "You reached out to Linda Hart and recommended she switch from Erie to Auto-Owners. Record her decision before Oct 18 so this household can leave the queue.",
      timeline: [
        { label: "You sent the outreach email", date: "Oct 1", state: "done" },
        { label: "She completed the questionnaire", date: "Oct 3", state: "done" },
        { label: "Shopping results were ready", date: "Oct 6", state: "done" },
        { label: "You sent the recommendation", date: "Oct 8", state: "done", detail: "Switch from Erie to Auto-Owners." },
        { label: "Close out Linda's renewal prior to her renewal date", date: "Now", state: "now" },
      ],
    },
  },
  desai: {
    namedInsured: "Anika Desai",
    phone: "(614) 555-0166",
    address: "91 E North Broadway, Columbus, OH 43214",
    people: [{ name: "Anika Desai", role: "Named insured" }],
    vehicles: [],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Westfield", current: 1593, renewal: 1720, detail: "Dwelling $275,000 · $2,500 AOP" },
    ],
    home: { roof: "Original 2009", trampoline: "No", dog: "Yes · cavalier King Charles" },
    driver: "Westfield is up 8% on the house. Under 10%. Stay is the recommendation.",
    closing: {
      title: "Close out Anika Desai's renewal",
      sub: "You reached out to Anika Desai and recommended she stay with Westfield. Record her decision before Oct 16 so this household can leave the queue.",
      timeline: [
        { label: "You sent the outreach email", date: "Sep 28", state: "done" },
        { label: "She completed the questionnaire", date: "Sep 30", state: "done" },
        { label: "Shopping results were ready", date: "Oct 4", state: "done" },
        { label: "You sent the recommendation", date: "Oct 6", state: "done", detail: "Stay with Westfield." },
        { label: "Close out Anika's renewal prior to her renewal date", date: "Now", state: "now" },
      ],
    },
  },
};

export function fileFor(card: QueueCard): HouseholdFile {
  return householdFiles[card.id] ?? {
    namedInsured: card.name,
    phone: agency.phone,
    address: "Columbus, OH",
    people: [{ name: card.name, role: "Named insured" }],
    vehicles: [],
    policies: [{ line: card.lines, carrier: card.carrier, current: card.was, renewal: card.premium, detail: card.note }],
  };
}

export function zillowUrl(address: string) {
  return zillow(address);
}
export type RetentionWeek = {
  label: string;
  queued: number;
  sent: number;
  retained: number | null;
  current?: boolean;
};

export const retentionWeeks: RetentionWeek[] = [
  { label: "Aug 24", queued: 18, sent: 18, retained: 17 },
  { label: "Aug 31", queued: 21, sent: 21, retained: 20 },
  { label: "Sep 7", queued: 19, sent: 19, retained: 19 },
  { label: "Sep 14", queued: 24, sent: 24, retained: 23 },
  { label: "Sep 21", queued: 20, sent: 19, retained: null },
  { label: "Sep 28", queued: 22, sent: 20, retained: null },
  { label: "Oct 5", queued: 18, sent: 16, retained: null },
  { label: "Oct 12", queued: 12, sent: 4, retained: null, current: true },
];

export const retentionKpis = {
  avgRetention: 96,
  lastYearRetention: 92,
  vsLastYearPts: 4,
  leadsToSales: 11,
  rangeLabel: "Aug 24 to Oct 12",
  throughLabel: "September 14",
};

export const questionnaireFields = {
  confirm: [
    { id: "name", label: "Named insured", value: "Dana Callahan" },
    { id: "email", label: "Email", value: "dana.callahan@gmail.com" },
    { id: "phone", label: "Mobile", value: "(614) 555-0194" },
    { id: "address", label: "Address", value: "418 Walnut Ave, Dublin, OH 43017" },
    { id: "home", label: "Home", value: "Erie HO-3 · dwelling $485,000" },
    { id: "auto", label: "Vehicles", value: "2019 Honda CR-V · 2016 Toyota Camry" },
    { id: "drivers", label: "Drivers", value: "Dana, Mike, Sophie (added Aug 2026)" },
  ],
  ask: [
    { id: "dl", prompt: "What's Sophie's driver's license number?" },
    { id: "life", prompt: "Want us to look at a life insurance quote while we shop?" },
    { id: "referral", prompt: "Anyone else who should hear from us?" },
  ],
};

export const lastWeekOutreach = [
  { id: "patel", name: "Priya Patel", sent: "Tue Oct 6", stage: "Shopping", renewal: "Oct 28" },
  { id: "brooks", name: "Kevin Brooks", sent: "Tue Oct 6", stage: "Shopping", renewal: "Oct 30" },
  { id: "vasquez", name: "Elena Vasquez", sent: "Wed Oct 7", stage: "Ready to send rec", renewal: "Oct 22" },
  { id: "foss", name: "Raymond Foss", sent: "Wed Oct 7", stage: "Ready to send rec", renewal: "Oct 24" },
  { id: "hart", name: "Linda Hart", sent: "Mon Oct 5", stage: "Closing", renewal: "Oct 18" },
  { id: "desai", name: "Anika Desai", sent: "Mon Oct 5", stage: "Closing", renewal: "Oct 16" },
  { id: "hale", name: "Jordan Hale", sent: "Tue Oct 6", stage: "Questionnaire in", renewal: "Oct 20" },
  { id: "chen", name: "Mei Chen", sent: "Thu Oct 8", stage: "Renewed", renewal: "Oct 11" },
];

export const documents = [
  { name: "Erie HO-3 declarations", date: "Nov 15, 2025" },
  { name: "Erie auto declarations", date: "Nov 15, 2025" },
  { name: "EZLynx policy history", date: "Oct 8, 2026" },
];

export const monthInReview = {
  subject: "September with Upline",
  from: "Upline",
  to: `${agency.agent.name} · ${agency.name}`,
  period: "September 2026",
  lag: "Numbers trail about 30 days. We verify retention in the AMS, not from the approve click.",
  needYou: [
    { label: "Bind Linda Hart", detail: "Approved 4 days ago. Auto-Owners home + auto." },
    { label: "Bind Anika Desai", detail: "Approved 6 days ago. Three human steps still open." },
    { label: "Referral · the Brennans", detail: "Dana named a neighbor on Walnut. No routing yet. Just a name." },
  ],
  beenDoing: [
    { value: "28", label: "Households we reached this month" },
    { value: "11", label: "Questionnaires completed" },
    { value: "8", label: "Households shopped" },
    { value: "4", label: "Referrals surfaced" },
  ],
  headline: { renewed: 22, up: 24, note: "Of the 24 that came due in the window we can see. Approve is not retained." },
  hygiene: "We corrected 6 phone numbers and 3 emails this month. They hadn't heard from anyone.",
};
