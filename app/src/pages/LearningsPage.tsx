import type { Learnings, QuestionLens } from '../types';

interface LearningsPageProps {
  learnings: Learnings | null;
}

const LENS_META: Record<QuestionLens, { label: string; color: string; bg: string; fg: string }> = {
  desirability: {
    label: 'User desirability',
    color: 'oklch(0.3811 0.196 279.1717)',
    bg: 'oklch(0.3811 0.196 279.1717 / 0.12)',
    fg: 'oklch(0.3811 0.196 279.1717)',
  },
  viability: {
    label: 'Business viability',
    color: 'oklch(0.6791 0.1292 149.9093)',
    bg: 'oklch(0.6791 0.1292 149.9093 / 0.16)',
    fg: 'oklch(0.42 0.12 149.9093)',
  },
  feasibility: {
    label: 'Technical feasibility',
    color: 'oklch(0.8246 0.1351 89.6359)',
    bg: 'oklch(0.8246 0.1351 89.6359 / 0.24)',
    fg: 'oklch(0.42 0.09 79.4236)',
  },
};

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const FN_GREEN = 'oklch(0.6791 0.1292 149.9093)';
const FN_PURPLE = 'oklch(0.3811 0.196 279.1717)';
const FN_GRAY = 'oklch(0.5309 0.0063 95.1706)';

interface FunnelNode {
  x: number;
  y: number;
  w: number;
  h: number;
  count: string;
  label: string[];
  desc: string[];
  color: string;
  ty?: number;
}

const FN_NODES: FunnelNode[] = [
  {
    x: 20, y: 115, w: 140, h: 270, count: '30', color: FN_GRAY, ty: 92,
    label: ['All outreach'],
    desc: ['Households sent a', 'renewal outreach email'],
  },
  {
    x: 270, y: 115, w: 150, h: 81, count: '9', color: FN_GREEN,
    label: ['Questionnaire done'],
    desc: ['Replied + filled out', 'the questionnaire'],
  },
  {
    x: 270, y: 202, w: 150, h: 50, count: '4', color: FN_GRAY,
    label: ['Could not contact'],
    desc: ['Bad / missing email'],
  },
  {
    x: 270, y: 258, w: 150, h: 153, count: '17', color: FN_GRAY, ty: 40,
    label: ['No response'],
    desc: ['Received it, no', 'reply yet'],
  },
  {
    x: 530, y: 95, w: 150, h: 58, count: '4', color: FN_GREEN,
    label: ['Requoted + shared'],
    desc: ['Shopped + shared rec'],
  },
  {
    x: 530, y: 165, w: 150, h: 58, count: '5', color: FN_PURPLE,
    label: ['Requoted, pending'],
    desc: ['Not shared yet (confirm)'],
  },
  {
    x: 800, y: 63, w: 155, h: 58, count: '1', color: FN_GREEN,
    label: ['Umbrella + life'],
    desc: ['Cross-sell (confirm)'],
  },
  {
    x: 800, y: 135, w: 155, h: 58, count: '1', color: FN_PURPLE,
    label: ['Medicare'],
    desc: ['Cross-sell (confirm)'],
  },
  {
    x: 800, y: 207, w: 155, h: 58, count: '1', color: FN_GRAY,
    label: ['Not asked'],
    desc: ['To shop yet (confirm)'],
  },
  {
    x: 800, y: 279, w: 155, h: 72, count: '6', color: FN_GRAY, ty: 8,
    label: ['Declined'],
    desc: ['Chose to stay /', 'declined to switch'],
  },
];

const FN_STAGES: { x: number; label: string }[] = [
  { x: 90, label: 'Outreach' },
  { x: 345, label: 'Response' },
  { x: 605, label: 'Requote' },
  { x: 877, label: 'Outcome' },
];

interface FunnelLink {
  x1: number; y1: number; t1: number;
  x2: number; y2: number; t2: number;
  color: string;
}

