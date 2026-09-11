/**
 * Sample data for the owner view — the weekly, peace-of-mind counterpart to the
 * business dashboard. Illustrative, not a live book.
 *
 * The premise: the owner delegated retention outreach to his team while he
 * chased growth, and could never verify it happened. So the number he gets is
 * coverage (ours entirely, moves weekly), with retention as the standing
 * headline that moves slowly. Retention / commission figures match the Aug 24
 * sales deck so this screen and the dashboard agree.
 */

export const AGENCY = {
  name: 'Stockton Hill Insurance',
  bookSize: 1540,
  startedOn: 'June 2',
  weeksIn: 18,
  today: 'Monday, Oct 6',
};

/** What he sees in the first five seconds, on either device. */
export const VERDICT = {
  headline: 'Nothing has gone quiet.',
  dueWindow: 'next 30 days',
  dueCount: 124,
  dueCovered: 124,
  unattendedEver: 0,
  sinceLastLook: { days: 6, reached: 30, wentQuiet: 0 },
  standing: {
    retentionPct: '97%',
    kept: 93,
    cameDue: 96,
    commission: '$6,226',
  },
};

export type FreshnessId = 'fresh' | 'recent' | 'drifting' | 'quiet';

export interface FreshnessBand {
  id: FreshnessId;
  label: string;
  color: string;
  /** Households in this band on day one vs today. */
  start: number;
  now: number;
}

/**
 * Contact freshness across the whole book. Positions in the field stay fixed
 * per household and only the colour changes between snapshots, so the two
 * states read as the same book filling in rather than two different pictures.
 */
export const BANDS: FreshnessBand[] = [
  {
    id: 'fresh',
    label: 'Reached in the last 90 days',
    color: 'var(--chart-1)',
    start: 110,
    now: 430,
  },
  {
    id: 'recent',
    label: 'Three to six months ago',
    color: 'var(--chart-2)',
    start: 95,
    now: 260,
  },
  {
    id: 'drifting',
    label: 'Six to twelve months ago',
    color: 'var(--chart-3)',
    start: 385,
    now: 280,
  },
  {
    id: 'quiet',
    label: 'Over a year, or never',
    color: 'var(--chart-4)',
    start: 950,
    now: 570,
  },
];

export type FieldSnapshot = 'start' | 'now';

export const SNAPSHOTS: {
  id: FieldSnapshot;
  label: string;
  caption: string;
}[] = [
  {
    id: 'start',
    label: 'Day one · June 2',
    caption:
      'The day we turned it on: 950 of your 1,540 households had not heard from anyone in over a year. Nobody could have told you that number.',
  },
  {
    id: 'now',
    label: 'Today · Oct 6',
    caption:
      '570 still have not been reached, and that number falls about 20 a week. They are not neglected — they are households whose renewal has not come up yet. Upline works the calendar forward. What matters is that none of them has come due without being reached.',
  },
];

export type WorthKnowingKind = 'wants' | 'changed' | 'told';

export const WORTH_KNOWING_KINDS: Record<WorthKnowingKind, { label: string; hint: string }> = {
  wants: { label: 'Wants more coverage', hint: 'Asked us directly' },
  changed: { label: 'Something changed', hint: 'The questionnaire caught it' },
  told: { label: 'Told us something', hint: 'Volunteered, not asked' },
};

export interface WorthKnowing {
  id: string;
  kind: WorthKnowingKind;
  name: string;
  lines: string;
  said: string;
  why: string;
  opener: string;
}

/** Opportunities, not tasks. Five is the ceiling — a queue stops getting opened. */
export const WORTH_KNOWING: WorthKnowing[] = [
  {
    id: 'chris',
    kind: 'told',
    name: 'Chris Nguyen',
    lines: 'Home + umbrella',
    said: 'Mentioned he is opening a second location in Millersburg in the spring.',
    why: 'Commercial, workers comp, a commercial auto. None of it is in your book today, and he has not shopped it yet.',
    opener:
      'Chris — heard you are opening a second spot in the spring. Congratulations. Want me to walk you through what you will need to cover it before you sign the lease?',
  },
  {
    id: 'helen',
    kind: 'wants',
    name: 'Helen Cho',
    lines: 'Auto + umbrella',
    said: 'Asked whether $1M of umbrella is still enough now that her son is driving.',
    why: 'She is asking to buy. Roughly $180 of premium and a three-minute call.',
    opener:
      'Helen — good question on the umbrella. With a teen on the policy I would take you to $2M. It is about $15 a month. Want me to add it?',
  },
  {
    id: 'dan',
    kind: 'changed',
    name: 'Dan Fisher',
    lines: 'Auto',
    said: 'Added a teen driver, and gave a garage address that does not match your AMS.',
    why: 'Two things: the rating is wrong today, and so is your file. This is the kind of gap that turns into a denied claim.',
    opener:
      'Dan — before we bind, I want to confirm the garage address. We have 418 Walnut on file and you listed something different.',
  },
  {
    id: 'ana',
    kind: 'told',
    name: 'Ana Ruiz',
    lines: 'Home',
    said: 'Daughter is getting married in June. Asked in passing whether the ring is covered.',
    why: 'A scheduled personal property rider, and a household about to have a second one.',
    opener:
      'Ana — congratulations on your daughter. On the ring: it is only covered to your contents limit right now. Let me schedule it properly.',
  },
  {
    id: 'patels',
    kind: 'wants',
    name: 'The Patels',
    lines: 'Auto + home',
    said: 'Asked whether the home and the auto could sit with the same carrier.',
    why: 'A bundle they asked for. It is a discount for them and a much harder household to take from you.',
    opener:
      'Hi — you asked about putting the home and auto together. We shopped it. Here is what it looks like with both under one carrier.',
  },
];

