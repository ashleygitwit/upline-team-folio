import type { JSX } from "react";
import type { SceneProps } from "../App";
import { Badge, Cockpit, Icon, UplineMark, money } from "../components/ui";
import { client, flags, household, policies, uplineRecommendation, vehicles } from "../data";

const flagIcon: Record<string, JSX.Element> = {
  gold: <Icon.alert size={16} className="flag-icon" />,
  indigo: <Icon.droplet size={16} className="flag-icon" />,
  green: <Icon.minus size={16} className="flag-icon" />,
};

export default function Client360Scene({ onNext }: SceneProps) {
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
          <Badge dot="gold">{client.daysOut} days out</Badge>
          <Badge tone="green" dot="green">Shop-ready</Badge>
        </div>
      </div>

      <div className="grid grid-main mt-24">
        {/* left column */}
        <div className="stack gap-16">
          <div className="card">
            <div className="section-head">Policies on this account</div>
            {policies.map((p) => (
              <div key={p.number} className="person">
                {p.line.startsWith("Home") ? <Icon.home size={18} /> : <Icon.car size={18} />}
                <div style={{ flex: 1 }}>
                  <div className="strong">{p.line}</div>
                  <div className="q-sub">{p.carrier} · {p.number} · {p.dwelling}</div>
                </div>
                <div className="mono strong">{money(p.premium)}/yr</div>
              </div>
            ))}
            <hr className="divider-h mt-12" />
            <div className="row between mt-12">
              <div className="muted">Bundled renewal offer</div>
              <div className="row gap-8">
                <span className="muted mono" style={{ textDecoration: "line-through" }}>{money(client.currentPremium)}</span>
                <span className="mono strong" style={{ fontSize: 18 }}>{money(client.renewalPremium)}/yr</span>
                <Badge tone="gold">+{client.changePct}%</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <div className="section-head">Household</div>
              {household.map((h) => (
                <div key={h.name} className="person">
                  <span className="avatar-sm">{h.initials}</span>
                  <div style={{ flex: 1 }}>
                    <div className="strong" style={{ fontSize: 13.5 }}>{h.name}</div>
                    <div className="q-sub">{h.role} · {h.note}</div>
                  </div>
                  {h.flag && <span className="dot gold" title="Needs attention" />}
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

          <div className="card">
            <div className="section-head">Flags Upline surfaced</div>
            {flags.map((f) => (
              <div key={f.title} className={`flag-item`} style={{ color: "var(--foreground)" }}>
                <span style={{ color: `var(--${f.tone === "indigo" ? "primary" : f.tone})` }}>{flagIcon[f.tone]}</span>
                <div>
                  <div className="strong">{f.title}</div>
                  <div className="muted" style={{ marginTop: 2 }}>{f.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right column — Upline recommendation */}
        <div className="stack gap-16">
          <div className="upline-callout">
            <span className="tag eyebrow"><UplineMark size={15} /> Upline suggests</span>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 19, marginTop: 10 }}>
              {uplineRecommendation.headline}
            </h3>
            <p className="muted mt-8" style={{ fontSize: 13.5, lineHeight: 1.5 }}>{uplineRecommendation.reason}</p>
            <div className="mt-16">
              {uplineRecommendation.actions.map((a) => (
                <div key={a} className="rec-line">
                  <span className="check"><Icon.check size={16} /></span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-block btn-lg mt-16" onClick={onNext}>
              <Icon.mail size={17} /> Draft the outreach
            </button>
            <p className="center muted mt-12" style={{ fontSize: 12 }}>
              Upline pre-writes it in the Members 1st voice — you just review &amp; send.
            </p>
          </div>
        </div>
      </div>
    </Cockpit>
  );
}