const FN_LINKS: FunnelLink[] = [
  { x1: 160, y1: 155.5, t1: 81, x2: 270, y2: 155.5, t2: 81, color: FN_GREEN },
  { x1: 160, y1: 214, t1: 36, x2: 270, y2: 227, t2: 36, color: FN_GRAY },
  { x1: 160, y1: 308.5, t1: 153, x2: 270, y2: 334.5, t2: 153, color: FN_GRAY },
  { x1: 420, y1: 133, t1: 36, x2: 530, y2: 124, t2: 36, color: FN_GREEN },
  { x1: 420, y1: 173.5, t1: 45, x2: 530, y2: 194, t2: 45, color: FN_PURPLE },
  { x1: 680, y1: 110.5, t1: 9, x2: 800, y2: 92, t2: 9, color: FN_GREEN },
  { x1: 680, y1: 119.5, t1: 9, x2: 800, y2: 236, t2: 9, color: FN_GREEN },
  { x1: 680, y1: 133, t1: 18, x2: 800, y2: 297, t2: 18, color: FN_GREEN },
  { x1: 680, y1: 176, t1: 9, x2: 800, y2: 164, t2: 9, color: FN_PURPLE },
  { x1: 680, y1: 198.5, t1: 36, x2: 800, y2: 324, t2: 36, color: FN_PURPLE },
];

function ribbonPath(l: FunnelLink): string {
  const cx = (l.x1 + l.x2) / 2;
  const a = l.y1 - l.t1 / 2;
  const b = l.y1 + l.t1 / 2;
  const c = l.y2 - l.t2 / 2;
  const d = l.y2 + l.t2 / 2;
  return `M${l.x1},${a} C${cx},${a} ${cx},${c} ${l.x2},${c} L${l.x2},${d} C${cx},${d} ${cx},${b} ${l.x1},${b} Z`;
}

