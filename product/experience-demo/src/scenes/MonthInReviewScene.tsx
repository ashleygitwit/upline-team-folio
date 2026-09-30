import type { SceneProps } from "../App";
import { DraftNote } from "../components/ui";
import { agency, monthInReview } from "../data";

export default function MonthInReviewScene({}: SceneProps) {
  const m = monthInReview;

  return (
    <div className="mir-shell">
      <div className="mir-letter">
        <div className="mir-head">
          <img src="/upline-logo.png" alt="Upline" />
          <p>{m.subject} · {agency.name}</p>
        </div>
        <div className="mir-body">
          <DraftNote>
            Dashboard is not a screen for MVP. This email is the stand-in: Upline-branded, to the agent. Two halves: what we need you to do, and what we've been doing. Retention is the headline. Not a funnel.
          </DraftNote>
          <p className="eyebrow">From Upline</p>
          <h1 className="scene-title" style={{ fontSize: 28 }}>September with Upline</h1>
          <p className="muted mt-8" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{m.lag}</p>

          <div className="card mt-20" style={{ background: "linear-gradient(180deg, var(--primary-soft), var(--card))" }}>
            <div className="section-head">The two numbers that matter</div>
            <p style={{ fontSize: 22, marginTop: 8 }}>
              <strong>{m.headline.renewed}</strong> renewed of <strong>{m.headline.up}</strong> that came due.
            </p>
            <p className="muted mt-8" style={{ fontSize: 13 }}>{m.headline.note}</p>
          </div>

          <div className="mir-split">
            <div className="card">
              <div className="section-head">What we need you to do</div>
              {m.needYou.map((n) => (
                <div key={n.label} className="need-item">
                  <div className="strong">{n.label}</div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{n.detail}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="section-head">What we've been doing</div>
              <div className="stat-grid mt-12">
                {m.beenDoing.map((s) => (
                  <div key={s.label} className="stat-cell">
                    <div className="val">{s.value}</div>
                    <div className="lbl">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="muted mt-20" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
            {m.hygiene}
          </p>
          <p className="mt-16" style={{ fontSize: 14 }}>
            This is their victory, not ours. Next month the picture fills in.
          </p>
        </div>
      </div>
    </div>
  );
}
