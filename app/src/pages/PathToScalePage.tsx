import { useState } from 'react';

type ScenarioKey = 'conservative' | 'baseline' | 'aggressive' | 'auto';

// Oct ’26 → Jun ’27. Index 2 = Dec = Dec 1 MVP launch marker.
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const MVP_MONTH_INDEX = 2; // December

interface Scenario {
  key: ScenarioKey;
  label: string;
  tag: string;
  family: 'va' | 'auto';
  ramp: number[];
  vas: number[];
  endCustomers: string;
  endVas: string;
  summary: string;
}

// Directional — VA paths ~1 VA per 1–1.5 agencies; auto path caps VAs ~5.
const SCENARIOS: Record<ScenarioKey, Scenario> = {
  conservative: {
    key: 'conservative',
    label: 'Conservative VA',
    tag: '~1 new customer / week in Q1–Q2',
    family: 'va',
    ramp: [0, 0, 2, 6, 10, 14, 18, 22, 26],
    vas: [0, 0, 2, 4, 7, 9, 12, 15, 17],
    endCustomers: '~26',
    endVas: '~17',
    summary:
      'VA-led. Zero logos until Dec 1 MVP, then the first two, then about one new agency a week into Q1–Q2. Automated shopping stays deferred ~2 years.',
  },
  baseline: {
    key: 'baseline',
    label: 'Baseline VA',
    tag: 'Fundraising story · ~2 / week by Feb',
    family: 'va',
    ramp: [0, 0, 2, 5, 10, 18, 28, 38, 48],
    vas: [0, 0, 2, 4, 7, 12, 19, 25, 32],
    endCustomers: '~45–50',
    endVas: '~30–32',
    summary:
      'VA-led. The plan we’d show investors: first two after Dec 1 MVP, then ~two new customers a week by Feb–Apr. Scale with VAs (gig-style); automate later — or never, if carrier APIs show up.',
  },
  aggressive: {
    key: 'aggressive',
    label: 'Aggressive VA',
    tag: 'Oct beta · timeline pulled forward',
    family: 'va',
    ramp: [2, 2, 4, 12, 20, 30, 40, 50, 60],
    vas: [2, 2, 3, 8, 13, 20, 27, 33, 40],
    endCustomers: '~60',
    endVas: '~40',
    summary:
      'VA-led, earlier. Two design partners live in October, still two through November, then add through Dec and scale from a head start. Contingent on an engineer by strategy-sprint week.',
  },
  auto: {
    key: 'auto',
    label: 'Auto-shopping priority',
    tag: 'Small VA bridge · automate ASAP',
    family: 'auto',
    // Dec +2, Jan +2 → 4/2 VAs; Feb–Apr +4/+4/+3 → 15 max pre-launch; then VAs flat, customers grow
    ramp: [0, 0, 2, 4, 8, 12, 15, 20, 30],
    vas: [0, 0, 1, 2, 3, 4, 5, 5, 5],
    endCustomers: '~30',
    endVas: '~5 (flat after launch)',
    summary:
      'Different bet: Dec–Jan bring on the first four logos (2 VAs), then ~four new agencies a month through mid-April to a 15-customer ceiling. Auto-shopping feature launches mid-April — VAs stay at ~5 while customers can keep growing (e.g. +5 in May, +10 in June). Automation-execution risk if that launch slips.',
  },
};

/** Mid-April — between Mar (5) and Apr (6) month ticks */
const AUTO_LAUNCH_MONTH_FRAC = 5.5;

const SCENARIO_ORDER: ScenarioKey[] = ['conservative', 'baseline', 'aggressive', 'auto'];

/** Shared post-MVP release order for all VA-led paces */
const VA_RELEASES: { when: string; title: string; note: string }[] = [
  {
    when: 'Dec ’26 – mid-Jan ’27',
    title: 'Close the loop',
    note: 'Record calls / Zooms; write fresh detail back into the repository.',
  },
  {
    when: '~late Jan – early Mar ’27',
    title: 'VA portal',
    note: 'Queues, upload, verification — internal surface for VAs.',
  },
  {
    when: '~Mar – mid-Apr ’27',
    title: 'RPA full-book AMS pull',
    note: 'Onboarding unlock (EasyLinks / HawkSoft first).',
  },
  {
    when: '~mid-Apr – late May ’27',
    title: 'Gig-style VA onboarding',
    note: 'Digital training + workflow; first VA may become manager / trainer.',
  },
  {
    when: '~Jun ’27 onward',
    title: 'AMS replacement (data visibility)',
    note: 'Show the repository internally, then to clients.',
  },
  {
    when: '~2028',
    title: 'Automated shopping',
    note: 'Deferred ~2 years — or unlocked via carrier APIs once we have leverage.',
  },
];

