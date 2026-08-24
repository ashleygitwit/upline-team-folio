import { ScenarioGanttSection } from '../components/ScenarioGanttSection';
import { BUILD_NOW_SCENARIO } from '../data/simulatedScenarios';

const MOVES: { item: string; current: string; scenario: string; note: string }[] = [
  {
    item: 'This week',
    current: 'Still in Stockton Hill holding (Aug 5–24)',
    scenario:
      '2 days sprint prep (Aug 24–25) → 3-day strategy sprint (Aug 26–28) → MVP planning (Aug 31–Sep 1)',
    note: 'Prep, then the sprint, then the MVP work — compressed into this week and next Monday.',
  },
  {
    item: 'Stockton Hill pilot',
    current: 'Aug 26 – Sep 16',
    scenario: 'Aug 26 – Sep 16',
    note: 'Same kickoff. In this scenario it runs beside the build, not in front of it.',
  },
  {
    item: 'Sprint / planning',
    current: 'Sep 17–18 prep · Sep 21–23 sprint · Sep 24–25 planning',
    scenario: 'Aug 24–25 prep · Aug 26–28 sprint · Aug 31–Sep 1 planning',
    note: 'Same three beats, in the same order, just pulled into this week. Current plan still waits until Stockton wraps.',
  },
  {
    item: 'Stockton synthesis',
    current: 'Absorbed into post-pilot sprint / planning',
    scenario: 'Sep 17 – 23 (one week after the pilot)',
    note: 'Writes back into a build that is already three weeks in.',
  },
  {
    item: 'MVP build',
    current: 'Sep 28 – Dec 4',
    scenario: 'Aug 31 – Nov 6',
    note: 'Same 10 weeks. Starts next Monday.',
  },
  {
    item: 'Launch',
    current: 'Dec 4 / around Thanksgiving',
    scenario: 'Nov 6 — before Thanksgiving',
    note: 'Four weeks earlier. Post-launch releases shift with it.',
  },
];

const MUST_BE_TRUE = [
  {
    item: 'This week’s two-day prep and three-day strategy sprint are enough to open MVP work on Monday.',
    implication:
      'The sprint sits between prep and MVP planning / the build. If that room still has to wait until after Stockton, this scenario collapses back to the current plan.',
  },
  {
    item: 'Someone can actually start building Monday, August 31.',
    implication:
      'Engineer in the chair, or a scoped first slice the current team can open. If that person is not there, launch stays on Dec 4.',
  },
  {
    item: 'Stockton Hill still kicks off August 26 — and a week of synthesis after it does not pause the build.',
    implication:
      'Same pilot dates as the current plan. The only change is they no longer sit in front of kickoff.',
  },
  {
    item: 'Members 1st is enough to start. Stockton learnings arrive during the build.',
    implication:
      'We already have one live pilot, a drafted experience, and a pricing hypothesis. The risk is over-fitting the first agency before the second one teaches us what generalizes.',
  },
];

export function ScenarioBuildNowPage() {
  return (
    <>
      <a className="page-back" href="#/roadmap">
        &larr; Back to roadmap
      </a>

      <section className="hero">
        <p className="eyebrow">Roadmap · Simulated scenario</p>
        <h1 className="hero-title">{BUILD_NOW_SCENARIO.title}.</h1>
        <p className="hero-sub">{BUILD_NOW_SCENARIO.assumption}</p>
      </section>

      <div className="phase-rule">
        <span>The punchline</span>
      </div>
      <section className="card phase-card">
        <div className="scenario-launch-row">
          <div className="scenario-launch-stat">
            <p className="tile-label">Build starts</p>
            <p className="scenario-launch-value">Aug 31</p>
            <p className="scenario-launch-note">Stockton Hill still starts Aug 26</p>
          </div>
          <div className="scenario-launch-stat">
            <p className="tile-label">Launch</p>
            <p className="scenario-launch-value">{BUILD_NOW_SCENARIO.launchLabel}</p>
            <p className="scenario-launch-note">Friday of build week 10</p>
          </div>
          <div className="scenario-launch-stat">
            <p className="tile-label">Vs. current plan</p>
            <p className="scenario-launch-value">
              {BUILD_NOW_SCENARIO.weeksPulledForward} weeks earlier
            </p>
            <p className="scenario-launch-note">Current launch is Dec 4</p>
          </div>
        </div>
      </section>

      <div className="phase-rule">
        <span>What moves</span>
      </div>
      <section className="card phase-card">
        <p className="export-hint">
          Stockton Hill dates do not change. What changes is that the build no longer waits for
          the pilot — or for a mid-September sprint week.
        </p>
        <div className="compare-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Current plan</th>
                <th>This scenario</th>
                <th>Why</th>
              </tr>
            </thead>
            <tbody>
              {MOVES.map((row) => (
                <tr key={row.item}>
                  <td>
                    <strong>{row.item}</strong>
                  </td>
                  <td>{row.current}</td>
                  <td>{row.scenario}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="phase-rule">
        <span>Timeline</span>
      </div>
      <ScenarioGanttSection heading="Layered against the current plan" showStats={false} />

      <div className="phase-rule">
        <span>What has to be true</span>
      </div>
      <section className="card phase-card">
        <ul className="proving-list">
          {MUST_BE_TRUE.map((row) => (
            <li key={row.item}>
              <strong>{row.item}</strong>
              <span className="scenario-implication">{row.implication}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
