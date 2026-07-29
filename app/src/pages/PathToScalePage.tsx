import { useState } from 'react';

type ScenarioKey = 'conservative' | 'baseline' | 'aggressive';

// Oct ’26 → Jun ’27. Index 2 = Dec = Dec 1 MVP launch marker.
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const MVP_MONTH_INDEX = 2; // December

interface Scenario {
  key: ScenarioKey;
  label: string;
  tag: string;
  ramp: number[];
  vas: number[];
  endCustomers: string;
  endVas: string;
  summary: string;
}

// Directional — ~1 VA per 1–1.5 agencies (Austin working assumption).
// Oct: Aggressive = 2 (design-partner beta); Baseline & Conservative = 0 until Dec 1 MVP.
const SCENARIOS: Record<ScenarioKey, Scenario> = {
  conservative: {
    key: 'conservative',
    label: 'Conservative',
    tag: '~1 new customer / week in Q1–Q2',
    ramp: [0, 0, 2, 6, 10, 14, 18, 22, 26],
    vas: [0, 0, 2, 4, 7, 9, 12, 15, 17],
    endCustomers: '~26',
    endVas: '~17',
    summary:
      'Zero logos until Dec 1 MVP launch, then the first two, then about one new agency a week into Q1–Q2. Same VA-arm model — slower add rate while we firm up onboarding and the gig workflow.',
  },
  baseline: {
    key: 'baseline',
    label: 'Baseline',
    tag: 'The fundraising story · ~2 / week by Feb',
    ramp: [0, 0, 2, 5, 10, 18, 28, 38, 48],
    vas: [0, 0, 2, 4, 7, 12, 19, 25, 32],
    endCustomers: '~45–50',
    endVas: '~30–32',
    summary:
      'Zero until Dec 1 MVP, learn hard on the first two through year-end, then ramp toward ~two new customers a week by Feb–Apr. Scale with VAs (gig-style), collect data, automate later — or never, if carrier APIs show up.',
  },
  aggressive: {
    key: 'aggressive',
    label: 'Aggressive',
    tag: 'Oct beta · timeline pulled forward',
    ramp: [2, 2, 4, 12, 20, 30, 40, 50, 60],
    vas: [2, 2, 3, 8, 13, 20, 27, 33, 40],
    endCustomers: '~60',
    endVas: '~40',
    summary:
      'Not “twice as many” — earlier. Two design partners live in October (Members 1st + Stockton beta), still two through November, then add through Dec and scale from a head start. Contingent on an engineer by strategy-sprint week.',
  },
};

const RELEASES: { when: string; title: string; note: string }[] = [
  {
    when: 'Dec ’26 – mid-Jan ’27',
    title: 'Close the loop',
    note: 'Record calls / Zooms and write fresh detail back into the repository so the book stays current — first step toward eventually replacing the AMS.',
  },
  {
    when: '~late Jan – early Mar ’27',
    title: 'VA portal',
    note: 'Internal surface for VAs: queues, upload, verification that submissions are complete. Can start as a lighter internal tool while the customer product stays engineer-built.',
  },
  {
    when: '~Mar – mid-Apr ’27',
    title: 'RPA full-book AMS pull',
    note: 'Automate extracting a whole book (EasyLinks / HawkSoft first). This is the onboarding unlock — without it, manual book download caps how fast we can add agencies.',
  },
  {
    when: '~mid-Apr – late May ’27',
    title: 'Gig-style VA onboarding',
    note: 'Uber-like digital training and workflow so VAs can come online without Upline babysitting every hire. First VA may become the manager / trainer.',
  },
  {
    when: '~Jun ’27 onward',
    title: 'AMS replacement (data visibility)',
    note: 'Show the repository — internally first, then peel the veil for clients. Background track while we’re still signing and serving agencies.',
  },
];

