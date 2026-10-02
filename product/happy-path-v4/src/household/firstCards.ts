import type { Day } from "@/data";
import { quoteDoc, type Card, type HouseholdFile } from "@/household/data";

/**
 * The first cards: the households that are the first card in one of the
 * homepage board's columns on some day of the walk, as the board first loads,
 * and that would otherwise be invented (pipeline.ts) with no drawer behind
 * them. Each has a drawer as full as the Pruitts': contact, household,
 * vehicles, policies and the home, Recent activity for every day of the walk
 * (activity.ts), and the email Jenna drafted for it, plus the shop results
 * for anyone past shopping. They keep their invented ids and their places on
 * the board (board.ts), so the board reads the same.
 *
 * Three were renamed on 2026-10-01 so no two of the seven share a first name
 * or a surname: Troy Lowry was Cole Carver, Lena Park was Hank Kowalski and
 * Elena Varga was Iris Fischer.
 *
 * | Household    | Monday                         | Wednesday to Friday                    |
 * | ------------ | ------------------------------ | -------------------------------------- |
 * | Cole Doyle   | Awaiting Response, first       | Awaiting Response, first               |
 * | Troy Lowry   | Shopping, first                | Recommendation Sent                    |
 * | Hank Fischer | Recommendation Ready, first    | Recommendation Sent, first             |
 * | Lena Park    | Recommendation Sent, first     | Completed                              |
 * | Grace Tanaka | Completed, first               | Completed, first                       |
 * | Elena Varga  | not on the board yet           | Scheduled, first                       |
 * | Sara Ortiz   | Scheduled                      | Awaiting (Wed), Shopping (Thu–Fri, first) |
 *
 * On Wednesday the Pruitts are the first card in Shopping. Cole was shopped
 * from Wednesday until 2026-10-01, when no one under two weeks from renewal
 * was shopped any more, so he waits all week and Sara leads Shopping instead.
 */
export type FirstCard = {
  card: Card;
  file: HouseholdFile;
  /**
   * The renewal email Jenna drafted, and, for one that hasn't gone out yet,
   * the days of the walk it's still waiting on, when she can send it early or
   * skip it. Sara's goes Tuesday with this week's; Elena's goes next Tuesday.
   */
  outreach: { subject: string; email: string; waitsOn?: Day[] };
  /** What needs Jenna on Monday, as the earlier weeks' do (tasks.ts). */
  monday?: "shopped" | "closing";
  /** The results in words (shopStory.ts), for anyone who has been shopped. */
  story?: { story: string[]; about: Record<string, string> };
};

const link = (slug: string) => `https://harborpoint.coverage-review.com/d/${slug}`;
const email = (...paragraphs: string[]) => paragraphs.join("\n\n");

/** The line every recommendation email ends on, but a stay, which changes nothing. */
const callMe = "This does not put coverage in place. Reply with a couple of times that work this week and I'll call you to walk it through.";
const nothingChanges = "This does not change anything on the policy. Reply if you want me to walk through the other quotes anyway.";

/* ------------------------------------------------------------------ *
 * Cole Doyle: waiting on an answer all week, too close to shop
 * ------------------------------------------------------------------ */

const doyle: FirstCard = {
  card: {
    id: "inv-102",
    name: "Cole Doyle",
    first: "Cole",
    email: "cole.doyle@gmail.com",
    kinds: ["home", "auto"],
    carrier: "Auto-Owners",
    lines: "Home + Auto · Auto-Owners",
    renewal: "Nov 11",
    daysOut: 8,
    jumpPct: 9,
    was: 5319,
    premium: 5798,
    note: "Hail claim in April. No answer yet.",
    col: "outreach",
  },
  file: {
    namedInsured: "Cole Doyle",
    phone: "(330) 555-0126",
    address: "1418 Graham Rd, Stow, OH 44224",
    people: [
      { name: "Cole Doyle", role: "Named insured", note: "Primary contact" },
      { name: "Amara Doyle", role: "Spouse", note: "Named insured" },
    ],
    vehicles: [
      { year: "2020", make: "Ford", model: "Explorer" },
      { year: "2017", make: "Honda", model: "Accord" },
    ],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Auto-Owners", current: 2140, renewal: 2410, detail: "Dwelling $395,000 · $1,000 AOP" },
      { line: "Personal auto", carrier: "Auto-Owners", current: 3179, renewal: 3388, detail: "2 vehicles · 2 drivers" },
    ],
    home: { roof: "Replaced May 2026, after hail", trampoline: "No", dog: "Yes · boxer" },
    driver: "Auto-Owners is up 9% on home and auto. The hail claim on the roof in April is most of it, and it's mostly on the house.",
    shopCarriers: ["Auto-Owners", "Erie", "Grange"],
  },
  outreach: {
    subject: "A heads up on your November 11 renewal",
    email: email(
      "Hi Cole,",
      "Hope you and Amara are doing well. It's that time of year again, and I wanted to give you a heads up on where your renewal is coming in.",
      "Your home and auto renew on November 11 at $5,798, which is about $480 more than last year. Most of that is the hail claim on the roof in April.",
      "When one comes in like this, I'd like to shop it and see what else is out there for you. Before I can, there are a few details I need to confirm. It takes about five minutes:",
      `Answer a few quick questions → ${link("doyle")}`,
      "Once I have your answers I'll get to work and come back to you well before the 11th.",
      "Jenna",
    ),
  },
};