export interface TrailEntry {
  date: string;
  who: 'upline' | 'household' | 'agency';
  text: string;
}

export interface SpotCheck {
  id: string;
  name: string;
  meta: string;
  status: string;
  trail: TrailEntry[];
}

/**
 * The spot-check pool. Deliberately mixed: two clean, one the owner himself
 * stopped, one still untouched. A verification tool that only returns good news
 * is not a verification tool.
 */
export const SPOT_CHECKS: SpotCheck[] = [
  {
    id: 'helen',
    name: 'Helen Cho',
    meta: 'Auto + umbrella · renews Oct 21 · last contact 2 days ago',
    status: 'Working',
    trail: [
      {
        date: 'Sep 22',
        who: 'upline',
        text: 'Renewal flagged. Premium up 4% — small increase.',
      },
      {
        date: 'Sep 29',
        who: 'upline',
        text: 'Email sent in your voice, framed honestly: “I probably would not shop this.”',
      },
      { date: 'Sep 30', who: 'household', text: 'Opened. No reply.' },
      { date: 'Oct 4', who: 'household', text: 'Started the questionnaire.' },
      {
        date: 'Oct 4',
        who: 'household',
        text: 'Asked whether $1M of umbrella is still enough with a teen driving.',
      },
      {
        date: 'Oct 5',
        who: 'upline',
        text: 'Surfaced to you as worth a call. Nothing auto-sent.',
      },
    ],
  },
  {
    id: 'marla',
    name: 'Marla Bennett',
    meta: 'Auto + home · renewed Aug 19 · closed',
    status: 'Renewed',
    trail: [
      {
        date: 'Jul 14',
        who: 'upline',
        text: 'Renewal flagged. Premium up 19%.',
      },
      { date: 'Jul 21', who: 'upline', text: 'Email sent. Opened same day.' },
      {
        date: 'Jul 24',
        who: 'household',
        text: 'Questionnaire submitted. Asked to be shopped.',
      },
      {
        date: 'Jul 28',
        who: 'upline',
        text: 'Shopped Progressive, Erie, Donegal. Best: Erie.',
      },
      {
        date: 'Jul 30',
        who: 'agency',
        text: 'You reviewed and sent the recommendation.',
      },
      {
        date: 'Aug 4',
        who: 'household',
        text: 'Said yes. Moved to Erie, saved $611.',
      },
      {
        date: 'Aug 19',
        who: 'upline',
        text: 'Renewal verified in your AMS. Counted here.',
      },
    ],
  },
  {
    id: 'millers',
    name: 'The Millers',
    meta: 'Home · renews Oct 18 · you stopped this one',
    status: 'Held by you',
    trail: [
      {
        date: 'Sep 19',
        who: 'upline',
        text: 'Renewal flagged. AMS note marked as a landmine.',
      },
      {
        date: 'Sep 19',
        who: 'upline',
        text: 'Draft written, queued for Sep 26.',
      },
      {
        date: 'Sep 24',
        who: 'agency',
        text: 'You held the send. Reason logged: family claim dispute.',
      },
      {
        date: 'Oct 6',
        who: 'upline',
        text: 'Still held. Nothing has gone out. Renewal is 12 days away.',
      },
    ],
  },
  {
    id: 'ray',
    name: 'Ray Whitfield',
    meta: 'Auto · renews Mar 14 · last contact 19 months ago',
    status: 'Not reached yet',
    trail: [
      {
        date: 'Jun 2',
        who: 'upline',
        text: 'Loaded from your AMS. Last contact of any kind: Feb 2025.',
      },
      {
        date: 'Jun 2',
        who: 'upline',
        text: 'Renewal is March, so he sits in the backlog until February.',
      },
      {
        date: 'Oct 6',
        who: 'upline',
        text: 'No outreach yet. This is one of the 570.',
      },
    ],
  },
  {
    id: 'priya',
    name: 'Priya Shah',
    meta: 'Auto + home · renews Oct 12 · you stopped this one',
    status: 'Held by you',
    trail: [
      {
        date: 'Sep 12',
        who: 'upline',
        text: 'Renewal flagged. Premium up 18%.',
      },
      {
        date: 'Sep 15',
        who: 'upline',
        text: 'Draft written. Prior note: she shops on double digits.',
      },
      { date: 'Sep 27', who: 'agency', text: 'You held it to call her first.' },
      {
        date: 'Oct 6',
        who: 'upline',
        text: 'Still held, 9 days. Renewal is 6 days away.',
      },
    ],
  },
  {
    id: 'jordan',
    name: 'Jordan Hale',
    meta: 'Auto · renews Oct 8 · waiting on your review',
    status: 'Working',
    trail: [
      {
        date: 'Sep 8',
        who: 'upline',
        text: 'Renewal flagged. Premium up 11%.',
      },
      {
        date: 'Sep 15',
        who: 'upline',
        text: 'Email sent. Opened, then replied asking to be shopped.',
      },
      {
        date: 'Sep 22',
        who: 'upline',
        text: 'Questionnaire in. 87 data points, 9 your AMS did not have.',
      },
      {
        date: 'Sep 30',
        who: 'upline',
        text: 'Shopped Progressive, Erie, Donegal.',
      },
      {
        date: 'Oct 2',
        who: 'upline',
        text: 'Recommendation drafted: Progressive, $184 less, same limits. Waiting on your review.',
      },
    ],
  },
];

export const TRAIL_WHO: Record<TrailEntry['who'], string> = {
  upline: 'Upline',
  household: 'Household',
  agency: 'You',
};
