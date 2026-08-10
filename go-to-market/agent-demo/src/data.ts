// Canned demo data for the Upline agent-cockpit walkthrough.
// Client: Corey A. Criswell (synthetic demo household, carried over from the
// original concept demo). Numbers are illustrative for the demo narrative.

export const agency = {
  name: "Seabrook Insurance",
  agent: { name: "Jolene Reyes", initials: "JR", title: "Account Manager" },
  carrierCount: 7,
  questionnaireHost: "seabrook.coverage-review.com",
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
  currentPremium: 10089,
  renewalPremium: 11659,
  homePremium: 1473,
  autoPremium: 10186,
  changePct: 16,
};

export const policies = [
  {
    line: "Homeowners (HO-3)",
    short: "Homeowners",
    carrier: "Donegal",
    number: "H-0 4419-882",
    renews: "May 9, 2026",
    currentPremium: 1280,
    renewalPremium: 1473,
    dwelling: "$412,000",
  },
  {
    line: "Personal Auto",
    short: "Personal Auto",
    carrier: "Donegal",
    number: "PA-9 1174-006",
    renews: "May 9, 2026",
    currentPremium: 8809,
    renewalPremium: 10186,
    dwelling: "3 vehicles · 4 drivers",
  },
];

export const household = [
  { name: "Corey A. Criswell", role: "Named insured", initials: "CC", note: "Primary contact", dob: "03/15/1980", license: "On file" },
  { name: "Sara Criswell", role: "Spouse", initials: "SC", note: "Named insured", dob: "07/22/1982", license: "On file" },
  { name: "Lily Criswell", role: "Driver", initials: "LC", note: "Added Feb 2026 · good student Apr 2026", dob: "—", license: "DL# missing", flag: true },
  { name: "Trenton Gurreri", role: "Driver", initials: "TG", note: "Drives the Mazda 6", dob: "—", license: "On file" },
];

export const homeProperty = {
  address: "284 Willow Creek Dr, Lancaster, PA 17601",
  type: "Single-family",
  yearBuilt: 1998,
  stories: "2",
  sqFt: "2,140",
  dwelling: "$412,000",
  roof: "Unknown — re-ask at renewal",
  heat: "Natural gas",
  fireplace: "None on file",
  pool: "In-ground pool (on file since May 2017)",
  trampoline: "Removed Apr 13, 2026 (endo. eff. May 9)",
  zillowUrl: "https://www.zillow.com/homes/284-Willow-Creek-Dr-Lancaster-PA-17601_rb/",
};

export const vehicles = [
  { desc: "2016 Toyota Corolla", year: "2016", make: "Toyota", model: "Corolla", driver: "Lily", use: "Commute / school", note: "Added at renewal · endorsed 4/8/26", vin: "On file" },
  { desc: "2019 Hyundai Sonata", year: "2019", make: "Hyundai", model: "Sonata", driver: "Corey", use: "Commute", note: "Full coverage", vin: "On file" },
  { desc: "2015 Mazda 6", year: "2015", make: "Mazda", model: "6", driver: "Trent", use: "Pleasure", note: "Full coverage", vin: "On file" },
];

export const autoClaims = [
  {
    date: "Dec 2025",
    description: "Comprehensive claim",
    vehicle: "2019 Hyundai Sonata",
    driver: "Corey Criswell",
    claimNumber: "PAF-PA-01-25-1250513",
    carrier: "Donegal",
  },
];

export const portfolioGaps = [
  { line: "Umbrella", status: "Not on file", note: "Flag for conversation — home + auto bundled, youthful driver" },
  { line: "Life", status: "Not on file", note: "In age band with dependents — surface in questionnaire" },
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
  headline: "Offer to shop the renewal",
  summary:
    "Combined premium is up 16% ($10,089 → $11,659). There are two children on the policy who are driving, and no life coverage on file — we’d recommend shopping life insurance.",
  confirmTitle: "Information to verify",
  gaps: [
    "Get Lily’s driver’s license number — added Feb 2026, not on file yet",
    "Confirm pool details (fencing, diving board)",
    "Confirm trampoline is gone — removed on endorsement Apr 2026",
    "Confirm roof age — make sure it wasn’t replaced this year",
  ],
};