/* ------------------------------------------------------------------ *
 * Troy Lowry (was Cole Carver): shopped Monday, recommendation Tuesday
 * ------------------------------------------------------------------ */

const lowryEmails = {
  tv: email(
    "Hi Troy,",
    "I shopped your auto ahead of November 17. Travelers came back at $1,795 for the same coverage you have with Nationwide, about $75 less than the renewal.",
    "It's a small save. Most of the increase is the longer drive to work, and every carrier rated that the same way. If you'd rather stay put, that's fine too.",
    callMe,
  ),
  nw: email(
    "Hi Troy,",
    "I shopped your auto ahead of November 17. Nationwide is still your current carrier at $1,870.",
    "Travelers came in $75 lower for the same coverage, but it's a small save, and staying put is on the table if that's what you want to do.",
    nothingChanges,
  ),
  west: email(
    "Hi Troy,",
    "I shopped your auto ahead of November 17. Westfield came back at $1,889. It's $19 more than Nationwide, but it raises your liability to 250/500.",
    callMe,
  ),
};

const lowry: FirstCard = {
  card: {
    id: "inv-145",
    name: "Troy Lowry",
    first: "Troy",
    email: "troy.lowry@gmail.com",
    kinds: ["auto"],
    carrier: "Nationwide",
    lines: "Auto · Nationwide",
    renewal: "Nov 17",
    daysOut: 14,
    jumpPct: 11,
    was: 1685,
    premium: 1870,
    note: "Longer commute since August.",
    col: "shopping",
  },
  file: {
    namedInsured: "Troy Lowry",
    phone: "(330) 555-0137",
    address: "88 Fishcreek Rd, Stow, OH 44224",
    people: [{ name: "Troy Lowry", role: "Named insured" }],
    vehicles: [{ year: "2021", make: "Subaru", model: "Outback" }],
    policies: [{ line: "Personal auto", carrier: "Nationwide", current: 1685, renewal: 1870, detail: "1 vehicle · 1 driver" }],
    driver: "Nationwide is up 11% on the auto. Troy's commute went from 8 to 25 miles each way when he changed jobs in August. There are no claims on file.",
    shopCarriers: ["Nationwide", "Travelers", "Westfield"],
    rec: {
      pick: "Travelers",
      summary: "Our recommendation: move Troy to Travelers. He'll have the same coverage he has with Nationwide, and it'll cost him $75 less this year.",
      email: lowryEmails.tv,
      currentLabel: "Nationwide",
      cols: [
        { id: "tv", name: "Travelers" },
        { id: "west", name: "Westfield" },
      ],
      coverage: [
        {
          label: "Annual premium",
          current: "$1,870",
          quotes: { tv: "$1,795", west: "$1,889" },
          help: "What he would pay for a year if this quote is written.",
        },
        {
          label: "Auto liability",
          current: "100/300",
          quotes: { tv: true, west: "250/500" },
          help: "Bodily injury limits if he hurts someone in a crash. 100/300 is $100,000 per person, $300,000 per accident.",
        },
        {
          label: "Uninsured motorist",
          current: "100/300",
          quotes: { tv: true, west: true },
          help: "What covers him if the other driver has no insurance, or too little.",
        },
        {
          label: "Comp / collision",
          current: "$500 / $500",
          quotes: { tv: true, west: true },
          help: "Deductibles on the car. Comprehensive is weather and theft. Collision is hitting something.",
        },
      ],
      biggest: [
        { carrier: "Travelers", text: "$1,795. The same coverage, $75 less than Nationwide." },
        { carrier: "Westfield", text: "$1,889. $19 more than Nationwide, with liability raised to 250/500." },
      ],
      options: [
        { id: "tv", name: "Travelers", lines: "auto", price: 1795, email: lowryEmails.tv },
        { id: "nw", name: "Nationwide", lines: "auto", price: 1870, current: true, email: lowryEmails.nw },
        { id: "west", name: "Westfield", lines: "auto", price: 1889, email: lowryEmails.west },
      ],
      talkingPoints: [
        "Travelers writes the same auto for $75 less, about $6 a month.",
        "Every carrier rated the longer commute the same way, so the save is small.",
        "Westfield costs $19 more but raises liability to 250/500.",
      ],
      quotes: [
        quoteDoc({
          id: "nw-auto",
          carrier: "Nationwide",
          title: "Personal auto renewal",
          filename: "Nationwide_auto_renewal.pdf",
          current: true,
          premium: "$1,870",
          rows: [
            { label: "Named insured", value: "Troy Lowry" },
            { label: "Liability", value: "100/300" },
            { label: "Comp / collision", value: "$500 / $500" },
            { label: "Vehicle", value: "2021 Subaru Outback" },
            { label: "Effective", value: "November 17, 2026" },
          ],
        }),
        quoteDoc({
          id: "tv",
          carrier: "Travelers",
          title: "Auto quote",
          filename: "Travelers_auto_quote.pdf",
          premium: "$1,795",
          rows: [
            { label: "Named insured", value: "Troy Lowry" },
            { label: "Liability", value: "100/300" },
            { label: "Comp / collision", value: "$500 / $500" },
            { label: "Quoted", value: "October 13, 2026" },
          ],
        }),
        quoteDoc({
          id: "west",
          carrier: "Westfield",
          title: "Auto quote",
          filename: "Westfield_auto_quote.pdf",
          premium: "$1,889",
          rows: [
            { label: "Named insured", value: "Troy Lowry" },
            { label: "Liability", value: "250/500" },
            { label: "Comp / collision", value: "$500 / $500" },
            { label: "Quoted", value: "October 13, 2026" },
          ],
        }),
      ],
    },
  },
  outreach: {
    subject: "A heads up on your November 17 renewal",
    email: email(
      "Hi Troy,",
      "Hope you're doing well. It's that time of year again, and I wanted to give you a heads up on where your renewal is coming in.",
      "Your auto renews on November 17 at $1,870, which is about $185 more than last year. Most of that is the longer drive to work since you changed jobs.",
      "When one comes in like this, I'd like to shop it and see what else is out there for you. Before I can, there are a few details I need to confirm. It takes about five minutes:",
      `Answer a few quick questions → ${link("lowry")}`,
      "Once I have your answers I'll get to work and come back to you well before the 17th.",
      "Jenna",
    ),
  },
  story: {
    story: [
      "Quoted Troy's auto with Travelers and Westfield against Nationwide's renewal.",
      "Travelers matched every limit and deductible he has today for $1,795: $75 back this year, about $6 a month.",
      "Most of the increase is the longer commute, and every carrier rated it the same way, so the save is small.",
      "Westfield came in at $1,889, $19 more than Nationwide, with liability raised to 250/500.",
    ],
    about: {
      tv: "The same coverage he has with Nationwide, for $75 less.",
      nw: "Renews as it is, up 11% for the longer commute. Nothing changes on the policy.",
      west: "$19 more than Nationwide, with liability raised to 250/500.",
    },
  },
};

