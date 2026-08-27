import type { VenturePlan } from '../types';

interface PocPageProps {
  plan: VenturePlan | null;
}

interface SuccessMetric {
  n: number;
  title: string;
  frame: string;
  question: string;
  signals: string[];
  guardrails: string[];
}

const SUCCESS_METRICS: SuccessMetric[] = [
  {
    n: 1,
    title: 'Agent trust',
    frame: 'Internal acceptance',
    question: 'Would an agent actually send this?',
    signals: [
      'Agents review the proposal and feel confident sending it',
      'Minimal edits required',
      'Qualitative signal: “this is good,” “this saves me time,” “I’d use this”',
    ],
    guardrails: [
      'Majority of emails sent with light or no edits',
      'Clear pattern of interest in repeat usage',
    ],
  },
  {
    n: 2,
    title: 'Customer engagement',
    frame: 'External validation',
    question: 'Do customers respond to this?',
    signals: [
      'Customers engage with the outreach — reply, click, opt into shopping',
      'No fixed % required yet, but must be directionally meaningful (not crickets)',
    ],
    guardrails: [
      'At least a handful of real opt-ins per design partner (not zero / negligible)',
      'Evidence customers understand the value and outreach prompts action',
    ],
  },
  {
    n: 3,
    title: 'Scalability confidence',
    frame: 'Path to a product',
    question: 'Can this become a real product?',
    signals: [
      'Even if manual today, the team believes there’s a clear path to automating the shopping process',
      'Major blockers are solvable, not fundamental — time horizon can be flexible',
    ],
    guardrails: [
      'Quoting + proposal process feels messy but learnable, not chaotic',
      'Team can articulate “here’s how this becomes a system”',
    ],
  },
];

const PILOT_FACTS: [string, string][] = [
  ['Design partners', 'Members 1st (done) + Stockton Hill (week of Aug 31)'],
  ['Members 1st', 'Jun 17 – Aug 3 · 10 sessions + retro · 42 emailed'],
  ['Session rhythm', 'Mon · Wed · Fri, ~30 min, on Zoom, recorded'],
  ['M1st outcomes', '18 QQ (43%) · 7 switched · 5 stayed · 6 pending'],
  ['Volume', '~15 households / week, 5 reviewed per session'],
];
const LANES: { key: string; label: string; color: string }[] = [
  { key: 'upline', label: 'Upline', color: 'var(--primary)' },
  { key: 'agent', label: 'Agent', color: 'var(--success-strong)' },
  { key: 'client', label: 'Client', color: 'var(--info)' },
];

interface LoopStep {
  lane: number;
  text: string;
}

// Sequential steps of the weekly loop — each sits in its actor's lane, left to right.
const STEPS: LoopStep[] = [
  { lane: 0, text: 'Pull renewals; build a Client 360 for ~15 households' },
  { lane: 0, text: 'Draft personalized outreach for the batch' },
  { lane: 1, text: 'Review ~5 and send from your own inbox' },
  { lane: 2, text: 'Complete the ~3-min household questionnaire' },
  { lane: 0, text: 'Shop across carriers; build the recommendation' },
  { lane: 1, text: 'Review, edit, and send the proposal' },
  { lane: 2, text: 'Receive the proposal and respond' },
];

interface Phase {
  start: number;
  span: number;
  label: string;
  bg: string;
  fg: string;
}

const PHASES: Phase[] = [
  { start: 0, span: 1, label: 'Prep · week before', bg: 'var(--primary)', fg: 'var(--primary-foreground)' },
  { start: 1, span: 3, label: 'Outreach & intake', bg: 'var(--chart-3)', fg: 'var(--foreground)' },
  { start: 4, span: 3, label: 'Shop & propose', bg: 'var(--chart-5)', fg: 'var(--primary-foreground)' },
];

