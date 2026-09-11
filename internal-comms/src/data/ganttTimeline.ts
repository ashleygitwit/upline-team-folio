/* Road to Nov 6 — the product and go-to-market timelines as one chart.
   Source of truth is project-planning/timelines.md. Columns are calendar weeks
   (Mon-dated) through launch, then two roll-up columns for the demo ramp that
   runs past it. Bar start/end are 1-indexed and inclusive. */

export type GanttTone =
  | 'design'
  | 'dev'
  | 'qa'
  | 'pilot-a'
  | 'pilot-b'
  | 'launch'
  | 'outbound'
  | 'paid-1'
  | 'paid-2'
  | 'paid-3'
  | 'web'
  | 'event';

export type GanttBar = {
  label: string;
  start: number;
  end: number;
  tone: GanttTone;
  /* Bars only one or two columns wide cannot hold their label. Set this and the
     label sits just past the bar's right edge instead of being ellipsised. */
  labelOutside?: boolean;
};

export type GanttRow = {
  label: string;
  sub?: string;
  bars: GanttBar[];
};

export type GanttLane = {
  title: string;
  rows: GanttRow[];
};

export type GanttColumn = {
  key: string;
  label: string;
  dates: string;
};

export const GANTT_COLUMNS: GanttColumn[] = [
  { key: 'w1', label: 'W1', dates: 'Sep 14' },
  { key: 'w2', label: 'W2', dates: 'Sep 21' },
  { key: 'w3', label: 'W3', dates: 'Sep 28' },
  { key: 'w4', label: 'W4', dates: 'Oct 5' },
  { key: 'w5', label: 'W5', dates: 'Oct 12' },
  { key: 'w6', label: 'W6', dates: 'Oct 19' },
  { key: 'w7', label: 'W7', dates: 'Oct 26' },
  { key: 'w8', label: 'W8', dates: 'Nov 2' },
  { key: 'nov', label: 'Nov', dates: '9–30' },
  { key: 'dec', label: 'Dec', dates: 'all' },
];

export const GANTT_LANES: GanttLane[] = [
  {
    title: 'Product',
    rows: [
      {
        label: 'Design',
        sub: 'Ashley · Amanda',
        bars: [{ label: '3 weeks — done Oct 2', start: 1, end: 3, tone: 'design' }],
      },
      {
        label: 'Build',
        sub: 'Doug',
        bars: [{ label: '6 weeks — starts now, freeze Oct 23', start: 1, end: 6, tone: 'dev' }],
      },
      {
        label: 'QA',
        sub: 'no new surfaces',
        bars: [{ label: '2 weeks', start: 7, end: 8, tone: 'qa' }],
      },
      {
        label: 'Customers',
        sub: 'one hands to the next',
        bars: [
          { label: 'Stockton Hill', start: 1, end: 3, tone: 'pilot-a' },
          { label: 'Design partner — also our QA users', start: 4, end: 8, tone: 'pilot-b' },
          { label: 'Customer 1', start: 9, end: 10, tone: 'launch' },
        ],
      },
    ],
  },
  {
    title: 'Go-to-market',
    rows: [
      {
        label: 'Outbound',
        sub: 'Davie',
        bars: [{ label: 'Warm + cold — runs throughout', start: 1, end: 10, tone: 'outbound' }],
      },
      {
        label: 'Paid social',
        sub: 'Austin',
        bars: [
          { label: 'Launch & learn', start: 1, end: 3, tone: 'paid-1' },
          { label: 'Contributing', start: 4, end: 6, tone: 'paid-2' },
          { label: 'At scale', start: 7, end: 10, tone: 'paid-3' },
        ],
      },
      {
        label: 'Website',
        sub: 'Claire',
        bars: [{ label: 'QR page → v2', start: 1, end: 2, tone: 'web', labelOutside: true }],
      },
      {
        label: 'Events',
        sub: 'Brandon · Davie',
        bars: [
          { label: 'SIA + Young Agents', start: 1, end: 1, tone: 'event', labelOutside: true },
        ],
      },
      {
        label: 'Content',
        sub: 'Claire',
        bars: [
          {
            label: 'Press release, posting workflow',
            start: 1,
            end: 2,
            tone: 'event',
            labelOutside: true,
          },
        ],
      },
    ],
  },
];

export type GanttMilestone = {
  column: number;
  label: string;
  date: string;
  emphasis?: boolean;
};

/* Milestones mark the END of their column — the Friday of that week — so they
   render flush to the column's right edge. Labels stay to two short lines;
   columns are only ~70px wide. */
export const GANTT_MILESTONES: GanttMilestone[] = [
  { column: 1, label: 'Decisions closed', date: 'Sep 18' },
  { column: 3, label: 'Design done', date: 'Oct 2' },
  { column: 6, label: 'Feature freeze', date: 'Oct 23' },
  { column: 8, label: 'Launch', date: 'Nov 6', emphasis: true },
  { column: 9, label: '120 demos', date: 'Nov 30' },
  { column: 10, label: '30 contracts', date: 'Dec 31' },
];

export const GANTT_WATCH = [
  {
    when: 'Oct 2 · the ramp checkpoint',
    what: 'If outbound and the two conferences have not produced roughly 18 booked demos by here, the November number is already gone — paid cannot make it up, because it will not have finished learning. Whether we hit 120 is decided in the first three weeks, by the lane we are touching least.',
  },
  {
    when: 'W1 · Sep 14–18',
    what: 'The worst week of the eight. Design and dev both kick off, ten decisions close, Linear gets stood up, Stockton Hill starts, two conferences run, a QR page ships, and paid goes live.',
  },
  {
    when: 'W4 · Oct 5–9',
    what: 'Quietly the second worst. The riskiest dev week is sending from the agent’s mailbox, the design partner starts, and paid spend scales — none of which reschedule easily.',
  },
  {
    when: 'December',
    what: 'The only place the two timelines genuinely conflict. Go-to-market succeeding is what creates the product problem, and nobody owns the onboarding lane that absorbs it.',
  },
];