/* ------------------------------------------------------------------ *
 * Hank Fischer: results to send Monday
 * ------------------------------------------------------------------ */

const fischerEmails = {
  om: email(
    "Hi Hank,",
    "I shopped your auto ahead of November 13. Ohio Mutual came back at $1,573 for the same coverage you have with Grange, about $235 less than the renewal.",
    "Nolan rates the same there as he does with Grange, so the save is all price.",
    callMe,
  ),
  grange: email(
    "Hi Hank,",
    "I shopped your auto ahead of November 13. Grange is still your current carrier at $1,808.",
    "The other quotes came in lower, and staying put is on the table if that is what you want to do.",
    nothingChanges,
  ),
  nw: email(
    "Hi Hank,",
    "I shopped your auto ahead of November 13. Nationwide came back at $1,763, $45 less than Grange, but the deductibles on both vehicles would go to $1,000.",
    callMe,
  ),
};

const fischer: FirstCard = {
  card: {
    id: "inv-160",
    name: "Hank Fischer",
    first: "Hank",
    email: "hank.fischer@gmail.com",
    kinds: ["auto"],
    carrier: "Grange",
    lines: "Auto · Grange",
    renewal: "Nov 13",
    daysOut: 10,
    jumpPct: 13,
    was: 1600,
    premium: 1808,
    note: "Son added as a driver in July. Rec does not auto-send.",
    col: "recommend",
  },
  file: {
    namedInsured: "Hank Fischer",
    phone: "(330) 555-0149",
    address: "2471 Graham Rd, Cuyahoga Falls, OH 44223",
    people: [
      { name: "Hank Fischer", role: "Named insured" },
      { name: "Nolan Fischer", role: "Driver", note: "Age 22 · added July 2026" },
    ],
    vehicles: [
      { year: "2019", make: "Ram", model: "1500" },
      { year: "2012", make: "Honda", model: "Civic" },
    ],
    policies: [{ line: "Personal auto", carrier: "Grange", current: 1600, renewal: 1808, detail: "2 vehicles · 2 drivers" }],
    driver: "Grange is up 13% on the auto. Hank added his son Nolan, 22, as a driver in July. There are no claims on file.",
    shopCarriers: ["Grange", "Ohio Mutual", "Nationwide"],
    rec: {
      pick: "Ohio Mutual",
      summary: "Our recommendation: move Hank to Ohio Mutual. He'll have the same coverage he has with Grange, and it'll cost him $235 less this year.",
      email: fischerEmails.om,
      currentLabel: "Grange",
      cols: [
        { id: "om", name: "Ohio Mutual" },
        { id: "nw", name: "Nationwide" },
      ],
      coverage: [
        {
          label: "Annual premium",
          current: "$1,808",
          quotes: { om: "$1,573", nw: "$1,763" },
          help: "What he would pay for a year if this quote is written.",
        },
        {
          label: "Auto liability",
          current: "100/300",
          quotes: { om: true, nw: true },
          help: "Bodily injury limits if he hurts someone in a crash. 100/300 is $100,000 per person, $300,000 per accident.",
        },
        {
          label: "Uninsured motorist",
          current: "100/300",
          quotes: { om: true, nw: true },
          help: "What covers him if the other driver has no insurance, or too little.",
        },
        {
          label: "Comp / collision",
          current: "$500 / $500",
          quotes: { om: true, nw: "$1,000 / $1,000" },
          help: "Deductibles on the cars. Comprehensive is weather and theft. Collision is hitting something.",
        },
      ],
      biggest: [
        { carrier: "Ohio Mutual", text: "$1,573. The same coverage, $235 less than Grange." },
        { carrier: "Nationwide", text: "$1,763. Both deductibles move to $1,000." },
      ],
      options: [
        { id: "om", name: "Ohio Mutual", lines: "auto", price: 1573, email: fischerEmails.om },
        { id: "grange", name: "Grange", lines: "auto", price: 1808, current: true, email: fischerEmails.grange },
        { id: "nw", name: "Nationwide", lines: "auto", price: 1763, email: fischerEmails.nw },
      ],
      talkingPoints: [
        "Ohio Mutual writes the same auto for $235 less, about $20 a month.",
        "Nolan rates the same with Ohio Mutual as with Grange.",
        "Nationwide is $45 under Grange, but only with $1,000 deductibles.",
      ],
      quotes: [
        quoteDoc({
          id: "grange-auto",
          carrier: "Grange",
          title: "Personal auto renewal",
          filename: "Grange_auto_renewal.pdf",
          current: true,
          premium: "$1,808",
          rows: [
            { label: "Named insured", value: "Hank Fischer" },
            { label: "Liability", value: "100/300" },
            { label: "Comp / collision", value: "$500 / $500" },
            { label: "Vehicles", value: "2019 Ram 1500 · 2012 Honda Civic" },
            { label: "Effective", value: "November 13, 2026" },
          ],
        }),
        quoteDoc({
          id: "om",
          carrier: "Ohio Mutual",
          title: "Auto quote",
          filename: "OhioMutual_auto_quote.pdf",
          premium: "$1,573",
          rows: [
            { label: "Named insured", value: "Hank Fischer" },
            { label: "Liability", value: "100/300" },
            { label: "Comp / collision", value: "$500 / $500" },
            { label: "Quoted", value: "October 9, 2026" },
          ],
        }),
        quoteDoc({
          id: "nw",
          carrier: "Nationwide",
          title: "Auto quote",
          filename: "Nationwide_auto_quote.pdf",
          premium: "$1,763",
          rows: [
            { label: "Named insured", value: "Hank Fischer" },
            { label: "Liability", value: "100/300" },
            { label: "Comp / collision", value: "$1,000 / $1,000" },
            { label: "Quoted", value: "October 9, 2026" },
          ],
        }),
      ],
    },
  },
  outreach: {
    subject: "A heads up on your November 13 renewal",
    email: email(
      "Hi Hank,",
      "Hope you're doing well. It's that time of year again, and I wanted to give you a heads up on where your renewal is coming in.",
      "Your auto renews on November 13 at $1,808, which is about $210 more than last year. Most of that is adding Nolan as a driver in July.",
      "When one comes in like this, I'd like to shop it and see what else is out there for you. Before I can, there are a few details I need to confirm, including Nolan's license number. It takes about five minutes:",
      `Answer a few quick questions → ${link("fischer")}`,
      "Once I have your answers I'll get to work and come back to you well before the 13th.",
      "Jenna",
    ),
  },
  monday: "shopped",
  story: {
    story: [
      "Quoted Hank's auto with Ohio Mutual and Nationwide against Grange's renewal.",
      "Ohio Mutual matched every limit and deductible he has today for $1,573: $235 back this year, about $20 a month.",
      "Nolan rates the same with Ohio Mutual as with Grange, so the save is all price.",
      "Nationwide came in at $1,763, but only by moving both deductibles to $1,000.",
    ],
    about: {
      om: "The same coverage he has with Grange, for $235 less.",
      grange: "Renews as it is, up 13% since Nolan was added. Nothing changes on the policy.",
      nw: "$45 less than Grange, but both deductibles move to $1,000.",
    },
  },
};

