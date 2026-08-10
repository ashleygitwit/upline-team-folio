import type { SceneProps } from "../App";
import { Badge, Cockpit, Icon, money } from "../components/ui";
import {
  autoClaims,
  client,
  homeProperty,
  householdAfterQuestionnaire,
  lifeQuote,
  savings,
  vehicles,
} from "../data";

const recommendedPolicies = [
  {
    short: "Homeowners",
    detail: "HO-3 · Travelers recommended",
    current: 1473,
    recommended: 1512,
  },
  {
    short: "Personal Auto",
    detail: "3 vehicles · 4 drivers · Travelers recommended",
    current: 10186,
    recommended: 8328,
  },
];

const portfolioGapsEnd = [
  {
    line: "Life",
    status: "Quoted",
    tone: "green" as const,
    note: `${lifeQuote.carrier} · ${lifeQuote.face} · ~$${lifeQuote.monthly}/mo`,
  },
  {
    line: "Umbrella",
    status: "Not on file",
    tone: "gold" as const,
    note: "",
  },
];

const history = [
  {
    when: "2017",
    title: "Became a client",
    body: "Opened home + auto with Seabrook · written with Donegal",
  },
  {
    when: "Feb 2026",
    title: "Lily added as a driver",
    body: "Youthful driver endorsed onto the auto policy",
  },
  {
    when: "Today · morning",
    title: "Renewal surfaced",
    body: `Combined premium up ${client.changePct}% · outreach email sent`,
  },
  {
    when: "Today · 2:14 PM",
    title: "Questionnaire complete",
    body: "Lily’s DL# on file · pool confirmed · life opt-in",
  },
  {
    when: "Today · afternoon",
    title: "Carriers shopped",
    body: "Travelers, Nationwide, Progressive · Travelers recommended",
  },
  {
    when: "Today · 2:31 PM",
    title: "Recommendation sent",
    body: `${money(savings.perYear)}/yr savings vs Donegal · Nationwide life quote attached`,
  },
];

