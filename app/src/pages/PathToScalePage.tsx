import { useState } from 'react';

type ScenarioKey = 'A' | 'B';

const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

interface Scenario {
  key: ScenarioKey;
  label: string;
  tag: string;
  ramp: number[]; // cumulative customers, aligned to MONTHS
  vas: number[]; // VA headcount, aligned to MONTHS
  endCustomers: string;
  endVas: string;
  summary: string;
  automation: string;
  releases: { when: string; title: string; note: string }[];
}

// NOTE: ramp + VA numbers are DIRECTIONAL placeholders for Ashley to confirm.
const SCENARIOS: Record<ScenarioKey, Scenario> = {
  A: {
    key: 'A',
    label: 'Conservative',
    tag: 'VAs as a bridge',
    ramp: [1, 2, 2, 3, 5, 8, 11, 15],
    vas: [1, 1, 1, 2, 2, 3, 4, 5],
    endCustomers: '~15',
    endVas: '~5',
    summary:
      'Cap the VA team at ~5 (temporary) and pour effort into automated shopping ASAP. The ramp stays flat while we learn from the first few, then steepens in H2 2027 once automation lands.',
    automation: 'Push automated shopping hard and first — prioritized above other net-new features.',
    releases: [
      {
        when: '~mid-Feb 2027',
        title: 'Automated shopping (discovery → build)',
        note: 'The killer feature — prioritized first so we can lift the customer ceiling.',
      },
      {
        when: '~late Mar 2027',
        title: 'Automated full-book upload',
        note: 'Read from the AMS so onboarding a whole book stops being manual.',
      },
      {
        when: '~early May 2027',
        title: 'Close-the-loop + AMS write-back',
        note: 'Record calls/meetings, push fresh data back — keeps the repository current.',
      },
    ],
  },
  B: {
    key: 'B',
    label: 'Aggressive',
    tag: 'VAs as an Upline arm',
    ramp: [1, 2, 5, 10, 18, 28, 38, 48],
    vas: [1, 1, 2, 4, 7, 10, 13, 16],
    endCustomers: '~45–50',
    endVas: '~15–17',
    summary:
      'Stand up a real, managed VA team (Davey runs it) and sell "use your VAs or ours." This buys 1–2 years, funds a faster ramp, and de-risks the automation timeline — at the cost of running a people-heavy operation.',
    automation: 'Ease off automated shopping for 1–2 years — the VA arm covers shopping.',
    releases: [
      {
        when: '~mid-Feb 2027',
        title: 'Close-the-loop (record + write-back)',
        note: 'Full end-to-end experience; first step toward eventually replacing the AMS.',
      },
      {
        when: '~late Mar 2027',
        title: 'AMS read / write',
        note: 'Pull from and push to the AMS — data stays fresh both directions.',
      },
      {
        when: '~early May 2027',
        title: 'Team settings + broader feature set',
        note: 'Automated shopping deferred 1–2 yrs while the VA arm carries the load.',
      },
    ],
  },
};

interface WmtItem {
  text: string;
  scope: 'both' | 'A' | 'B';
}

const WHAT_MUST_BE_TRUE: WmtItem[] = [
  { scope: 'both', text: 'A dedicated engineer (Gitwit or Upline) is hired before the strategy-sprint week — the linchpin. Miss it and the whole timeline slips.' },
  { scope: 'both', text: 'VA #1 is hired and trained — job ad out ~now, trains during the Stockton Hill pilot, running shotgun by the MVP.' },
  { scope: 'both', text: 'A per-agency quoting playbook is excavated at onboarding (~1–2 wks/agency, RPA-assisted rather than hand-keyed).' },
  { scope: 'both', text: 'Automated-shopping discovery kicks off at the start of the MVP build — it is our biggest unknown, so we time-box it early.' },
  { scope: 'A', text: 'Automated shopping proves feasible on a tight timeline — it is prioritized above other net-new features to lift the customer ceiling.' },
  { scope: 'B', text: 'Davey leads a funded 15–17-person VA team, with "use your VAs or ours" as a priced line.' },
];

// Side-by-side detail — the comparison table.
interface CompareRow {
  label: string;
  a: string;
  b: string;
}

const COMPARE: CompareRow[] = [
  { label: 'End-Q2 ’27 ramp', a: '~15 customers', b: '~45–50 (15–17 VAs × ~3 agencies each)' },
  { label: 'VA posture', a: '~5 VAs max, temporary', b: 'Real managed team; Davey runs it; “use your VAs or ours” as a priced line' },
  { label: 'Automation posture', a: 'Push automated shopping hard & first', b: 'Ease off automation 1–2 yrs — VA arm covers shopping' },
  { label: 'Feature focus', a: 'MVP + iterate → automated shopping ASAP', b: 'Full end-to-end: close-the-loop, AMS read/write, team settings' },
  { label: 'Upside', a: 'Low burn, low hiring risk, deep learning', b: 'Faster revenue/logos, de-risks automation timeline, richer product' },
  { label: 'Cost / risk', a: 'Growth capped (~15) until automation lands (~late ’27); bets the ramp on a hard unknown', b: 'Heavy people management; a whole new ops business; more capital' },
];