/* ------------------------------------------------------------------ *
 * Lena Park (was Hank Kowalski): approved, to bind Monday
 * ------------------------------------------------------------------ */

const parkEmails = {
  grange: email(
    "Hi Lena,",
    "You asked me to see whether anyone beats Erie, and someone does. Grange came back at $2,082 for the same coverage, $257 less than your renewal, which came in at the same price as last year.",
    callMe,
  ),
  erie: email(
    "Hi Lena,",
    "I shopped your auto ahead of November 7. Erie is renewing at $2,339, the same as last year.",
    "Grange came in lower for the same coverage, but staying put is on the table if you'd rather keep things as they are.",
    nothingChanges,
  ),
  nw: email(
    "Hi Lena,",
    "I shopped your auto ahead of November 7. Nationwide came back at $2,246, $93 less than Erie, but your uninsured motorist coverage would drop to 100/300.",
    callMe,
  ),
};

const park: FirstCard = {
  card: {
    id: "inv-168",
    name: "Lena Park",
    first: "Lena",
    email: "lena.park@gmail.com",
    kinds: ["auto"],
    carrier: "Erie",
    lines: "Auto · Erie",
    renewal: "Nov 7",
    daysOut: 4,
    jumpPct: 0,
    was: 2339,
    premium: 2339,
    note: "Approved Grange. Not bound.",
    col: "binding",
    ageDays: 4,
    owes: ["Bind Grange in the portal", "Send Erie the cancellation"],
  },
  file: {
    namedInsured: "Lena Park",
    phone: "(330) 555-0158",
    address: "915 Kent Rd, Kent, OH 44240",
    people: [{ name: "Lena Park", role: "Named insured" }],
    vehicles: [{ year: "2022", make: "Mazda", model: "CX-5" }],
    policies: [{ line: "Personal auto", carrier: "Erie", current: 2339, renewal: 2339, detail: "1 vehicle · 1 driver" }],
    driver: "Flat renewal, the same as last year. Lena asked us to shop it anyway: she's been with Erie eleven years and never compared.",
    shopCarriers: ["Erie", "Grange", "Nationwide"],
    rec: {
      pick: "Grange",
      summary: "Our recommendation: move Lena to Grange. She'll have the same coverage she has with Erie, and it'll cost her $257 less this year.",
      email: parkEmails.grange,
      currentLabel: "Erie",
      cols: [
        { id: "grange", name: "Grange" },
        { id: "nw", name: "Nationwide" },
      ],
      coverage: [
        {
          label: "Annual premium",
          current: "$2,339",
          quotes: { grange: "$2,082", nw: "$2,246" },
          help: "What she would pay for a year if this quote is written.",
        },
        {
          label: "Auto liability",
          current: "250/500",
          quotes: { grange: true, nw: true },
          help: "Bodily injury limits if she hurts someone in a crash. 250/500 is $250,000 per person, $500,000 per accident.",
        },
        {
          label: "Uninsured motorist",
          current: "250/500",
          quotes: { grange: true, nw: "100/300" },
          help: "What covers her if the other driver has no insurance, or too little.",
        },
        {
          label: "Comp / collision",
          current: "$500 / $500",
          quotes: { grange: true, nw: true },
          help: "Deductibles on the car. Comprehensive is weather and theft. Collision is hitting something.",
        },
      ],
      biggest: [
        { carrier: "Grange", text: "$2,082. The same coverage, $257 less than Erie." },
        { carrier: "Nationwide", text: "$2,246. Uninsured motorist drops to 100/300." },
      ],
      options: [
        { id: "grange", name: "Grange", lines: "auto", price: 2082, email: parkEmails.grange },
        { id: "erie", name: "Erie", lines: "auto", price: 2339, current: true, email: parkEmails.erie },
        { id: "nw", name: "Nationwide", lines: "auto", price: 2246, email: parkEmails.nw },
      ],
      talkingPoints: [
        "Grange writes the same auto for $257 less, about $21 a month.",
        "Erie came in flat, so this is the first save in years of not comparing.",
        "Nationwide is $93 under Erie, but uninsured motorist drops to 100/300.",
      ],
      quotes: [
        quoteDoc({
          id: "erie-auto",
          carrier: "Erie",
          title: "Personal auto renewal",
          filename: "Erie_auto_renewal.pdf",
          current: true,
          premium: "$2,339",
          rows: [
            { label: "Named insured", value: "Lena Park" },
            { label: "Liability", value: "250/500" },
            { label: "Comp / collision", value: "$500 / $500" },
            { label: "Vehicle", value: "2022 Mazda CX-5" },
            { label: "Effective", value: "November 7, 2026" },
          ],
        }),
        quoteDoc({
          id: "grange",
          carrier: "Grange",
          title: "Auto quote",
          filename: "Grange_auto_quote.pdf",
          premium: "$2,082",
          rows: [
            { label: "Named insured", value: "Lena Park" },
            { label: "Liability", value: "250/500" },
            { label: "Uninsured motorist", value: "250/500" },
            { label: "Quoted", value: "October 2, 2026" },
          ],
        }),
        quoteDoc({
          id: "nw",
          carrier: "Nationwide",
          title: "Auto quote",
          filename: "Nationwide_auto_quote.pdf",
          premium: "$2,246",
          rows: [
            { label: "Named insured", value: "Lena Park" },
            { label: "Liability", value: "250/500" },
            { label: "Uninsured motorist", value: "100/300" },
            { label: "Quoted", value: "October 2, 2026" },
          ],
        }),
      ],
    },
  },
  outreach: {
    subject: "Your November 7 renewal",
    email: email(
      "Hi Lena,",
      "Your auto renews on November 7 at $2,339, the same as last year, so there's nothing you need to do.",
      "You mentioned you'd like to see whether anyone beats Erie. If you still would, I'm happy to shop it. It takes about five minutes to get me what I need:",
      `Answer a few quick questions → ${link("park")}`,
      "Jenna",
    ),
  },
  monday: "closing",
  story: {
    story: [
      "Quoted Lena's auto with Grange and Nationwide against Erie's renewal, which came in flat.",
      "Grange matched every limit and deductible she has today for $2,082: $257 back this year, about $21 a month.",
      "Nationwide came in at $2,246, but uninsured motorist drops from 250/500 to 100/300.",
    ],
    about: {
      grange: "The same coverage she has with Erie, for $257 less.",
      erie: "Renews as it is, the same price as last year. Nothing changes on the policy.",
      nw: "$93 less than Erie, but uninsured motorist drops to 100/300.",
    },
  },
};

