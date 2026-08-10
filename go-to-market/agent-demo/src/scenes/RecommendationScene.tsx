import { useState } from "react";
import type { SceneProps } from "../App";
import { Badge, Cockpit, Icon, SceneHead, money } from "../components/ui";
import { agency, client, recommendationEmail, savings } from "../data";

export default function RecommendationScene({ onNext }: SceneProps) {
  const [sent, setSent] = useState(false);

  return (
    <Cockpit crumb={`${client.name} · Recommendation`}>
      <SceneHead
        eyebrow={`${client.name} · Recommendation`}
        title="Recommendation email"
        sub="Draft for review — coverage detail stays on your side for the call."
      />

      <div className="grid grid-main mt-20">
        <div className="email-frame">
          <div className="email-toolbar">
            <Icon.mail size={15} /> Recommendation email · draft
            <span style={{ marginLeft: "auto" }}><Badge dot="indigo">≤150 words · no jargon</Badge></span>
          </div>
          <div className="email-meta">
            <div className="line"><span className="lbl">To</span><span>{recommendationEmail.to}</span></div>
            <div className="line"><span className="lbl">Subject</span><span className="strong">{recommendationEmail.subject}</span></div>
          </div>
          <div className="email-body">
            <p>Hey {client.first},</p>
            <p>
              I reviewed your home and auto renewal and shopped it across our carriers. Travelers came
              in at {money(savings.travelers)}/yr for the two together — about {money(savings.perYear)} less
              per year than renewing with Donegal ({money(savings.donegal)}). My recommendation is to move
              both to Travelers as a bundle.
            </p>
            <table style={{ width: "100%", borderCollapse: "collapse", margin: "4px 0 14px", fontSize: 14 }}>
              <tbody>
                <tr><td style={{ padding: "6px 0", color: "var(--muted-foreground)" }}>Donegal (renewal)</td><td className="mono" style={{ textAlign: "right" }}>{money(savings.donegal)}</td></tr>
                <tr style={{ borderTop: "1px solid var(--border)" }}><td style={{ padding: "6px 0", fontWeight: 600 }}>Travelers</td><td className="mono strong" style={{ textAlign: "right" }}>{money(savings.travelers)}</td></tr>
              </tbody>
            </table>
            <p>
              Your coverage stays very close to what you have today, with a couple of small differences
              we'll go over on a quick call so you're comfortable. I'll handle the switch so everything
              stays bundled with no gap.
            </p>
            <p>I also grabbed that life quote you asked about — I'll bring it along.</p>
            <p>Send me a few times this week and I'll give you a call.</p>
            <p>{agency.agent.name}</p>
          </div>
        </div>

        <div className="stack gap-16">
          <div className="card">
            <div className="section-head">Kept on your side (for the call)</div>
            <div className="mt-8" style={{ fontSize: 13 }}>
              {[
                "Home all-peril deductible $500 → $1,000",
                "Auto comp shows $500 — re-rate to $100 + glass before bind",
                "Renewal dates aligned; bind before May 9",
                "Carriers shopped: Travelers, Nationwide, Progressive (declined)",
              ].map((t) => (
                <div key={t} className="rec-line" style={{ padding: "8px 0", borderTop: "1px solid var(--border)" }}>
                  <span className="muted"><Icon.shield size={15} /></span><span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {!sent ? (
            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={() => {
                setSent(true);
                onNext();
              }}
            >
              <Icon.send size={16} /> Send recommendation email
            </button>
          ) : (
            <div className="card fade-in" style={{ borderColor: "var(--green)", background: "var(--green-soft)" }}>
              <div className="row gap-8 strong"><Icon.checkCircle size={18} /> Sent · logged to account</div>
              <button className="btn btn-primary btn-block mt-12" onClick={onNext}>
                View updated client profile <Icon.arrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Cockpit>
  );
}