const OPEN_FOR_ENGINEER = [
  'What has to be built first, and where can we pull work forward?',
  'Is the October beta feasible — and is the ~2-week compression real?',
  'How hard is automated shopping? (This decides A vs. B.)',
];

const OPEN_FOR_LEADERSHIP = [
  'Sales-cycle length + how far ahead of each target sales must start (JV).',
  'Pricing model + tiers, and the "use your VAs or ours" line.',
  'Commission structure — what must be true for us to take commissions.',
  'Capital plan to fund the chosen scenario (possible raise via JV).',
  'The A vs. B call itself — the fork this whole plan tees up.',
];

function RampChart({ scenario }: { scenario: ScenarioKey }) {
  const active = SCENARIOS[scenario];
  const other = SCENARIOS[scenario === 'A' ? 'B' : 'A'];
  const W = 760;
  const H = 320;
  const padL = 34;
  const padR = 18;
  const padT = 22;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const yMax = 50;
  const x = (i: number) => padL + (i / (MONTHS.length - 1)) * plotW;
  const y = (v: number) => padT + plotH * (1 - v / yMax);
  const gridVals = [0, 10, 20, 30, 40, 50];

  const linePts = (data: number[]) => data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const areaPath = (data: number[]) =>
    `M ${x(0)},${y(0)} ` + data.map((v, i) => `L ${x(i)},${y(v)}`).join(' ') + ` L ${x(data.length - 1)},${y(0)} Z`;

  return (
    <svg
      className="ramp-chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Cumulative customer ramp, November 2026 through June 2027. ${active.label} scenario reaches ${active.endCustomers} customers by end of Q2 2027; the ${other.label} scenario is shown faintly for comparison.`}
    >
      <defs>
        <linearGradient id="rampFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* gridlines + y labels */}
      {gridVals.map((v) => (
        <g key={v}>
          <line x1={padL} y1={y(v)} x2={W - padR} y2={y(v)} stroke="var(--border)" strokeWidth={1} />
          <text x={padL - 8} y={y(v) + 3} textAnchor="end" className="ramp-axis">
            {v}
          </text>
        </g>
      ))}

      {/* x labels */}
      {MONTHS.map((m, i) => (
        <text key={m} x={x(i)} y={H - 12} textAnchor="middle" className="ramp-axis">
          {m}
        </text>
      ))}

      {/* comparison (other scenario) */}
      <polyline
        points={linePts(other.ramp)}
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        opacity={0.5}
      />
      <text x={x(7) - 4} y={y(other.ramp[7]) - 6} textAnchor="end" className="ramp-compare-lbl">
        {other.label}
      </text>

      {/* active scenario */}
      <path d={areaPath(active.ramp)} fill="url(#rampFill)" />
      <polyline points={linePts(active.ramp)} fill="none" stroke="var(--primary)" strokeWidth={2.5} />
      {active.ramp.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r={3.5} fill="var(--primary)" />
          {(i === 0 || i === MONTHS.length - 1 || v !== active.ramp[i - 1]) && (
            <text x={x(i)} y={y(v) - 9} textAnchor="middle" className="ramp-val">
              {v}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

export function PathToScalePage() {
  const [scenario, setScenario] = useState<ScenarioKey>('A');
  const active = SCENARIOS[scenario];

  return (
    <>
      <a className="page-back" href="#/roadmap">
        &larr; Back to roadmap
      </a>

      <section className="hero">
        <p className="eyebrow">Roadmap · The plan</p>
        <h1 className="hero-title">Path to Scale — Nov ’26 → Q2 ’27.</h1>
        <p className="hero-sub">
          How many customers we can onboard, how fast we can build, and what has to be true to get
          there. The plan forks on one strategic choice — how we treat VAs — which hangs on one
          unknown: how hard automated shopping is to build.
        </p>
      </section>

      <div className="mini-callout handoff-note">
        <p className="mini-callout-t">What this covers — and what it doesn’t</p>
        <p>
          This is the <strong>product &amp; operational plan</strong>. Pricing, commissions,
          revenue, and capital are owned by <strong>Mike &amp; Patrick</strong> (with JV) — the ramp
          here is the input their revenue model backs into.
        </p>
      </div>

      {/* THE RAMP */}
      <div className="phase-rule">
        <span>The ramp</span>
      </div>
      <section className="card phase-card">
        <div className="scale-toggle" role="tablist" aria-label="Scenario">
          {(['A', 'B'] as ScenarioKey[]).map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={scenario === k}
              className={scenario === k ? 'active' : undefined}
              onClick={() => setScenario(k)}
            >
              <b>{SCENARIOS[k].label}</b>
              <span>{SCENARIOS[k].tag}</span>
            </button>
          ))}
        </div>

        <div className="ramp-wrap">
          <RampChart scenario={scenario} />
          <div className="ramp-stats">
            <div className="ramp-stat">
              <span className="ramp-stat-v">{active.endCustomers}</span>
              <span className="ramp-stat-l">customers by end of Q2 ’27</span>
            </div>
            <div className="ramp-stat">
              <span className="ramp-stat-v">{active.endVas}</span>
              <span className="ramp-stat-l">VAs at peak</span>
            </div>
            <div className="ramp-stat">
              <span className="ramp-stat-v">2</span>
              <span className="ramp-stat-l">customers in Nov–Dec (both plans — learn deep)</span>
            </div>
          </div>
        </div>

        <p className="scenario-summary">{active.summary}</p>
        <p className="ramp-note">
          Numbers are directional — placeholders to confirm. Both plans start identically (2
          customers Nov–Dec) and both begin automated-shopping discovery at the start of the MVP
          build.
        </p>
      </section>

      {/* THE REFRAME */}
      <div className="phase-rule">
        <span>Two kinds of risk</span>
      </div>
      <section className="card phase-card">
        <p className="proof-statement">
          Neither path is the “safe” one — they trade different risks. The right call is a
          conversation to have with Justin, not a foregone conclusion.
        </p>
        <div className="risk-split">
          <div className={`risk-col ${scenario === 'A' ? 'is-active' : ''}`}>
            <p className="risk-h">A · Automation-execution risk</p>
            <p>
              We bet the ramp on cracking automated shopping fast. If it’s harder than hoped, growth
              <em> and revenue</em> stall while we keep grinding on it.
            </p>
          </div>
          <div className={`risk-col ${scenario === 'B' ? 'is-active' : ''}`}>
            <p className="risk-h">B · Operational-overhead risk</p>
            <p>
              We carry a 15–17-person VA arm (more to manage), but we get a revenue cushion that
              doesn’t depend on solving the hard automation problem on a deadline.
            </p>
          </div>
        </div>
      </section>

      {/* SIDE BY SIDE */}
      <div className="phase-rule">
        <span>Side by side</span>
      </div>
      <section className="card phase-card">
        <p className="export-hint">
          The two plans across the dimensions that matter. The selected scenario above is
          highlighted.
        </p>
        <div className="compare-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th />
                <th className={scenario === 'A' ? 'is-active' : undefined}>
                  A · Conservative
                  <span>VAs as a bridge</span>
                </th>
                <th className={scenario === 'B' ? 'is-active' : undefined}>
                  B · Aggressive
                  <span>VAs as an Upline arm</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td className={scenario === 'A' ? 'is-active' : undefined}>{row.a}</td>
                  <td className={scenario === 'B' ? 'is-active' : undefined}>{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* WHAT MUST BE TRUE */}
      <div className="phase-rule">
        <span>What must be true</span>
      </div>
      <section className="card phase-card">
        <ul className="wmt-list">
          {WHAT_MUST_BE_TRUE.map((w) => (
            <li key={w.text} className="wmt-item">
              <span className={`wmt-pill scope-${w.scope}`}>
                {w.scope === 'both' ? 'A & B' : w.scope}
              </span>
              <span>{w.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* HOW WE BUILD */}
      <div className="phase-rule">
        <span>How we build</span>
      </div>
      <section className="card phase-card">
        <div className="rel-gate">
          <span className="rel-gate-badge">Gate</span>
          <div>
            <p className="rel-title">Dedicated engineer hired — before the strategy-sprint week (~early-mid Sept)</p>
            <p className="rel-note">
              The linchpin for every number on this page. No engineer by then → MVP build slips →
              Thanksgiving slips → the whole ramp slips. (~2 weeks can be pulled forward if the
              engineer is teed up in time.)
            </p>
          </div>
        </div>

        <ol className="rel-timeline">
          <li className="rel-item is-shared">
            <span className="rel-date">Thanksgiving ’26</span>
            <div>
              <p className="rel-title">MVP launch</p>
              <p className="rel-note">
                Repository + prioritize → draft outreach → white-labeled send → custom questionnaire
                → ingest answers → drafted recommendation → agent review/approve/send.
              </p>
            </div>
          </li>
          <li className="rel-item is-shared">
            <span className="rel-date">Jan ’27</span>
            <div>
              <p className="rel-title">Iterate on the MVP w/ first 2 customers</p>
              <p className="rel-note">Fix what doesn’t test well; tighten the core experience.</p>
            </div>
          </li>
          {active.releases.map((r, i) => (
            <li key={r.title} className="rel-item">
              <span className="rel-date">{r.when}</span>
              <div>
                <p className="rel-title">
                  <span className="rel-idx">R{i + 2}</span> {r.title}
                </p>
                <p className="rel-note">{r.note}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="ramp-note">
          ~6-week release cadence. Release <em>ordering</em> flips by scenario — {active.automation}
        </p>
      </section>

      {/* OPEN QUESTIONS */}
      <div className="phase-rule">
        <span>Open questions</span>
      </div>
      <section className="card phase-card">
        <div className="open-qs">
          <div className="oq-col">
            <h3>For the lead engineer</h3>
            <ul>
              {OPEN_FOR_ENGINEER.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
          <div className="oq-col">
            <h3>For Justin / Mike / Patrick</h3>
            <ul>
              {OPEN_FOR_LEADERSHIP.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
