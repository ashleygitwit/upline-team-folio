/**
 * The household drawer's data: Ashley's v2 (Upline — Happy path, v2 draft,
 * Sept 22), as v2.5 carries it word for word, trimmed to what the drawer uses.
 * The twelve households share their ids with v3's (data.ts), so the drawer
 * opens on the same household either way. Copied from v2.5's src/data.ts;
 * change it there first.
 */

export type Column = "outreach" | "shopping" | "recommend" | "binding";
export type Kind = "home" | "auto" | "umbrella";

export type Card = {
  id: string;
  name: string;
  first: string;
  email: string;
  kinds: Kind[];
  carrier: string;
  lines: string;
  renewal: string;
  daysOut: number;
  jumpPct: number;
  was: number;
  premium: number;
  note: string;
  col: Column;
  target?: boolean;
  ageDays?: number;
  owes?: string[];
};

export type TimelineItem = {
  label: string;
  date: string;
  state: "done" | "now" | "soon";
  detail?: string;
};

export type QuoteDoc = {
  id: string;
  carrier: string;
  title: string;
  filename: string;
  current?: boolean;
  pages: { kicker: string; rows: { label: string; value: string }[]; note?: string }[];
};

export type Rec = {
  pick: string;
  summary: string;
  email: string;
  currentLabel: string;
  cols: { id: string; name: string }[];
  coverage: { label: string; current: string; quotes: Record<string, string | true>; help?: string }[];
  biggest: { carrier: string; text: string }[];
  options: { id: string; name: string; lines: string; price: number; current?: boolean; email: string }[];
  talkingPoints: string[];
  quotes: QuoteDoc[];
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
  timeline?: TimelineItem[];
  rec?: Rec;
  closing?: { title: string; sub: string; timeline: TimelineItem[] };
};




export const money = (n: number) => "$" + n.toLocaleString("en-US");

export function zillow(address: string) {
  return `https://www.zillow.com/homes/${encodeURIComponent(address)}_rb/`;
}

/** A carrier document, drawn as three pages: the summary, the coverage and the conditions. */
export function quoteDoc({
  id,
  carrier,
  title,
  filename,
  current,
  premium,
  rows,
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
          { label: "Produced for", value: "Harbor Point Insurance" },
        ],
      },
    ],
  };
}

