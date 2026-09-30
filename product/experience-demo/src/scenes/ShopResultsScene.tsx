import { useState } from "react";
import type { SceneProps } from "../App";
import { Badge, Cockpit, DraftNote, Icon, SceneHead, money } from "../components/ui";
import { carriers, client, questionnaireAnswers, shopDiffs, talkingPoints } from "../data";

export default function ShopResultsScene({ onNext }: SceneProps) {
  const [open, setOpen] = useState(false);
  const diffs = shopDiffs.filter((r) => !r.same);
  const same = shopDiffs.filter((r) => r.same);

  return (
    <Cockpit crumb={`${client.household} · Shop results`}>
      <DraftNote>
        Magic moment. Lead with what's different. Talking points are the rationale, not a separate artifact. Three options: one parity, one upsell, the incumbent. Generate email is the next beat, never auto-send.
      </DraftNote>
      <SceneHead
        eyebrow={`${client.name} · three markets`}
        title="Sophie rates. Auto-Owners is the offer."
        sub="Collapse everything identical. If it matches and it's cheaper, it's a dash: check, check, check, save."
      />

      <div className="grid grid-3 mt-20">
        {carriers.map((c) => (
          <div key={c.id} className={`card carrier-card ${c.status === "winner" ? "winner" : ""}`}>
            <div className="row between">
              <strong>{c.name}</strong>
              <Badge tone={c.status === "winner" ? "lime" : c.status === "renewal" ? undefined : "indigo"}>{c.tag}</Badge>
            </div>
            <p className="muted" style={{ fontSize: 12, marginTop: 4 }}>{c.role}</p>
            <p className="mono" style={{ fontSize: 26, fontWeight: 700, marginTop: 10 }}>{money(c.total)}</p>
            <p className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>Home {money(c.home)} · Auto {money(c.auto)}</p>
            <p style={{ fontSize: 13.5, lineHeight: 1.45, marginTop: 10 }}>{c.why}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-main mt-20">
        <div>
          <div className="section-head" style={{ marginBottom: 10 }}>Talking points</div>
          <div className="talk-list">
            {talkingPoints.map((t) => (
              <div key={t.title} className="talk-item">
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="section-head" style={{ marginBottom: 10 }}>Household snapshot · from the questionnaire</div>
          <div className="card" style={{ padding: 0 }}>
            {questionnaireAnswers.map((a) => (
              <div key={a.question} className="person" style={{ padding: "10px 14px" }}>
                <div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{a.question}</div>
                  <div className="strong" style={{ fontSize: 13.5 }}>{a.answer}</div>
                </div>
                {a.notInAms ? <Badge tone="gold">Not in your AMS</Badge> : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-24">
        <div className="section-head">What's different</div>
        <table className="diff-table mt-12">
          <thead>
            <tr>
              <th></th>
              <th>Erie renewal</th>
              <th>Auto-Owners</th>
              <th>Grange</th>
            </tr>
          </thead>
          <tbody>
            {diffs.map((r) => (
              <tr key={r.label} className="diff">
                <td>{r.label}</td>
                <td>{r.erie}</td>
                <td>{r.owners}</td>
                <td>{r.grange}</td>
              </tr>
            ))}
            {open && same.map((r) => (
              <tr key={r.label} className="same">
                <td>{r.label}</td>
                <td>{r.erie}</td>
                <td>{r.owners}</td>
                <td>{r.grange}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-ghost mt-12" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide matches" : "Everything else matches"}
        </button>
      </div>

      <button className="btn btn-primary btn-lg mt-24" onClick={onNext}>
        Generate the recommendation <Icon.arrowRight size={16} />
      </button>
    </Cockpit>
  );
}
