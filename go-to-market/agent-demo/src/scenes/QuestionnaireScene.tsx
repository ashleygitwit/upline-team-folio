import { useState } from "react";
import type { SceneProps } from "../App";
import { Icon } from "../components/ui";
import { agency, client, questionnaireIntro, questionnaireSteps } from "../data";

export default function QuestionnaireScene({ onNext }: SceneProps) {
  // sub-steps: -1 = intro, 0..n-1 = questions, n = thanks
  const [qi, setQi] = useState(-1);
  const [dl, setDl] = useState("");
  const [picks, setPicks] = useState<string[]>(["pool"]);
  const [life, setLife] = useState<string | null>(null);

  const total = questionnaireSteps.length;
  const pct = qi < 0 ? 0 : Math.min(100, Math.round(((qi + 1) / (total + 1)) * 100));

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
          <span className="muted" style={{ fontSize: 13 }}>· Coverage Review</span>
          <span className="q-cobrand"><Icon.lock size={13} /> Secure · {agency.questionnaireHost}</span>
        </div>
        <div className="q-progress"><span style={{ width: `${pct}%` }} /></div>

        <div className="q-main">
          {/* Intro */}
          {qi === -1 && (
            <div className="q-card fade-in center">
              <div className="q-step-label">A note from {agency.agent.name}</div>
              <h2 className="q-prompt" style={{ marginTop: 14 }}>{questionnaireIntro.headline}</h2>
              <p className="q-help" style={{ maxWidth: "40ch", margin: "16px auto 0" }}>{questionnaireIntro.sub}</p>
              <div className="q-footer" style={{ justifyContent: "center" }}>
                <button className="btn btn-primary btn-lg" onClick={() => setQi(0)}>
                  Get started <Icon.arrowRight size={16} />
                </button>
                <span className="muted" style={{ fontSize: 13 }}>~{questionnaireIntro.minutes} min</span>
              </div>
            </div>
          )}

          {/* Questions */}
          {qi >= 0 && qi < total && (
            <div className="q-card fade-in" key={qi}>
              <div className="q-step-label">{questionnaireSteps[qi].section}</div>
              <h2 className="q-prompt">{questionnaireSteps[qi].prompt}</h2>
              {questionnaireSteps[qi].help && <p className="q-help">{questionnaireSteps[qi].help}</p>}

              {/* confirm */}
              {questionnaireSteps[qi].kind === "confirm" && (
                <div className="q-review">
                  <div className="item"><span className="muted">Name</span><span className="strong" style={{ marginLeft: "auto" }}>{client.name}</span></div>
                  <div className="item"><span className="muted">Email</span><span className="strong" style={{ marginLeft: "auto" }}>{client.email}</span></div>
                  <div className="item"><span className="muted">Mobile</span><span className="strong" style={{ marginLeft: "auto" }}>{client.phone}</span></div>
                  <div className="item"><span className="muted">Address</span><span className="strong" style={{ marginLeft: "auto" }}>{client.address}</span></div>
                </div>
              )}

              {/* text (Lily DL#) */}
              {questionnaireSteps[qi].kind === "text" && (
                <div className="q-field">
                  <input
                    className={`q-input ${dl ? "filled-hint" : ""}`}
                    placeholder={questionnaireSteps[qi].prefillNote}
                    value={dl}
                    onChange={(e) => setDl(e.target.value)}
                  />
                </div>
              )}

              {/* multi */}
              {questionnaireSteps[qi].kind === "multi" && (
                <div className="q-field">
                  {questionnaireSteps[qi].choices!.map((c) => {
                    const on = picks.includes(c.id);
                    return (
                      <button key={c.id} className={`q-choice ${on ? "selected" : ""}`} onClick={() => toggle(c.id)}>
                        <span className="box">{on && <Icon.check size={13} />}</span>
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* life yes/no */}
              {questionnaireSteps[qi].kind === "life" && (
                <div className="q-field">
                  {questionnaireSteps[qi].choices!.map((c) => (
                    <button key={c.id} className={`q-choice radio ${life === c.id ? "selected" : ""}`} onClick={() => setLife(c.id)}>
                      <span className="box">{life === c.id && <Icon.check size={13} />}</span>
                      {c.label}
                    </button>
                  ))}
                  {life === "yes" && (
                    <p className="q-help fade-in" style={{ marginTop: 14 }}>
                      Great — we'll ask a couple quick questions (height, weight, coverage amount) and file a number away for you.
                    </p>
                  )}
                </div>
              )}

              <div className="q-footer">
                {qi > 0 && (
                  <button className="btn btn-soft" onClick={() => setQi(qi - 1)}>
                    <Icon.arrowLeft size={15} /> Back
                  </button>
                )}
                <button className="btn btn-primary btn-lg" onClick={() => setQi(qi + 1)}>
                  {qi === total - 1 ? "Submit" : "Continue"} <Icon.arrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Thanks */}
          {qi >= total && (
            <div className="q-thanks fade-in">
              <div className="big-check"><Icon.check size={30} /></div>
              <h2 className="q-prompt">Thanks {client.first} — we've got what we need</h2>
              <p className="q-help">Your agent at {agency.name} will follow up shortly with your renewal options. You can close this window.</p>
              <button className="btn btn-ghost btn-lg mt-24" onClick={onNext}>
                Close <Icon.arrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
