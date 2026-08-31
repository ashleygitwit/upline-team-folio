import type { Learnings, QuestionLens } from '../types';

interface LearningsPageProps {
  learnings: Learnings | null;
}

const LENS_META: Record<QuestionLens, { label: string; color: string; bg: string; fg: string }> = {
  desirability: {
    label: 'User desirability',
    color: 'var(--primary)',
    bg: 'color-mix(in srgb, var(--primary) 12%, transparent)',
    fg: 'var(--primary)',
  },
  viability: {
    label: 'Business viability',
    color: 'var(--chart-5)',
    bg: 'color-mix(in srgb, var(--chart-5) 16%, transparent)',
    fg: 'var(--success-strong)',
  },
  feasibility: {
    label: 'Technical feasibility',
    color: 'var(--chart-3)',
    bg: 'color-mix(in srgb, var(--chart-3) 24%, transparent)',
    fg: 'var(--amber-strong)',
  },
};

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const FN_GREEN = 'var(--chart-5)';
const FN_PURPLE = 'var(--primary)';
const FN_GRAY = 'var(--muted-foreground)';

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
    x: 20, y: 85, w: 150, h: 280, count: '48', color: FN_GRAY, ty: 108,
    label: ['On the sheet'],
    desc: ['Households on the', 'disposition roster'],
  },
  {
    x: 250, y: 70, w: 150, h: 185, count: '42', color: FN_GREEN,
    label: ['Outreach sent'],
    desc: ['Renewal email sent'],
  },
  {
    x: 250, y: 275, w: 150, h: 90, count: '6', color: FN_GRAY,
    label: ['Not emailed'],
    desc: ['Held — not in', 'the send queue'],
  },
  {
    x: 480, y: 70, w: 150, h: 140, count: '18', color: FN_GREEN,
    label: ['Responded'],
    desc: ['Questionnaire', 'completed · 43%'],
  },
  {
    x: 480, y: 230, w: 150, h: 135, count: '24', color: FN_GRAY, ty: 34,
    label: ['No response'],
    desc: ['Emailed, no', 'questionnaire'],
  },
  {
    x: 710, y: 70, w: 150, h: 140, count: '18', color: FN_GREEN,
    label: ['Rec sent'],
    desc: ['Shopped + rec', 'email · 100% of QQ'],
  },
  {
    x: 940, y: 55, w: 175, h: 310, count: '18', color: FN_PURPLE, ty: 8,
    label: ['Closed / open'],
    desc: ['Switched — 7', 'Stayed — 5', 'Pending — 6'],
  },
];

const FN_STAGES: { x: number; label: string }[] = [
  { x: 95, label: 'In pilot' },
  { x: 325, label: 'Outreach' },
  { x: 555, label: 'Response' },
  { x: 785, label: 'Recommend' },
  { x: 1027, label: 'Outcome' },
];

interface FunnelLink {
  x1: number; y1: number; t1: number;
  x2: number; y2: number; t2: number;
  color: string;
}

const FN_LINKS: FunnelLink[] = [
  // In pilot -> outreach sent / not emailed
  { x1: 170, y1: 170, t1: 110, x2: 250, y2: 162, t2: 110, color: FN_GREEN },
  { x1: 170, y1: 300, t1: 18, x2: 250, y2: 320, t2: 18, color: FN_GRAY },
  // Outreach sent -> responded / no response
  { x1: 400, y1: 115, t1: 42, x2: 480, y2: 140, t2: 42, color: FN_GREEN },
  { x1: 400, y1: 195, t1: 56, x2: 480, y2: 297, t2: 56, color: FN_GRAY },
  // Responded -> rec sent (all 18)
  { x1: 630, y1: 140, t1: 42, x2: 710, y2: 140, t2: 42, color: FN_GREEN },
  // Rec sent -> outcomes
  { x1: 860, y1: 140, t1: 42, x2: 940, y2: 210, t2: 42, color: FN_PURPLE },
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
        viewBox="0 0 1130 400"
        role="img"
        aria-label="Members 1st pilot funnel snapshot: 48 households on the disposition sheet; 42 outreach emails sent and 6 held (not emailed); 18 questionnaires completed (43%) and 24 with no response; all 18 responders received a recommendation email; outcomes — 7 switched, 5 stayed, 6 pending."
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
        End-of-pilot snapshot from Austin&rsquo;s disposition sheet (Members 1st, as of Aug 7, 2026).
        Outreach and response are cumulative; every questionnaire responder received a recommendation
        email (18/18). Outcomes: switched carriers, stayed with current carrier, or still pending a
        response to the recommendation.
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
        <h2>Pilot customer funnel — end of Members 1st</h2>
        <p className="export-hint">
          Closed snapshot of the Members 1st pilot: 48 households on the disposition sheet, traced
          from outreach through questionnaire, recommendation, and close-out.
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
                    <td className="col-source">
                      <span className="milestone-flag">Milestone</span>
                    </td>
                    <td>
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