/** Alternate bet: prioritize cracking automated shopping */
const AUTO_RELEASES: { when: string; title: string; note: string }[] = [
  {
    when: 'Dec ’26 – mid-Apr ’27',
    title: 'Automated shopping (build → launch)',
    note: 'The sprint — discovery into build. Feature launches mid-April. Until then: +2/+2 in Dec–Jan, then ~+4/mo to a 15-customer ceiling with ~5 VAs.',
  },
  {
    when: 'Alongside shopping build',
    title: 'RPA full-book AMS pull',
    note: 'Still needed so onboarding isn’t a manual nightmare while shopping automates.',
  },
  {
    when: 'Post mid-Apr launch',
    title: 'Scale customers · VAs stay flat',
    note: 'With shopping automated, add customers without adding VAs (e.g. +5 in May, +10 in June).',
  },
  {
    when: '~May – Jun ’27',
    title: 'Close the loop + AMS visibility',
    note: 'Record + write-back and broader product surface once the shopping bet is live.',
  },
  {
    when: 'As needed',
    title: 'Light VA tooling',
    note: 'Only what’s required for a ~5-person bridge — not a gig-ops product line.',
  },
  {
    when: 'If mid-Apr launch slips',
    title: 'Pivot to VA-led scale',
    note: 'Stuck near the 15-customer / growing-VA ceiling — or collapse toward the VA ramps with lost time.',
  },
];

interface WmtItem {
  scope: 'all' | 'va' | 'auto';
  item: string;
  implications: string;
}

const WHAT_MUST_BE_TRUE: WmtItem[] = [
  {
    scope: 'all',
    item: 'A dedicated engineer (Gitwit or Upline) is hired before the strategy-sprint week (~early–mid Sept).',
    implications:
      'If not, MVP start (Dec 1), and every ramp date on this page slip until they are hired. Non-negotiable for the build.',
  },
  {
    scope: 'all',
    item: 'VA #1 is hired and trained by Dec 1 MVP launch — ideally getting live reps during the build.',
    implications:
      'Without someone ready at launch, we can’t onboard agencies yet. That slice of the timeline slips until training is done.',
  },
  {
    scope: 'all',
    item: 'A per-agency quoting playbook is excavated at onboarding (~1–2 weeks / agency).',
    implications:
      'Skipping it means more hand-holding and back-and-forth — riskier for how the agency perceives Upline’s value day one.',
  },
  {
    scope: 'va',
    item: 'We can stand up a gig-style VA model (or hire someone to run a managed VA arm) at ~1–1.5 agencies per VA.',
    implications:
      'Without a scalable ops model, a large VA headcount becomes a full-time job that pulls the product team off the plot.',
  },
  {
    scope: 'va',
    item: 'RPA full-book AMS pull lands early post-MVP so onboarding isn’t a manual nightmare.',
    implications:
      'If books stay hand-pulled, we’re capped at roughly one agency per week per VA — the VA ramps stop being realistic.',
  },
  {
    scope: 'auto',
    item: 'Automated shopping proves feasible on a tight post-MVP timeline and stays prioritized above other net-new.',
    implications:
      'If it isn’t, growth and revenue stall at ~15 customers / ~5 VAs — or we pivot late to the VA-led path having lost months.',
  },
];

interface CompareRow {
  label: string;
  values: Record<ScenarioKey, string>;
}