// ---- Outreach email (Seabrook boilerplate, v8 — 3 merge fields) ----
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
// Questions Upline proposes for the questionnaire — agent can approve/remove before send
export const questionnaireQuestions = [
  {
    id: "contact",
    section: "Confirm your info",
    prompt: "Is this still the best way to reach you?",
    why: "Pre-filled from policy; confirms email, phone, address",
    included: true,
  },
  {
    id: "lily_dl",
    section: "Your household",
    prompt: "What's Lily's driver's license number?",
    why: "Added Feb 2026 — DL# missing; needed for MVR before quoting",
    included: true,
  },
  {
    id: "roof",
    section: "About your home",
    prompt: "Roughly when was the roof last replaced?",
    why: "Always re-ask — drifts on dec pages; affects eligibility",
    included: true,
  },
  {
    id: "unusual",
    section: "A few quick checks",
    prompt: "Pool, trampoline, dogs, or other household exposures?",
    why: "Pool on file since 2017; trampoline removed Apr 2026 — confirm both",
    included: true,
  },
  {
    id: "life",
    section: "One quick bonus",
    prompt: "Want us to grab a life insurance quote while we're at it?",
    why: "Corey mid-40s with a dependent driver; no life on file",
    included: true,
  },
];

export const responseHighlights = [
  { icon: "check", text: "Lily's DL# provided — MVR can now be pulled", tone: "green" },
  { icon: "check", text: "Confirmed email & mobile on file", tone: "green" },
  { icon: "pool", text: "Pool confirmed — fenced, self-latching gate, no diving board", tone: "indigo" },
  { icon: "minus", text: "Trampoline confirmed removed", tone: "green" },
  { icon: "life", text: "Corey opted in to a life insurance quote", tone: "gold" },
];

/** Structured Q&A as it would appear on the client card after submit */
export const questionnaireAnswers = [
  { question: "Best way to reach you?", answer: "Confirmed — email & mobile on file", updated: false },
  { question: "Lily's driver's license #", answer: "PA 28 401 773", updated: true },
  { question: "Roof last replaced?", answer: "6–10 years ago", updated: true },
  { question: "Pool / trampoline / dogs?", answer: "In-ground pool — fenced, self-latching, no diving board. Trampoline removed.", updated: true },
  { question: "Life insurance quote?", answer: "Yes — quote $1M / 20-year term", updated: true },
];

export const householdAfterQuestionnaire = [
  { name: "Corey A. Criswell", role: "Named insured", initials: "CC", note: "Primary contact", dob: "03/15/1980", license: "On file", flag: false },
  { name: "Sara Criswell", role: "Spouse", initials: "SC", note: "Named insured", dob: "07/22/1982", license: "On file", flag: false },
  { name: "Lily Criswell", role: "Driver", initials: "LC", note: "Added Feb 2026 · good student", dob: "On file", license: "PA 28 401 773", flag: false },
  { name: "Trenton Gurreri", role: "Driver", initials: "TG", note: "Drives the Mazda 6", dob: "On file", license: "On file", flag: false },
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
  carrier: "Nationwide",
  product: "20-year level term",
  face: "$1,000,000",
  monthly: 46,
  insured: "Corey Criswell",
  nextSteps: [
    "Include the life quote in the recommendation email so Corey sees it alongside the home + auto switch",
    "On the call, confirm face amount and beneficiary before binding",
    "Underwriting / apps can run in parallel with the Travelers bind",
  ],
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
  { title: "One warm email, one short form", body: "Seabrook voice, pre-filled from policy data. Corey answered in six minutes on his phone." },
  { title: "Shopped across the book", body: "Home + auto quoted together at Travelers, Nationwide, Progressive — coverage matched, not just price." },
  { title: "A recommendation, then a call", body: "Short email lands the number; Jolene walks the coverage details and binds. The relationship does the closing." },
];
