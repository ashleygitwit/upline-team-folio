import type { CSSProperties } from 'react';
import {
  GANTT_COLUMNS,
  GANTT_LANES,
  GANTT_MILESTONES,
  GANTT_WATCH,
} from '../data/ganttTimeline';

const LEGEND: { tone: string; label: string }[] = [
  { tone: 'design', label: 'Design' },
  { tone: 'dev', label: 'Build' },
  { tone: 'qa', label: 'QA' },
  { tone: 'pilot-a', label: 'Pilot' },
  { tone: 'launch', label: 'Paying customer' },
  { tone: 'paid-3', label: 'Paid social' },
];

export function GanttChart() {
  const gridStyle = { '--gantt-cols': GANTT_COLUMNS.length } as CSSProperties;

  return (
    <div className="gantt-wrap">
      <div className="gantt-scroll">
        <div className="gantt" style={gridStyle}>
          <div className="gantt-row gantt-row-head">
            <div className="gantt-label" aria-hidden="true" />
            <div className="gantt-track">
              {GANTT_COLUMNS.map((c) => (
                <div key={c.key} className="gantt-colhead">
                  <span className="gantt-colhead-week">{c.label}</span>
                  <span className="gantt-colhead-dates">{c.dates}</span>
                </div>
              ))}
            </div>
          </div>

          {GANTT_LANES.map((lane) => (
            <div className="gantt-lane" key={lane.title}>
              <div className="gantt-lane-title">{lane.title}</div>
              {lane.rows.map((row) => (
                <div className="gantt-row" key={`${lane.title}-${row.label}`}>
                  <div className="gantt-label">
                    <span className="gantt-label-main">{row.label}</span>
                    {row.sub && <span className="gantt-label-sub">{row.sub}</span>}
                  </div>
                  <div className="gantt-track">
                    {GANTT_COLUMNS.map((c, i) => (
                      <div
                        key={c.key}
                        className="gantt-gridline"
                        style={{ gridColumn: `${i + 1} / ${i + 2}` }}
                        aria-hidden="true"
                      />
                    ))}
                    {row.bars.map((bar) => (
                      <div
                        key={`${row.label}-${bar.label}`}
                        className="gantt-bar"
                        data-tone={bar.tone}
                        data-outside={bar.labelOutside ? 'true' : undefined}
                        style={{ gridColumn: `${bar.start} / ${bar.end + 1}` }}
                      >
                        <span>{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="gantt-row gantt-row-milestones">
            <div className="gantt-label">
              <span className="gantt-label-main">Milestones</span>
            </div>
            <div className="gantt-track">
              {GANTT_COLUMNS.map((c, i) => (
                <div
                  key={c.key}
                  className="gantt-gridline"
                  style={{ gridColumn: `${i + 1} / ${i + 2}` }}
                  aria-hidden="true"
                />
              ))}
              {GANTT_MILESTONES.map((m) => (
                <div
                  key={m.label}
                  className="gantt-milestone"
                  data-emphasis={m.emphasis ? 'true' : undefined}
                  style={{ gridColumn: `${m.column} / ${m.column + 1}` }}
                >
                  <span className="gantt-milestone-date">{m.date}</span>
                  <span className="gantt-milestone-label">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ul className="gantt-legend">
        {LEGEND.map((l) => (
          <li key={l.tone}>
            <span className="gantt-swatch" data-tone={l.tone} aria-hidden="true" />
            {l.label}
          </li>
        ))}
      </ul>

      <p className="gantt-hint">Scroll the chart sideways on a narrow screen.</p>

      <h3 className="sub-label">Where it gets tight</h3>
      <ul className="proving-list">
        {GANTT_WATCH.map((w) => (
          <li key={w.when}>
            <b>{w.when}.</b> {w.what}
          </li>
        ))}
      </ul>
    </div>
  );
}
