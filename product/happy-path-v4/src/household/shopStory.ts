/**
 * What the results say in words, for each household with a shop: `story` is
 * step 1's account of the shop, the biggest changes and the things to note,
 * as a few bullets (it was a paragraph until the 2026-09-29 review found the
 * paragraph harder to read than the table it was meant to explain), and
 * `about` is step 2's line on each plan, by option id, to help Jenna pick.
 * The numbers are the ones in each household's results (data.ts for the
 * Pruitts, household/data.ts for Sofia and Walter).
 */
export const shopStory: Record<string, { story: string[]; about: Record<string, string> }> = {
  pruitt: {
    story: [
      "Quoted Leah and Tom's home and auto with Auto-Owners and Grange against Erie's renewal.",
      "Auto-Owners matched every limit and deductible they have today for $4,640: $1,050 back this year, about $88 a month, more than Erie's $870 increase.",
      "Maya rates cleanly with Auto-Owners as a new driver, so most of the savings are on the auto.",
      "Grange came in at $5,210, but only by moving the home deductible from $1,000 to $2,500.",
    ],
    about: {
      ao: "The same limits and deductibles they have with Erie, for $1,050 less. Maya rates cleanly here, so most of the savings are on the auto.",
      grange: "$480 less than Erie, but the home deductible goes from $1,000 to $2,500.",
      erie: "Renews as it is, $870 more than last year. Nothing changes on the policy.",
    },
  },
  marin: {
    story: [
      "Quoted Sofia's home and auto with Auto-Owners, Grange and Erie against Travelers' renewal.",
      "Auto-Owners matched the coverage almost exactly for $3,480: $730 back this year, about $61 a month.",
      "Grange came in at $3,920 and raises auto liability to 250/500, more protection than Sofia carries today.",
      "Erie's $4,050 moves the home deductible to $2,500 and unstacks uninsured motorist.",
    ],
    about: {
      ao: "Almost identical coverage to Travelers, for $730 less.",
      travelers: "Renews as it is, up 18% with no claims on file. Nothing changes on the policy.",
      grange: "$290 less than Travelers, with auto liability raised to 250/500.",
      erie: "$160 less than Travelers, but the home deductible moves to $2,500 and uninsured motorist is unstacked.",
    },
  },
  kemp: {
    story: [
      "Quoted Walter's homeowners with Westfield, Ohio Mutual and Cincinnati against Nationwide's renewal.",
      "Westfield is the only real save at $2,690, $150 a year or about $13 a month, and it changes the deductible from $2,500 to $1,000.",
      "Ohio Mutual's $2,780 pays the roof actual cash value after 15 years, and Walter's roof is from 2017.",
      "Cincinnati came in higher than Nationwide.",
      "The save is small against moving the claims path this year.",
    ],
    about: {
      nw: "Renews as it is, with the coverage and claims path Walter already has. Up 11%, with no claims on file.",
      west: "$150 less, about $13 a month. The deductible changes from $2,500 to $1,000.",
      om: "$60 less, but the roof is paid actual cash value after 15 years, and Walter's is from 2017.",
      cin: "$70 more than Nationwide, with matching coverage.",
    },
  },
};
