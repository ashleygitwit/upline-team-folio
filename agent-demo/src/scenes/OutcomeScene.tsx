import type { SceneProps } from "../App";
import { Cockpit, Icon, UplineMark } from "../components/ui";
import { client, outcomeStats, outcomeTimeline } from "../data";

export default function OutcomeScene({ onBack }: SceneProps) {
  return (
    <Cockpit crumb="Outcome">
      <div className="outcome-hero">
        <span className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <UplineMark size={16} /> The Upline through line
        </span>
        <h1 style={{ marginTop: 12 }}>Corey stays — and he's better covered</h1>
        <p className="mantra">"Make every renewal prove the agent is in my corner."</p>
      </div>

      <div className="grid grid-3 mt-24">
        {outcomeStats.map((s) => (
          <div key={s.label} className="card center">
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 600, color: "var(--primary)" }}>{s.value}</div>
            <div className="muted mt-8" style={{ fontSize: 13 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-main mt-24">
        <div className="card pad-lg">
          <div className="section-head">What just happened — the whole loop</div>
          <div className="mt-12">
            {outcomeTimeline.map((t, n) => (
              <div key={t.title} className="timeline-item">
                <span className="timeline-num">{n + 1}</span>
                <div>
                  <div className="strong">{t.title}</div>
                  <div className="muted" style={{ marginTop: 3, fontSize: 13.5 }}>{t.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stack gap-16">
          <div className="upline-callout">
            <span className="tag eyebrow"><UplineMark size={15} /> The pitch, in one line</span>
            <p className="mt-12" style={{ fontSize: 15, lineHeight: 1.55 }}>
              Upline turns a renewal notice into a <strong>reason your members trust you more</strong> —
              proactive, warm, and shopped across your carriers — without adding hours to your day.
            </p>
            <div className="mt-16">
              {[
                "You touch every renewal, not just the easy ones",
                "Members feel looked after — retention goes up",
                "The busywork is Upline's; the relationship is yours",
              ].map((t) => (
                <div key={t} className="rec-line"><span className="check"><Icon.check size={16} /></span><span>{t}</span></div>
              ))}
            </div>
          </div>

          <div className="card card-soft center">
            <p className="muted" style={{ fontSize: 13 }}>Want to see it again for a different member?</p>
            <button className="btn btn-soft btn-block mt-12" onClick={onBack}>
              <Icon.arrowLeft size={15} /> Back a step
            </button>
          </div>
        </div>
      </div>

      <p className="center muted mt-24" style={{ fontSize: 12 }}>
        Demo walkthrough · {client.name} · illustrative data · not the final product UI
      </p>
    </Cockpit>
  );
}
