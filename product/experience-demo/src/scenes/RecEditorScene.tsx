import { useState } from "react";
import type { SceneProps } from "../App";
import { Badge, Cockpit, DraftNote, Icon, SceneHead, money } from "../components/ui";
import { agency, client, recEmail, recEmailBody, ruledOut, savings } from "../data";

export default function RecEditorScene({ onNext }: SceneProps) {
  const [body, setBody] = useState(recEmailBody.join("\n\n"));
  const [showGrange, setShowGrange] = useState(false);

  return (
    <Cockpit crumb={`${client.household} · Recommendation`}>
      <DraftNote>
        WYSIWYG. The agent sees what the insured will see. How many options they see is built-in logic, not a toggle: we found a save, so the page leads with one pick. The agent can still drop a carrier. This never auto-sends.
      </DraftNote>
      <SceneHead
        eyebrow={`${client.name} · does not auto-send`}
        title="What Dana will see"
        sub="Edit the copy. Drop anything you don't want on the page. What you send is the offer."
      />

      <div className="grid grid-main mt-20">
        <div className="email-frame">
          <div className="email-toolbar">
            <Icon.mail size={15} /> Recommendation email · from {agency.agent.name}
            <span style={{ marginLeft: "auto" }}><Badge tone="indigo">Invitation. The page is the brief.</Badge></span>
          </div>
          <div className="email-meta">
            <div className="line"><span className="lbl">To</span><span>{recEmail.to}</span></div>
            <div className="line"><span className="lbl">Subject</span><span className="strong">{recEmail.subject}</span></div>
          </div>
          <div className="email-body">
            <textarea value={body} onChange={(e) => setBody(e.target.value)} aria-label="Recommendation email" />
            <p>
              <a className="qlink" href="#proposal" onClick={(e) => e.preventDefault()}>
                See the recommendation →
              </a>
            </p>
          </div>
        </div>

        <div className="stack gap-16">
          <div className="card">
            <div className="section-head">On the insured page</div>
            <p className="mt-12" style={{ fontSize: 14, lineHeight: 1.45 }}>
              Auto-Owners · {money(savings.owners)} · same coverage as Erie, {money(savings.perYear)} less.
            </p>
            <div className="drop-row">
              <span>Auto-Owners (the pick)</span>
              <Badge tone="lime">Shown</Badge>
            </div>
            <div className="drop-row">
              <span>Grange (upsell)</span>
              <button className="btn btn-soft" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => setShowGrange((v) => !v)}>
                {showGrange ? "Showing" : "Dropped"}
              </button>
            </div>
            <div className="drop-row">
              <span>Erie (incumbent)</span>
              <Badge>Ruled out on the page</Badge>
            </div>
            {showGrange && (
              <p className="muted mt-8" style={{ fontSize: 12.5, lineHeight: 1.45 }}>
                Logic still leads with one pick. Grange becomes a "we also looked at" note, not a second offer.
              </p>
            )}
          </div>

          <div className="card">
            <div className="section-head">Why we rolled the others out</div>
            {ruledOut.map((r) => (
              <div key={r.name} className="mt-12">
                <div className="strong" style={{ fontSize: 13.5 }}>{r.name}</div>
                <p className="muted" style={{ fontSize: 13, lineHeight: 1.45, marginTop: 4 }}>{r.why}</p>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-block btn-lg" onClick={onNext}>
            <Icon.send size={16} /> Send recommendation
          </button>
        </div>
      </div>
    </Cockpit>
  );
}
