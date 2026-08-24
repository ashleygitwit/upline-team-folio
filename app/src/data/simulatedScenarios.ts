import type { Initiative } from '../types';

export const BUILD_NOW_SCENARIO_ID = 'build-next-week';

export interface SimulatedScenario {
  id: string;
  title: string;
  shortLabel: string;
  assumption: string;
  launchLabel: string;
  launchDate: string;
  currentLaunchDate: string;
  weeksPulledForward: number;
  href: string;
}

/** Compressed this week, then the 10-week build starts Monday Aug 31. */
export const BUILD_NOW_SCENARIO: SimulatedScenario = {
  id: BUILD_NOW_SCENARIO_ID,
  title: 'Start building next week',
  shortLabel: 'Build next week',
  assumption:
    'This week is two days of sprint prep, then the three-day product strategy sprint, then MVP planning. The 10-week build starts Monday Aug 31. Stockton Hill still kicks off Aug 26 for three weeks, plus a week of synthesis after — running in tandem with the build.',
  launchLabel: 'Nov 6, 2026',
  launchDate: '2026-11-06',
  currentLaunchDate: '2026-12-04',
  weeksPulledForward: 4,
  href: '#/scenario-build-now',
};

function item(
  id: string,
  title: string,
  status: Initiative['status'],
  start: string,
  end: string,
  notes: string,
  milestone = false,
): Initiative {
  return {
    id,
    title,
    workstream: 'Product',
    status,
    owner: 'Ashley + Agent',
    start,
    end,
    notes,
    ...(milestone ? { milestone: true } : {}),
  };
}

/**
 * Published current plan — the gray overlay. Keep in sync with
 * data/venture-plan.json product dates.
 */
export const BUILD_NOW_CURRENT: Initiative[] = [
  item(
    'prod-stockton-hill',
    'Stockton Hill pilot',
    'Next',
    '2026-08-26',
    '2026-09-16',
    'Three weeks starting Aug 26.',
  ),
  item(
    'prod-sprint-prep',
    'Sprint prep',
    'Future',
    '2026-09-17',
    '2026-09-18',
    'One to two days after Stockton wraps.',
  ),
  item(
    'prod-strategy-sprint',
    'Product strategy sprint',
    'Future',
    '2026-09-21',
    '2026-09-23',
    'Three in-person days, then planning, then the build.',
  ),
  item(
    'prod-mvp-planning',
    'MVP planning',
    'Future',
    '2026-09-24',
    '2026-09-25',
    'Two days before the Sep 28 build kickoff.',
  ),
  item(
    'prod-mvp-build',
    'MVP build',
    'Future',
    '2026-09-28',
    '2026-12-04',
    '10-week build. Kickoff Sep 28. Launch around Thanksgiving.',
  ),
  item(
    'prod-mvp-launch',
    'MVP launch',
    'Future',
    '2026-12-04',
    '2026-12-04',
    'Ship date — the day the 10-week build lands.',
    true,
  ),
  item(
    'prod-oct-beta',
    'Optional Oct beta — design partners',
    'Future',
    '2026-10-12',
    '2026-11-20',
    'Only if engineer gate clears.',
  ),
  item(
    'prod-mvp-iterate',
    'MVP iteration — first customers',
    'Future',
    '2026-12-07',
    '2027-01-15',
    'First paying logos, tandem with R2.',
  ),
  item(
    'prod-release-2',
    'R2 — Close the loop',
    'Future',
    '2026-12-07',
    '2027-01-15',
    'Record calls/Zooms; write fresh detail back.',
  ),
  item(
    'prod-release-3',
    'R3 — VA portal',
    'Future',
    '2027-01-18',
    '2027-02-26',
    'Internal VA queues, upload, verification.',
  ),
  item(
    'prod-release-4',
    'R4 — RPA full-book AMS pull',
    'Future',
    '2027-03-01',
    '2027-04-09',
    'Onboarding unlock — EasyLinks / HawkSoft first.',
  ),
  item(
    'prod-release-5',
    'R5 — Gig-style VA onboarding',
    'Future',
    '2027-04-12',
    '2027-05-21',
    'Digital training + workflow so VAs come online without heavy babysitting.',
  ),
  item(
    'prod-release-6',
    'R6 — AMS replacement (data visibility)',
    'Future',
    '2027-05-24',
    '2027-07-02',
    'Show the repository internally, then to clients.',
  ),
];

