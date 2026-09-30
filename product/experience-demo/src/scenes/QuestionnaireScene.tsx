import { useState } from "react";
import type { SceneProps } from "../App";
import { Icon } from "../components/ui";
import { agency, client, questionnaireIntro, questionnaireSteps } from "../data";

export default function QuestionnaireScene({ onNext }: SceneProps) {
  const [qi, setQi] = useState(-1);
  const [dl, setDl] = useState("");
  const [picks, setPicks] = useState<string[]>(["sophie"]);
  const [life, setLife] = useState<string | null>("yes");
  const [amount, setAmount] = useState("500000");
  const [referral, setReferral] = useState("");

  const total = questionnaireSteps.length;
  const pct = qi < 0 ? 0 : Math.min(100, Math.round(((qi + 1) / (total + 1)) * 100));
  const step = qi >= 0 && qi < total ? questionnaireSteps[qi] : null;

  const toggle = (id: string) =>
    setPicks((p) => {
      if (id === "none") return ["none"];
      const base = p.filter((x) => x !== "none");
      return base.includes(id) ? base.filter((x) => x !== id) : [...base, id];
    });

  return (
    <div className="cockpit customer-surface">
      <div className="q-shell">
        <div className="q-topbar">
          <strong style={{ fontFamily: "var(--font-serif)", fontSize: 16 }}>{agency.name}</strong>
          <span className="muted" style={{ fontSize: 13 }}>· Coverage review</span>
          <span className="q-cobrand"><Icon.lock size={13} /> Secure · {agency.questionnaireHost}</span>
        </div>
        <div className="q-progress"><span style={{ width: `${pct}%` }} /></div>

        <div className="q-main">
          {qi === -1 && (
            <div className="q-card fade-in" style={{ textAlign: "center" }}>
              <div className="q-step-label">A note from {agency.agent.name}</div>
              <h2 className="q-prompt" style={{ marginTop: 14 }}>{questionnaireIntro.headline}</h2>
              <p className="q-help" style={{ maxWidth: "42ch", margin: "16px auto 0" }}>{questionnaireIntro.sub}</p>
              <div className="q-footer" style={{ justifyContent: "center" }}>
                <button className="btn btn-agency btn-lg" onClick={() => setQi(0)}>
                  Get started <Icon.arrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {step && (
            <div className="q-card fade-in" key={step.id}>
              <div className="q-step-label">{step.section}</div>
              <h2 className="q-prompt">{step.prompt}</h2>
              {step.help && <p className="q-help">{step.help}</p>}

              {step.kind === "confirm" && (
                <div className="q-review">
                  <div className="item"><span className="muted">Name</span><span className="strong" style={{ marginLeft: "auto" }}>{client.name}</span></div>
                  <div className="item"><span className="muted">Email</span><span className="strong" style={{ marginLeft: "auto" }}>{client.email}</span></div>
                  <div className="item"><span className="muted">Mobile</span><span className="strong" style={{ marginLeft: "auto" }}>{client.phone}</span></div>
                  <div className="item"><span className="muted">Address</span><span className="strong" style={{ marginLeft: "auto" }}>{client.address}</span></div>
                </div>
              )}

              {step.kind === "multi" && (
                <div className="q-field">
                  {step.choices?.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`q-choice ${picks.includes(c.id) ? "selected" : ""}`}
                      onClick={() => toggle(c.id)}
                    >
                      <span className="box">{picks.includes(c.id) ? <Icon.check size={12} /> : null}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
              )}

              {step.kind === "text" && (
                <div className="q-field">
                  <input className="q-input" placeholder={step.placeholder} value={dl} onChange={(e) => setDl(e.target.value)} />
                </div>
              )}

              {step.kind === "life" && (
                <div className="q-field">
                  {step.choices?.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`q-choice ${life === c.id ? "selected" : ""}`}
                      onClick={() => setLife(c.id)}
                    >
                      <span className="box">{life === c.id ? <Icon.check size={12} /> : null}</span>
                      {c.label}
                    </button>
                  ))}
                  {life === "yes" && (
                    <label className="login-field mt-16">
                      <span>About how much coverage?</span>
                      <select className="q-input" value={amount} onChange={(e) => setAmount(e.target.value)}>
                        <option value="250000">$250,000</option>
                        <option value="500000">$500,000</option>
                        <option value="1000000">$1,000,000</option>
                      </select>
                    </label>
                  )}
                </div>
              )}

              {step.kind === "referral" && (
                <div className="q-field">
                  <input
                    className="q-input"
                    placeholder="Name, and how you know them"
                    value={referral}
                    onChange={(e) => setReferral(e.target.value)}
                  />
                  <p className="q-help">You can skip this. Asking here is the whole feature for November.</p>
                </div>
              )}

              <div className="q-footer">
                <button className="btn btn-soft" onClick={() => setQi((n) => n - 1)}>Back</button>
                <button className="btn btn-agency btn-lg" onClick={() => setQi((n) => n + 1)}>
                  {qi === total - 1 ? "Submit" : "Continue"} <Icon.arrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {qi >= total && (
            <div className="q-card q-thanks fade-in">
              <div className="big-check"><Icon.check size={28} /></div>
              <h2 className="q-prompt">Got it. We'll take it from here.</h2>
              <p className="q-help">{agency.agent.first} will be in touch once we've looked at your markets. Completing this was the yes to shop. Nothing else to click.</p>
              <div className="q-footer" style={{ justifyContent: "center" }}>
                <button className="btn btn-agency btn-lg" onClick={onNext}>Back to the week</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