export default function EndStateScene(_props: SceneProps) {
  return (
    <Cockpit crumb={`Renewals · ${client.name}`}>
      <div className="row between wrap gap-12">
        <div>
          <div className="eyebrow">Client since {client.memberSince}</div>
          <h1 className="scene-title">{client.name}</h1>
          <p className="muted mt-8" style={{ fontSize: 14 }}>
            {client.email} · {client.phone}
          </p>
        </div>
        <div className="row gap-12 wrap" style={{ alignItems: "center" }}>
          <span className="muted" style={{ fontSize: 13.5 }}>
            Renews {client.renewalDate} · {client.daysOut} days out
          </span>
          <Badge tone="green" dot="green">Recommendation sent</Badge>
        </div>
      </div>

      <div className="end-layout mt-28">
        <div className="end-main stack gap-20">
          <section className="card end-section">
            <div className="row between wrap gap-8" style={{ marginBottom: 14 }}>
              <div className="section-head" style={{ margin: 0 }}>Portfolio</div>
              <div className="muted" style={{ fontSize: 12 }}>Still on Donegal · switch pending</div>
            </div>
            <table className="premium-compare flat">
              <thead>
                <tr>
                  <th>Line</th>
                  <th className="num">Donegal renewal</th>
                  <th className="num">Travelers (rec.)</th>
                  <th className="num">Delta</th>
                </tr>
              </thead>
              <tbody>
                {recommendedPolicies.map((p) => {
                  const delta = p.recommended - p.current;
                  return (
                    <tr key={p.short}>
                      <td>
                        <div className="strong" style={{ fontSize: 13.5 }}>{p.short}</div>
                        <div className="q-sub">{p.detail}</div>
                      </td>
                      <td className="num mono muted">{money(p.current)}</td>
                      <td className="num mono strong">{money(p.recommended)}</td>
                      <td
                        className="num mono strong"
                        style={delta < 0 ? { color: "var(--green)" } : undefined}
                      >
                        {delta < 0 ? "−" : "+"}{money(Math.abs(delta))}
                      </td>
                    </tr>
                  );
                })}
                <tr className="total-row">
                  <td className="strong">Combined</td>
                  <td className="num mono muted">{money(savings.donegal)}</td>
                  <td className="num mono strong" style={{ fontSize: 16 }}>{money(savings.travelers)}</td>
                  <td className="num">
                    <Badge tone="green">−{money(savings.perYear)} · {savings.pct}%</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-16">
              <div className="section-head">Coverage gaps</div>
              <div className="mt-8">
                {portfolioGapsEnd.map((g) => (
                  <div key={g.line} className="fact-row">
                    <div className="strong">{g.line}</div>
                    <div>
                      <Badge tone={g.tone}>{g.status}</Badge>
                      {g.note && (
                        <span className="muted" style={{ marginLeft: 10, fontSize: 13 }}>{g.note}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="card end-section">
            <div className="section-head" style={{ marginBottom: 14 }}>Household</div>
            <table className="people-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>DOB</th>
                  <th>License</th>
                </tr>
              </thead>
              <tbody>
                {householdAfterQuestionnaire.map((h) => (
                  <tr key={h.name}>
                    <td>
                      <div className="row gap-8">
                        <span className="avatar-sm">{h.initials}</span>
                        <div>
                          <div className="strong" style={{ fontSize: 13.5 }}>{h.name}</div>
                          <div className="q-sub">{h.note}</div>
                        </div>
                      </div>
                    </td>
                    <td>{h.role}</td>
                    <td className="mono">{h.dob}</td>
                    <td>{h.license}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="section-head mt-24" style={{ marginBottom: 12 }}>Property</div>
            <div className="fact-list">
              {[
                { k: "Address", v: homeProperty.address, link: homeProperty.zillowUrl },
                { k: "Type", v: homeProperty.type },
                { k: "Year built", v: String(homeProperty.yearBuilt) },
                { k: "Stories / sq ft", v: `${homeProperty.stories} · ${homeProperty.sqFt} sq ft` },
                { k: "Dwelling", v: homeProperty.dwelling },
                { k: "Roof", v: "6–10 years ago (from questionnaire)" },
                { k: "Pool", v: "In-ground — fenced, self-latching gate, no diving board" },
                { k: "Trampoline", v: "Confirmed removed" },
              ].map((f) => (
                <div key={f.k} className="fact-item single">
                  <div className="fact-k">{f.k}</div>
                  <div className="fact-v fact-v-row">
                    <span>{f.v}</span>
                    {"link" in f && f.link && (
                      <a className="ext-link" href={f.link} target="_blank" rel="noreferrer">
                        View on Zillow ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card end-section">
            <div className="section-head" style={{ marginBottom: 14 }}>Vehicles</div>
            <table className="people-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Primary driver</th>
                  <th>Use</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.desc}>
                    <td>
                      <div className="row gap-8">
                        <Icon.car size={16} />
                        <div>
                          <div className="strong" style={{ fontSize: 13.5 }}>{v.year} {v.make} {v.model}</div>
                          <div className="q-sub">VIN {v.vin}</div>
                        </div>
                      </div>
                    </td>
                    <td>{v.driver}</td>
                    <td>{v.use}</td>
                    <td className="muted">{v.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="section-head mt-24" style={{ marginBottom: 12 }}>Claims (last 5 years)</div>
            <table className="people-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>What happened</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                </tr>
              </thead>
              <tbody>
                {autoClaims.map((c) => (
                  <tr key={c.claimNumber}>
                    <td className="mono">{c.date}</td>
                    <td>
                      <div className="strong" style={{ fontSize: 13.5 }}>{c.description}</div>
                      <div className="q-sub">{c.carrier} · {c.claimNumber}</div>
                    </td>
                    <td>{c.vehicle}</td>
                    <td>{c.driver}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <aside className="end-side stack gap-16">
          <div className="card upcoming-card">
            <div className="eyebrow" style={{ marginBottom: 6 }}>Upcoming</div>
            <h3 className="meeting-title">Zoom meeting with Corey</h3>
            <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.5, marginTop: 10 }}>
              Walk the two deductible differences and bind both lines to Travelers. Bring the
              Nationwide life quote.
            </p>
            <div className="meeting-meta mt-16">
              <div className="meeting-when">
                <div className="strong" style={{ fontSize: 14 }}>Tue, May 5</div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>10:00–10:30 AM ET</div>
              </div>
              <a
                className="btn btn-primary"
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ flex: "none", whiteSpace: "nowrap" }}
              >
                Join Zoom call
              </a>
            </div>
          </div>

          <div className="card">
            <div className="section-head" style={{ marginBottom: 4 }}>History</div>
            <div className="history-list">
              {[...history].reverse().map((h) => (
                <div key={h.title + h.when} className="history-item">
                  <div className="history-dot" />
                  <div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{h.when}</div>
                    <div className="strong" style={{ fontSize: 13.5, marginTop: 2 }}>{h.title}</div>
                    <div className="muted" style={{ fontSize: 12.5, marginTop: 2, lineHeight: 1.4 }}>
                      {h.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </Cockpit>
  );
}
