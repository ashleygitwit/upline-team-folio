// Canned demo data for the Upline agent-cockpit walkthrough.
// Client: Corey A. Criswell (synthetic demo household, carried over from the
// original concept demo). Numbers are illustrative for the demo narrative.

export const agency = {
  name: "Members 1st Insurance",
  agent: { name: "Jolene Reyes", initials: "JR", title: "Account Manager" },
  carrierCount: 7,
  questionnaireHost: "members1st.coverage-review.com",
};

export const client = {
  name: "Corey A. Criswell",
  first: "Corey",
  initials: "CC",
  memberSince: 2017,
  address: "284 Willow Creek Dr, Lancaster, PA 17601",
  email: "corey.criswell@gmail.com",
  phone: "(717) 555-0142",
  carrier: "Donegal",
  renewalDate: "May 9, 2026",
  daysOut: 30,
  currentPremium: 10088.89,
  renewalPremium: 11659.44,
  homePremium: 1473,
  autoPremium: 10186,
  changePct: 16,
};

export const policies = [
  {
    line: "Homeowners (HO-3)",
    carrier: "Donegal",
    number: "H-0 4419-882",
    renews: "May 9, 2026",
    premium: 1473,
    dwelling: "$412,000",
  },
  {
    line: "Personal Auto",
    carrier: "Donegal",
    number: "PA-9 1174-006",
    renews: "May 9, 2026",
    premium: 10186,
    dwelling: "3 vehicles · 4 drivers",
  },
];

export const household = [
  { name: "Corey A. Criswell", role: "Named insured", initials: "CC", note: "Primary contact" },
  { name: "Sara Criswell", role: "Spouse", initials: "SC", note: "On policy" },
  { name: "Lily Criswell", role: "Driver", initials: "LC", note: "Added Feb 2026 · DL# missing", flag: true },
  { name: "Trenton Gurreri", role: "Driver", initials: "TG", note: "Drives the Mazda 6" },
];

export const vehicles = [
  { desc: "2016 Toyota Corolla", driver: "Lily", note: "Added at renewal" },
  { desc: "2019 Hyundai Sonata", driver: "Corey" },
  { desc: "2015 Mazda 6", driver: "Trent" },
];

export const flags = [
  {
    tone: "gold",
    title: "New driver, no license number on file",
    body: "Lily was added in February. We need her DL# to pull an accurate MVR before we can shop the auto.",
  },
  {
    tone: "gold",
    title: "Auto claim on file (Dec 2025)",
    body: "One comprehensive claim last December. Not a shop-stopper — carriers are lenient on a single claim.",
  },
  {
    tone: "indigo",
    title: "In-ground pool on file since 2017",
    body: "Always re-confirm liability exposures at renewal — pool fencing and diving-board details affect eligibility.",
  },
  {
    tone: "green",
    title: "Trampoline removed (Apr 2026)",
    body: "Endorsed off the policy last month — worth confirming so we don't carry a phantom exposure into a quote.",
  },
];

export const uplineRecommendation = {
  headline: "Shop the renewal — and open the life conversation",
  reason:
    "A 16% bundled jump on an otherwise clean household is worth shopping across our carriers. Corey is mid-40s with a dependent driver at home and no life policy on file — a natural moment to surface a quote.",
  actions: [
    "Shop home + auto together (don't split the bundle and lose credits)",
    "Confirm Lily's DL# and the pool details before quoting",
    "Attach a life quote — kids at home, in the 25–65 band, no coverage on file",
  ],
};

// ---- Outreach email (Members 1st boilerplate, v8 — 3 merge fields) ----
export const outreachEmail = {
  subject: "A quick review of your upcoming renewal",
  to: `${client.name} <${client.email}>`,
  from: `${agency.agent.name}, ${agency.name}`,
  // paragraphs with {var} markers replaced in the component
  vars: {
    first: client.first,
    renewalDate: client.renewalDate,
    premium: "$11,659",
  },
};

// ---- Questionnaire steps shown in the customer preview ----
export type QChoice = { id: string; label: string; note?: string };
export type QStep = {
  section: string;
  kind: "confirm" | "drivers" | "text" | "multi" | "yesno" | "life";
  prompt: string;
  help?: string;
  choices?: QChoice[];
  multi?: boolean;
  prefillNote?: string;
};

export const questionnaireIntro = {
  headline: "Let's make sure we've got everything to shop your renewal",
  sub: "Your Donegal home and auto renew May 9. We've pre-filled what we can from your current policies — this takes about 6 minutes.",
  minutes: 6,
};

