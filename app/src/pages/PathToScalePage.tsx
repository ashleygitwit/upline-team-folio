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
    vas: [1, 1, 1, 1, 2, 3, 4, 5],
    endCustomers: '~15',
    endVas: '~5',
    summary:
      'Cap the VA team at ~5 (temporary) and pour effort into automated shopping ASAP. The ramp stays flat while we learn from the first few, then steepens in H2 2027 once automation lands.',
    automation: 'Push automated shopping hard and first — prioritized above other net-new features.',
    releases: [
      {
        when: 'Dec ’26 – mid-Feb ’27',
        title: 'Automated shopping (discovery → build)',
        note: 'Runs in tandem with onboarding the first 2 customers. The killer feature — prioritized first so we can lift the customer ceiling.',
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
    vas: [1, 2, 2, 4, 6, 10, 13, 16],
    endCustomers: '~45–50',
    endVas: '~15–17',
    summary:
      'Stand up a real, managed VA team (Davey runs it) and sell "use your VAs or ours." This buys 1–2 years, funds a faster ramp, and de-risks the automation timeline — at the cost of running a people-heavy operation.',
    automation: 'Ease off automated shopping for 1–2 years — the VA arm covers shopping.',
    releases: [
      {
        when: 'Dec ’26 – mid-Feb ’27',
        title: 'Close-the-loop (record + write-back)',
        note: 'Runs in tandem with onboarding the first 2 customers. Full end-to-end experience; first step toward eventually replacing the AMS.',
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
  scope: 'both' | 'A' | 'B';
  item: string;
  implications: string;
}

const WHAT_MUST_BE_TRUE: WmtItem[] = [
  {
    scope: 'both',
    item: 'A dedicated engineer (Gitwit or Upline) is hired before the strategy-sprint week (~early–mid Sept).',
    implications:
      'If not hired by then, the timeline slips until they are — MVP start, Thanksgiving launch, and every ramp date on this page can no longer be held true.',
  },
  {
    scope: 'both',
    item: 'VA #1 is hired and trained by MVP launch (Thanksgiving). Ideally they get live reps with a real agency while we build; if not, we need another way to get them ready.',
    implications:
      'If we don’t have someone hired and trained by launch, we can’t onboard anyone yet — that piece of the timeline starts to slip until they are ready.',
  },
  {
    scope: 'both',
    item: 'A per-agency quoting playbook is excavated at onboarding (~1–2 weeks per agency, RPA-assisted).',
    implications:
      'Skipping it means more back-and-forth and hand-holding from the Upline team to hit our stride — riskier for how the agency perceives Upline’s value.',
  },
  {
    scope: 'both',
    item: 'Automated-shopping discovery kicks off as soon as No-AMS feasibility ends and runs through MVP launch.',
    implications:
      'We don’t yet know how hard automated shopping is, how long it’ll take, or how we’ll build it. The longer we wait to wrap our arms around it, the later we can firm up — or pivot — the A vs. B choice.',
  },
  {
    scope: 'A',
    item: 'Automated shopping proves feasible on a tight timeline and is prioritized above other net-new features.',
    implications:
      'If it’s not feasible on that timeline, we need another way to make money — or we pivot to Option B (stand up a VA arm).',
  },
  {
    scope: 'B',
    item: 'Davey (or an equivalent hire) leads a funded 15–17-person VA team, with “use your VAs or ours” as a priced line.',
    implications:
      'If that’s not true, it’s not sustainable for us to manage a 15-person VA team ourselves — we’d need someone hired specifically to run that arm.',
  },
];

interface CompareRow {
  label: string;
  a: string;
  b: string;
}

const COMPARE: CompareRow[] = [
  {
    label: 'Risk type',
    a: 'Automation-execution risk — we bet the ramp on cracking automated shopping fast. If it’s harder than hoped, growth and revenue stall while we keep grinding on it.',
    b: 'Operational-overhead risk — we carry a 15–17-person VA arm (more to manage), but we get a revenue cushion that doesn’t depend on solving the hard automation problem on a deadline.',
  },
  { label: 'End-Q2 ’27 ramp', a: '~15 customers', b: '~45–50 (15–17 VAs × ~3 agencies each)' },
  { label: 'VA posture', a: '~5 VAs max, temporary', b: 'Real managed team; Davey runs it; “use your VAs or ours” as a priced line' },
  { label: 'Automation posture', a: 'Push automated shopping hard & first', b: 'Ease off automation 1–2 yrs — VA arm covers shopping' },
  { label: 'Feature focus', a: 'MVP + iterate → automated shopping ASAP', b: 'Full end-to-end: close-the-loop, AMS read/write, team settings' },
  { label: 'Upside', a: 'Low burn, low hiring risk, deep learning', b: 'Faster revenue/logos, de-risks automation timeline, richer product' },
  { label: 'Cost / risk', a: 'Growth capped (~15) until automation lands (~late ’27); bets the ramp on a hard unknown', b: 'Heavy people management; a whole new ops business; more capital' },
];

function RampChart({ scenario }: { scenario: ScenarioKey }) {
  const active = SCENARIOS[scenario];
  const other = SCENARIOS[scenario === 'A' ? 'B' : 'A'];
  const W = 780;
  const H = 340;
  const padL = 36;
  const padR = 36;
  const padT = 28;
  const padB = 48;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const custMax = 50;
  const vaMax = 20;
  const x = (i: number) => padL + (i / (MONTHS.length - 1)) * plotW;
  const yCust = (v: number) => padT + plotH * (1 - v / custMax);
  const yVa = (v: number) => padT + plotH * (1 - v / vaMax);
  const custGrid = [0, 10, 20, 30, 40, 50];
  const vaGrid = [0, 5, 10, 15, 20];

  const linePts = (data: number[], yFn: (v: number) => number) =>
    data.map((v, i) => `${x(i)},${yFn(v)}`).join(' ');
  const areaPath = (data: number[]) =>
    `M ${x(0)},${yCust(0)} ` +
    data.map((v, i) => `L ${x(i)},${yCust(v)}`).join(' ') +
    ` L ${x(data.length - 1)},${yCust(0)} Z`;

  return (
    <svg
      className="ramp-chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Customer and VA ramp, November 2026 through June 2027. ${active.label} scenario reaches ${active.endCustomers} customers and ${active.endVas} VAs by end of Q2 2027.`}
    >
      <defs>
        <linearGradient id="rampFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Customer grid (left) */}
      {custGrid.map((v) => (
        <g key={`c-${v}`}>
          <line
            x1={padL}
            y1={yCust(v)}
            x2={W - padR}
            y2={yCust(v)}
            stroke="var(--border)"
            strokeWidth={1}
          />
          <text x={padL - 8} y={yCust(v) + 3} textAnchor="end" className="ramp-axis">
            {v}
          </text>
        </g>
      ))}

      {/* VA axis labels (right) */}
      {vaGrid.map((v) => (
        <text key={`v-${v}`} x={W - padR + 8} y={yVa(v) + 3} textAnchor="start" className="ramp-axis ramp-axis-va">
          {v}
        </text>
      ))}

      {/* Axis titles */}
      <text x={padL - 8} y={padT - 10} textAnchor="end" className="ramp-axis-title">
        Customers
      </text>
      <text x={W - padR + 8} y={padT - 10} textAnchor="start" className="ramp-axis-title ramp-axis-va">
        VAs
      </text>

      {/* Month labels */}
      {MONTHS.map((m, i) => (
        <text key={m} x={x(i)} y={H - 28} textAnchor="middle" className="ramp-axis">
          {m}
        </text>
      ))}

      {/* Legend */}
      <g transform={`translate(${padL}, ${H - 12})`}>
        <line x1={0} y1={0} x2={16} y2={0} stroke="var(--primary)" strokeWidth={2.5} />
        <text x={20} y={3} className="ramp-legend">
          Customers
        </text>
        <line
          x1={90}
          y1={0}
          x2={106}
          y2={0}
          stroke="var(--chart-5)"
          strokeWidth={2.5}
          strokeDasharray="5 3"
        />
        <text x={110} y={3} className="ramp-legend ramp-axis-va">
          VAs
        </text>
        <line
          x1={150}
          y1={0}
          x2={166}
          y2={0}
          stroke="var(--muted-foreground)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          opacity={0.6}
        />
        <text x={170} y={3} className="ramp-legend">
          Other plan (customers)
        </text>
      </g>

      {/* Other scenario customers (faint) */}
      <polyline
        points={linePts(other.ramp, yCust)}
        fill="none"
        stroke="var(--muted-foreground)"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        opacity={0.45}
      />

      {/* Active customers */}
      <path d={areaPath(active.ramp)} fill="url(#rampFill)" />
      <polyline
        points={linePts(active.ramp, yCust)}
        fill="none"
        stroke="var(--primary)"
        strokeWidth={2.5}
      />
      {active.ramp.map((v, i) => (
        <g key={`cust-${i}`}>
          <circle cx={x(i)} cy={yCust(v)} r={3.5} fill="var(--primary)" />
          {(i === 0 || i === MONTHS.length - 1 || v !== active.ramp[i - 1]) && (
            <text x={x(i)} y={yCust(v) - 9} textAnchor="middle" className="ramp-val">
              {v}
            </text>
          )}
        </g>
      ))}

      {/* Active VAs */}
      <polyline
        points={linePts(active.vas, yVa)}
        fill="none"
        stroke="var(--chart-5)"
        strokeWidth={2.5}
        strokeDasharray="5 3"
      />
      {active.vas.map((v, i) => (
        <g key={`va-${i}`}>
          <circle cx={x(i)} cy={yVa(v)} r={3.5} fill="var(--chart-5)" />
          {(i === 0 || i === MONTHS.length - 1 || v !== active.vas[i - 1]) && (
            <text x={x(i)} y={yVa(v) - 9} textAnchor="middle" className="ramp-val ramp-val-va">
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
          Solid line = customers (left axis). Dashed teal = VAs (right axis). Numbers are
          directional — placeholders to confirm. Both plans start with 2 customers in Nov–Dec.
        </p>
      </section>

      {/* SIDE BY SIDE (includes risk type as top row) */}
      <div className="phase-rule">
        <span>Side by side</span>
      </div>
      <section className="card phase-card">
        <p className="export-hint">
          Neither path is the “safe” one — they trade different risks. The selected scenario above
          is highlighted in the table.
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
                <tr key={row.label} className={row.label === 'Risk type' ? 'compare-risk-row' : undefined}>
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
        <p className="export-hint">
          Conditions for the ramp to hold — and what slips if they don’t.
        </p>
        <div className="wmt-table-wrap">
          <table className="wmt-table">
            <thead>
              <tr>
                <th>Applies to</th>
                <th>What must be true</th>
                <th>If it’s not</th>
              </tr>
            </thead>
            <tbody>
              {WHAT_MUST_BE_TRUE.map((w) => (
                <tr key={w.item}>
                  <td>
                    <span className={`wmt-pill scope-${w.scope}`}>
                      {w.scope === 'both' ? 'A & B' : w.scope}
                    </span>
                  </td>
                  <td>{w.item}</td>
                  <td className="wmt-impl">{w.implications}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* HOW WE BUILD */}
      <div className="phase-rule">
        <span>How we build</span>
      </div>
      <section className="card phase-card">
        <div className="rel-gate">
          <span className="rel-gate-badge">Gate</span>
          <div>
            <p className="rel-title">
              Dedicated engineer hired — before the strategy-sprint week (~early-mid Sept)
            </p>
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
          {active.releases.map((r, i) => (
            <li key={r.title} className={`rel-item${i === 0 ? ' is-shared' : ''}`}>
              <span className="rel-date">{r.when}</span>
              <div>
                <p className="rel-title">
                  {i === 0 ? (
                    <>
                      <span className="rel-idx">R2</span> {r.title}
                      <span className="rel-tandem"> · in tandem with first 2 customers</span>
                    </>
                  ) : (
                    <>
                      <span className="rel-idx">R{i + 2}</span> {r.title}
                    </>
                  )}
                </p>
                <p className="rel-note">{r.note}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="ramp-note">
          Release 2 runs in tandem with onboarding the first 2 customers; then R3 → R4 on a ~6-week
          cadence. Release <em>ordering</em> flips by scenario — {active.automation}
        </p>
      </section>
    </>
  );
}