export const agency = {
  name: `Harbor Point Insurance`, short: `Harbor Point`, agent: {
    name: `Jenna Ruiz`, first: `Jenna`, initials: `JR`, title: `Account Manager`
  }, owner: `Greg Whitaker`, carrierCount: 7, markets: [`Erie`, `Auto-Owners`, `Grange`, `Ohio Mutual`, `Westfield`, `Cincinnati`, `Nationwide`], questionnaireHost: `harborpoint.coverage-review.com`, phone: `(330) 555-0140`, email: `jenna@harborpointins.com`
}, dana = {
  name: `Leah Pruitt`, first: `Leah`, last: `Pruitt`, household: `The Pruitts`, initials: `LP`, memberSince: 2018, address: `2214 Ridgewood Rd, Hudson, OH 44236`, email: `leah.pruitt@gmail.com`, phone: `(330) 555-0194`, carrier: `Erie`, renewalDate: `November 3, 2026`, daysOut: 34, currentPremium: 4820, renewalPremium: 5690, changeAmt: 870, changePct: 18
}, questionnaireUrl = `https://${agency.questionnaireHost}/d/pruitt`, outreachEmail = {
  subject: `A heads up on your November 3 renewal`, to: `${dana.name} <${dana.email}>`, from: `${agency.agent.name}, ${agency.name}`
}, outreachBody = [
  `Hi ${dana.first},`, `Hope you and Tom are doing well. It's that time of year again, and I wanted to give you a heads up on where your renewal is coming in.`, `Your home and auto renew on November 3 at $5,690, which is about $870 more than last year.`, `Increases can come from a few different places, the market, a claim, or a change in coverage during the year. When one comes in like this, I'd like to shop it and see what else is out there for you.`, `Before I can, there are a few details I need to confirm, especially Maya's driver's license number. It takes about five minutes:`, `Answer a few quick questions → ${questionnaireUrl}`, `Once I have your answers I'll get to work and come back to you well before the 3rd.`
], recEmail = {
  subject: `I looked at your November renewal`, to: `${dana.name} <${dana.email}>`, from: `${agency.agent.name}, ${agency.name}`
}, recBody = [
  `Hi ${dana.first},`, `I shopped your home and auto ahead of November 3. Auto-Owners came back at $4,640 for the same coverage you have with Erie, about $1,050 less than the renewal offer.`, `Maya rates cleanly, and nothing else on the household needed to change. I put the details on a short page so you can see the pick and why I didn't go another direction.`, `This does not put coverage in place. Reply to this email with a couple of times that work this week and I'll call you to walk it through.`
], cards: Card[] = [
  {
    id: `pruitt`, name: `Leah & Tom Pruitt`, first: `Leah`, email: `leah.pruitt@gmail.com`, kinds: [`home`, `auto`], carrier: `Erie`, lines: `Home + Auto · Erie`, renewal: `Nov 3`, daysOut: 22, jumpPct: 18, was: 4820, premium: 5690, note: `Maya licensed in August. DL# missing.`, col: `outreach`, target: true
  },
  {
    id: `whitmore`, name: `Doug & Carol Whitmore`, first: `Doug`, email: `doug.whitmore@gmail.com`, kinds: [`home`, `auto`], carrier: `Auto-Owners`, lines: `Home + Auto · Auto-Owners`, renewal: `Dec 4`, daysOut: 53, jumpPct: 14, was: 3614, premium: 4120, note: `Neighbor on Ridgewood. Ready to send.`, col: `outreach`
  },
  {
    id: `adeyemi`, name: `Tobi Adeyemi`, first: `Tobi`, email: `tobi.adeyemi@gmail.com`, kinds: [`auto`], carrier: `Grange`, lines: `Auto · Grange`, renewal: `Nov 30`, daysOut: 49, jumpPct: 22, was: 2344, premium: 2860, note: `Biggest jump this week.`, col: `outreach`
  },
  {
    id: `lindqvist`, name: `Jordan Lindqvist`, first: `Jordan`, email: `jordan.lindqvist@gmail.com`, kinds: [`home`, `umbrella`], carrier: `Westfield`, lines: `Home + Umbrella · Westfield`, renewal: `Dec 12`, daysOut: 61, jumpPct: 9, was: 1780, premium: 1940, note: `Under 10%. Soft shop offer.`, col: `outreach`
  },
  {
    id: `pham`, name: `Andy Pham`, first: `Andy`, email: `andy.pham@gmail.com`, kinds: [`auto`], carrier: `Erie`, lines: `Auto · Erie`, renewal: `Dec 10`, daysOut: 59, jumpPct: 0, was: 1680, premium: 1680, note: `Flat. Coverage and deductibles.`, col: `outreach`
  },
  {
    id: `conti`, name: `Marisa Conti`, first: `Marisa`, email: `marisa.conti@gmail.com`, kinds: [`home`, `auto`], carrier: `Ohio Mutual`, lines: `Home + Auto · Ohio Mutual`, renewal: `Nov 26`, daysOut: 45, jumpPct: 11, was: 3495, premium: 3880, note: `Held so Jenna can call first.`, col: `outreach`
  },
  {
    id: `rao`, name: `Neha Rao`, first: `Neha`, email: `neha.rao@gmail.com`, kinds: [`home`, `auto`], carrier: `Erie`, lines: `Home + Auto · Erie`, renewal: `Nov 19`, daysOut: 38, jumpPct: 16, was: 4517, premium: 5240, note: `Questionnaire in yesterday. VA on Auto-Owners.`, col: `shopping`
  },
  {
    id: `yates`, name: `Marcus Yates`, first: `Marcus`, email: `marcus.yates@gmail.com`, kinds: [`auto`], carrier: `Grange`, lines: `Auto · Grange`, renewal: `Nov 21`, daysOut: 40, jumpPct: 19, was: 2025, premium: 2410, note: `Waiting on a missing VIN.`, col: `shopping`
  },
  {
    id: `marin`, name: `Sofia Marin`, first: `Sofia`, email: `sofia.marin@gmail.com`, kinds: [`home`, `auto`], carrier: `Travelers`, lines: `Home + Auto · Travelers`, renewal: `Nov 13`, daysOut: 32, jumpPct: 18, was: 3568, premium: 4210, note: `Shop done. Rec does not auto-send.`, col: `recommend`
  },
  {
    id: `kemp`, name: `Walter Kemp`, first: `Walter`, email: `walter.kemp@gmail.com`, kinds: [`home`], carrier: `Nationwide`, lines: `Home · Nationwide`, renewal: `Nov 15`, daysOut: 34, jumpPct: 11, was: 2559, premium: 2840, note: `Stay recommendation. Three options on the page.`, col: `recommend`
  },
  {
    id: `mercer`, name: `Diane Mercer`, first: `Diane`, email: `diane.mercer@gmail.com`, kinds: [`home`, `auto`], carrier: `Erie`, lines: `Home + Auto · Erie`, renewal: `Nov 9`, daysOut: 28, jumpPct: 12, was: 3536, premium: 3960, note: `Approved Monday. Not bound.`, col: `binding`, ageDays: 4, owes: [`Bind Auto-Owners in the portal`, `Mark closed in Upline`]
  },
  {
    id: `iyer`, name: `Rhea Iyer`, first: `Rhea`, email: `rhea.iyer@gmail.com`, kinds: [`home`], carrier: `Westfield`, lines: `Home · Westfield`, renewal: `Nov 7`, daysOut: 26, jumpPct: 8, was: 1593, premium: 1720, note: `Approved last week.`, col: `binding`, ageDays: 6, owes: [`Bind Westfield`, `Confirm mortgagee clause`, `Mark closed in Upline`]
  }
];
const files: Record<string, HouseholdFile> = {
  pruitt: {
    namedInsured: `Leah Pruitt`, phone: `(330) 555-0194`, address: `2214 Ridgewood Rd, Hudson, OH 44236`, people: [
      {
        name: `Leah Pruitt`, role: `Named insured`, note: `Primary contact`
      },
      {
        name: `Tom Pruitt`, role: `Spouse`, note: `Named insured`
      },
      {
        name: `Maya Pruitt`, role: `Driver`, note: `Licensed Aug 2026 · DL# missing`
      }
    ], vehicles: [
      {
        year: `2019`, make: `Honda`, model: `CR-V`
      },
      {
        year: `2016`, make: `Toyota`, model: `Camry`
      }
    ], policies: [
      {
        line: `Homeowners (HO-3)`, carrier: `Erie`, current: 1640, renewal: 1785, detail: `Dwelling $485,000 · $1,000 AOP`
      },
      {
        line: `Personal auto`, carrier: `Erie`, current: 3180, renewal: 3905, detail: `2 vehicles · 3 drivers`
      }
    ], home: {
      roof: `Replaced 2024`, trampoline: `No`, dog: `No`
    }, driver: `Maya was licensed in August, which is causing the jump in Auto. There are no claims on file.`, shopCarriers: [`Auto-Owners`, `Erie`, `Grange`], timeline: [
      {
        label: `You sent the outreach email`, date: `Oct 13`, state: `done`
      },
      {
        label: `Leah completed the questionnaire`, date: `Oct 14`, state: `done`
      },
      {
        label: `VA is shopping Auto-Owners, Erie, and Grange`, date: `In progress`, state: `now`, detail: `Check back tomorrow for quotes.`
      },
      {
        label: `Renewal date. Coverage needs to be in place.`, date: `Nov 3`, state: `soon`
      }
    ]
  }, whitmore: {
    namedInsured: `Doug Whitmore`, phone: `(330) 555-0162`, address: `2208 Ridgewood Rd, Hudson, OH 44236`, people: [
      {
        name: `Doug Whitmore`, role: `Named insured`
      },
      {
        name: `Carol Whitmore`, role: `Spouse`, note: `Named insured`
      }
    ], vehicles: [
      {
        year: `2021`, make: `Ford`, model: `F-150`
      },
      {
        year: `2018`, make: `Subaru`, model: `Forester`
      }
    ], policies: [
      {
        line: `Homeowners (HO-3)`, carrier: `Auto-Owners`, current: 1520, renewal: 1740, detail: `Dwelling $410,000 · $1,000 AOP`
      },
      {
        line: `Personal auto`, carrier: `Auto-Owners`, current: 2094, renewal: 2380, detail: `2 vehicles · 2 drivers`
      }
    ], home: {
      roof: `Replaced 2019`, trampoline: `No`, dog: `Yes · yellow Labrador`
    }, driver: `Auto-Owners filed a rate increase in Ohio this summer. There are no claims on file, and nothing changed on their end.`
  }, adeyemi: {
    namedInsured: `Tobi Adeyemi`, phone: `(330) 555-0118`, address: `145 S Main St, Apt 4C, Akron, OH 44308`, people: [
      {
        name: `Tobi Adeyemi`, role: `Named insured`
      }
    ], vehicles: [
      {
        year: `2022`, make: `Tesla`, model: `Model Y`
      },
      {
        year: `2015`, make: `Honda`, model: `Civic`
      }
    ], policies: [
      {
        line: `Personal auto`, carrier: `Grange`, current: 2344, renewal: 2860, detail: `2 vehicles · 1 driver`
      }
    ], driver: `Two vehicles, one driver, and a 22% jump. Grange rerated the Tesla. There are no accidents on file.`
  }, lindqvist: {
    namedInsured: `Jordan Lindqvist`, phone: `(330) 555-0144`, address: `640 Fairway Ln, Stow, OH 44224`, people: [
      {
        name: `Jordan Lindqvist`, role: `Named insured`
      },
      {
        name: `Casey Lindqvist`, role: `Spouse`
      }
    ], vehicles: [], policies: [
      {
        line: `Homeowners (HO-3)`, carrier: `Westfield`, current: 1280, renewal: 1390, detail: `Dwelling $365,000 · $2,500 AOP`
      },
      {
        line: `Personal umbrella`, carrier: `Westfield`, current: 500, renewal: 550, detail: `$1M limit`
      }
    ], home: {
      roof: `Replaced 2021`, trampoline: `Yes`, dog: `Yes · goldendoodle`
    }, driver: `Westfield is up 9% on the house and the umbrella. Under 10%, and there are no claims. Soft shop is the offer.`
  }, pham: {
    namedInsured: `Andy Pham`, phone: `(330) 555-0177`, address: `31 Portage Trl, Cuyahoga Falls, OH 44221`, people: [
      {
        name: `Andy Pham`, role: `Named insured`
      }
    ], vehicles: [
      {
        year: `2020`, make: `Toyota`, model: `Tacoma`
      }
    ], policies: [
      {
        line: `Personal auto`, carrier: `Erie`, current: 1680, renewal: 1680, detail: `1 vehicle · 1 driver`
      }
    ], driver: `Flat renewal. Same number as last year. This one is coverage and deductibles, not price.`
  }, conti: {
    namedInsured: `Marisa Conti`, phone: `(330) 555-0133`, address: `512 Crain Ave, Kent, OH 44240`, people: [
      {
        name: `Marisa Conti`, role: `Named insured`
      }
    ], vehicles: [
      {
        year: `2017`, make: `Jeep`, model: `Grand Cherokee`
      }
    ], policies: [
      {
        line: `Homeowners (HO-3)`, carrier: `Ohio Mutual`, current: 1410, renewal: 1560, detail: `Dwelling $290,000 · $1,000 AOP`
      },
      {
        line: `Personal auto`, carrier: `Ohio Mutual`, current: 2085, renewal: 2320, detail: `1 vehicle · 1 driver`
      }
    ], home: {
      roof: `Replaced 2018`, trampoline: `No`, dog: `No`
    }, driver: `Ohio Mutual is up 11% on the package. There are no claims on file. Jenna wanted to call first before we email.`
  }, rao: {
    namedInsured: `Neha Rao`, phone: `(330) 555-0188`, address: `1022 Cambridge Dr, Kent, OH 44240`, people: [
      {
        name: `Neha Rao`, role: `Named insured`
      },
      {
        name: `Vikram Rao`, role: `Spouse`
      },
      {
        name: `Priyanka Rao`, role: `Driver`, note: `Age 19`
      }
    ], vehicles: [
      {
        year: `2019`, make: `Lexus`, model: `RX 350`
      },
      {
        year: `2014`, make: `Honda`, model: `Odyssey`
      }
    ], policies: [
      {
        line: `Homeowners (HO-3)`, carrier: `Erie`, current: 1980, renewal: 2260, detail: `Dwelling $520,000 · $1,000 AOP`
      },
      {
        line: `Personal auto`, carrier: `Erie`, current: 2537, renewal: 2980, detail: `2 vehicles · 3 drivers`
      }
    ], home: {
      roof: `Replaced 2022`, trampoline: `No`, dog: `Yes · shih tzu`
    }, shopCarriers: [`Auto-Owners`, `Erie`, `Grange`], timeline: [
      {
        label: `You sent the outreach email`, date: `Oct 6`, state: `done`
      },
      {
        label: `Neha completed the questionnaire`, date: `Oct 12`, state: `done`
      },
      {
        label: `VA is shopping Auto-Owners, Erie, and Grange`, date: `In progress`, state: `now`, detail: `Check back tomorrow for quotes.`
      },
      {
        label: `Renewal date. Coverage needs to be in place.`, date: `Nov 19`, state: `soon`
      }
    ]
  }, yates: {
    namedInsured: `Marcus Yates`, phone: `(330) 555-0109`, address: `1902 Sackett Ave, Cuyahoga Falls, OH 44223`, people: [
      {
        name: `Marcus Yates`, role: `Named insured`
      }
    ], vehicles: [
      {
        year: `2018`, make: `Chevrolet`, model: `Silverado`
      }
    ], policies: [
      {
        line: `Personal auto`, carrier: `Grange`, current: 2025, renewal: 2410, detail: `1 vehicle · 1 driver`
      }
    ], driver: `Grange is up 19% on the Silverado. Still waiting on a missing VIN. There are no accidents on file.`, shopCarriers: [`Erie`, `Auto-Owners`, `Grange`], timeline: [
      {
        label: `You sent the outreach email`, date: `Oct 6`, state: `done`
      },
      {
        label: `Marcus completed the questionnaire`, date: `Oct 11`, state: `done`
      },
      {
        label: `VA is shopping Erie, Auto-Owners, and Grange`, date: `In progress`, state: `now`, detail: `Check back tomorrow for quotes.`
      },
      {
        label: `Renewal date. Coverage needs to be in place.`, date: `Nov 21`, state: `soon`
      }
    ]
  }, marin: {
    namedInsured: `Sofia Marin`, phone: `(330) 555-0155`, address: `318 Hickory Ct, Stow, OH 44224`, people: [
      {
        name: `Sofia Marin`, role: `Named insured`
      },
      {
        name: `Mateo Marin`, role: `Spouse`
      }
    ], vehicles: [
      {
        year: `2020`, make: `Honda`, model: `Pilot`
      },
      {
        year: `2016`, make: `Toyota`, model: `Prius`
      }
    ], policies: [
      {
        line: `Homeowners (HO-3)`, carrier: `Travelers`, current: 1480, renewal: 1760, detail: `Dwelling $440,000 · $1,000 AOP`
      },
      {
        line: `Personal auto`, carrier: `Travelers`, current: 2088, renewal: 2450, detail: `2 vehicles · 2 drivers`
      }
    ], home: {
      roof: `Replaced 2020`, trampoline: `No`, dog: `Yes · beagle`
    }, driver: `Travelers is up 18% on the package. There are no claims on file, and nothing changed on her end.`, rec: {
      pick: `Auto-Owners`, summary: `Our recommendation: move Sofia to Auto-Owners. She'll have the same coverage she currently has with Travelers, but it'll cost her $730 less this year.`, email: `Hi Sofia,

I shopped your home and auto ahead of November 13. Auto-Owners came back at $3,480 for the same coverage you have with Travelers, about $730 less than the renewal offer.

Nothing on the household needed to change.

This does not put coverage in place. Reply with a couple of times that work this week and I'll call you to walk it through.`, currentLabel: `Travelers`, cols: [
        {
          id: `ao`, name: `Auto-Owners`
        },
        {
          id: `grange`, name: `Grange`
        },
        {
          id: `erie`, name: `Erie`
        }
      ], coverage: [
        {
          label: `Annual premium`, current: `$4,210`, quotes: {
            ao: `$3,480`, grange: `$3,920`, erie: `$4,050`
          }, help: `What she would pay for a year if this quote is written.`
        },
        {
          label: `Dwelling`, current: `$440,000`, quotes: {
            ao: true, grange: true, erie: true
          }, help: `The rebuild limit on the house. Matches what Travelers has on file today.`
        },
        {
          label: `Home deductible`, current: `$1,000`, quotes: {
            ao: true, grange: true, erie: `$2,500`
          }, help: `What she pays out of pocket on a home claim before the carrier pays.`
        },
        {
          label: `Auto liability`, current: `100/300`, quotes: {
            ao: true, grange: `250/500`, erie: true
          }, help: `Bodily injury limits if she hurts someone in a crash. 100/300 is $100,000 per person, $300,000 per accident.`
        },
        {
          label: `Uninsured motorist stacking`, current: `Stacked`, quotes: {
            ao: true, grange: true, erie: `Unstacked`
          }, help: `Whether uninsured-motorist limits from each car can be added together. Stacked is the stronger version.`
        },
        {
          label: `Comp / collision`, current: `$500 / $500`, quotes: {
            ao: true, grange: true, erie: true
          }, help: `Deductibles on the cars. Comprehensive is weather and theft. Collision is hitting something.`
        }
      ], biggest: [
        {
          carrier: `Auto-Owners`, text: `$3,480. Almost identical coverage, $730 less than Travelers if paid in full.`
        },
        {
          carrier: `Grange`, text: `$3,920. Auto liability goes to 250/500.`
        },
        {
          carrier: `Erie`, text: `$4,050. Home deductible moves to $2,500, and uninsured motorist is unstacked.`
        }
      ], options: [
        {
          id: `ao`, name: `Auto-Owners`, lines: `home and auto`, price: 3480, email: `Hi Sofia,

I shopped your home and auto ahead of November 13. Auto-Owners came back at $3,480 for the same coverage you have with Travelers, about $730 less than the renewal offer.

Nothing on the household needed to change.

This does not put coverage in place. Reply with a couple of times that work this week and I'll call you to walk it through.`
        },
        {
          id: `travelers`, name: `Travelers`, lines: `home and auto`, price: 4210, current: true, email: `Hi Sofia,

I shopped your home and auto ahead of November 13. Travelers is still your current carrier at $4,210.

The other quotes came in, and staying put is on the table if that is what you want to do.

This does not change anything on the policy. Reply if you want me to walk through the other quotes anyway.`
        },
        {
          id: `grange`, name: `Grange`, lines: `home and auto`, price: 3920, email: `Hi Sofia,

I shopped your home and auto ahead of November 13. Grange came back at $3,920. It is not the lowest number, but it does raise auto liability to 250/500.

This does not put coverage in place. Reply with a couple of times that work this week and I'll call you to walk it through.`
        },
        {
          id: `erie`, name: `Erie`, lines: `home and auto`, price: 4050, email: `Hi Sofia,

I shopped your home and auto ahead of November 13. Erie came back at $4,050. The home deductible would move to $2,500, which is the tradeoff on that number.

This does not put coverage in place. Reply with a couple of times that work this week and I'll call you to walk it through.`
        }
      ], talkingPoints: [
        `Auto-Owners will write the same home and auto for almost identical coverage. That is $730 a year back if paid in full.`, `Paid monthly, that is about $61 less each month than the Travelers renewal.`, `Grange raises auto liability to 250/500. That extra limit is worth having if she wants more protection, though it may not match what she needs right now.`, `Erie moves the home deductible to $2,500. That is the tradeoff behind a number that looks close.`, `Grange is not the most competitive on price. It does carry more coverage, including those higher liability limits.`
      ], quotes: [
        quoteDoc({
          id: `tv-home`, carrier: `Travelers`, title: `Homeowners renewal`, filename: `Travelers_HO3_renewal.pdf`, current: true, premium: `$1,760`, rows: [
            {
              label: `Named insured`, value: `Sofia Marin`
            },
            {
              label: `Dwelling`, value: `$440,000`
            },
            {
              label: `Deductible`, value: `$1,000`
            },
            {
              label: `Liability`, value: `$300,000`
            },
            {
              label: `Effective`, value: `November 13, 2026`
            }
          ]
        }), quoteDoc({
          id: `tv-auto`, carrier: `Travelers`, title: `Personal auto renewal`, filename: `Travelers_auto_renewal.pdf`, current: true, premium: `$2,450`, rows: [
            {
              label: `Named insured`, value: `Sofia Marin`
            },
            {
              label: `Liability`, value: `100/300`
            },
            {
              label: `Comp / collision`, value: `$500 / $500`
            },
            {
              label: `UM stacking`, value: `Stacked`
            },
            {
              label: `Vehicles`, value: `2020 Honda Pilot · 2016 Toyota Prius`
            }
          ]
        }), quoteDoc({
          id: `ao`, carrier: `Auto-Owners`, title: `Home and auto quote`, filename: `Auto-Owners_HA_quote.pdf`, premium: `$3,480`, rows: [
            {
              label: `Named insured`, value: `Sofia Marin`
            },
            {
              label: `Dwelling`, value: `$440,000`
            },
            {
              label: `Home deductible`, value: `$1,000`
            },
            {
              label: `Auto liability`, value: `100/300`
            },
            {
              label: `UM stacking`, value: `Stacked`
            },
            {
              label: `Quoted`, value: `October 14, 2026`
            }
          ]
        }), quoteDoc({
          id: `grange`, carrier: `Grange`, title: `Home and auto quote`, filename: `Grange_HA_quote.pdf`, premium: `$3,920`, rows: [
            {
              label: `Named insured`, value: `Sofia Marin`
            },
            {
              label: `Dwelling`, value: `$440,000`
            },
            {
              label: `Home deductible`, value: `$1,000`
            },
            {
              label: `Auto liability`, value: `250/500`
            },
            {
              label: `UM stacking`, value: `Stacked`
            },
            {
              label: `Quoted`, value: `October 14, 2026`
            }
          ]
        }), quoteDoc({
          id: `erie`, carrier: `Erie`, title: `Home and auto quote`, filename: `Erie_HA_quote.pdf`, premium: `$4,050`, rows: [
            {
              label: `Named insured`, value: `Sofia Marin`
            },
            {
              label: `Dwelling`, value: `$440,000`
            },
            {
              label: `Home deductible`, value: `$2,500`
            },
            {
              label: `Auto liability`, value: `100/300`
            },
            {
              label: `UM stacking`, value: `Unstacked`
            },
            {
              label: `Quoted`, value: `October 14, 2026`
            }
          ]
        })
      ]
    }
  }, kemp: {
    namedInsured: `Walter Kemp`, phone: `(330) 555-0121`, address: `77 Merriman Rd, Akron, OH 44303`, people: [
      {
        name: `Walter Kemp`, role: `Named insured`
      }
    ], vehicles: [], policies: [
      {
        line: `Homeowners (HO-3)`, carrier: `Nationwide`, current: 2559, renewal: 2840, detail: `Dwelling $310,000 · $2,500 AOP`
      }
    ], home: {
      roof: `Replaced 2017`, trampoline: `No`, dog: `No`
    }, driver: `Nationwide is up 11% on the house. The roof is from 2017. There are no claims on file.`, rec: {
      pick: `Nationwide`, summary: `Our recommendation: stay with Nationwide. Westfield is a little cheaper, but the coverage and claims path he already has are a better fit than chasing a small save.`, email: `Hi Walter,

I looked at your November 15 homeowners renewal. Nationwide came in at $2,840. Westfield was a little lower, but the coverage and claims path you already have are a better fit than chasing a small save.

This does not change anything on the policy. Reply if you want me to walk through the other quotes anyway.`, currentLabel: `Nationwide`, cols: [
        {
          id: `west`, name: `Westfield`
        },
        {
          id: `om`, name: `Ohio Mutual`
        },
        {
          id: `cin`, name: `Cincinnati`
        }
      ], coverage: [
        {
          label: `Annual premium`, current: `$2,840`, quotes: {
            west: `$2,690`, om: `$2,780`, cin: `$2,910`
          }, help: `What he would pay for a year if this quote is written.`
        },
        {
          label: `Dwelling`, current: `$310,000`, quotes: {
            west: true, om: true, cin: true
          }, help: `The rebuild limit on the house. Matches what Nationwide has on file today.`
        },
        {
          label: `Home deductible`, current: `$2,500`, quotes: {
            west: `$1,000`, om: true, cin: true
          }, help: `What he pays out of pocket on a home claim before the carrier pays.`
        },
        {
          label: `Roof settlement`, current: `Replacement`, quotes: {
            west: true, om: `ACV after 15 yrs`, cin: true
          }, help: `How the carrier pays a roof claim. Replacement is full cost. ACV after 15 years pays depreciated value.`
        }
      ], biggest: [
        {
          carrier: `Westfield`, text: `$2,690. $150 less, but the deductible drops to $1,000.`
        },
        {
          carrier: `Ohio Mutual`, text: `$2,780. Roof pays actual cash value after 15 years. His roof is 2017.`
        },
        {
          carrier: `Cincinnati`, text: `$2,910. Higher than the Nationwide renewal, with matching coverage.`
        }
      ], options: [
        {
          id: `nw`, name: `Nationwide`, lines: `homeowners`, price: 2840, current: true, email: `Hi Walter,

I looked at your November 15 homeowners renewal. Nationwide came in at $2,840. Westfield was a little lower, but the coverage and claims path you already have are a better fit than chasing a small save.

This does not change anything on the policy. Reply if you want me to walk through the other quotes anyway.`
        },
        {
          id: `west`, name: `Westfield`, lines: `homeowners`, price: 2690, email: `Hi Walter,

I looked at your November 15 homeowners renewal. Westfield came back at $2,690, $150 less than Nationwide. The deductible would drop to $1,000.

This does not put coverage in place. Reply if you want me to walk it through.`
        },
        {
          id: `om`, name: `Ohio Mutual`, lines: `homeowners`, price: 2780, email: `Hi Walter,

I looked at your November 15 homeowners renewal. Ohio Mutual came back at $2,780. They pay the roof actual cash value after 15 years, and yours is from 2017.

This does not put coverage in place. Reply if you want me to walk it through.`
        },
        {
          id: `cin`, name: `Cincinnati`, lines: `homeowners`, price: 2910, email: `Hi Walter,

I looked at your November 15 homeowners renewal. Cincinnati came back at $2,910, which is higher than staying with Nationwide.

This does not put coverage in place. Reply if you want me to walk it through.`
        }
      ], talkingPoints: [
        `Westfield is $150 less, but the deductible drops to $1,000.`, `Paid monthly, that Westfield save is about $13 a month.`, `Ohio Mutual pays the roof actual cash value after 15 years. His roof is 2017, so that may not match what he needs right now.`, `Cincinnati came in higher than the Nationwide renewal.`, `The save is small against moving the claim path this year.`
      ], quotes: [
        quoteDoc({
          id: `nw`, carrier: `Nationwide`, title: `Homeowners renewal`, filename: `Nationwide_HO3_renewal.pdf`, current: true, premium: `$2,840`, rows: [
            {
              label: `Named insured`, value: `Walter Kemp`
            },
            {
              label: `Dwelling`, value: `$310,000`
            },
            {
              label: `Deductible`, value: `$2,500`
            },
            {
              label: `Roof settlement`, value: `Replacement cost`
            },
            {
              label: `Effective`, value: `November 15, 2026`
            }
          ]
        }), quoteDoc({
          id: `west`, carrier: `Westfield`, title: `Homeowners quote`, filename: `Westfield_HO3_quote.pdf`, premium: `$2,690`, rows: [
            {
              label: `Named insured`, value: `Walter Kemp`
            },
            {
              label: `Dwelling`, value: `$310,000`
            },
            {
              label: `Deductible`, value: `$1,000`
            },
            {
              label: `Roof settlement`, value: `Replacement cost`
            },
            {
              label: `Quoted`, value: `October 16, 2026`
            }
          ]
        }), quoteDoc({
          id: `om`, carrier: `Ohio Mutual`, title: `Homeowners quote`, filename: `OhioMutual_HO3_quote.pdf`, premium: `$2,780`, rows: [
            {
              label: `Named insured`, value: `Walter Kemp`
            },
            {
              label: `Dwelling`, value: `$310,000`
            },
            {
              label: `Deductible`, value: `$2,500`
            },
            {
              label: `Roof settlement`, value: `ACV after 15 years`
            },
            {
              label: `Quoted`, value: `October 16, 2026`
            }
          ]
        }), quoteDoc({
          id: `cin`, carrier: `Cincinnati`, title: `Homeowners quote`, filename: `Cincinnati_HO3_quote.pdf`, premium: `$2,910`, rows: [
            {
              label: `Named insured`, value: `Walter Kemp`
            },
            {
              label: `Dwelling`, value: `$310,000`
            },
            {
              label: `Deductible`, value: `$2,500`
            },
            {
              label: `Roof settlement`, value: `Replacement cost`
            },
            {
              label: `Quoted`, value: `October 16, 2026`
            }
          ]
        })
      ]
    }
  }, mercer: {
    namedInsured: `Diane Mercer`, phone: `(330) 555-0190`, address: `860 Diagonal Rd, Akron, OH 44320`, people: [
      {
        name: `Diane Mercer`, role: `Named insured`
      }
    ], vehicles: [
      {
        year: `2018`, make: `Honda`, model: `CR-V`
      }
    ], policies: [
      {
        line: `Homeowners (HO-3)`, carrier: `Erie`, current: 1610, renewal: 1780, detail: `Dwelling $380,000 · $1,000 AOP`
      },
      {
        line: `Personal auto`, carrier: `Erie`, current: 1926, renewal: 2180, detail: `1 vehicle · 1 driver`
      }
    ], home: {
      roof: `Replaced 2023`, trampoline: `No`, dog: `No`
    }, driver: `Erie is up 12% on home and auto. There are no claims on file, and nothing changed on her end.`, closing: {
      title: `Close out Diane Mercer's renewal`, sub: `You reached out to Diane Mercer and recommended she switch from Erie to Auto-Owners. Record her decision before Nov 9 so this household can leave the queue.`, timeline: [
        {
          label: `You sent the outreach email`, date: `Oct 1`, state: `done`
        },
        {
          label: `She completed the questionnaire`, date: `Oct 3`, state: `done`
        },
        {
          label: `Shopping results were ready`, date: `Oct 6`, state: `done`
        },
        {
          label: `You sent the recommendation`, date: `Oct 8`, state: `done`, detail: `Switch from Erie to Auto-Owners.`
        },
        {
          label: `Close out Diane's renewal prior to her renewal date`, date: `Now`, state: `now`
        }
      ]
    }
  }, iyer: {
    namedInsured: `Rhea Iyer`, phone: `(330) 555-0166`, address: `405 Prospect St, Hudson, OH 44236`, people: [
      {
        name: `Rhea Iyer`, role: `Named insured`
      }
    ], vehicles: [], policies: [
      {
        line: `Homeowners (HO-3)`, carrier: `Westfield`, current: 1593, renewal: 1720, detail: `Dwelling $275,000 · $2,500 AOP`
      }
    ], home: {
      roof: `Original 2009`, trampoline: `No`, dog: `Yes · cavalier King Charles`
    }, driver: `Westfield is up 8% on the house. Under 10%. Stay is the recommendation.`, closing: {
      title: `Close out Rhea Iyer's renewal`, sub: `You reached out to Rhea Iyer and recommended she stay with Westfield. Record her decision before Nov 7 so this household can leave the queue.`, timeline: [
        {
          label: `You sent the outreach email`, date: `Sep 28`, state: `done`
        },
        {
          label: `She completed the questionnaire`, date: `Sep 30`, state: `done`
        },
        {
          label: `Shopping results were ready`, date: `Oct 4`, state: `done`
        },
        {
          label: `You sent the recommendation`, date: `Oct 6`, state: `done`, detail: `Stay with Westfield.`
        },
        {
          label: `Close out Rhea's renewal prior to her renewal date`, date: `Now`, state: `now`
        }
      ]
    }
  }
};
export const callahanFields = {
  confirm: [
    {
      id: `name`, label: `Named insured`, value: `Leah Pruitt`
    },
    {
      id: `email`, label: `Email`, value: `leah.pruitt@gmail.com`
    },
    {
      id: `phone`, label: `Mobile`, value: `(330) 555-0194`
    },
    {
      id: `address`, label: `Address`, value: `2214 Ridgewood Rd, Hudson, OH 44236`
    },
    {
      id: `home`, label: `Home`, value: `Erie HO-3 · dwelling $485,000`
    },
    {
      id: `auto`, label: `Vehicles`, value: `2019 Honda CR-V · 2016 Toyota Camry`
    },
    {
      id: `drivers`, label: `Drivers`, value: `Leah, Tom, Maya (added Aug 2026)`
    }
  ], ask: [
    {
      id: `dl`, prompt: `What's Maya's driver's license number?`
    },
    {
      id: `life`, prompt: `Want us to look at a life insurance quote while we shop?`
    },
    {
      id: `referral`, prompt: `Anyone else who should hear from us?`
    }
  ]
};

/** The household's file, or a thin one built from the card for anyone without a written file. */
export function fileFor(card: Card): HouseholdFile {
  return (
    files[card.id] ?? {
      namedInsured: card.name,
      phone: agency.phone,
      address: "Columbus, OH",
      people: [{ name: card.name, role: "Named insured" }],
      vehicles: [],
      policies: [{ line: card.lines, carrier: card.carrier, current: card.was, renewal: card.premium, detail: card.note }],
    }
  );
}