const COMPARE: CompareRow[] = [
  {
    label: 'What it is',
    values: {
      conservative: 'VA-led — slower add rate (~1 new agency / week in Q1–Q2).',
      baseline: 'VA-led — main fundraising curve (~2 / week by Feb–Apr).',
      aggressive: 'VA-led, pulled forward — 2 design partners live in October.',
      auto: 'Different bet — tiny VA bridge; sprint to automated shopping after MVP.',
    },
  },
  {
    label: 'Oct ’26 customers',
    values: {
      conservative: '0',
      baseline: '0',
      aggressive: '2 (Members 1st + Stockton beta)',
      auto: '0',
    },
  },
  {
    label: 'End-Q2 ’27 customers',
    values: {
      conservative: '~26',
      baseline: '~45–50',
      aggressive: '~60',
      auto: '~30 (15 by mid-Apr launch, then grow with VAs flat)',
    },
  },
  {
    label: 'VA posture',
    values: {
      conservative: 'Gig-style scale · ~1 VA / 1–1.5 agencies',
      baseline: 'Gig-style scale · ~1 VA / 1–1.5 agencies',
      aggressive: 'Same — more VAs sooner',
      auto: 'Grow to ~5 by mid-Apr, then flat — shopping feature carries the load',
    },
  },
  {
    label: 'Product focus',
    values: {
      conservative: 'Close-loop → VA portal → RPA book → gig onboarding → AMS visibility',
      baseline: 'Same VA release order · shopping deferred ~2 yrs',
      aggressive: 'Same VA order + Oct beta before Dec 1 MVP',
      auto: 'Automated shopping first → mid-Apr feature launch → then scale customers',
    },
  },
  {
    label: 'Biggest risk',
    values: {
      conservative: 'Growth looks soft if we’re raising on the curve',
      baseline: 'VA ops overhead until efficiency or carrier APIs land',
      aggressive: 'Half-baked Oct beta — or missing the engineer gate',
      auto: 'Automation-execution risk — if mid-Apr launch slips, stuck at ~15 / growing VAs again',
    },
  },
];