/* ------------------------------------------------------------------ *
 * Grace Tanaka: bound before the walk
 * ------------------------------------------------------------------ */

const tanakaEmails = {
  erie: email(
    "Hi Grace,",
    "I shopped your home and auto ahead of November 6. Erie came back at $4,002 for the same coverage you have with Ohio Mutual, about $650 less than the renewal.",
    "That's more than the $180 the renewal went up, so it's worth a look.",
    callMe,
  ),
  om: email(
    "Hi Grace,",
    "I shopped your home and auto ahead of November 6. Ohio Mutual is still your current carrier at $4,654.",
    "Erie came in lower for the same coverage, but staying put is on the table if that's what you and Ken want to do.",
    nothingChanges,
  ),
  west: email(
    "Hi Grace,",
    "I shopped your home and auto ahead of November 6. Westfield came back at $4,421, $233 less than Ohio Mutual, but the home deductible would move to $2,500.",
    callMe,
  ),
};

const tanaka: FirstCard = {
  card: {
    id: "inv-173",
    name: "Grace Tanaka",
    first: "Grace",
    email: "grace.tanaka@gmail.com",
    kinds: ["home", "auto"],
    carrier: "Ohio Mutual",
    lines: "Home + Auto · Ohio Mutual",
    renewal: "Nov 6",
    daysOut: 3,
    jumpPct: 4,
    was: 4475,
    premium: 4654,
    note: "Bound with Erie.",
    col: "binding",
  },
  file: {
    namedInsured: "Grace Tanaka",
    phone: "(330) 555-0171",
    address: "3307 Darrow Rd, Stow, OH 44224",
    people: [
      { name: "Grace Tanaka", role: "Named insured", note: "Primary contact" },
      { name: "Ken Tanaka", role: "Spouse", note: "Named insured" },
    ],
    vehicles: [
      { year: "2021", make: "Toyota", model: "RAV4" },
      { year: "2018", make: "Honda", model: "Odyssey" },
    ],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Ohio Mutual", current: 1860, renewal: 1930, detail: "Dwelling $420,000 · $1,000 AOP" },
      { line: "Personal auto", carrier: "Ohio Mutual", current: 2615, renewal: 2724, detail: "2 vehicles · 2 drivers" },
    ],
    home: { roof: "Replaced 2015", trampoline: "Yes", dog: "No" },
    driver: "Ohio Mutual is up 4% on home and auto. Under 10%, so the email offered a shop, and Grace took it.",
    shopCarriers: ["Ohio Mutual", "Erie", "Westfield"],
    rec: {
      pick: "Erie",
      summary: "Our recommendation: move Grace and Ken to Erie. They'll have the same coverage they have with Ohio Mutual, and it'll cost them $652 less this year.",
      email: tanakaEmails.erie,
      currentLabel: "Ohio Mutual",
      cols: [
        { id: "erie", name: "Erie" },
        { id: "west", name: "Westfield" },
      ],
      coverage: [
        {
          label: "Annual premium",
          current: "$4,654",
          quotes: { erie: "$4,002", west: "$4,421" },
          help: "What they would pay for a year if this quote is written.",
        },
        {
          label: "Dwelling",
          current: "$420,000",
          quotes: { erie: true, west: true },
          help: "The rebuild limit on the house. Matches what Ohio Mutual has on file today.",
        },
        {
          label: "Home deductible",
          current: "$1,000",
          quotes: { erie: true, west: "$2,500" },
          help: "What they pay out of pocket on a home claim before the carrier pays.",
        },
        {
          label: "Auto liability",
          current: "250/500",
          quotes: { erie: true, west: true },
          help: "Bodily injury limits if they hurt someone in a crash. 250/500 is $250,000 per person, $500,000 per accident.",
        },
        {
          label: "Comp / collision",
          current: "$500 / $500",
          quotes: { erie: true, west: true },
          help: "Deductibles on the cars. Comprehensive is weather and theft. Collision is hitting something.",
        },
      ],
      biggest: [
        { carrier: "Erie", text: "$4,002. The same coverage, $652 less than Ohio Mutual." },
        { carrier: "Westfield", text: "$4,421. The home deductible moves to $2,500." },
      ],
      options: [
        { id: "erie", name: "Erie", lines: "home and auto", price: 4002, email: tanakaEmails.erie },
        { id: "om", name: "Ohio Mutual", lines: "home and auto", price: 4654, current: true, email: tanakaEmails.om },
        { id: "west", name: "Westfield", lines: "home and auto", price: 4421, email: tanakaEmails.west },
      ],
      talkingPoints: [
        "Erie writes the same home and auto for $652 less, about $54 a month.",
        "That's more than three times what the renewal went up.",
        "Westfield is $233 under Ohio Mutual, but only with a $2,500 home deductible.",
      ],
      quotes: [
        quoteDoc({
          id: "om-home",
          carrier: "Ohio Mutual",
          title: "Homeowners renewal",
          filename: "OhioMutual_HO3_renewal.pdf",
          current: true,
          premium: "$1,930",
          rows: [
            { label: "Named insured", value: "Grace Tanaka" },
            { label: "Dwelling", value: "$420,000" },
            { label: "Deductible", value: "$1,000" },
            { label: "Effective", value: "November 6, 2026" },
          ],
        }),
        quoteDoc({
          id: "om-auto",
          carrier: "Ohio Mutual",
          title: "Personal auto renewal",
          filename: "OhioMutual_auto_renewal.pdf",
          current: true,
          premium: "$2,724",
          rows: [
            { label: "Named insured", value: "Grace Tanaka" },
            { label: "Liability", value: "250/500" },
            { label: "Vehicles", value: "2021 Toyota RAV4 · 2018 Honda Odyssey" },
            { label: "Effective", value: "November 6, 2026" },
          ],
        }),
        quoteDoc({
          id: "erie",
          carrier: "Erie",
          title: "Home and auto quote",
          filename: "Erie_HA_quote.pdf",
          premium: "$4,002",
          rows: [
            { label: "Named insured", value: "Grace Tanaka" },
            { label: "Dwelling", value: "$420,000" },
            { label: "Home deductible", value: "$1,000" },
            { label: "Auto liability", value: "250/500" },
            { label: "Quoted", value: "September 28, 2026" },
          ],
        }),
        quoteDoc({
          id: "west",
          carrier: "Westfield",
          title: "Home and auto quote",
          filename: "Westfield_HA_quote.pdf",
          premium: "$4,421",
          rows: [
            { label: "Named insured", value: "Grace Tanaka" },
            { label: "Dwelling", value: "$420,000" },
            { label: "Home deductible", value: "$2,500" },
            { label: "Auto liability", value: "250/500" },
            { label: "Quoted", value: "September 28, 2026" },
          ],
        }),
      ],
    },
  },
  outreach: {
    subject: "A heads up on your November 6 renewal",
    email: email(
      "Hi Grace,",
      "Hope you and Ken are doing well. Your home and auto renew on November 6 at $4,654, about $180 more than last year.",
      "That's a small bump, so there's nothing you need to do. If you'd like, I can shop it and see whether anyone beats Ohio Mutual. It takes about five minutes to get me what I need:",
      `Answer a few quick questions → ${link("tanaka")}`,
      "Either way, I'll make sure everything's in place before the 6th.",
      "Jenna",
    ),
  },
  story: {
    story: [
      "Quoted Grace and Ken's home and auto with Erie and Westfield against Ohio Mutual's renewal.",
      "Erie matched every limit and deductible they have today for $4,002: $652 back this year, about $54 a month.",
      "Westfield came in at $4,421, but only by moving the home deductible from $1,000 to $2,500.",
    ],
    about: {
      erie: "The same coverage they have with Ohio Mutual, for $652 less.",
      om: "Renews as it is, up 4%. Nothing changes on the policy.",
      west: "$233 less than Ohio Mutual, but the home deductible moves to $2,500.",
    },
  },
};