export const questionnaireSteps: QStep[] = [
  {
    section: "Confirm your info",
    kind: "confirm",
    prompt: "Is this still the best way to reach you?",
    help: "We pre-filled this from your current policies.",
  },
  {
    section: "Your household",
    kind: "text",
    prompt: "What's Lily's driver's license number?",
    help: "Lily was added in February — we need her license number to pull driving records when quoting.",
    prefillNote: "PA driver's license #",
  },
  {
    section: "A few quick checks",
    kind: "multi",
    prompt: "Tap anything that applies to your home or household.",
    help: "We have an in-ground pool on file since 2017. If that's still right, tap it and we'll confirm a couple details.",
    multi: true,
    choices: [
      { id: "pool", label: "Swimming pool, hot tub, or jacuzzi" },
      { id: "trampoline", label: "Trampoline" },
      { id: "dogs", label: "Dogs in the household" },
      { id: "business", label: "Business or in-home sales" },
      { id: "none", label: "None of the above" },
    ],
  },
  {
    section: "One quick bonus",
    kind: "life",
    prompt: "Want us to grab a life insurance quote while we're at it?",
    help: "It's a couple-minute add, no obligation — just a number to file away.",
    choices: [
      { id: "yes", label: "Yes, get me a number" },
      { id: "no", label: "No thanks" },
    ],
  },
];

// ---- What comes back after the client submits ----
export const responseHighlights = [
  { icon: "check", text: "Lily's DL# provided — MVR can now be pulled", tone: "green" },
  { icon: "check", text: "Confirmed email & mobile on file", tone: "green" },
  { icon: "pool", text: "Pool confirmed — fenced, self-latching gate, no diving board", tone: "indigo" },
  { icon: "minus", text: "Trampoline confirmed removed", tone: "green" },
  { icon: "life", text: "Corey opted in to a life insurance quote", tone: "gold" },
];

// ---- Carrier shopping ----
export const carriers = [
  { name: "Donegal", tag: "Current renewal", tone: "muted", total: 11659, home: 1473, auto: 10186, status: "renewal" },
  { name: "Travelers", tag: "Recommended", tone: "green", total: 9840, home: 1512, auto: 8328, status: "winner" },
  { name: "Nationwide", tag: "Quoted", tone: "muted", total: 10475, home: 1449, auto: 9026, status: "quoted" },
  { name: "Progressive", tag: "Declined — new driver", tone: "red", total: null, home: null, auto: null, status: "declined" },
];

export const coverageDiffs = [
  { tone: "green", label: "Liability aligned", body: "BI/PD 100/300 stacked, Full Tort, UM/UIM matched to current." },
  { tone: "gold", label: "Home all-peril deductible", body: "Donegal $500 → Travelers $1,000. Worth covering on the call." },
  { tone: "green", label: "Roadside added", body: "Travelers adds basic roadside on all 3 vehicles (Donegal towing only on 2)." },
  { tone: "gold", label: "Auto comp deductible", body: "Quote shows $500 — we'll re-rate to $100 + glass before bind to match today." },
];

export const savings = {
  perYear: 1819,
  pct: 16,
  donegal: 11659,
  travelers: 9840,
};

export const lifeQuote = {
  product: "20-year level term",
  face: "$1,000,000",
  monthly: 46,
};

// ---- Recommendation email (short, jargon-free, SWITCH shape) ----
export const recommendationEmail = {
  subject: "We shopped your renewal and found a lower rate",
  to: `${client.name} <${client.email}>`,
  from: `${agency.agent.name}, ${agency.name}`,
};

export const outcomeStats = [
  { value: "$1,819", label: "Saved per year vs. renewing with Donegal" },
  { value: "16%", label: "Lower than the renewal offer" },
  { value: "1", label: "New life quote opened for the household" },
];

export const outcomeTimeline = [
  { title: "Renewal surfaced automatically", body: "Upline flagged Corey's 16% bundled jump 30 days out — ranked to the top of Jolene's queue." },
  { title: "One warm email, one short form", body: "Members 1st voice, pre-filled from policy data. Corey answered in six minutes on his phone." },
  { title: "Shopped across the book", body: "Home + auto quoted together at Travelers, Nationwide, Progressive — coverage matched, not just price." },
  { title: "A recommendation, then a call", body: "Short email lands the number; Jolene walks the coverage details and binds. The relationship does the closing." },
];
