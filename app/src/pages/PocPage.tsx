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
  ['Design partners', 'Members 1st + Stockton Hill'],
  ['Length', '~3 weeks each — staggered, 1-week synthesis between'],
  ['Session rhythm', 'Mon · Wed · Fri, ~30 min, on Zoom, recorded'],
  ['Total sessions', '~18 across both pilots'],
  ['Volume', '~15 households / week, 5 reviewed per session'],
];

const LANES: { key: string; label: string; color: string }[] = [
  { key: 'upline', label: 'Upline', color: 'var(--primary)' },
  { key: 'agent', label: 'Agent', color: 'var(--chart-5)' },
  { key: 'client', label: 'Client', color: 'oklch(0.55 0.12 262)' },
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
  { start: 0, span: 1, label: 'Prep · week before', bg: 'var(--primary)', fg: '#fff' },
  { start: 1, span: 3, label: 'Outreach & intake', bg: 'var(--chart-3)', fg: '#3a3320' },
  { start: 4, span: 3, label: 'Shop & propose', bg: 'var(--chart-5)', fg: '#fff' },
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

const WHAT_WE_TEST: string[] = [
  'Does proactive outreach actually happen?',
  'Are the recommendations accurate and useful?',
  'Does this save the team time?',
  'Can it become part of the day-to-day workflow?',
];

interface OutcomeNote {
  title: string;
  sub: string;
  tone: 'win' | 'learn' | 'risk';
}

const OUTCOMES: OutcomeNote[] = [
  {
    title: 'Big victory',
    sub: 'Our scope and approach are right — we move forward and start scoping the MVP.',
    tone: 'win',
  },
  {
    title: 'Successful failure',
    sub: 'We learned a lot, but enough needs to change that we’re not ready to scope the MVP yet.',
    tone: 'learn',
  },
  {
    title: 'False positive',
    sub: 'Good signals, but real risks and open questions remain — we pause and discuss before committing.',
    tone: 'risk',
  },
];

export function PocPage({ plan }: PocPageProps) {
  return (
    <>
      <a className="page-back" href="#/roadmap">
        &larr; Back to roadmap
      </a>

      <section className="hero">
        <p className="eyebrow">Roadmap · Now</p>
        <h1 className="hero-title">Proof of concept — the Members 1st pilot.</h1>
        <p className="hero-sub">
          Our first live pilot with an independent agency. Weekly Mon/Wed/Fri sessions, small-batch
          outreach paced to shopping capacity, and end-to-end runs from outreach &rarr; questionnaire
          &rarr; shop &rarr; agent-reviewed recommendation. This is where we prove the proposal
          moment is real.
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
              What we&rsquo;re testing
            </h3>
            <ul className="check-list">
              {WHAT_WE_TEST.map((t) => (
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
        <div className="empty-state">
          <span className="spinner" aria-hidden="true" />
          <p className="empty-state-t">Proof of concept in progress</p>
          <p className="empty-state-b">
            The pilot is still running — the outcome lands here once it wraps.
          </p>
        </div>

        <div className="outcome-note-wrap">
          <p className="outcome-note-intro">
            <b>How we&rsquo;ll read it</b> — borrowed from the design-sprint playbook, but applied to
            the pilot:
          </p>
          <div className="outcome-notes">
            {OUTCOMES.map((o) => (
              <div key={o.title} className={`outcome-note tone-${o.tone}`}>
                <span className="outcome-note-h">
                  <span className="outcome-note-dot" aria-hidden="true" />
                  {o.title}
                </span>
                <p className="outcome-note-sub">{o.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