interface WmtItem {
  scope: 'all' | 'aggressive';
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
    item: 'VA #1 is hired and trained by Dec 1 MVP launch — ideally getting live reps during the build; first VA may become the manager / trainer.',
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
    scope: 'all',
    item: 'RPA full-book AMS pull lands early post-MVP so onboarding isn’t a manual nightmare.',
    implications:
      'If books stay hand-pulled, we’re capped at roughly one agency per week per VA — the ramps above stop being realistic.',
  },
  {
    scope: 'all',
    item: 'We can stand up a gig-style VA model (digital onboarding + queues) — or hire someone (e.g. Davey) to run a managed VA arm if gig doesn’t work.',
    implications:
      'A 1:1–1.5 VA-to-agency ratio without a scalable ops model is a full-time job that pulls the product team off the plot.',
  },
  {
    scope: 'aggressive',
    item: 'Engineer is in place by sprint week so we can pull the timeline forward — including an Oct / early-Nov beta with design partners.',
    implications:
      'Without that hire, Aggressive collapses back to Baseline timing. The expedite only works if build capacity is real.',
  },
];

interface CompareRow {
  label: string;
  conservative: string;
  baseline: string;
  aggressive: string;
}

const COMPARE: CompareRow[] = [
  {
    label: 'What it is',
    conservative: 'Same VA-arm model — slower add rate (~1 new agency / week in Q1–Q2).',
    baseline: 'The main plan / fundraising curve. ~2 new agencies / week by Feb–Apr.',
    aggressive: 'Baseline shape, pulled forward — 2 design partners live in October.',
  },
  {
    label: 'Oct ’26 customers',
    conservative: '0',
    baseline: '0',
    aggressive: '2 (Members 1st + Stockton beta)',
  },
  {
    label: 'End-Q2 ’27 customers',
    conservative: '~26',
    baseline: '~45–50',
    aggressive: '~60',
  },
  {
    label: 'VA posture',
    conservative: 'Gig-style VA scale; ~1 VA per 1–1.5 agencies',
    baseline: 'Gig-style VA scale; ~1 VA per 1–1.5 agencies',
    aggressive: 'Same — just more VAs sooner because more agencies sooner',
  },
  {
    label: 'Product focus',
    conservative: 'Close-the-loop → VA portal → RPA book pull → gig onboarding → AMS visibility',
    baseline: 'Same release order — automation shopping deferred ~2 years',
    aggressive: 'Same release order + Oct beta stress-test before Dec 1 MVP',
  },
  {
    label: 'Why this pace',
    conservative: 'More room to firm onboarding + gig ops before the faucet opens wide',
    baseline: 'Momentum for fundraising without betting the venture on automated shopping',
    aggressive: 'Max signal for investors / JV — only if engineer + Oct beta are real',
  },
  {
    label: 'Biggest risk',
    conservative: 'Growth looks soft if we’re raising on the curve',
    baseline: 'VA ops overhead (~$700–1,400 / agency / mo at current math) until efficiency or APIs land',
    aggressive: 'Shipping a half-baked beta too early, or missing the engineer gate',
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
        aria-label={`Customer and VA counts on the same scale, October 2026 through June 2027. Vertical marker at December 1 for MVP launch. ${active.label}: ${active.endCustomers} customers and ${active.endVas} VAs by end of Q2.`}
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

        {/* Dec 1 · MVP launch — same marker on every scenario */}
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
        <rect
          x={mvpX - 52}
          y={8}
          width={104}
          height={18}
          rx={4}
          fill="var(--secondary)"
        />
        <text x={mvpX} y={21} textAnchor="middle" className="ramp-mvp-label">
          Dec 1 · MVP launch
        </text>

        {MONTHS.map((m, i) => (
          <text key={m} x={x(i)} y={H - 30} textAnchor="middle" className="ramp-axis">
            {m}
          </text>
        ))}

        {/* Legend */}
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

        {/* Faint baselines of other scenarios (customers only) */}
        {(Object.keys(SCENARIOS) as ScenarioKey[])
          .filter((k) => k !== scenario)
          .map((k) => (
            <polyline
              key={k}
              points={linePts(SCENARIOS[k].ramp)}
              fill="none"
              stroke="var(--muted-foreground)"
              strokeWidth={1.25}
              strokeDasharray="3 4"
              opacity={0.28}
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

export function PathToScalePage() {
  const [scenario, setScenario] = useState<ScenarioKey>('baseline');
  const active = SCENARIOS[scenario];
  const keys = Object.keys(SCENARIOS) as ScenarioKey[];

  return (
    <>
      <a className="page-back" href="#/roadmap">
        &larr; Back to roadmap
      </a>

      <section className="hero">
        <p className="eyebrow">Roadmap · The plan</p>
        <h1 className="hero-title">Path to Scale — Oct ’26 → Q2 ’27.</h1>
        <p className="hero-sub">
          Scale with a VA arm (gig-style), ship the product end-to-end, and treat automated shopping
          as a ~2-year bet — or a carrier-API unlock — not the thing we sprint to the day after MVP.
          Three paces: Conservative, Baseline (the fundraising story), and Aggressive (Oct beta —
          two design partners before Dec 1 MVP launch).
        </p>
      </section>

      {/* THE RAMP */}
      <div className="phase-rule">
        <span>The ramp</span>
      </div>
      <section className="card phase-card">
        <div className="scale-toggle scale-toggle-3" role="tablist" aria-label="Scenario">
          {keys.map((k) => (
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

        <RampChart scenario={scenario} />

        <p className="scenario-summary">
          <strong>
            {active.endCustomers} customers · {active.endVas} VAs
          </strong>{' '}
          by end of Q2 ’27. {active.summary}
        </p>
        <p className="ramp-note">
          Chart runs Oct → Jun. The dashed marker is Dec 1 MVP launch on every scenario. Aggressive
          alone has 2 customers in October (design-partner beta); Baseline and Conservative stay at
          zero until that launch. Automated shopping is deferred ~2 years.
        </p>
      </section>

      {/* SIDE BY SIDE */}
      <div className="phase-rule">
        <span>Side by side</span>
      </div>
      <section className="card phase-card">
        <p className="export-hint">
          Same strategic bet — three paces. Selected column highlights with the toggle above.
        </p>
        <div className="compare-wrap">
          <table className="compare-table compare-table-3">
            <thead>
              <tr>
                <th />
                {keys.map((k) => (
                  <th key={k} className={scenario === k ? 'is-active' : undefined}>
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
                  <td className={scenario === 'conservative' ? 'is-active' : undefined}>
                    {row.conservative}
                  </td>
                  <td className={scenario === 'baseline' ? 'is-active' : undefined}>
                    {row.baseline}
                  </td>
                  <td className={scenario === 'aggressive' ? 'is-active' : undefined}>
                    {row.aggressive}
                  </td>
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
        <p className="export-hint">Conditions for the ramp to hold — and what slips if they don’t.</p>
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
                      {w.scope === 'all' ? 'All' : 'Aggressive'}
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
              Non-negotiable. No engineer by then → MVP slips past Dec 1 → every ramp number slips.
              Aggressive’s Oct beta only exists if this gate clears.
            </p>
          </div>
        </div>

        <ol className="rel-timeline">
          <li className="rel-item is-shared">
            <span className="rel-date">Oct – early Nov ’26</span>
            <div>
              <p className="rel-title">
                Optional beta <span className="rel-tandem">· Aggressive path</span>
              </p>
              <p className="rel-note">
                Simple slice in front of Members 1st + Stockton for VA reps and a stress-test before
                paying logos — only if the engineer gate is met.
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
                stays VA-manual at launch.
              </p>
            </div>
          </li>
          {RELEASES.map((r, i) => (
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
          <li className="rel-item is-deferred">
            <span className="rel-date">~2028</span>
            <div>
              <p className="rel-title">Automated shopping — deferred ~2 years</p>
              <p className="rel-note">
                Not critical-path after MVP. Scale VAs, collect observation data, improve models —
                and with enough agencies, push carriers for APIs. May never need a scraper.
              </p>
            </div>
          </li>
        </ol>
        <p className="ramp-note">
          ~6-week release cadence after MVP. Order is fixed across Conservative / Baseline /
          Aggressive — pace of customer adds is what changes.
        </p>
      </section>
    </>
  );
}
