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
