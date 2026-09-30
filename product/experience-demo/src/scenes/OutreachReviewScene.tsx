import { useState } from "react";
import type { SceneProps } from "../App";
import { Badge, Cockpit, DraftNote, Icon, SceneHead, money } from "../components/ui";
import { agency, client, contextFlags, household, outreachBody, outreachEmail, policies, week } from "../data";

export default function OutreachReviewScene({ onNext }: SceneProps) {
  const [body, setBody] = useState(outreachBody.join("\n\n"));
  const [held, setHeld] = useState(false);

  return (
    <Cockpit crumb={`${client.household} · Outreach review`}>
      <DraftNote>
        Not a client profile. The email review, with enough household context to decide. Fingerprints go on send, hold, and the copy.
      </DraftNote>
      <div className="row between wrap gap-12">
        <SceneHead
          eyebrow={`${client.name} · ${client.renewalDate}`}
          title="Outreach review"
          sub={`Sends ${week.sendAt} unless you hold this renewal. Hold is this cycle only, not a permanent opt-out.`}
        />
        <Badge tone={held ? "warn" : "indigo"} dot={held ? "warn" : "indigo"}>
          {held ? "Held · this renewal only" : "On the Tuesday send"}
        </Badge>
      </div>

      <div className="grid grid-main mt-20">
        <div className="email-frame">
          <div className="email-toolbar">
            <Icon.mail size={15} /> From {agency.agent.name}'s mailbox · looks like Compose
            <span style={{ marginLeft: "auto" }}><Badge tone="green">No Upline on this email</Badge></span>
          </div>
          <div className="email-meta">
            <div className="line"><span className="lbl">To</span><span>{outreachEmail.to}</span></div>
            <div className="line"><span className="lbl">From</span><span>{outreachEmail.from}</span></div>
            <div className="line"><span className="lbl">Subject</span><span className="strong">{outreachEmail.subject}</span></div>
          </div>
          <div className="email-body">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} aria-label="Outreach email body" />
            <p>
              <a className="qlink" href="#form" onClick={(e) => e.preventDefault()}>
                Complete the questionnaire here →
              </a>
            </p>
            <p className="muted" style={{ fontSize: 13 }}>Signature lands from the mailbox. We don't write one.</p>
          </div>
        </div>

        <div className="stack gap-16">
          <div className="card">
            <div className="section-head">Why this household</div>
            <dl className="kv mt-12">
              <dt>Renewal</dt><dd>{money(client.renewalPremium)} · +{client.changePct}%</dd>
              <dt>Was</dt><dd>{money(client.currentPremium)}</dd>
              <dt>Phone</dt><dd>{client.phone}</dd>
              <dt>Client since</dt><dd>{client.memberSince}</dd>
            </dl>
            <div className="mt-12">
              {policies.map((p) => (
                <div key={p.number} className="person">
                  {p.short === "Home" ? <Icon.home size={16} /> : <Icon.car size={16} />}
                  <div>
                    <div className="strong">{p.line}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{p.carrier} · {p.detail}</div>
                  </div>
                  <span className="mono" style={{ marginLeft: "auto", fontSize: 13 }}>{money(p.renewalPremium)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="section-head">Household</div>
            {household.map((p) => (
              <div key={p.name} className="person">
                <span className="avatar-sm">{p.initials}</span>
                <div>
                  <div className="strong">{p.name}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{p.role} · {p.note}</div>
                </div>
                {p.flag ? <Badge tone="gold">DL# missing</Badge> : null}
              </div>
            ))}
          </div>

          <div className="stack gap-8">
            {contextFlags.map((f) => (
              <div key={f.title} className="flag-chip">
                <Icon.alert size={16} />
                <div>
                  <div className="strong" style={{ fontSize: 13 }}>{f.title}</div>
                  <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{f.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row wrap gap-12 mt-24">
        <button className="btn btn-danger" onClick={() => setHeld(true)}>
          Hold this renewal
        </button>
        <button
          className="btn btn-primary btn-lg"
          onClick={onNext}
          disabled={held}
        >
          <Icon.send size={16} /> Send now from my inbox
        </button>
        <span className="muted" style={{ fontSize: 13 }}>
          Silence also means send. We never stack 90 emails waiting for approval.
        </span>
      </div>
    </Cockpit>
  );
}