/* ------------------------------------------------------------------ *
 * Elena Varga (was Iris Fischer): next week's email, waiting from Wednesday
 * ------------------------------------------------------------------ */

const varga: FirstCard = {
  card: {
    id: "inv-10",
    name: "Elena Varga",
    first: "Elena",
    email: "elena.varga@gmail.com",
    kinds: ["home", "auto"],
    carrier: "Auto-Owners",
    lines: "Home + Auto · Auto-Owners",
    renewal: "Dec 18",
    daysOut: 45,
    jumpPct: 16,
    was: 4886,
    premium: 5668,
    note: "Roof moved to actual cash value.",
    col: "outreach",
  },
  file: {
    namedInsured: "Elena Varga",
    phone: "(330) 555-0183",
    address: "4120 Hudson Dr, Stow, OH 44224",
    people: [
      { name: "Elena Varga", role: "Named insured", note: "Primary contact" },
      { name: "Laszlo Varga", role: "Spouse", note: "Named insured" },
    ],
    vehicles: [
      { year: "2023", make: "Hyundai", model: "Palisade" },
      { year: "2019", make: "Kia", model: "Soul" },
    ],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Auto-Owners", current: 2210, renewal: 2690, detail: "Dwelling $455,000 · $1,000 AOP" },
      { line: "Personal auto", carrier: "Auto-Owners", current: 2676, renewal: 2978, detail: "2 vehicles · 2 drivers" },
    ],
    home: { roof: "Original 2008", trampoline: "No", dog: "No" },
    driver: "Auto-Owners is up 16% on home and auto. Most of it is on the house: the roof is from 2008, and Auto-Owners now pays a roof claim at actual cash value.",
  },
  outreach: {
    subject: "A heads up on your December 18 renewal",
    email: email(
      "Hi Elena,",
      "Hope you and Laszlo are doing well. It's that time of year again, and I wanted to give you a heads up on where your renewal is coming in.",
      "Your home and auto renew on December 18 at $5,668, which is about $780 more than last year. Most of that is on the house: the roof is from 2008, and Auto-Owners will now pay a roof claim at actual cash value rather than full replacement.",
      "That's a change worth shopping. Before I can, there are a few details I need to confirm. It takes about five minutes:",
      `Answer a few quick questions → ${link("varga")}`,
      "Once I have your answers I'll get to work and come back to you well before the 18th.",
      "Jenna",
    ),
    waitsOn: ["wed", "thu", "fri"],
  },
};