function WeeklyLoopMap() {
  const W = 1000;
  const gutter = 88;
  const topPad = 6;
  const headerH = 24;
  const headerGap = 10;
  const laneH = 82;
  const laneGap = 10;
  const nStep = STEPS.length;
  const colW = (W - gutter) / nStep;
  const nodeW = colW - 14;
  const nodeH = 62;
  const lanesTop = topPad + headerH + headerGap;
  const laneTop = (i: number) => lanesTop + i * (laneH + laneGap);
  const nodeX = (col: number) => gutter + col * colW + (colW - nodeW) / 2;
  const nodeY = (lane: number) => laneTop(lane) + (laneH - nodeH) / 2;
  const centerY = (lane: number) => nodeY(lane) + nodeH / 2;
  const H = lanesTop + LANES.length * laneH + (LANES.length - 1) * laneGap + topPad;

  return (
    <figure className="wlm">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Weekly loop swim-lane map. Upline pulls renewals and builds a Client 360, then drafts outreach; the agent reviews and sends; the client completes a questionnaire; Upline shops and builds the recommendation; the agent sends the proposal; the client receives it and responds."
      >
        <defs>
          <marker id="wlmArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
          </marker>
        </defs>

        {/* Lane bands + labels */}
        {LANES.map((ln, i) => (
          <g key={ln.key}>
            <rect
              x={0}
              y={laneTop(i)}
              width={W}
              height={laneH}
              rx={8}
              style={{ fill: ln.color, fillOpacity: 0.055 }}
            />
            <rect x={0} y={laneTop(i)} width={4} height={laneH} style={{ fill: ln.color }} />
            <text
              x={13}
              y={centerY(i)}
              dominantBaseline="middle"
              style={{ fill: ln.color, fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-sans)' }}
            >
              {ln.label}
            </text>
          </g>
        ))}

        {/* Phase headers */}
        {PHASES.map((p) => {
          const x = gutter + p.start * colW + 3;
          const w = p.span * colW - 6;
          return (
            <g key={p.label}>
              <rect x={x} y={topPad} width={w} height={headerH} rx={6} style={{ fill: p.bg }} />
              <text
                x={x + w / 2}
                y={topPad + headerH / 2 + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fill: p.fg,
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* Connectors */}
        {STEPS.slice(0, -1).map((_, i) => {
          const a = STEPS[i];
          const b = STEPS[i + 1];
          const ax = nodeX(i) + nodeW;
          const ay = centerY(a.lane);
          const bx = nodeX(i + 1);
          const by = centerY(b.lane);
          const midx = (ax + bx) / 2;
          return (
            <polyline
              key={i}
              points={`${ax},${ay} ${midx},${ay} ${midx},${by} ${bx},${by}`}
              style={{ fill: 'none', stroke: 'var(--muted-foreground)', strokeWidth: 1.5 }}
              markerEnd="url(#wlmArrow)"
            />
          );
        })}

        {/* Nodes */}
        {STEPS.map((s, i) => {
          const color = LANES[s.lane].color;
          return (
            <foreignObject key={i} x={nodeX(i)} y={nodeY(s.lane)} width={nodeW} height={nodeH}>
              <div
                style={{
                  boxSizing: 'border-box',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  border: `1.5px solid ${color}`,
                  borderLeft: `4px solid ${color}`,
                  borderRadius: '8px',
                  background: 'var(--card)',
                  padding: '6px 8px',
                  overflow: 'hidden',
                }}
              >
                <span
                  style={{
                    fontSize: '8px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color,
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {LANES[s.lane].label}
                </span>
                <span
                  style={{
                    fontSize: '10.5px',
                    lineHeight: 1.2,
                    color: 'var(--card-foreground)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {s.text}
                </span>
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </figure>
  );
}

const WHAT_WE_TESTED: string[] = [
  'Does proactive outreach actually happen?',
  'Are the recommendations accurate and useful?',
  'Does this save the team time?',
  'Can it become part of the day-to-day workflow?',
];

const CLEARED: { title: string; frame: string; result: string }[] = [
  {
    title: 'Agent trust',
    frame: 'Internal acceptance',
    result:
      'They sent with light edits and said they want this day-to-day once it is built. Review before any client email stayed load-bearing — preliminary quotes are not bind-ready.',
  },
  {
    title: 'Customer engagement',
    frame: 'External validation',
    result:
      '43% of emailed households completed the questionnaire. Eighteen recommendations went out. Seven switched. Not crickets.',
  },
  {
    title: 'Scalability confidence',
    frame: 'Path to a product',
    result:
      'Shopping was messy but learnable. Path 2 (no AMS API) ops are in place. The blockers are time and tooling — not a broken idea.',
  },
];

const FINDINGS: string[] = [
  'Less written information protects the relationship. Outreach, the questionnaire, and the rec all got shorter because extra detail in writing is flight risk.',
  'Shop the biggest jumps first — 15%+ , highest to lowest. Under-threshold renewals are relationship touches, not shopping priorities.',
  'Upline drafts; the agency closes. The phone stays sacred. Coverage, deductibles, and the relationship belong on the call.',
  'Without the product, proactive disappears. They will go reactive again until this is built — not because the idea failed, but because they cannot run the play alone.',
  'Cross-sell interest is easy; closing it is a different motion. 35 households touched, 0 bound by the end of the pilot.',
  'Must-haves for day-to-day: EZLynx write-back, weekly batch + questionnaire notifications, the 15%+ queue, short client surfaces, and a manual mid-term add.',
];

const OUTCOME_STATS: { value: string; label: string }[] = [
  { value: '42', label: 'Households emailed' },
  { value: '43%', label: 'Completed the questionnaire' },
  { value: '7', label: 'Switched carriers' },
  { value: '~$474', label: 'Avg savings found when shopped' },
];

export function PocPage({ plan }: PocPageProps) {
  return (
    <>
      <a className="page-back" href="#/roadmap">
        &larr; Back to roadmap
      </a>

      <section className="hero">
        <p className="eyebrow">Roadmap · Proof</p>
        <h1 className="hero-title">Proof of concept — the Members 1st pilot.</h1>
        <p className="hero-sub">
          Our first live pilot with an independent agency is complete. Weekly Mon/Wed/Fri sessions,
          small-batch outreach paced to shopping capacity, and end-to-end runs from outreach &rarr;
          questionnaire &rarr; shop &rarr; agent-reviewed recommendation. It tested well. Stockton
          Hill is next.
        </p>
      </section>

      {/* GOAL */}
      <div className="phase-rule">
        <span>Goal</span>
      </div>
      <section className="card phase-card">
        <p className="proof-statement">
          {plan?.venture.upcomingProofPoint.description ??
            'For real renewals in this pilot, we need proof that we can repeatedly generate a proposal moment that agents trust enough to send and that customers respond to.'}
        </p>
        <p className="proof-lead-label">It&rsquo;s only proven if all three are true:</p>
        <div className="metric-grid">
          {SUCCESS_METRICS.map((m) => (
            <div key={m.n} className="metric-card">
              <div className="metric-head">
                <span className="metric-n">{m.n}</span>
                <div>
                  <h3>{m.title}</h3>
                  <span className="metric-frame">{m.frame}</span>
                </div>
              </div>
              <p className="metric-q">&ldquo;{m.question}&rdquo;</p>
              <ul className="metric-signals">
                {m.signals.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="metric-guardrail-label">Directional guardrails</p>
              <ul className="metric-guardrails">
                {m.guardrails.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="soft-rule" />
        <p className="sub-label">The lens — our mantra</p>
        <blockquote className="goal-mantra">
          {plan?.venture.mantra ?? 'Make every renewal prove the agent is in my corner.'}
        </blockquote>
        <p className="export-hint">
          Every decision in the pilot is judged against this. Automated shopping mostly saves the
          agent time — retention and cross-sell are what actually prove the agent is in the
          customer&rsquo;s corner, which is why the pilot leads with those.
        </p>
      </section>

      {/* PLAN */}
      <div className="phase-rule">
        <span>Plan</span>
      </div>
      <section className="card phase-card">
        <div className="plan-top">
          <div className="plan-col">
            <h3 className="plan-subhead" style={{ marginTop: 0 }}>
              Pilot details
            </h3>
            <dl className="pilot-facts">
              {PILOT_FACTS.map(([term, desc]) => (
                <div key={term} className="pilot-fact">
                  <dt>{term}</dt>
                  <dd>{desc}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="plan-divider" aria-hidden="true" />
          <div className="plan-col">
            <h3 className="plan-subhead" style={{ marginTop: 0 }}>
              What we tested
            </h3>
            <ul className="check-list">
              {WHAT_WE_TESTED.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className="plan-subhead" style={{ marginTop: 0 }}>
          The weekly loop
        </h3>
        <WeeklyLoopMap />
      </section>

      {/* OUTCOME */}
      <div className="phase-rule">
        <span>Outcome</span>
      </div>
      <section className="card phase-card">
        <div className="outcome-verdict tone-win">
          <span className="outcome-verdict-kicker">How we read it</span>
          <p className="outcome-verdict-title">It tested well. Big victory — we move forward.</p>
          <p className="outcome-verdict-body">
            Members 1st proved the proposal moment on a real book. Agents trusted the rec enough to
            send it. Customers answered. Seven households switched. The agency wants this as the
            day-to-day once it is built — and was clear that without the product, they go reactive
            again.
          </p>
        </div>

        <div className="outcome-stats">
          {OUTCOME_STATS.map((s) => (
            <div key={s.label} className="outcome-stat">
              <p className="outcome-stat-value">{s.value}</p>
              <p className="outcome-stat-label">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="export-hint">
          Disposition sheet closed Aug 7: 48 households on the roster &rarr; 42 emailed &rarr; 18
          questionnaires (43%) &rarr; 18 recommendations &rarr; 7 switched &middot; 5 stayed &middot;
          6 pending. Average savings found among shopped households ~$474/yr; ~$665/yr among known
          switchers.
        </p>

        <p className="sub-label">Against the three bars</p>
        <div className="metric-grid">
          {CLEARED.map((m, i) => (
            <div key={m.title} className="metric-card">
              <div className="metric-head">
                <span className="metric-n">{i + 1}</span>
                <div>
                  <h3>{m.title}</h3>
                  <span className="metric-frame">{m.frame}</span>
                </div>
              </div>
              <p className="metric-q">{m.result}</p>
            </div>
          ))}
        </div>

        <p className="sub-label">What we learned</p>
        <ul className="check-list">
          {FINDINGS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>

        <hr className="soft-rule" />
        <p className="sub-label">What&rsquo;s next</p>
        <p className="proof-statement" style={{ marginTop: 0 }}>
          Stockton Hill kicks off the week of August 31. Same proposal moment, Version A outreach
          — we do not inherit the Members 1st v8 copy. That is the second proof, running in tandem
          with strategy sprint week (week of Sep 8) and the start of the MVP build.
        </p>
      </section>
    </>
  );
}