function RampChart({ scenario }: { scenario: ScenarioKey }) {
  const active = SCENARIOS[scenario];
  const W = 900;
  const H = 380;
  const padL = 40;
  const padR = 24;
  const padT = 36;
  const padB = 56;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const yMax = 60;
  const x = (i: number) => padL + (i / (MONTHS.length - 1)) * plotW;
  const y = (v: number) => padT + plotH * (1 - v / yMax);
  const gridVals = [0, 10, 20, 30, 40, 50, 60];
  const [hover, setHover] = useState<number | null>(null);
  const mvpX = x(MVP_MONTH_INDEX);
  const octX = x(0);
  const autoLaunchX = padL + (AUTO_LAUNCH_MONTH_FRAC / (MONTHS.length - 1)) * plotW;
  const showOctBeta = scenario === 'aggressive';
  const showAutoLaunch = scenario === 'auto';

  const linePts = (data: number[]) => data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const areaPath = (data: number[]) =>
    `M ${x(0)},${y(0)} ` +
    data.map((v, i) => `L ${x(i)},${y(v)}`).join(' ') +
    ` L ${x(data.length - 1)},${y(0)} Z`;

  const tipI = hover ?? MONTHS.length - 1;
  const tipX = x(tipI);
  const tipY = y(Math.max(active.ramp[tipI], 1));
  const tipFlip = tipI > MONTHS.length - 3;

  return (
    <div className="ramp-chart-wrap">
      <svg
        className="ramp-chart"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Customer and VA counts, October 2026 through June 2027. Dec 1 MVP launch marked.${showOctBeta ? ' Aggressive VA: onboard two beta customers in October.' : ''}${showAutoLaunch ? ' Auto-shopping feature launch mid-April; VAs stay flat while customers grow.' : ''} ${active.label}: ${active.endCustomers} customers and ${active.endVas} VAs by end of Q2.`}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="rampFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {gridVals.map((v) => (
          <g key={v}>
            <line
              x1={padL}
              y1={y(v)}
              x2={W - padR}
              y2={y(v)}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text x={padL - 8} y={y(v) + 3} textAnchor="end" className="ramp-axis">
              {v}
            </text>
          </g>
        ))}

        <text x={padL - 8} y={14} textAnchor="end" className="ramp-axis-title">
          Count
        </text>

        {showOctBeta ? (
          <g>
            <line
              x1={octX}
              y1={padT}
              x2={octX}
              y2={padT + plotH}
              stroke="var(--primary)"
              strokeWidth={2}
              strokeDasharray="4 3"
              opacity={0.85}
            />
            <rect
              x={octX + 6}
              y={padT + 8}
              width={168}
              height={34}
              rx={6}
              fill="color-mix(in srgb, var(--primary) 12%, var(--card))"
              stroke="var(--primary)"
              strokeWidth={1.25}
            />
            <text x={octX + 14} y={padT + 22} className="ramp-beta-label">
              Onboard 2 beta customers
            </text>
            <text x={octX + 14} y={padT + 35} className="ramp-beta-label-sub">
              in October · 2 VAs
            </text>
          </g>
        ) : null}

        <line
          x1={mvpX}
          y1={padT}
          x2={mvpX}
          y2={padT + plotH}
          stroke="var(--foreground)"
          strokeWidth={1.75}
          strokeDasharray="5 4"
          opacity={0.55}
        />
        <rect x={mvpX - 52} y={8} width={104} height={18} rx={4} fill="var(--secondary)" />
        <text x={mvpX} y={21} textAnchor="middle" className="ramp-mvp-label">
          Dec 1 · MVP launch
        </text>

        {/* Auto-shopping path only — mid-April feature launch; VAs flat after */}
        {showAutoLaunch ? (
          <g>
            <line
              x1={autoLaunchX}
              y1={padT}
              x2={autoLaunchX}
              y2={padT + plotH}
              stroke="var(--chart-5)"
              strokeWidth={2}
              strokeDasharray="4 3"
              opacity={0.9}
            />
            <rect
              x={autoLaunchX - 78}
              y={padT + 8}
              width={156}
              height={34}
              rx={6}
              fill="color-mix(in srgb, var(--chart-5) 14%, var(--card))"
              stroke="var(--chart-5)"
              strokeWidth={1.25}
            />
            <text x={autoLaunchX} y={padT + 22} textAnchor="middle" className="ramp-auto-label">
              Auto-shopping launch
            </text>
            <text x={autoLaunchX} y={padT + 35} textAnchor="middle" className="ramp-auto-label-sub">
              mid-April · VAs stay flat
            </text>
          </g>
        ) : null}

        {MONTHS.map((m, i) => (
          <text key={m} x={x(i)} y={H - 30} textAnchor="middle" className="ramp-axis">
            {m}
          </text>
        ))}

        <g transform={`translate(${padL}, ${H - 10})`}>
          <line x1={0} y1={0} x2={18} y2={0} stroke="var(--primary)" strokeWidth={2.5} />
          <text x={22} y={3} className="ramp-legend">
            Customers
          </text>
          <line
            x1={100}
            y1={0}
            x2={118}
            y2={0}
            stroke="var(--chart-5)"
            strokeWidth={2.5}
            strokeDasharray="5 3"
          />
          <text x={122} y={3} className="ramp-legend">
            VAs (same scale — watch them diverge)
          </text>
        </g>

        {SCENARIO_ORDER.filter((k) => k !== scenario).map((k) => (
          <polyline
            key={k}
            points={linePts(SCENARIOS[k].ramp)}
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth={1.25}
            strokeDasharray="3 4"
            opacity={0.22}
          />
        ))}

        <path d={areaPath(active.ramp)} fill="url(#rampFill)" />
        <polyline
          points={linePts(active.ramp)}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2.5}
        />
        <polyline
          points={linePts(active.vas)}
          fill="none"
          stroke="var(--chart-5)"
          strokeWidth={2.5}
          strokeDasharray="5 3"
        />

        {active.ramp.map((v, i) => (
          <g key={i}>
            <circle
              cx={x(i)}
              cy={y(v)}
              r={14}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHover(i)}
            />
            <circle
              cx={x(i)}
              cy={y(v)}
              r={hover === i ? 5 : 3.5}
              fill="var(--primary)"
              style={{ pointerEvents: 'none' }}
            />
            <circle
              cx={x(i)}
              cy={y(active.vas[i])}
              r={hover === i ? 5 : 3.5}
              fill="var(--chart-5)"
              style={{ pointerEvents: 'none' }}
            />
          </g>
        ))}

        {hover !== null && (
          <g
            transform={`translate(${tipFlip ? tipX - 148 : tipX + 12}, ${Math.max(padT + 4, tipY - 48)})`}
            style={{ pointerEvents: 'none' }}
          >
            <rect
              width={136}
              height={52}
              rx={8}
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth={1.5}
            />
            <text x={12} y={20} className="ramp-tip-month">
              {MONTHS[hover]}
            </text>
            <text x={12} y={36} className="ramp-tip-line">
              {active.ramp[hover]} customers
            </text>
            <text x={12} y={48} className="ramp-tip-line ramp-tip-va">
              {active.vas[hover]} VAs
            </text>
          </g>
        )}
      </svg>
      <p className="ramp-hover-hint">Hover a point for customers + VAs</p>
    </div>
  );
}

const SCOPE_LABEL: Record<WmtItem['scope'], string> = {
  all: 'All',
  va: 'VA paths',
  auto: 'Auto-shopping',
};

export function PathToScalePage() {
  const [scenario, setScenario] = useState<ScenarioKey>('baseline');
  const active = SCENARIOS[scenario];

  return (
    <>
      <a className="page-back" href="#/roadmap">
        &larr; Back to roadmap
      </a>

      <section className="hero">
        <p className="eyebrow">Roadmap · The plan</p>
        <h1 className="hero-title">Path to Scale — Oct ’26 → Q2 ’27.</h1>
        <p className="hero-sub">
          Two strategic bets, four paces. Three VA-led ramps (Conservative / Baseline / Aggressive)
          scale with a gig-style VA arm and defer automated shopping ~2 years. A fourth path keeps
          VAs tiny and prioritizes automated shopping right after MVP — back in the consideration
          set so the tradeoff stays visible.
        </p>
      </section>

      {/* THE RAMP */}
      <div className="phase-rule">
        <span>The ramp</span>
      </div>
      <section className="card phase-card">
        <div className="scale-toggle scale-toggle-4" role="tablist" aria-label="Scenario">
          {SCENARIO_ORDER.map((k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={scenario === k}
              className={[
                scenario === k ? 'active' : undefined,
                SCENARIOS[k].family === 'auto' ? 'is-auto' : undefined,
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setScenario(k)}
            >
              <b>{SCENARIOS[k].label}</b>
              <span>{SCENARIOS[k].tag}</span>
            </button>
          ))}
        </div>

        <RampChart scenario={scenario} />

        <p className="scenario-summary">
          <strong>
            {active.endCustomers} customers · {active.endVas} VAs
          </strong>{' '}
          by end of Q2 ’27. {active.summary}
        </p>
        <p className="ramp-note">
          Chart runs Oct → Jun. Dec 1 MVP launch is marked on every scenario. Aggressive VA alone
          has 2 customers in October. On Auto-shopping priority, mid-April marks the feature launch
          — customers can keep growing while VAs stay flat at ~5.
        </p>
      </section>

      {/* THE STRATEGIC FORK */}
      <div className="phase-rule">
        <span>The decision</span>
      </div>
      <section className="card phase-card">
        <p className="proof-statement">
          Above the ramps, one fork: how we treat shopping labor for the next 12–24 months. That
          choice sets the product roadmap, the fundraising story, and how much risk we put on a
          technology we haven’t proven yet.
        </p>
        <div className="strat-fork">
          <div className="strat-col strat-rec">
            <div className="strat-col-head">
              <span className="strat-badge strat-badge-rec">Recommended</span>
              <h3>VA-led path</h3>
              <p className="strat-col-tag">Conservative · Baseline · Aggressive VA</p>
            </div>
            <p>
              Treat VAs as a real arm of Upline — with management, process, and ideally a{' '}
              <strong>gig-style “Uber for VAs”</strong> so hiring scales without building a
              traditional ops org. We can grow logos and revenue without making automated shopping
              the make-or-break moment.
            </p>
            <ul className="strat-list">
              <li>
                Multiple outs: scale the gig VA model, sell VA capacity as a{' '}
                <strong>product within a product</strong>, or eventually lean on{' '}
                <strong>carrier APIs / carrier-side shopping</strong> once we have leverage — we may
                never need to build a scraper.
              </li>
              <li>
                Buys 1–2 years to learn, collect observation data, and only then invest in
                automation (or skip it).
              </li>
              <li>
                Tradeoff: people and management overhead — a real business line to run, not a
                temporary hack.
              </li>
            </ul>
          </div>
          <div className="strat-col">
            <div className="strat-col-head">
              <span className="strat-badge">Alternate bet</span>
              <h3>Auto-shopping priority</h3>
              <p className="strat-col-tag">Small VA bridge · automate ASAP</p>
            </div>
            <p>
              Keep the VA team tiny (~5), avoid standing up a VA-ops business, and{' '}
              <strong>sprint to automated shopping</strong> right after MVP so customer growth isn’t
              gated on headcount.
            </p>
            <ul className="strat-list">
              <li>
                Puts a lot of eggs in one basket: if the tech isn’t ready by mid-April ’27, we’ve
                spent <strong>December–April</strong> chasing a feature that may not land.
              </li>
              <li>
                Failure mode is costly — delayed customer onboarding at the ~15 ceiling, then we
                likely <strong>pivot to the VA path anyway</strong>, having lost months.
              </li>
              <li>
                Upside if it works: lean ops, faster unit economics, no large VA arm to manage.
              </li>
            </ul>
          </div>
        </div>
        <p className="strat-footer">
          The three VA tabs differ by <em>pace</em>. The auto-shopping tab differs by{' '}
          <em>strategy</em>. The side-by-side below lays out both so the tradeoff stays in the
          conversation.
        </p>
      </section>

      {/* SIDE BY SIDE */}
      <div className="phase-rule">
        <span>Side by side</span>
      </div>
      <section className="card phase-card">
        <p className="export-hint">
          Three VA paces plus the automated-shopping-prioritized alternative. Selected column
          highlights with the toggle above.
        </p>
        <div className="compare-wrap">
          <table className="compare-table compare-table-4">
            <thead>
              <tr>
                <th />
                {SCENARIO_ORDER.map((k) => (
                  <th
                    key={k}
                    className={[
                      scenario === k ? 'is-active' : undefined,
                      SCENARIOS[k].family === 'auto' ? 'is-auto' : undefined,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {SCENARIOS[k].label}
                    <span>{SCENARIOS[k].tag}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {SCENARIO_ORDER.map((k) => (
                    <td
                      key={k}
                      className={[
                        scenario === k ? 'is-active' : undefined,
                        SCENARIOS[k].family === 'auto' ? 'is-auto-col' : undefined,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {row.values[k]}
                    </td>
                  ))}
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
        <p className="export-hint">Conditions for each path to hold — and what slips if they don’t.</p>
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
                    <span className={`wmt-pill scope-${w.scope}`}>{SCOPE_LABEL[w.scope]}</span>
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
              Non-negotiable on every path. No engineer by then → MVP slips past Dec 1 → every ramp
              number slips. Aggressive VA’s Oct beta only exists if this gate clears.
            </p>
          </div>
        </div>

        <ol className="rel-timeline">
          <li className="rel-item is-shared">
            <span className="rel-date">Oct – early Nov ’26</span>
            <div>
              <p className="rel-title">
                Optional beta <span className="rel-tandem">· Aggressive VA only</span>
              </p>
              <p className="rel-note">
                Simple slice in front of Members 1st + Stockton for VA reps before paying logos —
                only if the engineer gate is met.
              </p>
            </div>
          </li>
          <li className="rel-item is-shared">
            <span className="rel-date">Dec 1 ’26</span>
            <div>
              <p className="rel-title">MVP launch</p>
              <p className="rel-note">
                Repository + prioritize → draft outreach → white-labeled send → custom questionnaire
                → ingest answers → drafted recommendation → agent review/approve/send. Shopping
                stays VA-manual at launch on every path.
              </p>
            </div>
          </li>
        </ol>

        <p className="build-split-intro">
          After MVP, release <em>order</em> forks by strategic bet — not by VA pace. Conservative /
          Baseline / Aggressive VA share the left column; Auto-shopping priority is the right.
        </p>

        <div className="build-split">
          <div
            className={`build-col ${active.family === 'va' ? 'is-active' : ''}`}
          >
            <h3>VA-led paths</h3>
            <p className="build-col-sub">Conservative · Baseline · Aggressive</p>
            <ol className="build-release-list">
              {VA_RELEASES.map((r, i) => (
                <li key={r.title}>
                  <span className="rel-idx">R{i + 2}</span>
                  <div>
                    <p className="build-rel-title">{r.title}</p>
                    <p className="build-rel-when">{r.when}</p>
                    <p className="build-rel-note">{r.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div
            className={`build-col ${active.family === 'auto' ? 'is-active' : ''}`}
          >
            <h3>Auto-shopping priority</h3>
            <p className="build-col-sub">Small VA bridge · automate ASAP</p>
            <ol className="build-release-list">
              {AUTO_RELEASES.map((r, i) => (
                <li key={r.title}>
                  <span className="rel-idx">R{i + 2}</span>
                  <div>
                    <p className="build-rel-title">{r.title}</p>
                    <p className="build-rel-when">{r.when}</p>
                    <p className="build-rel-note">{r.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
