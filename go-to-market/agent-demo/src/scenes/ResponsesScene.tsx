import type { SceneProps } from "../App";
import { Badge, Cockpit, Icon, UplineMark, money } from "../components/ui";
import {
  client,
  householdAfterQuestionnaire,
  policies,
  questionnaireAnswers,
  vehicles,
} from "../data";

export default function ResponsesScene({ onNext }: SceneProps) {
  return (
    <Cockpit crumb={`Renewals · ${client.name}`}>
      <div className="row between wrap gap-12">
        <div>
          <div className="eyebrow">Member since {client.memberSince}</div>
          <h1 className="scene-title">{client.name}</h1>
          <p className="muted mt-8" style={{ fontSize: 14 }}>{client.address} · {client.phone}</p>
        </div>
        <div className="row gap-8 wrap">
          <Badge tone="lime">Renews {client.renewalDate}</Badge>
          <Badge tone="green" dot="green">Questionnaire complete</Badge>
          <Badge tone="gold" dot="gold">Ready to shop</Badge>
        </div>
      </div>

      <div className="grid grid-main mt-24">
        <div className="stack gap-16">
          {/* Same premium table as profile */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="row between" style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
              <div className="section-head" style={{ margin: 0 }}>Policies on this account</div>
              <div className="muted" style={{ fontSize: 12 }}>Donegal · renews {client.renewalDate}</div>
            </div>
            <table className="premium-compare">
              <thead>
                <tr>
                  <th>Line</th>
                  <th className="num">This year</th>
                  <th className="num">Renewal</th>
                  <th className="num">Jump</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((p) => {
                  const delta = p.renewalPremium - p.currentPremium;
                  return (
                    <tr key={p.number}>
                      <td>
                        <div className="row gap-8">
                          {p.line.startsWith("Home") ? <Icon.home size={16} /> : <Icon.car size={16} />}
                          <div>
                            <div className="strong" style={{ fontSize: 13.5 }}>{p.short}</div>
                            <div className="q-sub">{p.number} · {p.dwelling}</div>
                          </div>
                        </div>
                      </td>
                      <td className="num mono muted">{money(p.currentPremium)}</td>
                      <td className="num mono strong">{money(p.renewalPremium)}</td>
                      <td className="num mono strong">+{money(delta)}</td>
                    </tr>
                  );
                })}
                <tr className="total-row">
                  <td className="strong">Combined</td>
                  <td className="num mono muted">{money(client.currentPremium)}</td>
                  <td className="num mono strong" style={{ fontSize: 16 }}>{money(client.renewalPremium)}</td>
                  <td className="num">
                    <Badge tone="gold">
                      +{money(Math.round(client.renewalPremium - client.currentPremium))} · {client.changePct}%
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Questionnaire answers — new on this "state" of the profile */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div className="row between wrap gap-8" style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
              <div className="row gap-8">
                <div className="section-head" style={{ margin: 0 }}>Questionnaire responses</div>
                <Badge tone="indigo">From questionnaire</Badge>
              </div>
              <div className="muted" style={{ fontSize: 12 }}>Submitted today · 2:14 PM</div>
            </div>
            <table className="qa-table">
              <tbody>
                {questionnaireAnswers.map((row) => (
                  <tr key={row.question}>
                    <td className="muted" style={{ width: "42%" }}>{row.question}</td>
                    <td>
                      <span className="strong">{row.answer}</span>
                      {row.updated && (
                        <span className="qa-updated">Updated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <div className="section-head">Household</div>
              {householdAfterQuestionnaire.map((h) => (
                <div key={h.name} className="person">
                  <span className="avatar-sm">{h.initials}</span>
                  <div style={{ flex: 1 }}>
                    <div className="strong" style={{ fontSize: 13.5 }}>{h.name}</div>
                    <div className="q-sub">{h.role} · {h.note}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="section-head">Vehicles</div>
              {vehicles.map((v) => (
                <div key={v.desc} className="vehicle">
                  <Icon.car size={16} />
                  <div style={{ flex: 1 }}>
                    <div className="strong" style={{ fontSize: 13.5 }}>{v.desc}</div>
                    <div className="q-sub">Primary: {v.driver}{v.note ? ` · ${v.note}` : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="stack gap-16">
          <div className="upline-callout">
            <span className="tag eyebrow"><UplineMark size={15} /> Ready to shop</span>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 19, marginTop: 10 }}>
              Shop home + auto together
            </h3>
            <p className="muted mt-8" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
              Gaps are filled — Lily’s DL#, pool details, and life opt-in. Quote the bundle across appointed carriers; don’t split and lose credits.
            </p>
            <div className="mt-16">
              {[
                "Match coverage to today’s Donegal structure",
                "Include life quote Corey requested",
              ].map((t) => (
                <div key={t} className="rec-line">
                  <span className="check"><Icon.check size={16} /></span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-block btn-lg mt-16" onClick={onNext}>
              <Icon.search size={16} /> Shop carriers
            </button>
          </div>
        </div>
      </div>
    </Cockpit>
  );
}