/**
 * This week: 2-day prep, then 3-day strategy sprint, then MVP planning + build.
 * Stockton Hill still Aug 26, then a week of synthesis — in tandem.
 */
export const BUILD_NOW_INITIATIVES: Initiative[] = [
  item(
    'prod-sprint-prep',
    'Sprint prep',
    'In Flight',
    '2026-08-24',
    '2026-08-25',
    'Two days this week — Mon–Tue — instead of waiting until after Stockton.',
  ),
  item(
    'prod-strategy-sprint',
    'Product strategy sprint',
    'In Flight',
    '2026-08-26',
    '2026-08-28',
    'Three days this week — Wed–Fri — between prep and the MVP work.',
  ),
  item(
    'prod-mvp-planning',
    'MVP planning',
    'Next',
    '2026-08-31',
    '2026-09-01',
    'Two days at the open of the build — same length as the current plan, pulled forward.',
  ),
  item(
    'prod-mvp-build',
    'MVP build',
    'Next',
    '2026-08-31',
    '2026-11-06',
    'Same 10-week build, started four weeks earlier. Launch Friday Nov 6.',
  ),
  item(
    'prod-mvp-launch',
    'MVP launch',
    'Next',
    '2026-11-06',
    '2026-11-06',
    'Ship date — Friday of build week 10.',
    true,
  ),
  item(
    'prod-stockton-hill',
    'Stockton Hill pilot',
    'Next',
    '2026-08-26',
    '2026-09-16',
    'Same kickoff as the current plan. Runs in tandem with the build.',
  ),
  item(
    'prod-pilot-retro',
    'Stockton Hill synthesis',
    'Future',
    '2026-09-17',
    '2026-09-23',
    'One week after the three-week pilot. Writes back into a build already underway.',
  ),
  item(
    'prod-oct-beta',
    'Optional Oct beta — design partners',
    'Future',
    '2026-10-12',
    '2026-11-06',
    'Optional mid-build slice. Ends at the pulled-forward launch.',
  ),
  item(
    'prod-mvp-iterate',
    'MVP iteration — first customers',
    'Future',
    '2026-11-09',
    '2026-12-18',
    'First paying logos, shifted with the earlier launch.',
  ),
  item(
    'prod-release-2',
    'R2 — Close the loop',
    'Future',
    '2026-11-09',
    '2026-12-18',
    'Close the loop. Shifted ~4 weeks.',
  ),
  item(
    'prod-release-3',
    'R3 — VA portal',
    'Future',
    '2026-12-21',
    '2027-01-29',
    'VA portal. Shifted ~4 weeks.',
  ),
  item(
    'prod-release-4',
    'R4 — RPA full-book AMS pull',
    'Future',
    '2027-02-01',
    '2027-03-12',
    'RPA full-book AMS pull. Shifted ~4 weeks.',
  ),
  item(
    'prod-release-5',
    'R5 — Gig-style VA onboarding',
    'Future',
    '2027-03-15',
    '2027-04-23',
    'Gig-style VA onboarding. Shifted ~4 weeks.',
  ),
  item(
    'prod-release-6',
    'R6 — AMS replacement (data visibility)',
    'Future',
    '2027-04-26',
    '2027-06-04',
    'AMS replacement (data visibility). Shifted ~4 weeks.',
  ),
];

export const BUILD_NOW_OVERLAY: Record<string, Initiative> = Object.fromEntries(
  BUILD_NOW_CURRENT.map((initiative) => [initiative.id, initiative]),
);
