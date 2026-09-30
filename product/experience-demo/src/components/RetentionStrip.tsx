import { useMemo, useState } from "react";
import { Icon } from "./ui";
import { retentionKpis, retentionWeeks } from "../data";

const W = 640;
const H = 168;
const PAD = { l: 28, r: 8, t: 12, b: 26 };

export function RetentionStrip() {
  const [hover, setHover] = useState<number | null>(null);
  const week = hover != null ? retentionWeeks[hover] : null;

  const max = useMemo(() => {
    const m = Math.max(...retentionWeeks.flatMap((w) => [w.queued, w.sent, w.retained ?? 0]));
    return Math.ceil(m / 5) * 5;
  }, []);

  const plotW = W - PAD.l - PAD.r;
  const plotH = H - PAD.t - PAD.b;
  const groupW = plotW / retentionWeeks.length;
  const barW = 7;

  function y(n: number) {
    return PAD.t + plotH - (n / max) * plotH;
  }
  function h(n: number) {
    return (n / max) * plotH;
  }

  const ticks = [0, max / 2, max];
  const cx = 54;
  const cy = 54;
  const r = 42;
  const circ = 2 * Math.PI * r;
  const pct = retentionKpis.avgRetention / 100;

  return (
    <section className="retention" aria-label="Retention data">
      <div className="retention-chart">
        <div className="row between wrap" style={{ gap: 10 }}>
          <div>
            <h2 className="retention-title">Weekly book</h2>
            <p className="muted" style={{ fontSize: 12, marginTop: 2 }}>
              Counted after the renewal date.
            </p>
          </div>
          <div className="retention-legend">
            <span><i className="swatch queued" /> Teed up</span>
            <span><i className="swatch sent" /> Sent</span>
            <span><i className="swatch kept" /> Renewed</span>
            <span className="retention-range">{retentionKpis.rangeLabel}</span>
          </div>
        </div>

        <div className="retention-plot">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Households teed up, sent, and renewed by week">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} className="retention-grid" />
                <text x={PAD.l - 6} y={y(t) + 3} className="retention-axis" textAnchor="end">{t}</text>
              </g>
            ))}
            {retentionWeeks.map((w, i) => {
              const gx = PAD.l + i * groupW + groupW / 2;
              const on = i === hover;
              const trio = w.retained == null ? 2 : 3;
              const span = trio * barW + (trio - 1) * 3;
              const x0 = gx - span / 2;
              return (
                <g
                  key={w.label}
                  className={`retention-group ${on ? "is-on" : ""}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <rect x={PAD.l + i * groupW} y={PAD.t} width={groupW} height={plotH} fill="transparent" />
                  <rect x={x0} y={y(w.queued)} width={barW} height={h(w.queued)} rx="2" className="bar-queued" />
                  <rect x={x0 + barW + 3} y={y(w.sent)} width={barW} height={h(w.sent)} rx="2" className="bar-sent" />
                  {w.retained != null && (
                    <rect x={x0 + (barW + 3) * 2} y={y(w.retained)} width={barW} height={h(w.retained)} rx="2" className="bar-kept" />
                  )}
                  <text
                    x={gx}
                    y={H - 8}
                    textAnchor="middle"
                    className={`retention-x ${on || w.current ? "is-on" : ""}`}
                  >
                    {w.label}
                  </text>
                </g>
              );
            })}
          </svg>
          {week && hover != null && (
            <div
              className="retention-tip"
              style={{ left: `${Math.min(86, Math.max(14, ((hover + 0.5) / retentionWeeks.length) * 100))}%` }}
            >
              <p className="retention-tip-kicker">{week.current ? "This week" : week.label}</p>
              <p><span className="swatch queued" /> {week.queued} teed up</p>
              <p><span className="swatch sent" /> {week.sent} sent</p>
              <p>
                <span className="swatch kept" />{" "}
                {week.retained == null ? "Available after the renewal date" : `${week.retained} renewed`}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="retention-kpis">
        <div className="retention-ring-card">
          <p className="section-head">Average retention</p>
          <div className="retention-ring-wrap">
            <div className="retention-ring" aria-hidden="true">
              <svg viewBox="0 0 108 108">
                <circle cx={cx} cy={cy} r={r} className="ring-track" />
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  className="ring-value"
                  strokeDasharray={circ}
                  strokeDashoffset={circ * (1 - pct)}
                  transform={`rotate(-90 ${cx} ${cy})`}
                />
              </svg>
            </div>
            <p className="retention-kpi-value">{retentionKpis.avgRetention}%</p>
          </div>
          <p className="muted" style={{ fontSize: 12 }}>
            Through {retentionKpis.throughLabel}
          </p>
        </div>

        <div className="retention-mini">
          <svg className="mini-wave" viewBox="0 0 80 28" aria-hidden="true">
            <path d="M0 18 C12 18 14 8 26 8 S40 22 52 16 S68 4 80 10" />
          </svg>
          <p className="retention-mini-stat">
            <Icon.trendUp size={14} /> +{retentionKpis.vsLastYearPts}%
          </p>
          <p className="muted" style={{ fontSize: 12 }}>
            vs this stretch last year ({retentionKpis.lastYearRetention}%)
          </p>
        </div>

        <div className="retention-mini">
          <svg className="mini-wave alt" viewBox="0 0 80 28" aria-hidden="true">
            <path d="M0 20 C10 16 18 6 30 10 S48 24 60 14 S72 8 80 12" />
          </svg>
          <p className="retention-mini-stat">{retentionKpis.leadsToSales} leads</p>
          <p className="muted" style={{ fontSize: 12 }}>sent to sales this month</p>
        </div>
      </div>
    </section>
  );
}
