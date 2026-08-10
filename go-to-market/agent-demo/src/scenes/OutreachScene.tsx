import { useState, type JSX } from "react";
import type { SceneProps } from "../App";
import { Badge, Cockpit, Icon, SceneHead } from "../components/ui";
import { agency, client, flags, outreachEmail, questionnaireQuestions, uplineRecommendation } from "../data";

function Var({ children }: { children: string }) {
  return <span className="var">{children}</span>;
}

const flagIcon: Record<string, JSX.Element> = {
  gold: <Icon.alert size={16} />,
  indigo: <Icon.droplet size={16} />,
  green: <Icon.minus size={16} />,
};

export default function OutreachScene({ onNext }: SceneProps) {
  const [sent, setSent] = useState(false);
  const [questions, setQuestions] = useState(
    () => questionnaireQuestions.map((q) => ({ ...q })),
  );
  const v = outreachEmail.vars;
  const includedCount = questions.filter((q) => q.included).length;

  const toggle = (id: string) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, included: !q.included } : q)));

  return (
    <Cockpit crumb={`${client.name} · Outreach`}>
      <SceneHead
        eyebrow={`${client.name} · Outreach`}
        title="Outreach email & questionnaire"
        sub="Review the draft and the questions before send. Remove anything you don’t need."
      />

      <div className="confirm-block mt-16">
        <div className="section-head" style={{ marginBottom: 8 }}>{uplineRecommendation.confirmTitle}</div>
        <div className="confirm-list">
          {uplineRecommendation.gaps.map((g) => (
            <div key={g} className="rec-line tight">
              <span className="check"><Icon.check size={16} /></span>
              <span>{g}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flags-strip mt-16">
        <div className="section-head" style={{ marginBottom: 8 }}>Flags for this outreach</div>
        <div className="flags-row">
          {flags.map((f) => (
            <div key={f.title} className="flag-chip">
              <span style={{ color: `var(--${f.tone === "indigo" ? "primary" : f.tone})` }}>
                {flagIcon[f.tone]}
              </span>
              <div>
                <div className="strong" style={{ fontSize: 13 }}>{f.title}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{f.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-main mt-20">
        <div className="email-frame">
          <div className="email-toolbar">
            <Icon.mail size={15} /> Outreach email · draft
            <span style={{ marginLeft: "auto" }}>
              <Badge dot="green" tone="green">Email verified</Badge>
            </span>
          </div>
          <div className="email-meta">
            <div className="line"><span className="lbl">To</span><span>{outreachEmail.to}</span></div>
            <div className="line"><span className="lbl">From</span><span>{outreachEmail.from}</span></div>
            <div className="line"><span className="lbl">Subject</span><span className="strong">{outreachEmail.subject}</span></div>
          </div>
          <div className="email-body">
            <p>Hi <Var>{v.first}</Var>,</p>
            <p>
              At Seabrook Insurance, we value you as a client, not just a policyholder. As your
              renewal on <Var>{v.renewalDate}</Var> approaches, we'd like to take a few minutes to
              review your coverage and make sure everything still fits your needs. Sometimes we find
              our clients are missing out on discounts, because over time the information we have no
              longer reflects your current situation. Your renewal premium for this term is{" "}
              <Var>{v.premium}</Var>.
            </p>
            <p>
              One of the advantages of working with Seabrook is that we partner with{" "}
              {agency.carrierCount} different insurance companies. That means we can compare options
              across multiple carriers to help ensure you're receiving competitive rates and the
              coverage that's right for you. Let us take the guesswork and the multiple phone calls
              off your plate.
            </p>
            <p>
              To make sure you're not missing any available discounts or carrying coverage that may
              no longer match your situation, I've put together a brief questionnaire.
            </p>
            <p>
              <a className="qlink" onClick={(e) => e.preventDefault()} href="#">
                Complete the questionnaire here →
              </a>
            </p>
            <p>Thank you for being a valued client of Seabrook Insurance.</p>
            <p>{agency.agent.name}</p>
          </div>
        </div>

        <div className="stack gap-16">
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="row between" style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
              <div className="section-head" style={{ margin: 0 }}>Questionnaire questions</div>
              <span className="muted" style={{ fontSize: 12 }}>{includedCount} included</span>
            </div>
            {questions.map((q) => (
              <div key={q.id} className={`q-approve-row ${q.included ? "" : "removed"}`}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
                    {q.section}
                  </div>
                  <div className="strong" style={{ fontSize: 13.5, marginTop: 3 }}>{q.prompt}</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 3 }}>{q.why}</div>
                </div>
                <button
                  className={`btn ${q.included ? "btn-soft" : "btn-ghost"}`}
                  style={{ padding: "6px 10px", fontSize: 12, flex: "none" }}
                  onClick={() => toggle(q.id)}
                  title={q.included ? "Remove from questionnaire" : "Include again"}
                >
                  {q.included ? <><Icon.x size={13} /> Remove</> : <>Include</>}
                </button>
              </div>
            ))}
          </div>

          <div className="card card-soft">
            <div className="section-head">Secure questionnaire link</div>
            <div className="mono mt-8" style={{ fontSize: 12.5, wordBreak: "break-all", color: "var(--primary)" }}>
              https://{agency.questionnaireHost}/q/corey-criswell
            </div>
            <div className="row gap-6 mt-12 muted" style={{ fontSize: 12 }}>
              <Icon.lock size={13} /> Opens only after Corey confirms his date of birth
            </div>
          </div>

          {!sent ? (
            <button className="btn btn-primary btn-block btn-lg" onClick={() => setSent(true)}>
              <Icon.send size={16} /> Send to Corey
            </button>
          ) : (
            <div className="card fade-in" style={{ borderColor: "var(--green)", background: "var(--green-soft)" }}>
              <div className="row gap-8 strong"><Icon.checkCircle size={18} /> Sent · logged to account</div>
              <button className="btn btn-ghost btn-block mt-12" onClick={onNext}>
                View as member <Icon.arrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Cockpit>
  );
}