/* ------------------------------------------------------------------ *
 * Sara Ortiz: this week's email, answered Wednesday night
 * ------------------------------------------------------------------ */

const ortiz: FirstCard = {
  card: {
    id: "inv-82",
    name: "Sara Ortiz",
    first: "Sara",
    email: "sara.ortiz@gmail.com",
    kinds: ["home", "auto"],
    carrier: "Erie",
    lines: "Home + Auto · Erie",
    renewal: "Nov 26",
    daysOut: 23,
    jumpPct: 4,
    was: 4706,
    premium: 4894,
    note: "Under 10%. Soft shop offer.",
    col: "outreach",
  },
  file: {
    namedInsured: "Sara Ortiz",
    phone: "(330) 555-0105",
    address: "1690 Treetop Trl, Akron, OH 44313",
    people: [
      { name: "Sara Ortiz", role: "Named insured", note: "Primary contact" },
      { name: "Rafael Ortiz", role: "Spouse", note: "Named insured" },
    ],
    vehicles: [
      { year: "2020", make: "Toyota", model: "Highlander" },
      { year: "2017", make: "Honda", model: "Fit" },
    ],
    policies: [
      { line: "Homeowners (HO-3)", carrier: "Erie", current: 1906, renewal: 1982, detail: "Dwelling $350,000 · $1,000 AOP" },
      { line: "Personal auto", carrier: "Erie", current: 2800, renewal: 2912, detail: "2 vehicles · 2 drivers" },
    ],
    home: { roof: "Replaced 2021", trampoline: "No", dog: "Yes · golden retriever" },
    driver: "Erie is up 4% on home and auto. Under 10%, and there are no claims, so the email offers a shop rather than pushing one.",
    shopCarriers: ["Erie", "Nationwide", "Ohio Mutual"],
  },
  outreach: {
    subject: "A heads up on your November 26 renewal",
    email: email(
      "Hi Sara,",
      "Hope you and Rafael are doing well. Your home and auto renew on November 26 at $4,894, about $190 more than last year.",
      "That's a small bump, so there's nothing you need to do. If you'd like, I can shop it and see whether anyone beats Erie. It takes about five minutes to get me what I need:",
      `Answer a few quick questions → ${link("ortiz")}`,
      "Either way, I'll make sure everything's in place before the 26th.",
      "Jenna",
    ),
    waitsOn: ["mon"],
  },
};

export const firstCards: Record<string, FirstCard> = Object.fromEntries(
  [doyle, lowry, fischer, park, tanaka, varga, ortiz].map((f) => [f.card.id, f]),
);
