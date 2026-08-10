import { useState } from "react";
import type { SceneProps } from "../App";
import { Badge, Cockpit, Icon, UplineMark, money } from "../components/ui";
import {
  autoClaims,
  client,
  homeProperty,
  household,
  policies,
  portfolioGaps,
  uplineRecommendation,
  vehicles,
} from "../data";

type Tab = "portfolio" | "household" | "vehicles";

export default function Client360Scene({ onNext }: SceneProps) {
  const [tab, setTab] = useState<Tab>("portfolio");

  return (
    <Cockpit crumb={`Renewals · ${client.name}`}>
      {/* Header */}
      <div className="row between wrap gap-12">
        <div>
          <div className="eyebrow">Member since {client.memberSince}</div>
          <h1 className="scene-title">{client.name}</h1>
          <p className="muted mt-8" style={{ fontSize: 14 }}>
            {client.email} · {client.phone}
          </p>
        </div>
        <div className="row gap-12 wrap" style={{ alignItems: "center" }}>
          <span className="muted" style={{ fontSize: 13.5 }}>
            Renews {client.renewalDate} · {client.daysOut} days out
          </span>
          <Badge tone="indigo" dot="indigo">Outreach Ready</Badge>
        </div>
      </div>

      {/* Upline suggests — full width, above tabs */}
      <div className="upline-callout mt-20">
        <span className="tag eyebrow"><UplineMark size={15} /> Upline suggests</span>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, marginTop: 10, fontWeight: 600 }}>
          {uplineRecommendation.headline}
        </h2>
        <p className="suggest-summary muted">
          {uplineRecommendation.summary}
        </p>
        <button className="btn btn-primary btn-lg mt-16" onClick={onNext}>
          <Icon.mail size={17} /> Review outreach &amp; questionnaire
        </button>
      </div>

      {/* Tabs */}
      <div className="profile-tabs mt-24">
        {(
          [
            ["portfolio", "Portfolio"],
            ["household", "Household"],
            ["vehicles", "Vehicles"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`profile-tab ${tab === id ? "on" : ""}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="profile-tab-panel mt-16 fade-in" key={tab}>
        {tab === "portfolio" && <PortfolioTab />}
        {tab === "household" && <HouseholdTab />}
        {tab === "vehicles" && <VehiclesTab />}
      </div>
    </Cockpit>
  );
}

function PortfolioTab() {
  return (
    <div className="stack gap-20">
      <div>
        <div className="row between wrap gap-8" style={{ marginBottom: 10 }}>
          <div className="section-head" style={{ margin: 0 }}>Policies on this account</div>
          <div className="muted" style={{ fontSize: 12 }}>Donegal · renews {client.renewalDate}</div>
        </div>
        <table className="premium-compare flat">
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

      <div>
        <div className="section-head">Coverage gaps</div>
        <div className="mt-8">
          {portfolioGaps.map((g) => (
            <div key={g.line} className="fact-row">
              <div className="strong">{g.line}</div>
              <div>
                <Badge tone="gold">{g.status}</Badge>
                <span className="muted" style={{ marginLeft: 10, fontSize: 13 }}>{g.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HouseholdTab() {
  const propertyFacts = [
    { k: "Address", v: homeProperty.address, link: homeProperty.zillowUrl },
    { k: "Type", v: homeProperty.type },
    { k: "Year built", v: String(homeProperty.yearBuilt) },
    { k: "Stories / sq ft", v: `${homeProperty.stories} · ${homeProperty.sqFt} sq ft` },
    { k: "Dwelling", v: homeProperty.dwelling },
    { k: "Roof", v: homeProperty.roof },
    { k: "Heat", v: homeProperty.heat },
    { k: "Fireplace", v: homeProperty.fireplace },
    { k: "Pool", v: homeProperty.pool },
    { k: "Trampoline", v: homeProperty.trampoline },
  ];

  return (
    <div className="stack gap-32">
      <div>
        <div className="section-head">People in the household</div>
        <table className="people-table mt-12">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>DOB</th>
              <th>License</th>
            </tr>
          </thead>
          <tbody>
            {household.map((h) => (
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
                <td>
                  {h.flag ? <Badge tone="gold">{h.license}</Badge> : h.license}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <div className="section-head">Property</div>
        <div className="fact-list mt-12">
          {propertyFacts.map((f) => (
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
      </div>
    </div>
  );
}

function VehiclesTab() {
  return (
    <div className="stack gap-32">
      <div>
        <div className="section-head">Vehicles on the auto policy</div>
        <table className="people-table mt-12">
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
        <p className="muted mt-12" style={{ fontSize: 13 }}>
          2016 Chevrolet Cruze removed Dec 2025 (sold) — not on current policy.
        </p>
      </div>

      <div>
        <div className="section-head">Claims (last 5 years)</div>
        {autoClaims.length === 0 ? (
          <p className="muted mt-12" style={{ fontSize: 14 }}>No claims in the last five years.</p>
        ) : (
          <table className="people-table mt-12">
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
        )}
      </div>
    </div>
  );
}