function PilotFunnel() {
  return (
    <figure className="funnel-figure">
      <svg
        className="funnel-svg"
        viewBox="0 0 975 425"
        role="img"
        aria-label="Pilot funnel: 30 outreach contacts flow to 9 questionnaires, 4 could-not-contact, 17 no-response; the 9 are requoted and split into outcomes (declined 6, umbrella+life 1, Medicare 1, not asked 1)."
      >
        {FN_STAGES.map((s) => (
          <text key={s.label} x={s.x} y={22} textAnchor="middle" className="fn-stage">
            {s.label.toUpperCase()}
          </text>
        ))}

        {FN_LINKS.map((l, i) => (
          <path key={i} d={ribbonPath(l)} fill={l.color} fillOpacity={0.22} />
        ))}

        {FN_NODES.map((n, i) => {
          const top = n.ty ?? 4;
          return (
            <g key={i}>
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx={8}
                fill={n.color}
                fillOpacity={0.14}
                stroke={n.color}
                strokeOpacity={0.5}
              />
              <text x={n.x + 12} y={n.y + top + 20} className="fn-num" fill={n.color}>
                {n.count}
              </text>
              {n.label.map((ln, j) => (
                <text key={`l${j}`} x={n.x + 40} y={n.y + top + 14 + j * 13} className="fn-lbl">
                  {ln}
                </text>
              ))}
              {n.desc.map((ln, j) => (
                <text
                  key={`d${j}`}
                  x={n.x + 12}
                  y={n.y + top + 14 + n.label.length * 13 + 6 + j * 12}
                  className="fn-desc"
                >
                  {ln}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <figcaption>
        Directional, small sample from the pilot so far. &ldquo;(confirm)&rdquo; marks a label we
        still need to verify with the agency.
      </figcaption>
    </figure>
  );
}

function VennDiagram() {
  const d = LENS_META.desirability.color;
  const v = LENS_META.viability.color;
  const f = LENS_META.feasibility.color;
  return (
    <figure className="venn">
      <svg viewBox="0 0 340 300" role="img" aria-label="Overlapping circles: user desirability, business viability, technical feasibility">
        <circle cx="170" cy="108" r="90" fill={d} fillOpacity="0.18" stroke={d} strokeOpacity="0.5" />
        <circle cx="118" cy="196" r="90" fill={v} fillOpacity="0.18" stroke={v} strokeOpacity="0.5" />
        <circle cx="222" cy="196" r="90" fill={f} fillOpacity="0.22" stroke={f} strokeOpacity="0.6" />
        <text x="170" y="60" textAnchor="middle" className="venn-label" fill={LENS_META.desirability.fg}>
          <tspan x="170" dy="0">User</tspan>
          <tspan x="170" dy="16">desirability</tspan>
        </text>
        <text x="86" y="225" textAnchor="middle" className="venn-label" fill={LENS_META.viability.fg}>
          <tspan x="86" dy="0">Business</tspan>
          <tspan x="86" dy="16">viability</tspan>
        </text>
        <text x="256" y="225" textAnchor="middle" className="venn-label" fill={LENS_META.feasibility.fg}>
          <tspan x="256" dy="0">Technical</tspan>
          <tspan x="256" dy="16">feasibility</tspan>
        </text>
        <text x="170" y="163" textAnchor="middle" className="venn-center">Upline</text>
      </svg>
    </figure>
  );
}

export function LearningsPage({ learnings }: LearningsPageProps) {
  if (!learnings) {
    return <p className="loading">Loading learnings…</p>;
  }

  const timeline = [...learnings.entries].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <section className="hero learnings-hero">
        <div className="learnings-hero-copy">
          <p className="eyebrow">Learnings</p>
          <h1 className="hero-title">How our thinking has changed.</h1>
          <p className="hero-sub">{learnings.intro}</p>
          <p className="venn-explainer">
            Each open question below is still pressure-testing one of these three &mdash; and a
            venture only works where all three overlap.
          </p>
        </div>
        <VennDiagram />
      </section>

      <section className="card">
        <h2>Questions we set out to answer</h2>
        <div className="table-scroll">
          <table className="q-table">
            <thead>
              <tr>
                <th className="q-col-question">Question</th>
                <th className="q-col-status">Status</th>
                <th>What we&rsquo;re seeing</th>
                <th className="q-col-lens">Lens</th>
              </tr>
            </thead>
            <tbody>
              {learnings.questions.map((q) => (
                <tr key={q.id}>
                  <td className="q-col-question">{q.question}</td>
                  <td className="q-col-status">
                    <span className="status-pill status-plain">{q.status}</span>
                  </td>
                  <td className="q-col-note">{q.note}</td>
                  <td className="q-col-lens">
                    <span
                      className="lens-pill"
                      style={{
                        backgroundColor: LENS_META[q.lens].bg,
                        color: LENS_META[q.lens].fg,
                      }}
                    >
                      <span className="lens-dot" style={{ backgroundColor: LENS_META[q.lens].color }} />
                      {LENS_META[q.lens].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Funnel economics — early pilot trends</h2>
        <p className="export-hint">
          Where the pilot outreach has landed so far (small sample) — every contact traced through
          questionnaire, requote, and outcome.
        </p>
        <PilotFunnel />
      </section>

      <section className="card">
        <h2>The learning log</h2>
        <p className="export-hint">
          A chronology of the moments that moved our thinking — milestones we hit and the learning
          each one produced. Read top to bottom to see how the bet evolved.
        </p>
        <div className="table-scroll">
          <table className="log-table timeline-table">
            <thead>
              <tr>
                <th className="col-date">Date</th>
                <th className="col-source">Source</th>
                <th>Learning</th>
              </tr>
            </thead>
            <tbody>
              {timeline.map((e, idx) =>
                e.kind === 'milestone' ? (
                  <tr key={`${e.date}-${idx}`} className="timeline-milestone-row">
                    <td className="col-date">{formatDate(e.date)}</td>
                    <td colSpan={2}>
                      <span className="milestone-flag">Milestone</span>
                      <span className="milestone-title">{e.title}</span>
                      <p className="milestone-desc">{e.learning}</p>
                    </td>
                  </tr>
                ) : (
                  <tr key={`${e.date}-${idx}`}>
                    <td className="col-date">{formatDate(e.date)}</td>
                    <td className="col-source">
                      {e.source ? <span className="source-tag">{e.source}</span> : null}
                    </td>
                    <td>
                      {e.learning}
                      {e.detail && e.detail.length ? (
                        <ul className="row-detail">
                          {e.detail.map((d) => (
                            <li key={d}>{d}</li>
                          ))}
                        </ul>
                      ) : null}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
        <p className="edit-hint">
          Not exhaustive by design — the full detail lives in Notion. Add a moment by appending to{' '}
          <code>data/learnings.json</code> as a byproduct of the weekly meeting.
        </p>
      </section>
    </>
  );
}
