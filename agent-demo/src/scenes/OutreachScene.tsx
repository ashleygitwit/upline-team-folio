import { useState } from "react";
import type { SceneProps } from "../App";
import { Badge, Cockpit, Icon, SceneHead, UplineMark } from "../components/ui";
import { agency, client, outreachEmail } from "../data";

function Var({ children }: { children: string }) {
  return <span className="var">{children}</span>;
}

export default function OutreachScene({ onNext }: SceneProps) {
  const [sent, setSent] = useState(false);
  const v = outreachEmail.vars;

  return (
    <Cockpit crumb={`${client.name} · Outreach`}>
      <SceneHead
        eyebrow="Step 1 · The warm touch"
        title="One email — already written in your voice"
        sub="Every renewal gets the same warm, member-first note. Upline fills in the three things that change — name, renewal date, and the new rate — and attaches the client's secure questionnaire link. No sticker shock, no scary numbers."
      />

      <div className="grid grid-main mt-20">
        <div className="email-frame">
          <div className="email-toolbar">
            <Icon.mail size={15} /> Outreach email · draft
            <span style={{ marginLeft: "auto" }}>
              <Badge dot="green" tone="green">Email verified in membership book</Badge>
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
              At Members 1st Insurance, we value you as a member, not just a policyholder. As your
              renewal on <Var>{v.renewalDate}</Var> approaches, we'd like to take a few minutes to
              review your coverage and make sure everything still fits your needs. Sometimes we find
              our members are missing out on discounts, because over time the information we have no
              longer reflects your current situation. Your renewal premium for this term is{" "}
              <Var>{v.premium}</Var>.
            </p>
            <p>
              One of the advantages of working with Members 1st is that we partner with{" "}
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
            <p>Thank you for being a valued member of Members 1st Insurance.</p>
            <p>{agency.agent.name}</p>
          </div>
        </div>

        <div className="stack gap-16">
          <div className="upline-callout">
            <span className="tag eyebrow"><UplineMark size={15} /> What Upline did</span>
            <div className="mt-16">
              {[
                "Pulled Corey's verified email from the membership book",
                "Filled the three merge fields — name, date, new rate",
                "Generated a secure, DOB-gated questionnaire link",
                "Kept the increase off the page (no %, no old rate)",
              ].map((t) => (
                <div key={t} className="rec-line"><span className="check"><Icon.check size={16} /></span><span>{t}</span></div>
              ))}
            </div>
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
              <div className="row gap-8 strong"><Icon.checkCircle size={18} /> Sent — and logged to Corey's card</div>
              <p className="muted mt-8" style={{ fontSize: 13 }}>
                You'll get a ping the moment Corey completes it. Here's what he sees on his phone →
              </p>
              <button className="btn btn-ghost btn-block mt-12" onClick={onNext}>
                See the customer's questionnaire <Icon.arrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Cockpit>
  );
}
